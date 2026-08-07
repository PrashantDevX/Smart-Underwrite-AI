"""
Train Risk Prediction and Fraud Detection Models
"""
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
import lightgbm as lgb
import joblib
from pathlib import Path
import json
from loguru import logger

# Create directories
Path("./backend/models_trained").mkdir(parents=True, exist_ok=True)
Path("./backend/data").mkdir(parents=True, exist_ok=True)

def generate_synthetic_data(n_samples=5000):
    """Generate synthetic loan data for training"""
    np.random.seed(42)
    
    logger.info(f"Generating {n_samples} synthetic samples...")
    
    data = {
        # Demographics
        'age': np.random.randint(22, 65, n_samples),
        'education_years': np.random.randint(12, 20, n_samples),
        
        # Employment
        'years_of_employment': np.random.exponential(5, n_samples),
        'monthly_income': np.random.lognormal(10.5, 0.5, n_samples),
        'industry_type': np.random.choice([0, 1, 2, 3, 4], n_samples),  # IT, Finance, Healthcare, Manufacturing, Other
        
        # Financial
        'credit_score': np.random.normal(700, 100, n_samples).clip(300, 850),
        'loan_amount': np.random.lognormal(11, 0.7, n_samples),
        'monthly_expenses': np.random.lognormal(9.5, 0.5, n_samples),
        'savings': np.random.lognormal(11.5, 1, n_samples),
        'existing_loans': np.random.lognormal(10, 1, n_samples) * np.random.binomial(1, 0.6, n_samples),
        'monthly_debt': np.random.lognormal(8, 0.8, n_samples) * np.random.binomial(1, 0.6, n_samples),
        
        # Alternative Data
        'email_account_age': np.random.gamma(5, 1.5, n_samples),
        'utility_payment_score': np.random.beta(8, 2, n_samples) * 100,
        'failed_transactions': np.random.poisson(3, n_samples),
        'device_stability_score': np.random.beta(7, 2, n_samples) * 100,
        'linkedin_verified': np.random.binomial(1, 0.7, n_samples),
        'digital_engagement_score': np.random.beta(6, 3, n_samples) * 100,
        'location_stability_years': np.random.exponential(4, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Calculate engineered features
    df['debt_ratio'] = (df['monthly_debt'] / df['monthly_income']).clip(0, 1) * 100
    df['savings_ratio'] = (df['savings'] / df['loan_amount']).clip(0, 5) * 20
    df['income_stability'] = np.minimum(df['years_of_employment'] * 10 + df['credit_score'] / 10, 100)
    df['employment_stability'] = np.minimum(df['years_of_employment'] * 15 + df['age'] * 0.5, 100)
    df['financial_discipline_score'] = (df['utility_payment_score'] + df['credit_score'] / 8.5) / 2
    df['digital_trust_score'] = (
        df['email_account_age'] * 8 +
        df['device_stability_score'] * 0.3 +
        df['linkedin_verified'] * 10 +
        df['digital_engagement_score'] * 0.3 -
        df['failed_transactions'] * 2
    ).clip(0, 100)
    df['behavior_consistency'] = (
        (100 - df['failed_transactions'] * 5) * 0.4 +
        df['location_stability_years'] * 8 +
        df['device_stability_score'] * 0.3
    ).clip(0, 100)
    df['alternative_data_score'] = (
        df['digital_trust_score'] * 0.4 +
        df['behavior_consistency'] * 0.3 +
        df['utility_payment_score'] * 0.3
    )
    
    # Generate target: risk_score (0-100, lower is better)
    risk_base = (
        100 -
        df['credit_score'] / 10 -
        df['income_stability'] / 5 +
        df['debt_ratio'] / 3 +
        df['failed_transactions'] * 2 -
        df['digital_trust_score'] / 8 -
        df['savings_ratio'] / 5
    )
    
    # Add some noise
    risk_noise = np.random.normal(0, 5, n_samples)
    df['risk_score'] = (risk_base + risk_noise).clip(0, 100)
    
    # Generate fraud labels (5% fraud rate)
    fraud_probability = (
        (df['failed_transactions'] > 10).astype(float) * 0.3 +
        (df['device_stability_score'] < 50).astype(float) * 0.2 +
        (df['email_account_age'] < 1).astype(float) * 0.3 +
        (df['location_stability_years'] < 0.5).astype(float) * 0.2
    )
    df['is_fraud'] = (fraud_probability + np.random.normal(0, 0.1, n_samples) > 0.6).astype(int)
    
    logger.success(f"Generated {len(df)} samples with {df['is_fraud'].sum()} fraud cases ({df['is_fraud'].mean()*100:.1f}%)")
    
    return df

def train_risk_model(df):
    """Train LightGBM risk prediction model"""
    logger.info("Training Risk Prediction Model...")
    
    # Feature selection
    feature_cols = [
        'age', 'education_years', 'years_of_employment', 'monthly_income',
        'industry_type', 'credit_score', 'loan_amount', 'monthly_expenses',
        'savings', 'existing_loans', 'monthly_debt', 'email_account_age',
        'utility_payment_score', 'failed_transactions', 'device_stability_score',
        'linkedin_verified', 'digital_engagement_score', 'location_stability_years',
        'debt_ratio', 'savings_ratio', 'income_stability', 'employment_stability',
        'financial_discipline_score', 'digital_trust_score', 'behavior_consistency',
        'alternative_data_score'
    ]
    
    X = df[feature_cols]
    y = df['risk_score']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    # Scale features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    # Train LightGBM model
    lgb_train = lgb.Dataset(X_train_scaled, y_train)
    lgb_eval = lgb.Dataset(X_test_scaled, y_test, reference=lgb_train)
    
    params = {
        'objective': 'regression',
        'metric': 'rmse',
        'boosting_type': 'gbdt',
        'num_leaves': 31,
        'learning_rate': 0.05,
        'feature_fraction': 0.9,
        'bagging_fraction': 0.8,
        'bagging_freq': 5,
        'verbose': 0
    }
    
    model = lgb.train(
        params,
        lgb_train,
        num_boost_round=100,
        valid_sets=[lgb_eval],
        valid_names=['eval']
    )
    
    # Evaluate
    y_pred = model.predict(X_test_scaled)
    from sklearn.metrics import mean_squared_error, r2_score, mean_absolute_error
    
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    logger.success(f"Risk Model Performance: RMSE={rmse:.2f}, MAE={mae:.2f}, R²={r2:.3f}")
    
    # Save model and scaler
    joblib.dump(model, './backend/models_trained/risk_model.pkl')
    joblib.dump(scaler, './backend/models_trained/feature_scaler.pkl')
    
    # Save feature names
    with open('./backend/models_trained/feature_names.json', 'w') as f:
        json.dump(feature_cols, f)
    
    # Save model metadata
    metadata = {
        'model_type': 'lightgbm',
        'version': 'v2.5.1',
        'features': feature_cols,
        'performance': {
            'rmse': float(rmse),
            'mae': float(mae),
            'r2': float(r2)
        },
        'thresholds': {
            'low_risk': 30,
            'medium_risk': 60,
            'high_risk': 100
        }
    }
    
    with open('./backend/models_trained/risk_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    logger.info("Risk model saved successfully!")
    
    return model, scaler, feature_cols

def train_fraud_model(df):
    """Train Isolation Forest fraud detection model"""
    logger.info("Training Fraud Detection Model...")
    
    # Feature selection for fraud detection
    fraud_features = [
        'failed_transactions', 'device_stability_score', 'email_account_age',
        'location_stability_years', 'digital_engagement_score',
        'monthly_income', 'loan_amount', 'credit_score'
    ]
    
    X = df[fraud_features]
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Train Isolation Forest
    iso_forest = IsolationForest(
        n_estimators=100,
        max_samples='auto',
        contamination=0.05,  # Expected fraud rate
        random_state=42
    )
    
    iso_forest.fit(X_scaled)
    
    # Evaluate
    predictions = iso_forest.predict(X_scaled)
    anomaly_scores = iso_forest.score_samples(X_scaled)
    
    # Convert to probability scores (0-100)
    # More negative = more anomalous = higher fraud score
    fraud_scores = ((1 - (anomaly_scores - anomaly_scores.min()) / 
                     (anomaly_scores.max() - anomaly_scores.min())) * 100)
    
    logger.success(f"Fraud Model: Detected {(predictions == -1).sum()} anomalies ({(predictions == -1).mean()*100:.1f}%)")
    
    # Save model and scaler
    joblib.dump(iso_forest, './backend/models_trained/fraud_model.pkl')
    joblib.dump(scaler, './backend/models_trained/fraud_scaler.pkl')
    
    # Save feature names
    with open('./backend/models_trained/fraud_feature_names.json', 'w') as f:
        json.dump(fraud_features, f)
    
    # Save model metadata
    metadata = {
        'model_type': 'isolation_forest',
        'version': 'v1.0.0',
        'features': fraud_features,
        'thresholds': {
            'low': 20,
            'medium': 50,
            'high': 80,
            'critical': 100
        }
    }
    
    with open('./backend/models_trained/fraud_model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    logger.info("Fraud model saved successfully!")
    
    return iso_forest, scaler, fraud_features

def main():
    """Main training pipeline"""
    logger.info("=" * 60)
    logger.info("SmartUnderwrite AI - Model Training Pipeline")
    logger.info("=" * 60)
    
    # Generate data
    df = generate_synthetic_data(n_samples=5000)
    
    # Save training data sample
    df.head(100).to_csv('./backend/data/sample_training_data.csv', index=False)
    logger.info("Sample training data saved")
    
    # Train models
    risk_model, risk_scaler, risk_features = train_risk_model(df)
    fraud_model, fraud_scaler, fraud_features = train_fraud_model(df)
    
    logger.success("=" * 60)
    logger.success("Model Training Complete!")
    logger.success("=" * 60)
    logger.success("Saved files:")
    logger.success("  - ./backend/models_trained/risk_model.pkl")
    logger.success("  - ./backend/models_trained/fraud_model.pkl")
    logger.success("  - ./backend/models_trained/feature_scaler.pkl")
    logger.success("  - ./backend/models_trained/fraud_scaler.pkl")
    logger.success("  - ./backend/models_trained/*_metadata.json")
    logger.success("=" * 60)

if __name__ == "__main__":
    main()
