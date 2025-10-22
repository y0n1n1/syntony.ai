// based on fuzzy string matching (Levenshtein distance) 
// author's articles Total Citations, Views, etc
// and on author's level of fame (followers, views, engagement, etc)

import { query } from "../../dbconnect";
import { metaSearchCriteria } from "../search";


export async function SearchAuthors(criteriaList: metaSearchCriteria): Promise<any[]> {
  console.log("AUTHORS called");

  // Initial query to fetch author information without calculating number_of_articles
  const text = `SELECT author.*,
      levenshtein(LPAD(LEFT(LOWER(author.name), LENGTH($1)), LENGTH($1), ' '), LOWER($1)) AS distance,
      SOUNDEX(author.name) AS soundex_val,
      similarity(LOWER(author.name), LOWER($1)) AS trigram_similarity
    FROM author
    WHERE levenshtein(LPAD(LEFT(LOWER(author.name), LENGTH($1)), LENGTH($1), ' '), LOWER($1)) <= 7
    ORDER BY distance ASC, soundex_val ASC, trigram_similarity DESC
    LIMIT 50;`;

  const value = [criteriaList.query];
  try {
    // Execute the first query
    const result = await query(text, value);
    const names = result.rows;

    // Get author IDs from the initial results
    const authorIds = names.map((row: { id: number }) => row.id);

    // If there are authors, fetch the number_of_articles for each
    let articlesCountMap: Record<number, number> = {};
    if (authorIds.length > 0) {
      const articlesQuery = `SELECT author_id, COUNT(*) AS number_of_articles
        FROM author_article
        WHERE author_id = ANY($1)
        GROUP BY author_id;`;

      const articlesResult = await query(articlesQuery, [authorIds]);
      articlesCountMap = Object.fromEntries(
        articlesResult.rows.map((row: { author_id: number; number_of_articles: number }) => [
          row.author_id,
          row.number_of_articles,
        ])
      );
    }

    // Normalize levenshtein distance and combine with trigram_similarity and Soundex similarity
    const namesWithScores = names.map((row: { [key: string]: any; distance: number; trigram_similarity: number; soundex_val: string }) => {
      // Normalize levenshtein distance to be between 0 and 1
      const normalizedLevenshtein = Math.max(0, Math.min(1, 1 - row.distance / criteriaList.query.length));

      // Combine the trigram similarity with the normalized levenshtein distance
      const finalTrigramSimilarity = (normalizedLevenshtein + row.trigram_similarity) / 2;

      // Add number_of_articles from the map
      const numberOfArticles = articlesCountMap[row.id] || 0;

      // Destructure the row to exclude distance, trigram_similarity, and soundex_val
      const { distance, trigram_similarity, soundex_val, ...rowWithoutScores } = row;

      // Return the row without the unwanted properties and include the score and number_of_articles
      return { 
        item: { ...rowWithoutScores, number_of_articles: numberOfArticles }, 
        result_type: "author", 
        score: 1 - finalTrigramSimilarity 
      };
    });

    console.log("AUTHORS resulted");
    return namesWithScores;
  } catch (error) {
    console.error("Error querying database:", error);
    return [];
  }
}


/*


async function main(){
  const sq = {
      metaSearchCriteria: {
      query:"Alessio devoto",
      rankBy:[]
  },
      resultsPerPage:20,
      pageNumber:1
  }
  const query_emb = await getEmbedding(sq.metaSearchCriteria.query)
  console.log("query embedded!")
  const critFinal:metaSearchCriteria = {
      ...sq.metaSearchCriteria,
      query_embedding:query_emb
  }
  const res = await SearchAuthors(critFinal)
  console.log(res)
}

main()

*/