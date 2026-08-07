# 🌐 Deployment Guide - SmartUnderwrite AI

## Quick Deploy Options

### 🚀 Fastest: Vercel (Recommended)

#### Option 1: Vercel CLI
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
cd smartunderwrite-ai
vercel

# Follow prompts
```

#### Option 2: Vercel Git Integration
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your repository
5. Done! Auto-deploys on push

**Build Settings (Auto-detected):**
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

---

### 🔷 Netlify

#### Option 1: Drag & Drop
```bash
# Build locally
npm run build

# Drag the 'dist' folder to netlify.com/drop
```

#### Option 2: Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy

# Production deploy
netlify deploy --prod
```

#### Option 3: Git Integration
1. Push to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Click "New site from Git"
4. Select repository
5. Set build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`

---

### 📦 GitHub Pages

#### 1. Update `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/your-repo-name/', // Add this line
})
```

#### 2. Install gh-pages:
```bash
npm install -D gh-pages
```

#### 3. Add deploy scripts to `package.json`:
```json
{
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d dist"
  }
}
```

#### 4. Deploy:
```bash
npm run deploy
```

#### 5. Enable GitHub Pages:
- Go to repository settings
- Pages section
- Source: gh-pages branch
- Save

---

### ☁️ AWS Amplify

#### 1. Push to Git (GitHub/GitLab/Bitbucket)

#### 2. AWS Console:
1. Go to AWS Amplify Console
2. Click "New App" → "Host web app"
3. Connect your repository
4. Configure build settings:
   ```yaml
   version: 1
   frontend:
     phases:
       preBuild:
         commands:
           - npm ci
       build:
         commands:
           - npm run build
     artifacts:
       baseDirectory: dist
       files:
         - '**/*'
     cache:
       paths:
         - node_modules/**/*
   ```
5. Deploy

---

### 🐳 Docker Deployment

#### Dockerfile:
```dockerfile
# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### nginx.conf:
```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

#### Build & Run:
```bash
# Build image
docker build -t smartunderwrite-ai .

# Run container
docker run -p 80:80 smartunderwrite-ai
```

#### Docker Compose (docker-compose.yml):
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

---

### 🌩️ Azure Static Web Apps

#### 1. Azure CLI:
```bash
# Install Azure CLI
# https://docs.microsoft.com/cli/azure/install-azure-cli

# Login
az login

# Create static web app
az staticwebapp create \
  --name smartunderwrite-ai \
  --resource-group your-resource-group \
  --source . \
  --location "East US 2" \
  --branch main \
  --app-location "/" \
  --output-location "dist"
```

#### 2. GitHub Actions (auto-created):
```yaml
name: Azure Static Web Apps CI/CD

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Build And Deploy
        uses: Azure/static-web-apps-deploy@v1
        with:
          azure_static_web_apps_api_token: ${{ secrets.AZURE_TOKEN }}
          repo_token: ${{ secrets.GITHUB_TOKEN }}
          action: "upload"
          app_location: "/"
          output_location: "dist"
```

---

## 🔐 Environment Variables

### Production Environment Variables:

#### .env.production:
```bash
VITE_API_URL=https://your-api-domain.com/api
VITE_APP_NAME=SmartUnderwrite AI
VITE_APP_VERSION=1.0.0
```

### Setting in Hosting Services:

#### Vercel:
```bash
vercel env add VITE_API_URL production
# Enter value when prompted
```

Or in Vercel Dashboard:
- Settings → Environment Variables
- Add: `VITE_API_URL` = `https://api.yourbackend.com`

#### Netlify:
- Site settings → Build & deploy → Environment
- Add variables

#### GitHub Pages:
- Repository Settings → Secrets
- Add secrets (access via workflow)

#### Docker:
```bash
docker run -e VITE_API_URL=https://api.example.com -p 80:80 smartunderwrite-ai
```

---

## 🔄 CI/CD Setup

### GitHub Actions (.github/workflows/deploy.yml):

```yaml
name: Build and Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Lint
        run: npm run lint
      
      - name: Build
        run: npm run build
        env:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Download artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./
```

---

## 🎯 Custom Domain Setup

### Vercel:
1. Go to project settings
2. Domains tab
3. Add custom domain
4. Update DNS:
   - Type: CNAME
   - Name: www (or @)
   - Value: cname.vercel-dns.com

### Netlify:
1. Domain settings
2. Add custom domain
3. Update DNS:
   - Type: CNAME
   - Name: www
   - Value: yoursite.netlify.app

### SSL Certificate:
- ✅ Automatic on Vercel
- ✅ Automatic on Netlify
- ✅ Let's Encrypt on others

---

## 📊 Performance Optimization

### Build Optimization:

#### 1. Analyze Bundle:
```bash
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    visualizer()
  ]
})

npm run build
# Opens stats.html
```

#### 2. Code Splitting:
```typescript
// Use dynamic imports
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'))

<Suspense fallback={<Loading />}>
  <Routes>
    <Route path="/admin" element={<AdminDashboard />} />
  </Routes>
</Suspense>
```

#### 3. Image Optimization:
```bash
# Install plugin
npm install -D vite-plugin-image-optimizer

# Add to vite.config.ts
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
```

---

## 🔍 SEO & Meta Tags

### Update `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- SEO -->
    <meta name="description" content="AI-powered loan underwriting with explainable decisions and fraud detection" />
    <meta name="keywords" content="AI, loan underwriting, fintech, risk assessment" />
    <meta name="author" content="Your Company" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="SmartUnderwrite AI" />
    <meta property="og:description" content="AI-Powered Dynamic Underwriting System" />
    <meta property="og:image" content="/og-image.png" />
    <meta property="og:url" content="https://yourapp.com" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="SmartUnderwrite AI" />
    <meta name="twitter:description" content="AI-Powered Dynamic Underwriting System" />
    <meta name="twitter:image" content="/og-image.png" />
    
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    
    <title>SmartUnderwrite AI - AI-Powered Loan Underwriting</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

---

## 🚦 Health Check & Monitoring

### Add Health Check Endpoint:

Create `public/_health` (static file):
```json
{
  "status": "ok",
  "version": "1.0.0",
  "timestamp": "2026-08-07"
}
```

### Monitoring Services:
- **Vercel Analytics:** Built-in
- **Google Analytics:** Add to index.html
- **Sentry:** Error tracking
- **LogRocket:** Session replay

---

## 🔒 Security Headers

### Netlify (_headers file):
```
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
```

### Vercel (vercel.json):
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

---

## ✅ Pre-Deployment Checklist

- [ ] Run `npm run build` successfully
- [ ] Test production build locally (`npm run preview`)
- [ ] Set environment variables
- [ ] Update API URLs
- [ ] Add custom domain (if needed)
- [ ] Configure SSL certificate
- [ ] Set up CI/CD pipeline
- [ ] Add error tracking (Sentry)
- [ ] Configure analytics
- [ ] Test on multiple devices
- [ ] Run Lighthouse audit
- [ ] Check SEO meta tags
- [ ] Test all routes
- [ ] Verify API connections

---

## 📈 Post-Deployment

### Monitor:
- Server response times
- Error rates
- User sessions
- Page load times
- Conversion rates

### Optimize:
- Enable CDN
- Configure caching
- Compress images
- Minify assets
- Enable gzip/brotli

---

## 🎉 Deployment Complete!

Your SmartUnderwrite AI application is now live! 🚀

**Recommended Services for Different Needs:**

| Use Case | Best Platform |
|----------|--------------|
| Quick demo/hackathon | Vercel |
| Portfolio project | Netlify |
| Enterprise/scalable | AWS Amplify |
| Full control | Docker + VPS |
| Free tier priority | GitHub Pages |

---

**Questions?** Check the main README.md or open an issue.

**Happy Deploying! 🌐**
