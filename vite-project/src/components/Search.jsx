import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full max-w-3xl mx-auto mt-10">
      <div className="relative">
        {/* Inline SVG Icon */}
        <svg
          className="absolute left-3 top-1/2 w-5 h-5 text-gray-400 transform -translate-y-1/2 pointer-events-none"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        {/* Input */}
        <input
          type="text"
          placeholder="Search through thousands of movies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full h-12 bg-light-100/5 pl-10 pr-4 py-2 text-gray-200 rounded-lg outline-none placeholder-gray-400"
        />
      </div>
    </div>
  );
};

export default Search;
