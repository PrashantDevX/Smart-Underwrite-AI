"""
Train LightGBM model for loan risk prediction
This script generates synthetic training data and trains the model
"""

import numpy as np
import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, roc_auc_score, confusion_matrix
from sklearn.ensemble import IsolationForest
import joblib
import os
from pathlib import Path

# Create models directory
MODELS_DIR = Path(__file__).parent / "models"
MODELS_DIR.mkdir(exist_ok=True)


def generate_synthetic_data(n_samples=10000):
    """Generate synthetic loan application data for training"""
    np.random.seed(42)
    
    data = {
        # Demographics
        'age': np.random.randint(21, 65, n_samples),
        'credit_score': np.random.randint(300, 850, n_samples),
        
        # Employment
        'monthly_income': np.random.gamma(4, 15000, n_samples),
        'years_of_employment': np.random.gamma(2, 2, n_samples),
        'employment_type': np.random.choice([1, 2, 3, 4], n_samples),  # 1=full-time, 2=part-time, etc.
        
        # Financial
        'monthly_expenses': np.random.gamma(3, 8000, n_samples),
        'savings': np.random.gamma(2, 20000, n_samples),
        'existing_loans': np.random.gamma(1.5, 10000, n_samples),
        'monthly_debt': np.random.gamma(2, 2000, n_samples),
        
        # Alternative Data
        'email_account_age': np.random.gamma(3, 2, n_samples),
        'utility_payment_score': np.random.uniform(0, 100, n_samples),
        'failed_transactions': np.random.poisson(2, n_samples),
        'device_stability_score': np.random.uniform(50, 100, n_samples),
        'digital_engagement_score': np.random.uniform(30, 100, n_samples),
        'location_stability': np.random.uniform(60, 100, n_samples),
    }
    
    df = pd.DataFrame(data)
    
    # Calculate engineered features
    df['debt_ratio'] = (df['monthly_debt'] / df['monthly_income']) * 100
    df['savings_ratio'] = (df['savings'] / (df['monthly_income'] * 12)) * 100
    df['income_stability'] = np.clip(
        (df['years_of_employment'] * 10) + 
        (df['monthly_income'] / 1000) - 
        (df['failed_transactions'] * 2), 
        0, 100
    )
    df['employment_stability'] = np.clip(
        (df['years_of_employment'] * 15) + 
        (df['employment_type'] == 1) * 20, 
        0, 100
    )
    df['financial_discipline_score'] = np.clip(
        100 - df['debt_ratio'] + 
        (df['utility_payment_score'] * 0.3), 
        0, 100
    )
    df['digital_trust_score'] = np.clip(
        (df['email_account_age'] * 5) + 
        (df['device_stability_score'] * 0.5) + 
        (df['digital_engagement_score'] * 0.3), 
        0, 100
    )
    
    # Calculate risk score (target)
    risk_score = (
        (50 - df['credit_score'] / 20) +
        (df['debt_ratio'] * 0.8) +
        (50 - df['income_stability'] * 0.5) +
        (50 - df['financial_discipline_score'] * 0.5) +
        (df['failed_transactions'] * 3) -
        (df['savings_ratio'] * 0.3) -
        (df['digital_trust_score'] * 0.2)
    )
    
    # Normalize to 0-100
    df['risk_score'] = np.clip(risk_score, 0, 100)
    
    # Create risk categories (0=low, 1=medium, 2=high)
    df['risk_category'] = pd.cut(
        df['risk_score'], 
        bins=[-np.inf, 30, 60, np.inf], 
        labels=[0, 1, 2],
        include_lowest=True
    ).astype(int)
    
    return df


def train_risk_model():
    """Train LightGBM risk prediction model"""
    print("Generating synthetic training data...")
    df = generate_synthetic_data(10000)
    
    # Features for model
    feature_columns = [
        'age', 'credit_score', 'monthly_income', 'years_of_employment',
        'monthly_expenses', 'savings', 'existing_loans', 'monthly_debt',
        'email_account_age', 'utility_payment_score', 'failed_transactions',
        'device_stability_score', 'digital_engagement_score', 'location_stability',
        'debt_ratio', 'savings_ratio', 'income_stability', 'employment_stability',
        'financial_discipline_score', 'digital_trust_score'
    ]
    
    X = df[feature_columns]
    y = df['risk_category']
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print(f"Training set size: {len(X_train)}")
    print(f"Test set size: {len(X_test)}")
    
    # Train LightGBM model
    print("\nTraining LightGBM model...")
    model = LGBMClassifier(
        n_estimators=200,
        max_depth=6,
        learning_rate=0.05,
        num_leaves=31,
        objective='multiclass',
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # Evaluate
    y_pred = model.predict(X_test)
    y_pred_proba = model.predict_proba(X_test)
    
    print("\n" + "="*50)
    print("MODEL EVALUATION")
    print("="*50)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=['Low Risk', 'Medium Risk', 'High Risk']))
    
    print("\nConfusion Matrix:")
    print(confusion_matrix(y_test, y_pred))
    
    print(f"\nROC-AUC Score (One-vs-Rest): {roc_auc_score(y_test, y_pred_proba, multi_class='ovr'):.4f}")
    
    # Feature importance
    print("\nTop 10 Feature Importances:")
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False).head(10)
    print(feature_importance.to_string(index=False))
    
    # Save model
    model_path = MODELS_DIR / "risk_model_lightgbm.pkl"
    joblib.dump(model, model_path)
    print(f"\n[OK] Risk model saved to: {model_path}")
    
    # Save feature names
    feature_names_path = MODELS_DIR / "feature_names.pkl"
    joblib.dump(feature_columns, feature_names_path)
    print(f"[OK] Feature names saved to: {feature_names_path}")
    
    return model


def train_fraud_model():
    """Train Isolation Forest for fraud detection"""
    print("\n" + "="*50)
    print("TRAINING FRAUD DETECTION MODEL")
    print("="*50)
    
    # Generate data (mostly normal with some anomalies)
    df = generate_synthetic_data(5000)
    
    # Features for fraud detection
    fraud_features = [
        'failed_transactions', 'device_stability_score', 
        'location_stability', 'email_account_age',
        'monthly_income', 'credit_score'
    ]
    
    X = df[fraud_features]
    
    # Train Isolation Forest
    print("\nTraining Isolation Forest...")
    fraud_model = IsolationForest(
        contamination=0.05,  # Expect 5% anomalies
        random_state=42,
        n_estimators=100
    )
    
    fraud_model.fit(X)
    
    # Predict anomalies
    predictions = fraud_model.predict(X)
    anomaly_count = sum(predictions == -1)
    
    print(f"\nAnomalies detected: {anomaly_count} / {len(X)} ({anomaly_count/len(X)*100:.2f}%)")
    
    # Save model
    fraud_model_path = MODELS_DIR / "fraud_model_isolation_forest.pkl"
    joblib.dump(fraud_model, fraud_model_path)
    print(f"[OK] Fraud model saved to: {fraud_model_path}")
    
    # Save fraud feature names
    fraud_features_path = MODELS_DIR / "fraud_feature_names.pkl"
    joblib.dump(fraud_features, fraud_features_path)
    print(f"[OK] Fraud feature names saved to: {fraud_features_path}")
    
    return fraud_model


if __name__ == "__main__":
    print("="*50)
    print("SMARTUNDERWRITE AI - MODEL TRAINING")
    print("="*50)
    print("\nThis script will train:")
    print("1. LightGBM Risk Prediction Model")
    print("2. Isolation Forest Fraud Detection Model")
    print("\n" + "="*50 + "\n")
    
    # Train risk model
    risk_model = train_risk_model()
    
    # Train fraud model
    fraud_model = train_fraud_model()
    
    print("\n" + "="*50)
    print("[OK] ALL MODELS TRAINED SUCCESSFULLY!")
    print("="*50)
    print(f"\nModels saved in: {MODELS_DIR.absolute()}")
    print("\nYou can now start the FastAPI server:")
    print("  python main.py")
    print("\n" + "="*50)
