const { GoogleGenAI } = require('@google/genai');

let ai = null;

function initializeGemini(apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

async function optimizeArticle(originalArticle, referenceArticles) {
  try {
    console.log('\n🤖 Optimizing article with Gemini AI...');

    const prompt = buildPrompt(originalArticle, referenceArticles);

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }]
        }
      ]
    });

    const optimizedContent = result.text;

    console.log('  ✓ Article optimization complete');

    return {
      title: extractTitle(optimizedContent) || originalArticle.title,
      content: extractContent(optimizedContent),
      references: referenceArticles.map(ref => ({
        title: ref.title,
        url: ref.url
      }))
    };

  } catch (error) {
    console.error('Error optimizing with Gemini:', error.message);
    throw error;
  }
}

/**
 * Build prompt for Gemini AI
 */
function buildPrompt(originalArticle, referenceArticles) {
  const refContents = referenceArticles
    .map((ref, idx) => `
### Reference Article ${idx + 1}: ${ref.title}
URL: ${ref.url}
Content: ${ref.content}
Headings: ${ref.headings ? ref.headings.join(', ') : 'N/A'}
`)
    .join('\n');

  return `You are an expert content optimizer and SEO specialist. Your task is to rewrite and optimize an article to match the style, formatting, and quality of top-ranking articles on Google.

## Original Article to Optimize:
Title: ${originalArticle.title}
Content: ${originalArticle.description}
URL: ${originalArticle.url}

## Top-Ranking Reference Articles from Google:
${refContents}

## Your Task:
1. Analyze the structure, formatting, and writing style of the reference articles
2. Rewrite the original article to match the quality and style of the top-ranking articles
3. Improve the content by incorporating:
   - Similar heading structure and formatting
   - Writing tone and style
   - Content depth and comprehensiveness
   - SEO-friendly language
   - Clear, engaging narrative
4. Keep the core message of the original article but enhance it significantly
5. Make it detailed, informative, and reader-friendly
6. Include proper paragraph breaks and formatting

## Output Format:
Provide the optimized article in the following format:

TITLE: [Your optimized title here]

CONTENT:
[Your optimized content here - make it comprehensive, well-structured, and engaging. Include multiple paragraphs with clear headings where appropriate.]

## Requirements:
- Minimum 800 words
- Use markdown-style headings (##, ###)
- Make it conversational yet professional
- Focus on value for the reader
- Match the style of the reference articles

Generate the optimized article now:`;
}

/**
 * Extract title from Gemini response
 */
function extractTitle(content) {
  const titleMatch = content.match(/TITLE:\s*(.+?)(?:\n|CONTENT:)/i);
  return titleMatch ? titleMatch[1].trim() : null;
}

/**
 * Extract content from Gemini response
 */
function extractContent(response) {
  const contentMatch = response.match(/CONTENT:\s*([\s\S]+)/i);
  if (contentMatch) {
    return contentMatch[1].trim();
  }
  // If no CONTENT: marker, return entire response
  return response.trim();
}

/**
 * Format article with references section
 */
function formatWithReferences(content, references) {
  let formattedContent = content;

  // Add references section at the end
  if (references && references.length > 0) {
    formattedContent += '\n\n---\n\n## References\n\n';
    formattedContent += 'This article was optimized based on insights from the following top-ranking articles:\n\n';
    
    references.forEach((ref, idx) => {
      formattedContent += `${idx + 1}. [${ref.title}](${ref.url})\n`;
    });
  }

  return formattedContent;
}

module.exports = {
  initializeGemini,
  optimizeArticle,
  formatWithReferences
};
