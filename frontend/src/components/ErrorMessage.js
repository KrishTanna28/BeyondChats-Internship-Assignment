import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className="text-center py-16 px-8 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg max-w-[600px] mx-auto my-8">
      <AlertTriangle size={64} className="text-[#ff4444] mb-4 mx-auto" />
      <h2 className="text-white text-2xl mb-3 font-poppins font-semibold">Something went wrong</h2>
      <p className="text-[#888888] text-base mb-8 leading-relaxed font-poppins font-light">{message}</p>
      <button 
        onClick={onRetry}
        className="bg-white text-black border-0 py-3 px-6 rounded text-base font-medium cursor-pointer font-poppins inline-flex items-center gap-2 hover:bg-[#f0f0f0]"
      >
        <RefreshCw size={18} />
        <span>Try Again</span>
      </button>
    </div>
  );
}

export default ErrorMessage;
