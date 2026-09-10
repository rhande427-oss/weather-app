// src/components/SearchBar.jsx
import { useState } from "react";

function SearchBar({ onSearch }) {
  const [input, setInput] = useState("");

  const handleSearch = () => {
    if (input.trim()) {
      onSearch(input);
      setInput(""); // clear after search
    }
  };

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search city..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
}

export default SearchBar;
