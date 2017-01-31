const React = require('react');
const SearchBar = require('./SearchBar.jsx');
const SearchResults = require('./SearchResults.jsx');

class LegislationSearch extends React.Component {
  render() {
    return (
      <LegislationSearchPresentational />
    );
  }
}

class LegislationSearchPresentational extends React.Component {
  render() {
    return (
      <div>
        <SearchBar />
        <SearchResults />
      </div>
    );
  }
}
module.exports = LegislationSearch;