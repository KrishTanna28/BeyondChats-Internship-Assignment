import React from 'react';
import { Loader2 } from 'lucide-react';

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 min-h-[400px]">
      <Loader2 size={48} className="text-white animate-spin" />
      <p className="mt-4 text-white text-lg font-normal font-poppins">Loading articles...</p>
    </div>
  );
}

export default LoadingSpinner;
