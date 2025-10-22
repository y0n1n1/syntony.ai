import { addSearchHistory, SearchHistoryInput } from "../searchHistoryController";
import { getEmbedding } from "./embedding";
import { searchDistribution } from "./searchDistribution";

export interface metaSearchCriteria {
    minCitations?: string;
    maxCitations?: string;
    startDate?: string;
    endDate?: string;
    query: string;
    query_embedding:number[];
    include?:string[];
    filters?: {
      filterName:string;
      filterContent:string;
    }[]
    rankBy:string[];
  }

  export interface PremetaSearchCriteria {
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

  export interface Statistics {
    totalResults: number;
  }

  export interface SearchResults {
    statistics: Statistics;
  }

export const searchGeneral = async (userId: string | undefined, results_per_page: number, page_n: number, criteriaList: PremetaSearchCriteria) => {
  const query_emb = await getEmbedding(criteriaList.query)
  console.log("query embedded!")
  const critFinal:metaSearchCriteria = {
    ...criteriaList,
    query_embedding:query_emb
  }
  console.log(critFinal)
  const results = await searchDistribution(critFinal)
  // go to searchDistribution
  // come back with results
  // add to search history
  const searchCrit:SearchHistoryInput = {
    user_id:userId||undefined,
    minCitations:criteriaList.minCitations||undefined,
    maxCitations:criteriaList.maxCitations||undefined,
    startDate:criteriaList.startDate||undefined,
    endDate:criteriaList.endDate||undefined,
    query:criteriaList.query,
    include:criteriaList.include||undefined,
    filters:criteriaList.filters||undefined,
    rankBy:criteriaList.rankBy||undefined
  }
  // return
  addSearchHistory(searchCrit)
  //console.log(results.slice(((page_n-1)*results_per_page), (page_n*results_per_page)))
  console.log(results)
  return results.slice(((page_n-1)*results_per_page), (page_n*results_per_page))
  };
  
