import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState("");
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    // Fetch movie list from backend
    axios
      .get("https://movie-recommendation-backend-1.onrender.com/movies") // Adjust the backend URL as needed
      .then((response) => {
        setMovies(response.data); // Assuming the response contains an array of movie names
      })
      .catch((error) => console.error("Error fetching movie list:", error));
  }, []);

  const fetchRecommendations = () => {
    axios
      .post("https://movie-recommendation-backend-1.onrender.com/recommend", { movie: selectedMovie })
      .then(async (response) => {
        const recommendationsWithPosters = await Promise.all(
          response.data.map(async (rec) => {
            const poster = await fetchPoster(rec.movie_id);
            return { ...rec, poster }; // Add poster URL to the movie object
          })
        );
        setRecommendations(recommendationsWithPosters);
      })
      .catch((error) => {
        console.error("Error fetching recommendations:", error);
        alert("Failed to fetch recommendations. Please try again.");
      });
  };

  const fetchPoster = async (movieId) => {
    try {
      const TMDB_API_KEY = "8265bd1679663a7ea12ac168da84d2e8";
      const response = await axios.get(
        `https://api.themoviedb.org/3/movie/${movieId}?api_key=${TMDB_API_KEY}&language=en-US`
      );
      return `https://image.tmdb.org/t/p/w500/${response.data.poster_path}`;
    } catch (error) {
      console.error("Error fetching poster:", error);
      return null; // Return null if no poster is found
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white py-10 px-4">
    <div className="max-w-5xl mx-auto">
      <h1 className="text-5xl font-extrabold mb-8 text-center text-gradient bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent">
        Movie Recommender
      </h1>

      {/* Movie Selector */}
      <div className="mb-8">
        <label htmlFor="movie-selector" className="block text-lg font-medium mb-2">
          Choose a movie:
        </label>
        <select
          id="movie-selector"
          className="w-full p-4 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
          value={selectedMovie}
          onChange={(e) => setSelectedMovie(e.target.value)}
        >
          <option value="" disabled>
            Select a movie
          </option>
          {movies.map((movie, index) => (
            <option key={index} value={movie} className="text-black">
              {movie}
            </option>
          ))}
        </select>
      </div>

      {/* Recommend Button */}
      <div className="text-center">
        <button
          className="px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 rounded-full shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
          onClick={fetchRecommendations}
          disabled={!selectedMovie}
        >
          Show Recommendations
        </button>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow"
            >
              <div className="h-48 w-full mb-4 relative">
                {rec.poster ? (
                  <img
                    src={rec.poster}
                    alt={rec.title}
                    className="w-full h-full object-cover rounded-md"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-700 rounded-md text-sm">
                    No Image
                  </div>
                )}
              </div>
              <p className="text-md font-bold text-center truncate">
                {rec.title}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>

  );
};

export default App;
