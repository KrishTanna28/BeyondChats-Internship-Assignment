import React, { useState } from 'react';
import { Sparkles, FileText, User, BookOpen, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

function ArticleCard({ article }) {
  const [showFullContent, setShowFullContent] = useState(false);
  const [activeTab, setActiveTab] = useState('enhanced');
  const isOptimized = article.tags && article.tags.includes('optimized');
  const hasOriginal = isOptimized && article.original_description;
  
  // Extract references from description if they exist
  const extractReferences = (description) => {
    if (!description) return { content: '', references: [] };
    
    const referencesIndex = description.indexOf('## References');
    if (referencesIndex === -1) {
      return { content: description, references: [] };
    }
    
    const content = description.substring(0, referencesIndex).trim();
    const referencesText = description.substring(referencesIndex);
    
    // Extract URLs from references section
    const urlRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const references = [];
    let match;
    
    while ((match = urlRegex.exec(referencesText)) !== null) {
      references.push({
        title: match[1],
        url: match[2]
      });
    }
    
    return { content, references };
  };

  const { content, references } = extractReferences(article.description);
  const originalContent = hasOriginal ? article.original_description : '';
  
  const displayContent = showFullContent ? content : content.substring(0, 300);
  const displayOriginal = showFullContent ? originalContent : originalContent.substring(0, 300);
  const shouldTruncate = content.length > 300;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        {isOptimized && (
          <span className="py-2 px-4 rounded bg-[#1a1a1a] text-white border border-[#333333] text-xs font-medium font-poppins flex items-center gap-2">
            <Sparkles size={14} />
            <span>AI Optimized</span>
          </span>
        )}
        {!isOptimized && (
          <span className="py-2 px-4 rounded bg-[#1a1a1a] text-[#888888] border border-[#333333] text-xs font-medium font-poppins flex items-center gap-2">
            <FileText size={14} />
            <span>Original</span>
          </span>
        )}
        <span className="text-sm text-[#666666] font-poppins font-light">{formatDate(article.date)}</span>
      </div>

      <h2 className="text-xl font-semibold text-white mb-3 leading-snug font-poppins">{article.title}</h2>

      {article.author && (
        <p className="text-sm text-[#888888] mb-4 flex items-center gap-2 font-poppins font-light">
          <User size={16} />
          <span>{article.author}</span>
        </p>
      )}

      {hasOriginal ? (
        <>
          <div className="flex gap-2 mb-4 border-b border-[#1a1a1a]">
            <button
              className={`flex-1 py-3 px-4 font-poppins text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'enhanced'
                  ? 'border-white text-white'
                  : 'border-transparent text-[#666666] hover:text-[#888888]'
              }`}
              onClick={() => setActiveTab('enhanced')}
            >
              <Sparkles size={16} />
              <span>AI Enhanced</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 font-poppins text-sm flex items-center justify-center gap-2 border-b-2 transition-colors ${
                activeTab === 'original'
                  ? 'border-white text-white'
                  : 'border-transparent text-[#666666] hover:text-[#888888]'
              }`}
              onClick={() => setActiveTab('original')}
            >
              <FileText size={16} />
              <span>Original</span>
            </button>
          </div>

          <div className="text-[#cccccc] leading-relaxed mb-4 flex-grow whitespace-pre-line font-poppins font-light">
            {activeTab === 'enhanced' ? (
              <>
                {displayContent}
                {shouldTruncate && !showFullContent && '...'}
              </>
            ) : (
              <>
                {displayOriginal}
                {originalContent.length > 300 && !showFullContent && '...'}
              </>
            )}
          </div>
        </>
      ) : (
        <div className="text-[#cccccc] leading-relaxed mb-4 flex-grow whitespace-pre-line font-poppins font-light">
          {displayContent}
          {shouldTruncate && !showFullContent && '...'}
        </div>
      )}

      {shouldTruncate && (
        <div className="flex justify-center mb-4">
          <button 
            className="text-white font-normal cursor-pointer py-2.5 px-5 text-sm font-poppins rounded flex items-center gap-2 hover:text-[#252525]"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? (
              <>
                <ChevronUp size={16} />
                <span>Show Less</span>
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                <span>Read More</span>
              </>
            )}
          </button>
        </div>
      )}

      {references.length > 0 && (
        <div className="mt-6 pt-6 border-t border-[#1a1a1a]">
          <h3 className="text-base font-semibold text-white mb-3 font-poppins flex items-center gap-2">
            <BookOpen size={18} />
            <span>References</span>
          </h3>
          <div className="flex flex-col gap-2">
            {references.map((ref, idx) => (
              <div key={idx} className="flex justify-center">
                <a 
                  href={ref.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 bg-[#1a1a1a] border border-[#333333] rounded no-underline text-white text-sm font-poppins font-light hover:bg-[#252525]"
                >
                  <span className="bg-white text-black w-6 h-6 rounded flex items-center justify-center text-xs font-semibold flex-shrink-0 font-poppins">{idx + 1}</span>
                  <span className="flex-grow">{ref.title}</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#1a1a1a] justify-center">
          {article.tags.map((tag, idx) => (
            <span key={idx} className="bg-[#1a1a1a] text-[#888888] py-2 px-3 border border-[#333333] rounded text-xs font-normal font-poppins">#{tag}</span>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-[#1a1a1a] flex justify-center">
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-white no-underline font-normal text-sm font-poppins flex items-center gap-2 py-2.5 px-5 rounded hover:text-[#252525]"
        >
          <span>View Original Source</span>
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
}

export default ArticleCard;
