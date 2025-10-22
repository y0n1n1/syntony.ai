
import { query } from "../../dbconnect";
import { metaSearchCriteria } from "../search";
const parseMonthYear = (monthYear: string): Date => {
    // Convert the month-year string into a full date string with a default day (e.g., the 1st day of the month)
    const dateStr = `${monthYear} 1`; // "Jun 1995 1"
    
    // Create a Date object from the string
    return new Date(dateStr);
  };
  

// filter by citations and dates!
// go by Relevance, Latest, Citations:
// relevance: solely the embedding. Latest: 
// query embedding to article title embeddings
// query embedding to article's topic's embeddings


// Step 1: filter by citations and dates!

// Step 2: call relevant rank bys:
// Top articles SOLELY by relevance:
//      weighted sum 60% article title, all topic embeddings distribute evenly, 
//      if no embeddings, weighted sum = article title
//      if not solely: same method

// Top articles SOLELY by latest:
//      get n latest that pass relevance score of x. 
//      if solely: return by latest
//      if not solely:
//      multiply how latest it is to the relevance score !!!!!!
//      Now with correct order return to be combined

// Top articles SOLELY by Citations:
//      get n most cited that pass relevance score of x.
//      if not solely: 
//      multiply citations to the relevance score !!!!!!
//      Now with correct order return to be combined

// Step 3: Combine rank bys lists:
// If two combined: 50/50 split as in the top 1 of both lists get compared to compete for 1, 2 spots, 
//                                        top 2s of both lists get compared to compete for 3, 4 spots, and so on
// If 3 combined: 33/33/33 split as in the top 1 of 3 lists get compared to compete for 1, 2, 3 spots, 
//                                        top 2s of 3 lists get compared to compete for 4, 5, 6 spots, and so on

// return top 200 of final listing. **** Return with meta in the new format....

export interface ArticleResult {
    item:{
        external_id?: string;      // Unique identifier from an external source
        id: string;               // Unique identifier in the database
        source?: string;           // Source of the article (e.g., arXiv, journal)
        title: string;            // Title of the article
        authors: string[];        // Array of authors (assuming multiple authors)
        published_date: string;   // Publication date (consider using Date type if needed)
        pdf_url?: string;          // URL to the PDF of the article
        comments?: string;        // Comments about the article (optional)
        journal_ref?: string;     // Reference to the journal (optional)
        doi?: string;             // Digital Object Identifier (optional)
        abstract: string;         // Abstract of the article
        categories: string[];     // Array of categories the article belongs to
        scat?: string;            // Subject classification (optional)
        citations?: number;        // Number of citations the article has received
        last_citation_check?: string; // Date of the last citation check (optional)
    };
    result_type:string;
    score:number;
};

// filter by citations and dates!
// Top articles SOLELY by relevance:
//      weighted sum 60% article title, all topic embeddings distribute evenly, 
//      if no embeddings, weighted sum = article title
//      if not solely: same method
/*
export interface metaSearchCriteria {
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
    */

  
  function mergeByClosestScoreToZero<T extends ArticleResult>(...lists: T[][]): T[] {
    const allItems = lists.flat();
  
    // Group items by `id`
    const groupedItems = allItems.reduce<Record<string | number, T[]>>((acc, x) => {
      if (!acc[x.item.id]) {
        acc[x.item.id] = [];
      }
      acc[x.item.id].push(x);
      return acc;
    }, {});
  
    // Merge groups by selecting the item with the score closest to zero
    return Object.values(groupedItems).map((group) => {
      return group.reduce((closest, current) => {
        return Math.abs(current.score) < Math.abs(closest.score) ? current : closest;
      });
    });
  }

  export async function RelevanceSearch(criteriaList: metaSearchCriteria, res_size: number): Promise<ArticleResult[]> {
    // Base query with focus on title_embedding similarity
    let text = `
        SELECT 
            a.*,
            (a.title_embedding <=> $1) AS score
        FROM 
            articles a      
    `;/*LEFT JOIN 
            topic_article_connection mt ON a.id = mt.article_id
    
    */

    // Prepare an array to store dynamic query values
    const emb = criteriaList.query_embedding;
    const formatted_query_emb = `[${emb.join(', ')}]`;
    const values: any[] = [formatted_query_emb];

    // Start WHERE clause
    const whereClauses: string[] = [];

        // Add conditions for date range if they exist
    if (criteriaList.startDate && criteriaList.endDate) {
        // Parse both dates
        const startDate = parseMonthYear(criteriaList.startDate);
        const endDate = parseMonthYear(criteriaList.endDate);

        // Ensure the dates are in the correct order
        if (startDate > endDate) {
            whereClauses.push(`a.published_date >= $${values.length + 1}`);
            whereClauses.push(`a.published_date <= $${values.length + 2}`);
            values.push(endDate, startDate); // Swap order
        } else {
            whereClauses.push(`a.published_date >= $${values.length + 1}`);
            whereClauses.push(`a.published_date <= $${values.length + 2}`);
            values.push(startDate, endDate);
        }
    } else if (criteriaList.startDate) {
        whereClauses.push(`a.published_date >= $${values.length + 1}`);
        values.push(parseMonthYear(criteriaList.startDate));
    } else if (criteriaList.endDate) {
        whereClauses.push(`a.published_date <= $${values.length + 1}`);
        values.push(parseMonthYear(criteriaList.endDate));
    }


    // Add conditions for citations if they exist
    if (criteriaList.minCitations) {
        whereClauses.push(`(a.citations >= $${values.length + 1} OR a.citations IS NULL)`);
        values.push(criteriaList.minCitations);
    }
    if (criteriaList.maxCitations) {
        whereClauses.push(`(a.citations <= $${values.length + 1} OR a.citations IS NULL)`);
        values.push(criteriaList.maxCitations);
    }

    // Add condition for filtering based on topic_id in the meta_topics table
    if (criteriaList.filters && criteriaList.filters.length > 0) {
        const topicIds = criteriaList.filters.map((id) => `'${id}'`).join(', ');
        whereClauses.push(`mt.topic_id IN (${topicIds})`);
    }

    // Combine WHERE clause conditions
    if (whereClauses.length > 0) {
        text += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add ORDER BY clause for title_embedding similarity
    text += `
        ORDER BY 
            score 
    `;

    // Add LIMIT clause
    text += ` LIMIT $${values.length + 1}`;
    values.push(res_size);
    const result = await query(text, values);
    return result.rows.map(row => ({
        item: row,
        result_type: "article",
        score: row.score
    }));
}


// Top articles SOLELY by latest:
//      get x latest that pass a reasonable relevance score of x. 
//      then return ordering by latest
export async function LatestSearch(criteriaList: metaSearchCriteria, res_size: number): Promise<ArticleResult[]> {
    // Base query
    let text = `
        SELECT 
            a.*,
            (a.title_embedding <=> $1) AS score
        FROM 
            articles a
    `;

    // Prepare an array to store dynamic query values
    const emb = criteriaList.query_embedding;
    const formatted_query_emb = `[${emb.join(', ')}]`;
    const values: any[] = [formatted_query_emb];

    // Start WHERE clause
    const whereClauses: string[] = [];

    // Add conditions for a reasonable relevance score (e.g., 0.75 as an example threshold)
    const reasonableRelevanceScore = 0.75; // Adjust this value based on your requirements
    whereClauses.push(`(a.title_embedding <=> $1) <= $${values.length + 1}`);
    values.push(reasonableRelevanceScore);

        // Add conditions for date range if they exist
    if (criteriaList.startDate && criteriaList.endDate) {
        // Parse both dates
        const startDate = parseMonthYear(criteriaList.startDate);
        const endDate = parseMonthYear(criteriaList.endDate);

        // Ensure the dates are in the correct order
        if (startDate > endDate) {
            whereClauses.push(`a.published_date >= $${values.length + 1}`);
            whereClauses.push(`a.published_date <= $${values.length + 2}`);
            values.push(endDate, startDate); // Swap order
        } else {
            whereClauses.push(`a.published_date >= $${values.length + 1}`);
            whereClauses.push(`a.published_date <= $${values.length + 2}`);
            values.push(startDate, endDate);
        }
    } else if (criteriaList.startDate) {
        whereClauses.push(`a.published_date >= $${values.length + 1}`);
        values.push(parseMonthYear(criteriaList.startDate));
    } else if (criteriaList.endDate) {
        whereClauses.push(`a.published_date <= $${values.length + 1}`);
        values.push(parseMonthYear(criteriaList.endDate));
    }


    // Add conditions for citations if they exist
    if (criteriaList.minCitations) {
        whereClauses.push(`(a.citations >= $${values.length + 1} OR a.citations IS NULL)`);
        values.push(criteriaList.minCitations);
    }
    if (criteriaList.maxCitations) {
        whereClauses.push(`(a.citations <= $${values.length + 1} OR a.citations IS NULL)`);
        values.push(criteriaList.maxCitations);
    }

    // Add condition for filtering based on topic_id in the meta_topics table
    if (criteriaList.filters && criteriaList.filters.length > 0) {
        const topicIds = criteriaList.filters.map((id) => `'${id}'`).join(', ');
        whereClauses.push(`a.id IN (SELECT article_id FROM topic_article_connection WHERE topic_id IN (${topicIds}))`);
    }

    // Combine WHERE clause conditions
    if (whereClauses.length > 0) {
        text += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add ORDER BY clause for the latest articles
    text += `
        ORDER BY 
            a.published_date DESC
    `;

    // Add LIMIT clause
    text += ` LIMIT $${values.length + 1}`;
    values.push(res_size);

    // Execute the query
    const result = await query(text, values);

    // Map results to return the required format
    return result.rows.map(row => ({
        item: row,
        result_type: "article",
        score: row.score,
    }));
}


// Top articles SOLELY by Citations:
//      get n most cited that pass relevance score of x.
//      if not solely: 
//      multiply citations to the relevance score !!!!!!
//      Now with correct order return to be combined
export async function CitationsSearch(criteriaList: metaSearchCriteria, res_size: number): Promise<ArticleResult[]> {
    // Base query
    let text = `
        SELECT 
            a.*,
            (a.title_embedding <=> $1) AS score
        FROM 
            articles a
    `;

    // Prepare an array to store dynamic query values
    const emb = await criteriaList.query_embedding;
    const formatted_query_emb = `[${emb.join(', ')}]`;
    const values: any[] = [formatted_query_emb];

    // Start WHERE clause
    const whereClauses: string[] = [];

    // Add conditions for a reasonable relevance score (e.g., 0.75 as an example threshold)
    const reasonableRelevanceScore = 0.75; // Adjust this value based on your requirements
    whereClauses.push(`(a.title_embedding <=> $1) <= $${values.length + 1}`);
    values.push(reasonableRelevanceScore);

        // Add conditions for date range if they exist
    if (criteriaList.startDate && criteriaList.endDate) {
        // Parse both dates
        const startDate = parseMonthYear(criteriaList.startDate);
        const endDate = parseMonthYear(criteriaList.endDate);

        // Ensure the dates are in the correct order
        if (startDate > endDate) {
            whereClauses.push(`a.published_date >= $${values.length + 1}`);
            whereClauses.push(`a.published_date <= $${values.length + 2}`);
            values.push(endDate, startDate); // Swap order
        } else {
            whereClauses.push(`a.published_date >= $${values.length + 1}`);
            whereClauses.push(`a.published_date <= $${values.length + 2}`);
            values.push(startDate, endDate);
        }
    } else if (criteriaList.startDate) {
        whereClauses.push(`a.published_date >= $${values.length + 1}`);
        values.push(parseMonthYear(criteriaList.startDate));
    } else if (criteriaList.endDate) {
        whereClauses.push(`a.published_date <= $${values.length + 1}`);
        values.push(parseMonthYear(criteriaList.endDate));
    }


    // Add conditions for citations if they exist
    if (criteriaList.minCitations) {
        whereClauses.push(`(a.citations >= $${values.length + 1} OR a.citations IS NULL)`);
        values.push(criteriaList.minCitations);
    }
    if (criteriaList.maxCitations) {
        whereClauses.push(`(a.citations <= $${values.length + 1} OR a.citations IS NULL)`);
        values.push(criteriaList.maxCitations);
    }

    // Add condition for filtering based on topic_id in the meta_topics table
    if (criteriaList.filters && criteriaList.filters.length > 0) {
        const topicIds = criteriaList.filters.map((id) => `'${id}'`).join(', ');
        whereClauses.push(`a.id IN (SELECT article_id FROM topic_article_connection WHERE topic_id IN (${topicIds}))`);
    }

    // Combine WHERE clause conditions
    if (whereClauses.length > 0) {
        text += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    // Add ORDER BY clause for citations (descending order)
    text += `
        ORDER BY 
            a.citations DESC NULLS LAST
    `;

    // Add LIMIT clause
    text += ` LIMIT $${values.length + 1}`;
    values.push(res_size);

    // Execute the query
    const result = await query(text, values);
    console.log(text)
    console.log(values)
    //console.log(result)

    // Map results to return the required format
    return result.rows.map(row => ({
        item: row,
        result_type: "article",
        score: row.score,
    }));
}


// Map strings to functions
const SearchMap: { [key: string]: Function } = {
    "Relevance": RelevanceSearch,
    "Latest": LatestSearch,
    "Citations": CitationsSearch
  };

export async function SearchArticles(criteriaList: metaSearchCriteria): Promise<ArticleResult[]> {
    if (criteriaList.rankBy.length === 0) {
        const [relevance_articles, latest_articles] = await Promise.all([
            RelevanceSearch(criteriaList, 200),
            LatestSearch(criteriaList, 200),
        ]);

        const weighted_relevance_articles = relevance_articles.map(item => ({
            ...item,
            result_type:"article",
            score: item.score * 0.9,
        }));

        const weighted_latest_articles = latest_articles.map(item => ({
            ...item,
            result_type:"article",
            score: item.score * 1.2,
        }));

        const mergedList = mergeByClosestScoreToZero(weighted_relevance_articles,weighted_latest_articles)
        const finalArticles = mergedList
            .sort((a, b) => a.score - b.score)
            .slice(0, 200);
        console.log("ARTICLES resulted")
        return finalArticles;
    }

    if (criteriaList.rankBy.length === 1) {
        const funcCall = SearchMap[criteriaList.rankBy[0]];
        const func_articles = await funcCall(criteriaList, 200);

        const finalArticles = func_articles
            .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
            .slice(0, 200);
            console.log("ARTICLES resulted")
        return finalArticles;
    }

    if (criteriaList.rankBy.length === 2) {
        const [func1_articles, func2_articles] = await Promise.all([
            SearchMap[criteriaList.rankBy[0]](criteriaList, 200),
            SearchMap[criteriaList.rankBy[1]](criteriaList, 200),
        ]);

        const weighted_func1_articles = func1_articles.map((item: any) => ({
            ...item,
            result_type:"article",
            score: item.score * 0.9,
        }));

        const weighted_func2_articles = func2_articles.map((item: any) => ({
            ...item,
            result_type:"article",
            score: item.score * 0.9,
        }));

        const mergedList = mergeByClosestScoreToZero(weighted_func1_articles,weighted_func2_articles)
        const finalArticles = mergedList
            .sort((a, b) => a.score - b.score)
            .slice(0, 200);
            console.log("ARTICLES resulted")
        return finalArticles;
    }

    if (criteriaList.rankBy.length === 3) {
        const [func1_articles, func2_articles, func3_articles] = await Promise.all([
            SearchMap[criteriaList.rankBy[0]](criteriaList, 200),
            SearchMap[criteriaList.rankBy[1]](criteriaList, 200),
            SearchMap[criteriaList.rankBy[2]](criteriaList, 200),
        ]);

        const weighted_func1_articles = func1_articles.map((item: any) => ({
            ...item,
            result_type:"article",
            score: item.score * 0.8,
        }));

        const weighted_func2_articles = func2_articles.map((item: any) => ({
            ...item,
            result_type:"article",
            score: item.score * 0.8,
        }));

        const weighted_func3_articles = func3_articles.map((item: any) => ({
            ...item,
            result_type:"article",
            score: item.score * 0.8,
        }));

        const mergedList = mergeByClosestScoreToZero(weighted_func1_articles,weighted_func2_articles,weighted_func3_articles)
        const finalArticles = mergedList
            .sort((a, b) => a.score - b.score)
            .slice(0, 200);
            console.log("ARTICLES resulted")
        return finalArticles;
    }
    return []
}

/*


async function main(){
    const sq = {
        metaSearchCriteria: {
        query:"kv cache",
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
    const res = await SearchArticles(critFinal)
    console.log(res.length)
}

main()


*/