import { Client, TablesDB, ID, Query } from 'appwrite';

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_ID;

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(PROJECT_ID);

const tablesDB = new TablesDB(client);

export const updateSearchCount = async (searchTerm, movie) => {
  try {
    // Validate inputs
    if (!searchTerm || searchTerm.trim() === "") {
      console.warn("Skipping update: searchTerm is empty or undefined");
      return;
    }

    if (!movie || !movie.id) {
      console.warn("Skipping update: movie is invalid or missing ID");
      return;
    }

    console.log('Updating search count for:', { searchTerm, movieId: movie.id });

    // Fix the Query syntax - remove array wrapper
    const listResult = await tablesDB.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal('searchTerm', searchTerm)] 
    });

    console.log('Query result:', listResult);

    if (listResult.rows && listResult.rows.length > 0) {
      // Update existing row
      const row = listResult.rows[0];
      console.log('Found existing row:', row);
      
      const updated = await tablesDB.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: { 
          count: (row.count || 0) + 1 // Handle case where count might be undefined
        }
      });
      console.log("Row updated:", updated);
    } else {
      // Create new row
      console.log('Creating new row for search term:', searchTerm);
      
      // Prepare data with proper validation
      const rowData = {
        searchTerm: searchTerm.trim(),
        count: 1,
        movie_id: (movie.id), // Ensure it's a string if your schema expects string
        poster_url: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
          : null
      };

      console.log('Row data to create:', rowData);

      const created = await tablesDB.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: rowData
        // Remove permissions from here - set them in your table schema instead
      });
      console.log("Row created:", created);
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    
    // Log more details about the error
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", error.response.data);
    }
    
    // Re-throw so calling code can handle it
    throw error;
  }
};
export const getTrendingMovies = async () => {
    try {
        const result = await tablesDB.listRows({
            databaseId: DATABASE_ID,
            tableId: TABLE_ID,
            queries: [Query.orderDesc('count'), Query.limit(5)]
        });
        return result.rows;

    }catch (error) {
        console.error("Error fetching trending movies:", error);
    }
}