import React, { createContext, useContext, useState } from "react";
import {ArticleProps} from '../components/shared/ArticleColumn'

// Define the context type for search
interface SearchContextType {
  searchInput: string;
  setSearchInput: (value: string) => void;
}


export interface ItemProps {
  item:any;
  type:string;
  score:number;
}


// Create the contexts
const SearchContext = createContext<SearchContextType | undefined>(undefined);
const ResultContext = createContext<{items: ItemProps[] } | undefined>(undefined);

// Provider component
export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [searchInput, setSearchInput] = useState("");
  const [searchResult, setSearchResult] = useState<{items: ItemProps[] } | undefined>(undefined);

  return (
    <SearchContext.Provider value={{ searchInput, setSearchInput }}>
      <ResultContext.Provider value={{ searchResult, setSearchResult }}>
        {children}
      </ResultContext.Provider>
    </SearchContext.Provider>
  );
};

// Custom hook to use the search context
export const useSearch = () => {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearch must be used within a SearchProvider");
  }
  return context;
};

// Custom hook to use the result context
export const useResult = () => {
  const context = useContext(ResultContext);
  if (context === undefined) {
    throw new Error("useResult must be used within a SearchProvider");
  }
  return context;
};
