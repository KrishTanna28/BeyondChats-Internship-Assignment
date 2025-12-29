# BeyondChats Blog Article Optimizer

A comprehensive full-stack application that scrapes blog articles, enhances them using AI, and displays both original and optimized versions through a modern React interface.

## 🎯 Project Overview

This project demonstrates an end-to-end article optimization pipeline:
1. **Web Scraping**: Extracts articles from BeyondChats blog
2. **Google Search Integration**: Finds related reference articles using SerpAPI
3. **AI Enhancement**: Uses Google Gemini AI to optimize content based on top-ranking articles
4. **CRUD API**: Manages articles via REST endpoints
5. **Modern Frontend**: React-based UI to display and compare articles

## 🏗️ Architecture

<img width="2816" height="1536" alt="Architecture" src="https://github.com/user-attachments/assets/464e530d-d914-4522-9ef4-cf04cc9904ec" />

## 📊 Data Flow

### 1. Scraping Phase
```
BeyondChats Blog → Scraper → Parse HTML → MongoDB
```

### 2. Optimization Phase
```
MongoDB → Article → Google Search (SerpAPI) → Top 2 URLs
        ↓
Scrape Reference Articles → Extract Content
        ↓
Original + References → Gemini AI → Enhanced Content
        ↓
Save to MongoDB (preserves original)
```

### 3. Display Phase
```
Frontend → API Request → MongoDB → Return Articles
        ↓
Display with Tab Interface (Original vs Enhanced)
```

## 🚀 Features

- **Web Scraping**: Automated scraping of BeyondChats blog articles (pages 14-15)
- **Google Search Integration**: SerpAPI for reliable search results
- **AI Content Enhancement**: Google Gemini 2.5 Flash for content optimization
- **Dual Content Storage**: Preserves both original and enhanced versions
- **RESTful API**: Full CRUD operations for article management
- **Modern UI**: Dark-themed React interface with Tailwind CSS
- **Tab Interface**: Easy comparison between original and AI-enhanced content
- **Responsive Design**: Works seamlessly across all devices

## 📁 Project Structure

```
BeyondChats/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── models/
│   │   └── Article.js               # Article schema
│   ├── routes/
│   │   └── articles.js              # API routes
│   ├── utils/
│   │   ├── articleContentScraper.js # Content extraction
│   │   ├── articleOptimizer.js      # Gemini AI integration
│   │   └── googleSearchScraper.js   # SerpAPI integration
│   ├── article-optimizer.js         # Main optimization script
│   ├── scraper.js                   # Blog scraper
│   ├── server.js                    # Express server
│   ├── package.json
│   └── .env                         # Environment variables
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleCard.js       # Individual article with tabs
│   │   │   ├── ArticleList.js       # Grid layout
│   │   │   ├── ErrorMessage.js      # Error handling
│   │   │   ├── Header.js            # App header
│   │   │   └── LoadingSpinner.js    # Loading state
│   │   ├── services/
│   │   │   └── api.js               # API integration
│   │   ├── App.js                   # Main component
│   │   └── index.css                # Tailwind styles
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md                        # This file
```

## 🛠️ Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas
- **ODM**: Mongoose
- **Web Scraping**: Axios, Cheerio, Puppeteer
- **Search API**: SerpAPI
- **AI**: Google Gemini AI (@google/genai)

### Frontend
- **Framework**: React 18.2.0
- **Styling**: Tailwind CSS 3.3.0
- **Icons**: Lucide React 0.294.0
- **HTTP Client**: Axios 1.6.2
- **Font**: Poppins

## 📋 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account
- Google Gemini API key
- SerpAPI key (optional, 100 free searches/month)

## ⚙️ Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/KrishTanna28/BeyondChats-Internship-Assignment
cd BeyondChats
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_KEY=your_serpapi_key_here
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000/api/articles
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Update the API base URL in `frontend/src/services/api.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:5000/api/articles';
```

## 🎮 Usage

### Step 1: Start Backend Server

```bash
cd backend
npm start
```

Server runs on `http://localhost:5000`

### Step 2: Scrape Articles (Initial Setup)

```bash
npm run scrape
```

This scrapes 5 articles from BeyondChats blog pages 14-15 and stores them in MongoDB.

### Step 3: Optimize Articles with AI

```bash
npm run optimize
```

This process:
1. Fetches articles from database
2. Searches Google for each article title
3. Scrapes content from top 2 results
4. Uses Gemini AI to create enhanced version
5. Saves both original and optimized versions

### Step 4: Start Frontend

```bash
cd frontend
npm start
```

Frontend runs on `http://localhost:3000`

## 📡 API Endpoints

### Articles

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/articles` | Get all articles |
| GET | `/api/articles/:id` | Get article by ID |
| POST | `/api/articles` | Create new article |
| PUT | `/api/articles/:id` | Update article |
| DELETE | `/api/articles/:id` | Delete article |

### Example Response

```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Article Title",
      "author": "Author Name",
      "date": "January 1, 2024",
      "url": "https://...",
      "description": "Enhanced content...",
      "original_description": "Original content...",
      "tags": ["optimized", "ai-enhanced"],
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

## 🎨 Frontend Features

### Tab Interface
- **AI Enhanced Tab**: Shows optimized content created by Gemini AI
- **Original Tab**: Displays the original article content
- Seamless switching between versions

### Responsive Design
- Grid layout adapts to screen size
- Mobile-friendly interface
- Smooth interactions

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | Yes |
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `SERPAPI_KEY` | SerpAPI key for Google Search | No* |
| `PORT` | Server port (default: 5000) | No |
| `NODE_ENV` | Environment (development/production) | No |
| `API_BASE_URL` | Base URL for articles API | No |

*Falls back to web scraping if not provided (may be blocked)

## 📦 Available Scripts

### Backend

```bash
npm start          # Start server
npm run dev        # Start with nodemon (auto-reload)
npm run scrape     # Scrape BeyondChats blog
npm run optimize   # Optimize articles with AI
```

### Frontend

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

## 🚀 Deployment

### Backend Deployment (Heroku/Railway)

1. Set environment variables in platform dashboard
2. Deploy from GitHub repository
3. Update `API_BASE_URL` in frontend

### Frontend Deployment (Vercel/Netlify)

1. Build the project: `npm run build`
2. Deploy `build` folder
3. Update API URL to production backend URL

## 🧪 Testing

### Test Backend API

```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get single article
curl http://localhost:5000/api/articles/:id
```

### Test Individual Components

```bash
# Test specific article optimization
npm run optimize 0  # Optimizes first article only
```

## 🤝 Contributing

This is an internship assignment project. For any questions or suggestions, please contact the project maintainer.

## 📄 License

This project is created as an internship assignment for BeyondChats.

## 👤 Author

Created as part of the BeyondChats internship application process.

---

**Note**: Make sure to obtain your own API keys for MongoDB Atlas, Google Gemini, and SerpAPI before running the project.
