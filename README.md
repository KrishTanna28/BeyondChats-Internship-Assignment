# BeyondChats Blog Scraper - Phase 1

A Node.js/Express backend application that scrapes blog articles from BeyondChats website and provides RESTful CRUD APIs for managing the articles.

## 🚀 Features

- ✅ Web scraping from BeyondChats blog (last page - 5 oldest articles)
- ✅ MongoDB database storage
- ✅ Complete CRUD API endpoints
- ✅ Error handling and validation
- ✅ Clean code structure
- ✅ Environment-based configuration

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v4.4 or higher) - [Download](https://www.mongodb.com/try/download/community)
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd BeyondChats/backend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the backend directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/beyondchats
NODE_ENV=development
```

### 4. Start MongoDB

Make sure MongoDB is running on your system:

**Windows:**
```bash
mongod
```

**Mac/Linux:**
```bash
sudo service mongod start
```

Or if using MongoDB Atlas, update the `MONGODB_URI` in `.env` with your connection string.

### 5. Run the Web Scraper

Scrape the 5 oldest articles from BeyondChats blog:

```bash
npm run scrape
```

This will:
- Connect to MongoDB
- Scrape articles from https://beyondchats.com/blogs/page/14/ and page/15/
- Extract article title, author, date, URL, description, and tags
- Store them in the database

### 6. Start the API Server

```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at: **http://localhost:5000**

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api/articles`

### 1. Get All Articles
```http
GET /api/articles
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "title": "Article Title",
      "author": "Author Name",
      "date": "December 5, 2023",
      "url": "https://beyondchats.com/blogs/...",
      "description": "Article description...",
      "tags": ["AI", "Chatbots"],
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 2. Get Single Article
```http
GET /api/articles/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Article Title",
    ...
  }
}
```

### 3. Create New Article
```http
POST /api/articles
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Article Title",
  "author": "Author Name",
  "date": "December 29, 2025",
  "url": "https://example.com/article",
  "description": "Article description",
  "tags": ["tag1", "tag2"]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Article created successfully",
  "data": { ... }
}
```

### 4. Update Article
```http
PUT /api/articles/:id
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Article updated successfully",
  "data": { ... }
}
```

### 5. Delete Article
```http
DELETE /api/articles/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Article deleted successfully"
}
```

## 🗂️ Project Structure

```
backend/
├── config/
│   └── db.js              # MongoDB connection configuration
├── models/
│   └── Article.js         # Article schema/model
├── routes/
│   └── articles.js        # CRUD API routes
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── scraper.js            # Web scraping script
├── server.js             # Express server setup
└── README.md             # This file
```

## 🧪 Testing the APIs

### Using cURL:

**Get all articles:**
```bash
curl http://localhost:5000/api/articles
```

**Create article:**
```bash
curl -X POST http://localhost:5000/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Article",
    "author": "John Doe",
    "date": "December 29, 2025",
    "url": "https://example.com/test",
    "description": "This is a test article"
  }'
```

**Update article:**
```bash
curl -X PUT http://localhost:5000/api/articles/<article-id> \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated Title"}'
```

**Delete article:**
```bash
curl -X DELETE http://localhost:5000/api/articles/<article-id>
```

### Using Postman:
Import the API endpoints into Postman and test each CRUD operation.

## 🔧 Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Axios** - HTTP client for scraping
- **Cheerio** - HTML parsing for scraping
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📊 Data Flow

```
1. Scraper (scraper.js)
   ↓
   Fetches HTML from BeyondChats blog
   ↓
   Parses with Cheerio
   ↓
   Extracts article data
   ↓
   Saves to MongoDB

2. API Server (server.js)
   ↓
   Express routes (routes/articles.js)
   ↓
   MongoDB operations via Mongoose (models/Article.js)
   ↓
   JSON responses to client
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running: `mongod` or `sudo service mongod start`
- Check if port 27017 is available
- Verify MONGODB_URI in `.env`

### Scraper Not Working
- Check internet connection
- Website structure might have changed
- Add delays between requests to avoid rate limiting

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using port 5000

## 👨‍💻 Development

**Run with nodemon (auto-reload):**
```bash
npm run dev
```

**Run scraper again:**
```bash
npm run scrape
```

## 📝 Notes

- The scraper targets the last pages (14 & 15) of BeyondChats blog to get the oldest articles
- Duplicate URLs are automatically prevented
- Articles are timestamped with `createdAt` and `updatedAt` fields
- All API responses follow a consistent format with `success`, `message`, and `data` fields

## 🎯 Phase 1 Completion Checklist

- ✅ Web scraping implemented
- ✅ MongoDB integration
- ✅ CRUD APIs (Create, Read, Update, Delete)
- ✅ Error handling
- ✅ Input validation
- ✅ Environment configuration
- ✅ Clean code structure
- ✅ Comprehensive documentation

## 📧 Support

For any questions or issues, please create an issue in the GitHub repository.

---

**Internship Assignment - BeyondChats - Phase 1**
