import React from 'react'

export const MovieCard = ({movie:{id,title,vote_average,poster_path,release_date,original_language}}) => (
    <div className='movie-card'>
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : "/no-movie.png"} alt={title} className='w-full h-auto rounded-lg'/>
        <div className="mt-4">
            <h3>{title}</h3>
            <div className="content">
                <div className="rating">
                    <img src="star.svg" alt="Star Icon" />
                    <span>{vote_average? vote_average.toFixed(1):'NA'}</span>
                </div>
                <span>⋅</span>
                <p className="lang">
                    {original_language ? original_language.toUpperCase() : 'N/A'}
                </p>
                <span>⋅</span>
                <p className="year">{release_date ? new Date(release_date).getFullYear() : 'N/A'}</p>
            </div>
        </div>
    </div>
)
