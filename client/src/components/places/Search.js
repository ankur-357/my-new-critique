import React from "react";

const Search = ({ searchQuery, setSearchQuery }) => {
  const handleSearchChange = (e) => {
    e.preventDefault();
    setSearchQuery(e.target.value);
  };

  return (
    <div className="mb-4 border-2 border-primary rounded-lg">
      <input
        type="text"
        placeholder="Search places"
        value={searchQuery}
        onChange={handleSearchChange}
        className="rounded-md border-primary focus:border-primary focus:ring focus:ring-primary py-2 px-4 block w-full appearance-none leading-normal"
      />
    </div>
  );
};

export default Search;
