import React from 'react';
import { RefreshCw } from 'lucide-react';

function Header({ articleCount, onRefresh }) {
  return (
    <header className="bg-black text-white py-8 px-4 border-b border-[#1a1a1a]">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex justify-between items-center mb-2 flex-col md:flex-row gap-4 md:gap-0">
          <div className="self-start md:self-center">
            <h1 className="text-3xl md:text-4xl font-semibold font-poppins text-white">
              BeyondChats Article Optimizer
            </h1>
            <p className="text-base text-[#888888] mt-2 font-poppins font-light">
              AI-powered article optimization with Google Search insights
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
