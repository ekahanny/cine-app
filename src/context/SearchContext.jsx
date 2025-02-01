import { createContext, useState } from "react";

export const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
  const [searchResult, setSearchResult] = useState([]);
  const [inputValue, setInputValue] = useState("");

  return (
    <SearchContext.Provider
      value={{ searchResult, setSearchResult, inputValue, setInputValue }}
    >
      {children}
    </SearchContext.Provider>
  );
};
