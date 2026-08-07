"""
Test Backend API Functionality
"""
import requests
import json

API_URL = "http://localhost:8000"

def test_health():
    """Test health endpoint"""
    print("\n=== Testing Health Endpoint ===")
    response = requests.get(f"{API_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
    return response.status_code == 200

def test_underwrite():
    """Test underwriting endpoint"""
    print("\n=== Testing Underwriting Endpoint ===")
    
    # Sample loan application
    application = {
        "full_name": "John Smith",
        "age": 32,
        "email": "john.smith@example.com",
        "phone": "+91-9876543210",
        "location": "Mumbai, Maharashtra",
        "education": "Bachelor of Engineering",
        "employment_type": "Salaried",
        "company_name": "Tech Corp India",
        "job_role": "Software Engineer",
        "years_of_employment": 5.5,
        "monthly_income": 95000,
        "industry_type": "Information Technology",
        "loan_amount": 500000,
        "loan_purpose": "Home Renovation",
        "monthly_expenses": 45000,
        "savings": 300000,
        "existing_loans": 150000,
        "monthly_debt": 12000,
        "credit_score": 750,
        "email_account_age": 8,
        "utility_payment_history": "excellent",
        "failed_transactions": 1,
        "device_stability_score": 85,
        "professional_profile": True,
        "linkedin_verified": True,
        "education_verified": True,
        "digital_engagement_score": 78,
        "location_stability": 80
    }
    
    response = requests.post(f"{API_URL}/api/underwrite", json=application)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ UNDERWRITING RESULT:")
        print(f"  Risk Score: {data['risk']['risk_score']}")
        print(f"  Risk Level: {data['risk']['risk_level']}")
        print(f"  Recommendation: {data['risk']['recommendation']}")
        print(f"  Confidence: {data['risk']['confidence']}%")
        print(f"\n  Fraud Score: {data['fraud']['fraud_score']}")
        print(f"  Fraud Risk: {data['fraud']['fraud_risk']}")
        print(f"\n  Decision: {data['decision']['decision']}")
        print(f"  Fairness Status: {data['fairness']['status']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_risk_prediction():
    """Test risk prediction endpoint"""
    print("\n=== Testing Risk Prediction Endpoint ===")
    
    application = {
        "full_name": "Jane Doe",
        "age": 28,
        "email": "jane.doe@example.com",
        "phone": "+91-9876543211",
        "location": "Bangalore, Karnataka",
        "education": "Master of Business Administration",
        "employment_type": "Salaried",
        "company_name": "Finance Corp",
        "job_role": "Financial Analyst",
        "years_of_employment": 3.0,
        "monthly_income": 75000,
        "industry_type": "Financial Services",
        "loan_amount": 300000,
        "loan_purpose": "Education",
        "monthly_expenses": 35000,
        "savings": 150000,
        "existing_loans": 50000,
        "monthly_debt": 8000,
        "credit_score": 720,
        "email_account_age": 5,
        "utility_payment_history": "good",
        "failed_transactions": 2,
        "device_stability_score": 75,
        "professional_profile": True,
        "linkedin_verified": True,
        "education_verified": True,
        "digital_engagement_score": 72,
        "location_stability": 60
    }
    
    response = requests.post(f"{API_URL}/api/risk/predict", json=application)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ RISK ASSESSMENT:")
        print(f"  Risk Score: {data['risk_score']}")
        print(f"  Risk Level: {data['risk_level']}")
        print(f"  Recommendation: {data['recommendation']}")
        print(f"  Confidence: {data['confidence']}%")
        print(f"\n  Engineered Features:")
        print(f"    Debt Ratio: {data['features']['debt_ratio']}%")
        print(f"    Savings Ratio: {data['features']['savings_ratio']}%")
        print(f"    Digital Trust Score: {data['features']['digital_trust_score']}/100")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_fraud_detection():
    """Test fraud detection endpoint"""
    print("\n=== Testing Fraud Detection Endpoint ===")
    
    # Suspicious application
    application = {
        "full_name": "Suspicious User",
        "age": 22,
        "email": "new@email.com",
        "phone": "+91-1234567890",
        "location": "Unknown City",
        "education": "High School",
        "employment_type": "Self Employed",
        "company_name": "New Startup",
        "job_role": "Owner",
        "years_of_employment": 0.5,
        "monthly_income": 150000,
        "industry_type": "Other",
        "loan_amount": 1000000,
        "loan_purpose": "Business",
        "monthly_expenses": 20000,
        "savings": 10000,
        "existing_loans": 0,
        "monthly_debt": 0,
        "credit_score": 650,
        "email_account_age": 0.5,
        "utility_payment_history": "poor",
        "failed_transactions": 15,
        "device_stability_score": 30,
        "professional_profile": False,
        "linkedin_verified": False,
        "education_verified": False,
        "digital_engagement_score": 25,
        "location_stability": 10
    }
    
    response = requests.post(f"{API_URL}/api/fraud/check", json=application)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"\n✅ FRAUD ASSESSMENT:")
        print(f"  Fraud Score: {data['fraud_score']}")
        print(f"  Fraud Risk: {data['fraud_risk']}")
        print(f"  Anomalies Detected: {len(data.get('anomalies_detected', []))}")
        print(f"  Suspicious Patterns: {len(data.get('suspicious_patterns', []))}")
        
        if data.get('suspicious_patterns'):
            print("\n  Patterns:")
            for pattern in data['suspicious_patterns'][:3]:
                print(f"    - {pattern['type']}: {pattern['description']}")
        return True
    else:
        print(f"Error: {response.text}")
        return False

def test_chat():
    """Test policy chat endpoint"""
    print("\n=== Testing Policy Chat Endpoint ===")
    
    questions = [
        "What are the interest rates for loans?",
        "What documents are required?",
        "What is the eligibility criteria?"
    ]
    
    for question in questions:
        print(f"\nQuestion: {question}")
        response = requests.post(
            f"{API_URL}/api/chat",
            json={"message": question}
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"Answer: {data['response'][:200]}...")
        else:
            print(f"Error: {response.status_code}")
    
    return True

def main():
    """Run all tests"""
    print("=" * 60)
    print("SmartUnderwrite AI - Backend API Tests")
    print("=" * 60)
    
    results = {
        "Health Check": test_health(),
        "Full Underwriting": test_underwrite(),
        "Risk Prediction": test_risk_prediction(),
        "Fraud Detection": test_fraud_detection(),
        "Policy Chat": test_chat()
    }
    
    print("\n" + "=" * 60)
    print("TEST RESULTS SUMMARY")
    print("=" * 60)
    for test_name, passed in results.items():
        status = "✅ PASSED" if passed else "❌ FAILED"
        print(f"{test_name}: {status}")
    
    all_passed = all(results.values())
    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 ALL TESTS PASSED! Backend is working correctly!")
    else:
        print("⚠️  Some tests failed. Check the output above.")
    print("=" * 60)

if __name__ == "__main__":
    main()
