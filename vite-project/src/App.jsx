
import React, { useState, useEffect } from 'react'
import Search from './components/search'
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';
import { useDebounce } from 'react-use';
import { getTrendingMovies,updateSearchCount } from './AppWrite';
import { Filters } from './components/Filter';


const API_BASE_URL= 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

// if (!API_KEY) {
//   console.log('TMDB API key is missing. Please set VITE_TMDB_API_KEY in your environment variables.');
// }
const API_OPTIONS={
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}



const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieList,setMoviesList]=useState([]);
  const [trendingMovies,setTrendingMovies]=useState([]);
  const [isLoading,setIsLoading]=useState(false)
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [genres, setGenres] = useState({});
  const [page, setPage] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [randomMovie, setRandomMovie] = useState(null);




  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(handler);
  }, [searchTerm]);


  const fetchMovies = async (query = '', pageNum = 1) => {
  setIsLoading(true);
  setErrorMessage('');

  try {
    let endpoint;

    if (query) {
      
      endpoint = `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}&page=${pageNum}`;
    } else {
      //endpoint with filters
      const params = new URLSearchParams({
        sort_by: "popularity.desc",
        page: pageNum,
      });

      if (selectedGenre) {
        params.append("with_genres", selectedGenre);
      }

      if (selectedYear) {
        // You can either use `primary_release_year` (exact year)
        // or release_date.gte / lte for ranges
        params.append("primary_release_year", selectedYear);
      }

      if (selectedRating) {
        params.append("vote_average.gte", selectedRating);
      }

      endpoint = `${API_BASE_URL}/discover/movie?${params.toString()}`;
    }

    const response = await fetch(endpoint, API_OPTIONS);

    if (!response.ok) throw new Error("Network response was not ok");

    const data = await response.json();

    if (data.Response === "False") {
      setErrorMessage(data.Error || "Error fetching movies");
      setMoviesList([]);

      return;
    }

    setMoviesList(data.results || []);
    setTotalResults(data.total_results || 0);

    if (query && data.results.length > 0) {
      await updateSearchCount(query, data.results[0]);
    }

    // console.log("Fetched Movies:", data);
  } catch (error) {
    console.error("Error fetching movies:", error);
    setErrorMessage("Error fetching movies. Please try again later.");
  } finally {
    setIsLoading(false);
  }
};

  const fetchGenres = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/genre/movie/list?language=en-US`, API_OPTIONS);
    const data = await response.json();
    if (data.genres) {
      // Convert array to object { 28: "Action", 12: "Adventure", ... }
      const genreMap = data.genres.reduce((acc, genre) => {
        acc[genre.id] = genre.name;
        return acc;
      }, {});
      setGenres(genreMap);
    }
  } catch (error) {
    console.error("Error fetching genres:", error);
  }
};

  const loadTrendingMovies= async()=>{
    try{
      const movies = await getTrendingMovies();
      setTrendingMovies(movies);
    }catch(error){
      console.error("Error fetching trending movies:",error);
    }
  }

  useEffect(()=>{
    fetchMovies(debouncedSearchTerm,page);
  },[debouncedSearchTerm,page])
  useEffect(()=>{
    loadTrendingMovies()
    fetchGenres();
  },[])
  return (
    <main>
      <div className="pattern"></div>
      <div className="wrapper">
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
           <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {randomMovie && (
            <div className="mt-6 z-10  
              w-64 lg:w-64 md:w-64 sm:w-64 xs:w-64 
              mx-auto lg:mx-0">
              <MovieCard movie={randomMovie} genres={genres} />
            </div>

        )}
           <div className="flex flex-col md:flex-row items-center justify-center gap-2 p-4">
              {/* Filters */}
  <div className="filter-container w-full md:w-auto bg-dark-200 rounded-lg p-4">
    <Filters
      selectedGenre={selectedGenre}
      setSelectedGenre={setSelectedGenre}
      selectedYear={selectedYear}
      setSelectedYear={setSelectedYear}
      selectedRating={selectedRating}
      setSelectedRating={setSelectedRating}
      fetchMovies={fetchMovies}
    />
  </div>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full md:w-auto">
    {/* Random from loaded list */}
    <button
      className="mt-4 sm:mt-0 bg-primary text-white py-2 px-4 rounded-lg cursor-pointer w-full sm:w-40 hover:text-gray-300 transition"
      onClick={() => {
        if (movieList.length > 0) {
          const picked =
            movieList[Math.floor(Math.random() * movieList.length)];
          setRandomMovie(picked); // save movie in state
        }
      }}
    >
      Random Movie
    </button>

    {/* Random from API with filters */}
    <button
      className="mt-4 sm:mt-0 bg-primary text-white py-2 px-4 rounded-lg cursor-pointer w-full sm:w-40 hover:text-gray-300 transition"
      onClick={async () => {
        try {
          let filterParams = "";
          if (selectedGenre) filterParams += `&with_genres=${selectedGenre}`;
          if (selectedYear)
            filterParams += `&primary_release_year=${selectedYear}`;
          if (selectedRating)
            filterParams += `&vote_average.gte=${selectedRating}`;

          const firstResponse = await fetch(
            `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=1${filterParams}`,
            API_OPTIONS
          );
          const firstData = await firstResponse.json();

          if (firstData.total_pages > 0) {
            const randomPage =
              Math.floor(
                Math.random() * Math.min(firstData.total_pages, 500)
              ) + 1;

            const response = await fetch(
              `${API_BASE_URL}/discover/movie?sort_by=popularity.desc&page=${randomPage}${filterParams}`,
              API_OPTIONS
            );
            const data = await response.json();

            if (data.results?.length > 0) {
              const picked =
                data.results[Math.floor(Math.random() * data.results.length)];
              setRandomMovie(picked); // save movie in state
            }
          }
        } catch (error) {
                    console.error("Error fetching random movie:", error);
                  }
                }}
              >
                Feeling Lucky
              </button>
            </div>
          </div>

        </header>
        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>
                    {index + 1}
                  </p>
                  <img
                    src={movie.poster_url || '/no-movie.png'}
                    alt={movie.title}
                    className="poster"
                  />
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="allMovies mt-15">
          <h2>All Movies</h2>
          {isLoading ? (
           <Spinner />
          ) : errorMessage ? (
            <p className="error">{errorMessage}</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4 h-full">
              {movieList.map((movie)=>(
                <MovieCard key={movie.id} movie={movie} genres={genres}/>
              ))}
            </ul>
          )}
        </section>
        {/* <button className='mt-6 w-full bg-light-200 text-white py-2 rounded-lg hover:bg-primary transition cursor-pointer' onClick={data.pages+1}>Load More</button> */}
        <div className='flex justify-center gap-4'>
          <button
            className='prev mt-6 w-20  text-white py-2 rounded-lg hover:text-gray-300 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <button
            className='next mt-6 w-20  text-white py-2 rounded-lg hover:text-gray-300 transition cursor-pointer'
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>

        </div>



        <p className="text-center text-light-200 mt-4">Page {page}</p>



        
      </div>
    </main>
  )
}



export default App