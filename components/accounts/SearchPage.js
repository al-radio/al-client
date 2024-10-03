import React, { useState } from "react";
import { Button, TextInput, GroupBox } from "react95";
import styled from "styled-components";
import { fetchPublicProfile } from "@/services/api";
import ProfileAnchor from "../foundational/ProfileAnchor";

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SearchPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (!searchQuery) return;
    fetchPublicProfile(searchQuery).then((profileData) => {
      if (profileData.message) {
        setError(profileData.message); // Display the error message
        setSearchResult(null); // Clear any previous search result
      } else {
        setError(null); // Clear any previous error
        setSearchResult(profileData); // Set the profile data
      }
    });
  };

  return (
    <SearchContainer>
      <GroupBox label="Search">
        <TextInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Enter handle..."
        />
        <Button onClick={handleSearch} style={{ marginTop: "10px" }}>
          Search
        </Button>
      </GroupBox>

      <GroupBox label="Results">
        {error ? (
          <p>{error}</p> // Display the error message
        ) : searchResult ? (
          <ul>
            <li key={searchResult.handle}>
              <ProfileAnchor handle={searchResult.handle} />
            </li>
          </ul>
        ) : (
          <p>No results found.</p>
        )}
      </GroupBox>
    </SearchContainer>
  );
};

export default SearchPage;
