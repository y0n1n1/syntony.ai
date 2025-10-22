// Search must be distributed:
// Take each category's relevance scores to be normalized from 0-1 or 0-100 etc.
// This as opposed to just ranking them actually gives a proximity to the type, so that even the top could be 0.2 instead of always being 1
// Include natural weighting for them, this will be modded when specific combinations are selected 

import { getEmbedding } from "./embedding";
import { SearchArticles } from "./individualized_algorithms/articleSearch";
import { SearchAuthors } from "./individualized_algorithms/authorSearch";
import { SearchTopics } from "./individualized_algorithms/topicSearch";
import { metaSearchCriteria } from "./search"

// take all items of all types, and rank by the natural weighing, return to user only top 200?. If run out of x,y,z types, just go with other ones.

export async function searchDistribution(criteriaList: metaSearchCriteria) {
    if ((!criteriaList.include)||(criteriaList.include.length===0)) {
      // Parallelize the searches and handle the results
      const [articles_finals, author_finals, topic_finals] = await Promise.all([
        SearchArticles(criteriaList),
        SearchAuthors(criteriaList),
        SearchTopics(criteriaList),
      ]);
      /*
      when SearchTopics is called and the results are found, it logs TOPICS resulted
      when SearchAuthors is called and the results are found, it logs AUTHORS resulted
      when SearchArticles is called and the results are found, it logs ARTICLES resulted
      */

  
      const weighted_articles_finals = articles_finals.map((item: { score: number }) => ({
        ...item,
        score: item.score * 0.07,
      }));
  
      const weighted_author_finals = author_finals.map((item: { score: number }) => ({
        ...item,
        score: item.score * 0.205,
      }));
  
      const weighted_topic_finals = topic_finals.map((item: { score: number }) => ({
        ...item,
        score: item.score * 0.125,
      }));
  
      const mergedFinals = [
        ...new Set([...weighted_articles_finals, ...weighted_author_finals, ...weighted_topic_finals]),
      ];
  
      const finalLastArticles = mergedFinals
        .sort((a, b) => a.score - b.score)
        .slice(0, 200);
  
      return finalLastArticles;
    }
  
    let mergedFinals: any[] = [];
    
    if (criteriaList.include.includes("Articles")) {
      const resart = await SearchArticles(criteriaList)
      const weighted_articles_finals = resart.map((item: { score: number }) => ({
        ...item,
        score: item.score * 0.07,
      }));
      mergedFinals = weighted_articles_finals;
    }
    if (criteriaList.include.includes("Authors")) {
      const resaut = await SearchAuthors(criteriaList)
      const weighted_author_finals = resaut.map((item: { score: number }) => ({
        ...item,
        score: item.score * 0.205,
      }));
      mergedFinals = [...new Set([...mergedFinals, ...weighted_author_finals])];
    }
    if (!criteriaList.include.every((item) => ["Articles", "Authors"].includes(item))) {
      const restop = await SearchTopics(criteriaList)
      const weighted_topic_finals = restop.map((item: { score: number }) => ({
        ...item,
        score: item.score * 0.125,
      }));
      mergedFinals = [...new Set([...mergedFinals, ...weighted_topic_finals])];
    }
  
    const finalLastArticles = mergedFinals
      .sort((a: { score: number }, b: { score: number }) => a.score - b.score)
      .slice(0, 200);
  
    return finalLastArticles;
  }
  
