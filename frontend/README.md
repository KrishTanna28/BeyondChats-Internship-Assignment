# Frontend - BeyondChats Article Optimizer

Modern React application with Tailwind CSS for displaying and comparing original vs AI-enhanced articles.

## 📁 Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── ArticleCard.js       # Individual article with tab interface
│   │   ├── ArticleList.js       # Responsive grid layout
│   │   ├── ErrorMessage.js      # Error display component
│   │   ├── Header.js            # App header with refresh
│   │   └── LoadingSpinner.js    # Loading state
│   ├── services/
│   │   └── api.js               # Axios API integration
│   ├── App.js                   # Main application component
│   ├── index.css                # Tailwind directives + custom styles
│   └── index.js                 # React entry point
├── package.json
├── tailwind.config.js           # Tailwind configuration
└── postcss.config.js            # PostCSS plugins
```

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm start
```

Runs on `http://localhost:3000`

### Build for Production

```bash
npm run build
```

## 🎨 Features

### Tab Interface
Each optimized article displays two tabs:
- **AI Enhanced**: Gemini-optimized content
- **Original**: Original article content

Original (non-optimized) articles show single content view.

### Dark Theme
- Black background (#000000)
- Professional color scheme
- High contrast for readability
- No animations or hover effects

### Responsive Design
- Grid adapts to screen size
- Mobile-first approach
- Tailwind responsive classes

### Components

#### Header
- Application title and subtitle
- Article count display
- Refresh button
- Icons from Lucide React

#### ArticleList
- Responsive grid layout (1-3 columns)
- Empty state handling
- Article cards

#### ArticleCard
- Tab interface for version switching
- Author, date, tags display
- External link to original article
- Expandable description
- Lucide icons throughout

#### LoadingSpinner
- Centered animated loader
- Loader2 icon with spin animation

#### ErrorMessage
- Alert icon with error text
- Retry button
- Error-specific styling

## 🛠️ Technologies

- **React** 18.2.0 - UI framework
- **Tailwind CSS** 3.3.0 - Utility-first styling
- **Lucide React** 0.294.0 - Icon library
- **Axios** 1.6.2 - HTTP requests
- **Poppins** - Primary font family

## 🎯 Design Principles

1. **No Emojis**: Professional appearance using Lucide icons
2. **No Animations**: Static, professional interface
3. **Centered Elements**: All interactive elements horizontally centered
4. **Dark Theme**: Black background for modern look
5. **Clean Typography**: Poppins font throughout

## 📡 API Integration

Located in `src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:5000/api/articles';

// Functions
- fetchArticles()     // GET all articles
- fetchArticle(id)    // GET single article
- createArticle(data) // POST new article
- updateArticle(id, data) // PUT update
- deleteArticle(id)   // DELETE article
```

## 🎨 Tailwind Configuration

Custom extensions in `tailwind.config.js`:

```javascript
{
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif']
      }
    }
  }
}
```

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm test` | Run tests |
| `npm run eject` | Eject from Create React App |

## 🚀 Deployment

### Vercel

```bash
npm run build
vercel --prod
```

### Netlify

```bash
npm run build
# Deploy build/ folder
```

### Update API URL for Production

Edit `src/services/api.js`:

```javascript
const API_BASE_URL = 'https://your-backend-url.com/api/articles';
```

## 🎨 Color Scheme

| Element | Color | Usage |
|---------|-------|-------|
| Background | `#000000` | Main background |
| Cards | `#1a1a1a` | Article cards |
| Borders | `#333333` | Subtle borders |
| Text Primary | `#ffffff` | Main text |
| Text Secondary | `#9ca3af` | Metadata |
| Accent | `#3b82f6` | Links, active tabs |

## 🧩 Component Props

### ArticleCard
```javascript
{
  article: {
    _id: string,
    title: string,
    author: string,
    date: string,
    url: string,
    description: string,
    original_description: string,
    tags: string[]
  }
}
```

### ArticleList
```javascript
{
  articles: Article[]
}
```

### Header
```javascript
{
  articleCount: number,
  onRefresh: function
}
```

## 🔧 Customization

### Change Font
Edit `tailwind.config.js` and `index.css`

### Modify Colors
Update Tailwind classes in components

### Add New Icons
Import from `lucide-react`:
```javascript
import { IconName } from 'lucide-react';
```

## 📱 Responsive Breakpoints

- **Mobile**: < 768px (1 column)
- **Tablet**: 768px - 1024px (2 columns)
- **Desktop**: > 1024px (3 columns)

---

**See main README.md for complete setup instructions**
