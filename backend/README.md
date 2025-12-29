# Backend - BeyondChats Article Optimizer

Node.js/Express backend with MongoDB, Google Search integration, and AI-powered content optimization.

## 📁 Structure

```
backend/
├── config/
│   └── db.js                    # MongoDB connection configuration
├── models/
│   └── Article.js               # Mongoose schema for articles
├── routes/
│   └── articles.js              # Express routes for CRUD operations
├── utils/
│   ├── articleContentScraper.js # Web scraping utility (Cheerio/Puppeteer)
│   ├── articleOptimizer.js      # Gemini AI integration
│   └── googleSearchScraper.js   # SerpAPI integration
├── article-optimizer.js         # Main optimization orchestration
├── scraper.js                   # BeyondChats blog scraper
├── server.js                    # Express server entry point
├── package.json
└── .env                         # Environment variables
```

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Environment Setup

Create `.env` file:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/
GEMINI_API_KEY=your_gemini_api_key
SERPAPI_KEY=your_serpapi_key
PORT=5000
NODE_ENV=development
API_BASE_URL=http://localhost:5000/api/articles
```

### Run Commands

```bash
npm start          # Start server
npm run dev        # Start with auto-reload
npm run scrape     # Scrape BeyondChats blog
npm run optimize   # Optimize articles with AI
```

## 📡 API Endpoints

### GET `/api/articles`
Get all articles

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [...]
}
```

### GET `/api/articles/:id`
Get single article by ID

### POST `/api/articles`
Create new article

**Body:**
```json
{
  "title": "Article Title",
  "author": "Author Name",
  "date": "Date String",
  "url": "https://...",
  "description": "Content",
  "tags": ["tag1", "tag2"]
}
```

### PUT `/api/articles/:id`
Update article

### DELETE `/api/articles/:id`
Delete article

## 🔧 Components

### 1. Web Scraper (`scraper.js`)
- Scrapes BeyondChats blog pages 14-15
- Extracts title, author, date, description, tags
- Stores in MongoDB
- Handles duplicates

### 2. Google Search (`utils/googleSearchScraper.js`)
- Uses SerpAPI for reliable results
- Falls back to web scraping if no API key
- Filters for blog/article URLs
- Returns top 2 relevant articles

### 3. Content Scraper (`utils/articleContentScraper.js`)
- Static scraping with Cheerio (fast)
- Dynamic scraping with Puppeteer (JS-heavy sites)
- Extracts main content, headings, title
- Cleans and normalizes text

### 4. AI Optimizer (`utils/articleOptimizer.js`)
- Google Gemini 2.5 Flash integration
- Analyzes original + reference articles
- Generates enhanced content
- Maintains article structure

### 5. Article Optimizer (`article-optimizer.js`)
- Orchestrates entire optimization flow
- Fetches articles from database
- Calls search, scrape, optimize
- Saves original + enhanced versions
- Handles errors gracefully

## 🗄️ Database Schema

```javascript
{
  title: String (required),
  author: String,
  date: String,
  url: String (unique, required),
  description: String (enhanced content),
  original_description: String (original content),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔑 API Keys Required

1. **MongoDB Atlas**: Database hosting
2. **Google Gemini API**: AI content optimization
3. **SerpAPI** (optional): Google Search (100 free searches/month)

## 📝 Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Production server |
| `npm run dev` | Development with nodemon |
| `npm run scrape` | Scrape BeyondChats blog |
| `npm run optimize` | Optimize all articles |
| `npm run optimize 0` | Optimize first article only |

## 🛡️ Error Handling

- API errors return proper HTTP status codes
- Database errors are caught and logged
- Scraping failures handled gracefully
- Missing API keys are detected at startup

## 🚀 Production Deployment

1. Set environment variables
2. Deploy to Heroku/Railway/Render
3. Update frontend API URL
4. Run scraper and optimizer

---

**See main README.md for complete setup instructions**
