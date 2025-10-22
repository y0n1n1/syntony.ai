import { query } from "../db/dbconnect";

export const updateCitationsInBatches = async (citations: { citationCount: number; articleId: string }[], batchSize: number) => {
    try {
      const currentDate = new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD
  
      for (let i = 0; i < citations.length; i += batchSize) {
        const batch = citations.slice(i, i + batchSize);
        const updateQuery = `
          UPDATE public.articles
          SET citations = CASE external_id ${batch.map((_, index) => `WHEN $${index * 2 + 1} THEN $${index * 2 + 2}::integer`).join(' ')} END,
              last_citation_check = $${batch.length * 2 + 1}
          WHERE external_id IN (${batch.map((_, index) => `$${index * 2 + 1}`).join(', ')})
        `;
  
        // Flatten the parameters: [articleId1, citationCount1, articleId2, citationCount2, ..., currentDate]
        const params = batch.flatMap(({ citationCount, articleId }) => [articleId, citationCount]);
        params.push(currentDate); // Add the current date as the last parameter
        console.log('Params:', params);
        console.log('updateQuery:', updateQuery);
  
        await query(updateQuery, params);
        console.log(`Updated batch of ${batch.length} articles.`);
      }
    } catch (error) {
      console.error('Error updating citations in batch:', error);
    }
  };





