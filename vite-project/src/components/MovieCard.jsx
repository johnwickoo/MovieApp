import React, { useState } from 'react';

export const MovieCard = ({ 
  movie: { id, title, vote_average, poster_path, release_date, original_language, overview, genre_ids }, 
  genres 
}) => {
  const movieGenres = genre_ids?.map(gid => genres[gid]).filter(Boolean);
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="movie-card w-full aspect-[2/3.3] relative cursor-pointer"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="card-inner relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d]"
        style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        {/* Front Side */}
        <div className="front absolute inset-0 bg-black  rounded-lg  flex flex-col">
          <img
            src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : '/no-movie.png'}
            alt={title}
            className="w-full h-auto rounded-lg"
          />
          <div className="mt-4">
            <h3 className="font-semibold text-white line-clamp-1">{title}</h3>
            <div className="content flex items-center gap-2 text-sm text-gray-300">
              <div className="rating flex items-center gap-1">
                <img src="/star.svg" alt="Star Icon" className="w-4 h-4" />
                <span>{vote_average ? vote_average.toFixed(1) : 'NA'}</span>
              </div>
              <span>⋅</span>
              <p className="lang">{original_language?.toUpperCase() || 'N/A'}</p>
              <span>⋅</span>
              <p className="year">{release_date ? new Date(release_date).getFullYear() : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Back Side */}
        <div className="back absolute inset-0 backdrop-blur-md bg-black/20 p-6 rounded-lg flex flex-col [backface-visibility:hidden] [transform:rotateY(180deg)]">
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
            onClick={(e) => {
              e.stopPropagation(); // prevent flipping when clicking button
              window.open(
                `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+trailer`,
                '_blank'
              );
            }}
            className="mt-6 w-full bg-light-200 text-white py-2 rounded-lg hover:bg-primary transition-colors cursor-pointer text-sm"
          >
            Watch Trailer
          </button>
        </div>
      </div>
    </div>
  );
};
