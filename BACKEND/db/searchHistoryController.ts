import { query } from './dbconnect';



const parseMonthYear = (monthYear: string): Date => {
  // Convert the month-year string into a full date string with a default day (e.g., the 1st day of the month)
  const dateStr = `${monthYear} 1`; // "Jun 1995 1"
  
  // Create a Date object from the string
  return new Date(dateStr);
};



export interface SearchHistoryInput {
  user_id?: string;
  minCitations?: string;
  maxCitations?: string;
  startDate?: string;
  endDate?: string;
  query: string;
  include?:string[];
  filters?: {
    filterName:string;
    filterContent:string;
  }[]
  rankBy:string[];
}

// Get all saved folders for a user
export const getHistoryByUserId = async (user_id: string) => {
  const text = `SELECT * FROM search_history WHERE user_id = $1`; // Updated to new naming convention
  const values = [user_id];
  const result = await query(text, values);
  return result.rows; // Return all saved folders for the user
};


// Add search history
export const addSearchHistory = async (input: SearchHistoryInput) => {
  
    const text = `
      INSERT INTO search_history (
        user_id,
        time_of_query,
        min_citations,
        max_citations,
        start_date,
        end_date,
        query,
        include,
        filters,
        rank_by
      ) VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING search_id, user_id, time_of_query, min_citations, max_citations, start_date, end_date, query, include, filters, rank_by;
    `;
    const values = [
      input.user_id||null,
      input.minCitations||null,
      input.maxCitations||null,
      input.startDate ? parseMonthYear(input.startDate) : null,
      input.endDate ? parseMonthYear(input.endDate) : null,
      input.query,
      input.include||null,
      input.filters||null,
      input.rankBy||null
    ];
  
    const result = await query(text, values);
  
    return {
      success: true,
      message: 'Search history added successfully',
      searchHistory: result.rows[0],
    };
  };

