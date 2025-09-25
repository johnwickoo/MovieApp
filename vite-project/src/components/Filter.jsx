import React, { useState, useEffect } from "react";

const genresList = [
  { id: 28, name: "Action" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Sci-Fi" },
  // 👉 add more from TMDB genres
];

export const Filters = ({ 
  selectedGenre, setSelectedGenre, 
  selectedYear, setSelectedYear, 
  selectedRating, setSelectedRating, 
  fetchMovies 
}) => {
  const years = Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i); // last 50 years
  const ratings = [1,2,3,4,5,6,7,8,9,10];

  // Trigger fetchMovies when filter changes
  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedYear, selectedRating]);

  return (
    <div className="flex gap-4 md:mx-auto flex-wrap justify-center">
      {/* Genre Dropdown */}
      <select
        value={selectedGenre || ""}
        onChange={(e) => setSelectedGenre(e.target.value || null)}
        className="px-4 py-2 rounded-lg bg-dark-100 text-white border border-gray-600"
      >
        <option value="">All Genres</option>
        {genresList.map((g) => (
          <option key={g.id} value={g.id}>{g.name}</option>
        ))}
      </select>

      {/* Year Dropdown */}
      <select
        value={selectedYear || ""}
        onChange={(e) => setSelectedYear(e.target.value || null)}
        className="px-4 py-2 rounded-lg bg-dark-100 text-white border border-gray-600"
      >
        <option value="">All Years</option>
        {years.map((year) => (
          <option key={year} value={year}>{year}</option>
        ))}
      </select>

      {/* Rating Dropdown */}
      <select
        value={selectedRating || ""}
        onChange={(e) => setSelectedRating(e.target.value || null)}
        className="px-4 py-2 rounded-lg bg-dark-100 text-white border border-gray-600"
      >
        <option value="">All Ratings</option>
        {ratings.map((r) => (
          <option key={r} value={r}>{r}+</option>
        ))}
      </select>
    </div>
  );
};
