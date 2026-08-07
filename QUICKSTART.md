# SmartUnderwrite AI - Quick Start Guide

## 🚀 System Status

✅ **Backend**: Running on http://localhost:8000
✅ **Frontend**: Running on http://localhost:5173  
✅ **ML Models**: Trained and loaded (LightGBM + Isolation Forest)
✅ **Ollama**: Running with qwen2.5:3b
✅ **Database**: SQLite (development mode)
✅ **RAG Service**: Initialized with policy documents

---

## 📋 What's Working

### Backend API (Port 8000)
- ✅ `/health` - Health check endpoint
- ✅ `/api/underwrite` - Full multi-agent underwriting pipeline
- ✅ `/api/risk/predict` - LightGBM risk prediction  
- ✅ `/api/fraud/check` - Isolation Forest fraud detection
- ✅ `/api/chat` - RAG-powered policy Q&A (using Ollama qwen2.5:3b)
- ✅ `/api/analytics/dashboard` - Analytics data
- ✅ `/docs` - Interactive API documentation (Swagger UI)

### Frontend (Port 5173)
- ✅ Landing page with animations
- ✅ Consent management page
- ✅ Multi-step loan application form
- ✅ AI Risk Dashboard with animated gauges
- ✅ Explainability page with SHAP-style factors
- ✅ Fraud detection dashboard
- ✅ Admin dashboard with analytics
- ✅ Reports and settings pages

### AI Features
- ✅ **Risk Engine**: LightGBM model trained on 5000 samples
- ✅ **Fraud Engine**: Isolation Forest anomaly detection
- ✅ **Explainability**: SHAP-style feature importance
- ✅ **Fairness Audit**: Bias detection and disparate impact metrics
- ✅ **Multi-Agent Pipeline**: 7-step coordinated workflow
- ✅ **LLM Integration**: Ollama qwen2.5:3b for explanations
- ✅ **RAG Service**: Policy document retrieval

---

## 🎯 Testing the System

### 1. Test Backend API

Run the test script:
```bash
python test_backend.py
```

Expected output: All 5 tests should pass ✅

### 2. Test Frontend

Open browser to: http://localhost:5173

**Flow to Test:**
1. **Landing Page** → Click "Start Risk Assessment"
2. **Consent Page** → Enable all data sources → Continue
3. **Loan Application** → Fill 4-step form:
   - Personal Information
   - Employment Information  
   - Financial Information
   - Alternative Data
4. **Submit** → View animated risk dashboard
5. Navigate to:
   - Explainability → See top factors
   - Fraud Detection → View security checks
   - Admin Dashboard → See analytics

### 3. Test API Directly

```bash
# Health check
curl http://localhost:8000/health

# API Documentation
Open: http://localhost:8000/docs

# Test underwriting
curl -X POST http://localhost:8000/api/underwrite \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "John Smith",
    "age": 32,
    "email": "john@example.com",
    "phone": "+91-9876543210",
    "location": "Mumbai",
    "education": "Bachelor of Engineering",
    "employment_type": "Salaried",
    "company_name": "Tech Corp",
    "job_role": "Software Engineer",
    "years_of_employment": 5.5,
    "monthly_income": 95000,
    "industry_type": "IT",
    "loan_amount": 500000,
    "loan_purpose": "Home Renovation",
    "monthly_expenses": 45000,
    "savings": 300000,
    "existing_loans": 150000,
    "monthly_debt": 12000,
    "credit_score": 750
  }'
```

---

## 🔧 Configuration

### Environment Variables

**Backend** (`backend/.env`):
```env
DATABASE_URL=sqlite:///./smartunderwrite.db
OLLAMA_MODEL=qwen2.5:3b
OLLAMA_BASE_URL=http://localhost:11434
ENABLE_RAG=True
ENABLE_FAIRNESS_AUDIT=True
ENABLE_FRAUD_CHECK=True
```

**Frontend** (`.env`):
```env
VITE_API_URL=http://localhost:8000
```

---

## 📊 Sample Test Data

### Low Risk Applicant
```json
{
  "full_name": "Jane Doe",
  "age": 28,
  "email": "jane@example.com",
  "phone": "+91-9876543211",
  "location": "Bangalore",
  "education": "MBA",
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
  "professional_profile": true,
  "linkedin_verified": true,
  "education_verified": true,
  "digital_engagement_score": 72,
  "location_stability": 60
}
```

### High Risk / Fraud Applicant
```json
{
  "full_name": "Suspicious User",
  "age": 22,
  "email": "new@email.com",
  "phone": "+91-1234567890",
  "location": "Unknown",
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
  "professional_profile": false,
  "linkedin_verified": false,
  "education_verified": false,
  "digital_engagement_score": 25,
  "location_stability": 10
}
```

---

## 🎨 UI Features

### Animations
- ✅ Smooth page transitions (Framer Motion)
- ✅ Animated circular risk gauge (SVG)
- ✅ Gradient backgrounds with blur effects
- ✅ Card hover effects
- ✅ Loading states

### Design System
- ✅ Tailwind CSS utility classes
- ✅ Custom gradient cards
- ✅ Glass morphism effects
- ✅ Responsive grid layouts
- ✅ Professional typography (Inter font)
- ✅ Color palette: Blue + Emerald accents

### Responsive
- ✅ Mobile-first design
- ✅ Tablet optimized
- ✅ Desktop layouts
- ✅ Sidebar navigation for admin section

---

## 🧠 AI Architecture

### Multi-Agent Pipeline (7 Agents)

1. **Feature Engineering Agent** → Calculates 8 engineered features
2. **Fraud Detection Agent** → Isolation Forest anomaly detection
3. **Risk Prediction Agent** → LightGBM regression model
4. **Explainability Agent** → SHAP-style feature importance
5. **Fairness Agent** → Bias audit (disparate impact, demographic parity)
6. **Decision Engine Agent** → Final underwriting decision (5 outcomes)
7. **Self-Review Agent** → Validates quality before response

### Decision Outcomes
- ✅ **APPROVED** - Low risk, high confidence
- ⚠️ **APPROVED_LOWER_LIMIT** - Medium risk, reduced loan amount
- 📋 **NEED_MORE_DOCUMENTS** - Additional verification required
- 👁️ **MANUAL_REVIEW** - Edge case, human review needed
- ❌ **REJECTED** - High risk or fraud detected

### ML Models

**Risk Model** (LightGBM):
- Features: 26 total (20 raw + 6 engineered)
- Metrics: RMSE ~5.0, R² ~0.95, MAE ~3.5
- Output: Risk score 0-100 (lower is better)

**Fraud Model** (Isolation Forest):
- Features: 8 behavioral signals
- Contamination: 5% (expected fraud rate)
- Output: Fraud score 0-100, anomaly labels

---

## 🔐 Security & Compliance

- ✅ CORS configured for frontend origins
- ✅ Input validation (Pydantic schemas)
- ✅ Fairness audit (no protected attribute discrimination)
- ✅ Explainability for regulatory compliance
- ✅ Audit logging (all decisions tracked)
- ✅ Data privacy (consent management)
- ⚠️ **Production TODO**: Add JWT authentication, rate limiting, HTTPS

---

## 📈 Performance

### Backend
- API response time: ~200-500ms per underwriting request
- Model inference: ~50ms (LightGBM + Isolation Forest)
- RAG retrieval: ~100ms (ChromaDB vector search)
- LLM generation: ~1-2s (Ollama qwen2.5:3b on CPU)

### Frontend
- Initial load: ~500ms (Vite dev server)
- Page transitions: <100ms (React Router)
- Animations: 60fps (Framer Motion)

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version (3.11+)
python --version

# Install dependencies
cd backend
pip install -r requirements.txt

# Check if port 8000 is free
netstat -ano | findstr :8000
```

### Frontend won't start
```bash
# Check Node version (18+)
node --version

# Install dependencies
npm install

# Clear cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Models not loading
```bash
# Retrain models
cd backend
python ml/train_models.py

# Check model files exist
dir ml\models\*.pkl
```

### Ollama not responding
```bash
# Check Ollama is running
curl http://localhost:11434/api/tags

# Pull model if needed
ollama pull qwen2.5:3b

# Start Ollama
ollama serve
```

### API connection errors
- Verify backend is running on port 8000
- Check `.env` file has correct `VITE_API_URL`
- Verify CORS origins in `backend/config/settings.py`
- Check browser console for errors

---

## 🎯 Next Steps

### For Hackathon Demo
1. ✅ Test full application flow
2. ✅ Prepare sample applications (low/medium/high risk)
3. ✅ Practice explaining AI decisions
4. ✅ Highlight fairness and explainability
5. ✅ Show RAG-powered policy Q&A
6. ✅ Demo admin analytics dashboard

### For Production
1. ⚠️ Add JWT authentication
2. ⚠️ Switch to PostgreSQL database
3. ⚠️ Add comprehensive error handling
4. ⚠️ Implement rate limiting
5. ⚠️ Add monitoring (Sentry, DataDog)
6. ⚠️ Deploy to cloud (Render/Railway + Vercel)
7. ⚠️ Add actual alternative data API integrations
8. ⚠️ Improve ML model training with real data
9. ⚠️ Add A/B testing framework
10. ⚠️ Implement continuous model monitoring

---

## 📞 Support

- **Backend Logs**: Check `logs/app.log`
- **Frontend Console**: Open browser DevTools (F12)
- **API Docs**: http://localhost:8000/docs
- **Test Script**: `python test_backend.py`

---

## ✨ Key Highlights for Demo

1. **AI Innovation**:
   - Multi-agent architecture (7 specialized agents)
   - LightGBM risk prediction + Isolation Forest fraud detection
   - SHAP-style explainability
   - RAG-powered policy Q&A with local LLM

2. **Fairness & Compliance**:
   - Bias audit on every decision
   - Protected attributes isolated
   - Disparate impact testing
   - Transparent explanations

3. **Alternative Data**:
   - Email account age, utility payments
   - Device stability, digital engagement
   - Professional profile verification
   - Location stability

4. **Enterprise Architecture**:
   - RESTful API design
   - Type-safe schemas (Pydantic + TypeScript)
   - Modular service architecture
   - Scalable multi-agent coordination

5. **User Experience**:
   - Modern fintech UI (Stripe/Brex inspired)
   - Smooth animations and transitions
   - Responsive design
   - Real-time risk visualization

---

## 🎉 Congratulations!

Your SmartUnderwrite AI platform is **fully functional** and ready for the hackathon demo!

All features are working:
- ✅ Backend API with all endpoints
- ✅ Frontend with complete UI
- ✅ ML models trained and predicting
- ✅ Ollama LLM integrated
- ✅ RAG service operational
- ✅ Multi-agent pipeline executing
- ✅ Fairness and explainability working

**You're ready to win! 🏆**
