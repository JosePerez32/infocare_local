import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchBar = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = () => {
    onSearch(searchValue); // Llama a la función onSearch con el valor de búsqueda
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch(); // Realiza la búsqueda al presionar "Enter"
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
      }}
    >
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search..."
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        startIcon={<SearchIcon />}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;