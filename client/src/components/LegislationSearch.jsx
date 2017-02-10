////////////////////////////////////////////////////////////////////////////////
// LegislationSearch.jsx
// --------------------------
// This is the component that bundle the search bar and the results together
//
// Search related AJAX calls to the Sunlight server are made at this component
// level
//
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const SearchBar = require('./SearchBar.jsx');
const SearchResults = require('./SearchResults.jsx');

class LegislationSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetchingSearchResults: false,
      searchResults: []
    };

    this.handleSearchSubmit = this.handleSearchSubmit.bind(this);
  }
  render() {
    return (
      <LegislationSearchPresentational
        isFetching={this.state.isFetchingSearchResults}
        billResults={this.state.searchResults}
        onSearchSubmit={this.handleSearchSubmit}
        username={this.props.username}
        updateList={this.props.updateList}
        favoriteList={this.props.favoriteList}
      />
    );
  }

  handleSearchSubmit(searchTerms) {
    this.setState({isFetchingSearchResults: true});

    // AJAX call for a full text search to the Sunlight server
    let ajaxSettings = {
      method: 'GET',
      context: this,
      data: {
        query: searchTerms,
        fields: 'bill_id,bill_type,chamber,introduced_on,last_action_at,short_title,official_title,keywords,summary_short,urls,sponsor,sponsor_id,cosponsor_ids,cosponsors.legislator,related_bill_ids,upcoming'
      },
      dataType: 'jsonp',
      success: this.handleSearchComplete.bind(this)

    };

    $.ajax('https://congress.api.sunlightfoundation.com/bills/search', ajaxSettings);
  }

  handleSearchComplete(data) {
    this.setState({
      isFetchingSearchResults: false,
      searchResults: data.results
    });

  }
}


class LegislationSearchPresentational extends React.Component {
  render() {
    return (
      <div id="search-body">
        <SearchBar onSubmit={this.props.onSearchSubmit}/>
        {!this.props.isFetching &&
          <SearchResults
            isFetching={this.props.isFetching}
            billResults={this.props.billResults}
            username={this.props.username}
            updateList={this.props.updateList}
            favoriteList={this.props.favoriteList}
            />
        }
      </div>
    );
  }
}
module.exports = LegislationSearch;