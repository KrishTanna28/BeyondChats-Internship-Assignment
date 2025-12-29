import React from 'react';
import { Inbox } from 'lucide-react';
import ArticleCard from './ArticleCard';

function ArticleList({ articles }) {
  if (articles.length === 0) {
    return (
      <div className="text-center py-16 px-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
        <Inbox size={64} className="text-[#666666] mb-4 mx-auto" />
        <h2 className="text-white mb-2 text-2xl font-poppins font-semibold">No articles found</h2>
        <p className="text-[#888888] text-base font-poppins font-light">Try adjusting your filter or check back later.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-4">
      {articles.map(article => (
        <ArticleCard key={article._id} article={article} />
      ))}
    </div>
  );
}

export default ArticleList;
