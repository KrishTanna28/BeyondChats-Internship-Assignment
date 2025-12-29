import React, { useState, useEffect } from 'react';
import { fetchArticles } from './services/api';
import ArticleList from './components/ArticleList';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadArticles();
  }, []);

  const loadArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchArticles();
      
      if (response.success) {
        setArticles(response.data);
      } else {
        setError('Failed to load articles');
      }
    } catch (err) {
      setError('Unable to connect to the server. Please make sure the backend is running.');
      console.error('Error loading articles:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-8 bg-black">
      <Header 
        articleCount={articles.length}
        onRefresh={loadArticles}
      />
      
      <main className="max-w-[1400px] mx-auto px-4 py-8 md:px-4 md:py-8">
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} onRetry={loadArticles} />
        ) : (
          <ArticleList articles={articles} />
        )}
      </main>
    </div>
  );
}

export default App;
