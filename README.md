# SmartUnderwrite AI

An AI-powered dynamic loan underwriting platform that evaluates customer loan risk using alternative data and provides explainable AI decisions.

## 🚀 Features

- **AI Risk Prediction**: Predict borrower risk using advanced machine learning algorithms
- **Explainable AI**: Transparent decision-making with detailed explanations
- **Fraud Detection**: Real-time fraud monitoring and anomaly detection
- **Dynamic Credit Assessment**: Continuously updated risk scores based on alternative data
- **Comprehensive Analytics**: Deep insights into loan portfolios and trends
- **Admin Dashboard**: Full-featured management interface
- **Report Generation**: Export detailed underwriting reports

## 🛠 Tech Stack

- **React.js** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Recharts** - Data visualization
- **React Router** - Navigation
- **Vite** - Build tool

## 📦 Installation

1. Clone the repository
```bash
git clone <repository-url>
cd smartunderwrite-ai
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗 Project Structure

```
smartunderwrite-ai/
├── src/
│   ├── components/
│   │   ├── ui/              # Reusable UI components
│   │   └── layout/          # Layout components (Navbar, Sidebar, Footer)
│   ├── pages/               # Page components
│   │   ├── LandingPage.tsx
│   │   ├── LoanApplicationPage.tsx
│   │   ├── RiskDashboardPage.tsx
│   │   ├── ExplainabilityPage.tsx
│   │   ├── FraudDetectionPage.tsx
│   │   ├── AdminDashboard.tsx
│   │   ├── AnalyticsPage.tsx
│   │   ├── ReportsPage.tsx
│   │   └── SettingsPage.tsx
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── data/                # Mock data
│   ├── App.tsx              # Main app component
│   └── main.tsx             # Entry point
├── public/                  # Static assets
└── package.json
```

## 🎨 Pages

### 1. Landing Page
- Hero section with call-to-action
- Feature cards
- Statistics showcase
- Benefits section

### 2. Loan Application
- Multi-step form with validation
- Personal information
- Employment details
- Financial information
- Alternative data collection

### 3. Risk Dashboard
- Circular risk gauge with animation
- Risk level indicators
- Detailed metrics breakdown
- Quick actions panel

### 4. Explainability Page
- Positive and negative factors
- Feature importance chart
- Transparent AI decision breakdown

### 5. Fraud Detection
- Fraud risk score visualization
- Security checks status
- Anomaly detection timeline

### 6. Analytics Dashboard
- Loan approval trends
- Risk distribution charts
- Income vs risk analysis
- Fraud detection trends

### 7. Admin Dashboard
- Key metrics overview
- Recent applications table
- Statistical insights
- Navigation sidebar

### 8. Reports Page
- Comprehensive report generation
- PDF export functionality
- Decision history timeline
- Customer summary

### 9. Settings Page
- Profile management
- Notification preferences
- Security settings
- Theme customization

## 🔌 API Integration

The application is ready for backend integration. Update the API base URL in `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

### API Endpoints to Implement:

- `POST /api/predict` - Risk prediction
- `POST /api/fraud-check` - Fraud detection
- `GET /api/customers` - Get all customers
- `GET /api/analytics` - Get analytics data
- `GET /api/explain` - Get explainability data

## 🎯 Environment Variables

Create a `.env` file in the root directory:

```
VITE_API_URL=http://localhost:8000/api
```

## 📱 Responsive Design

The application is fully responsive and works seamlessly on:
- Desktop (1920px and above)
- Laptop (1024px - 1919px)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 Design Features

- **Glassmorphism cards** with backdrop blur
- **Gradient accents** using blue and emerald colors
- **Smooth animations** powered by Framer Motion
- **Professional typography** with Inter font family
- **Clean white background** with subtle color accents
- **Rounded corners** for modern aesthetics

## 🚀 Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

## 📊 Mock Data

The application currently uses mock data for demonstration. All mock data is located in `src/data/mockData.ts`.

## 🤝 Contributing

This is a hackathon demo project. Feel free to extend and customize as needed.

## 📄 License

MIT License

## 👥 Authors

Created for AI-powered fintech innovation

---

**Note**: This is a frontend demo application. For production use, connect to a real FastAPI backend with actual AI/ML models for risk prediction and fraud detection.
