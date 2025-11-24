# XAI Image Classifier v2.0

An explainable AI image classification web application powered by ResNet152 and Grad-CAM visualizations.

## 🌟 Features

- **AI-Powered Classification**: 1000 ImageNet categories with 82.3% accuracy
- **Explainable AI**: Grad-CAM heatmaps show what the model sees
- **User Authentication**: Google OAuth + Email/Password
- **Analysis History**: Track your past classifications
- **Dark Mode**: Beautiful light/dark theme support
- **Responsive Design**: Works on desktop and mobile

## 🚀 Tech Stack

### Frontend
- Next.js 14
- React
- Tailwind CSS
- NextAuth.js
- Recharts

### Backend
- FastAPI
- PyTorch
- ResNet152
- Grad-CAM (Captum)
- SQLAlchemy
- SQLite/PostgreSQL

## 📦 Installation

### Prerequisites
- Node.js 18+
- Python 3.9+
- Git

### Backend Setup

```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Add your environment variables to .env.local:
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=your-secret-here
# NEXT_PUBLIC_API_URL=http://localhost:7860
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret

# Run development server
npm run dev
```

Visit `http://localhost:3000`

## 🌐 Deployment

### Backend (Free Options)

**Render** (Recommended):
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

**Railway**:
1. Connect GitHub repo
2. Deploy automatically

### Frontend

**Vercel** (Recommended):
1. Import GitHub repository
2. Set environment variables
3. Deploy

## 🔑 Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-domain.com/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

## 📝 Environment Variables

### Frontend (.env.local)
```env
NEXTAUTH_URL=https://your-frontend-url.com
NEXTAUTH_SECRET=generate-random-secret
NEXT_PUBLIC_API_URL=https://your-backend-url.com
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
```

### Backend
No environment variables required for basic setup.

## 🎯 Usage

1. **Upload Image**: Drag & drop or click to upload
2. **Analyze**: AI processes and classifies your image
3. **View Results**: See predictions with confidence scores
4. **Explore**: View Grad-CAM heatmaps, graphs, and comparisons
5. **History**: Check your past analyses (requires login)

## 🛠️ API Endpoints

- `POST /api/classify` - Classify an image
- `GET /api/history` - Get user's analysis history
- `POST /api/feedback` - Submit feedback on predictions

## 📄 License

MIT License

## 👨‍💻 Author

Anshu Aditya
- GitHub: [@0AnshuAditya0](https://github.com/0AnshuAditya0)

## 🙏 Acknowledgments

- ResNet152 model from PyTorch
- Grad-CAM implementation using Captum
- ImageNet dataset

---

**Version 2.0** - Complete UI/UX overhaul with blue theme and enhanced user experience