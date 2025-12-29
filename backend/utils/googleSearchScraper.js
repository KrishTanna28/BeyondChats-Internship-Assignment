const axios = require('axios');
const cheerio = require('cheerio');
const { getJson } = require('serpapi');

async function searchGoogle(query, limit = 2) {
  console.log(`🔍 Searching Google for: "${query}"`);
  
  // Read SERPAPI_KEY at runtime, not at module load time
  const SERP_API_KEY = process.env.SERPAPI_KEY;
  
  if (SERP_API_KEY) {
    return await searchWithSerpApi(query, limit, SERP_API_KEY);
  } else {
    console.log('  ⚠ SERPAPI_KEY not found, using web scraping (may be blocked)');
    return await searchWithScraping(query, limit);
  }
}

/**
 * Search using SerpAPI (reliable, requires API key)
 */
async function searchWithSerpApi(query, limit = 2, apiKey) {
    try {
      console.log('  → Using SerpAPI for reliable results...');
      
      const response = await getJson({
        engine: "google",
        q: query,
        api_key: apiKey,
        num: 10
      });

      const results = [];
      
      if (response.organic_results) {
        for (const result of response.organic_results) {
          if (results.length >= limit) break;
          
          const url = result.link;
          const title = result.title;
          const description = result.snippet || '';
          
          // Filter for blog/article URLs
          if (url && title && isBlogOrArticle(url)) {
            results.push({
              title,
              url,
              description,
              rank: results.length + 1
            });
            console.log(`  ✓ Found: ${title.substring(0, 60)}...`);
          }
        }
      }

      console.log(`✓ Found ${results.length} relevant articles via SerpAPI`);
      return results;

    } catch (error) {
      console.error('  ✗ SerpAPI error:', error.message);
      console.log('  → Falling back to web scraping...');
      return await searchWithScraping(query, limit);
    }
}

/**
 * Search using web scraping (free but may be blocked)
 */
async function searchWithScraping(query, limit = 2) {
    try {
      console.log(`🔍 Searching Google for: "${query}"`);
      
      const response = await axios.get('https://www.google.com/search', {
        params: {
          q: query,
          num: 10,
          hl: 'en'
        },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });

      const $ = cheerio.load(response.data);
      const results = [];

      // Try multiple selectors for Google search results
      // Google frequently changes their HTML structure
      const searchSelectors = [
        'div.g',           // Classic selector
        'div[data-sokoban-container]',  // Newer structure
        'div.Gx5Zad',      // Alternative
        'div[jscontroller]' // Fallback
      ];

      let foundElements = $();
      for (const selector of searchSelectors) {
        foundElements = $(selector);
        if (foundElements.length > 0) {
          console.log(`  Using selector: ${selector}, found ${foundElements.length} elements`);
          break;
        }
      }

      foundElements.each((i, elem) => {
        if (results.length >= limit) return false;

        // Try different link selectors
        const linkElem = $(elem).find('a[href]').first();
        let url = linkElem.attr('href');
        
        // Extract URL from Google's redirect format
        if (url && url.startsWith('/url?q=')) {
          const urlMatch = url.match(/\/url\?q=([^&]+)/);
          url = urlMatch ? decodeURIComponent(urlMatch[1]) : url;
        }

        // Try different title selectors
        const titleElem = $(elem).find('h3, h2, h1').first();
        const title = titleElem.text().trim();
        
        // Try different description selectors
        const descSelectors = ['.VwiC3b', '.lyLwlc', '.s', 'span', 'div.VwiC3b'];
        let description = '';
        for (const descSel of descSelectors) {
          description = $(elem).find(descSel).first().text().trim();
          if (description.length > 20) break;
        }

        // Validate and filter results
      if (url && title && url.startsWith('http') && isBlogOrArticle(url)) {
          results.push({
            title,
            url,
            description,
            rank: results.length + 1
          });
          console.log(`  ✓ Found: ${title.substring(0, 60)}...`);
        }
      });

      if (results.length === 0) {
        console.log('  ⚠ No results found with current selectors');
        console.log('  ℹ Google may be blocking or HTML structure changed');
        console.log('  ℹ Skipping this article...');
        return [];
      }

      console.log(`✓ Found ${results.length} relevant articles`);
      return results;

    } catch (error) {
      console.error('Error searching Google:', error.message);
      console.log('  ℹ Skipping this article due to search failure...');
      return [];
    }
  }

/**
 * Check if URL is likely a blog or article
 */
function isBlogOrArticle(url) {
    // Exclude certain domains
    const excludeDomains = [
      'youtube.com',
      'facebook.com',
      'twitter.com',
      'linkedin.com',
      'instagram.com',
      'pinterest.com',
      'google.com',
      'wikipedia.org' // Can be included if desired
    ];

    // Check for blog/article keywords in URL
    const blogKeywords = [
      '/blog',
      '/article',
      '/post',
      '/news',
      '/guide',
      '/tutorial',
      '/story'
    ];

    const urlLower = url.toLowerCase();
    
    // Exclude unwanted domains
    if (excludeDomains.some(domain => urlLower.includes(domain))) {
      return false;
    }

    // Include if has blog keywords or is a regular article URL
    return blogKeywords.some(keyword => urlLower.includes(keyword)) || 
         (!urlLower.includes('/video') && !urlLower.includes('/watch'));
}

module.exports = { searchGoogle }