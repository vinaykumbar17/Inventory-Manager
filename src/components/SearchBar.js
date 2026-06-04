function SearchBar({ search, setSearch }) {

  return (
    <>
      <input
        type="text"
        placeholder="Search Product"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <br /><br />
    </>
  );
}

export default SearchBar;