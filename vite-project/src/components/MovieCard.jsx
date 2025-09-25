import React, { useState, useEffect } from 'react'

export const MovieCard = ({ 
  movie: { id, title, vote_average, poster_path, release_date, original_language, overview, genre_ids }, 
  genres 
}) => {
  // Map genre ids to genre names
  const movieGenres = genre_ids?.map(gid => genres[gid]).filter(Boolean);
  const [isFlipped, setIsFlipped] = useState(false);


  return (
    <div className="movie-card perspective " onClick={() => setIsFlipped(!isFlipped)}>
      {/* Front Side */}
      <div className={`card-inner ${isFlipped ? "rotate-y-180" : ""}`}>
        <img
        src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/no-movie.png"}
        alt={title}
        className="w-full h-auto rounded-lg"
      />
      <div className="mt-4">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="star.svg" alt="Star Icon" />
            <span>{vote_average ? vote_average.toFixed(1) : "NA"}</span>
          </div>
          <span>⋅</span>
          <p className="lang">
            {original_language ? original_language.toUpperCase() : "N/A"}
          </p>
          <span>⋅</span>
          <p className="year">
            {release_date ? new Date(release_date).getFullYear() : "N/A"}
          </p>
        </div>
      </div>

      </div>
      

      {/* Back Side */}
      <div className="back backdrop-blur-md rounded-lg p-10">
        <h3 className="text-white font-bold text-lg">Overview</h3>
        <p className="text-gray-200 text-sm mt-4 line-clamp-6 text-justify">{overview}</p>
        <div className="genres mt-4 flex flex-wrap gap-2">
          {movieGenres?.map((g, idx) => (
            <span 
              key={idx} 
              className="bg-gray-700 text-white px-2 py-1 rounded-full text-xs"
            >
              {g}
            </span>
          ))}
        </div>
        <button 
  onClick={() => window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+trailer`, "_blank")}
  className="mt-6 w-full bg-light-200 text-white py-2 rounded-lg hover:bg-primary transition cursor-pointer"
>
  Watch Trailer
</button>

      </div>
    </div>
  );
};
