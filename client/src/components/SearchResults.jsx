const React = require('react');
const BillResultSummary = require('./BillResultSummary.jsx');

class SearchResults extends React.Component {
  render() {
    return (
      <SearchResultsPresentational 
        isFetching={this.props.isFetching} 
        searchResults={this.props.billResults} 
        legislatorCache={this.props.legislatorCache}
        />
    );
  }

}


class SearchResultsPresentational extends React.Component {
  render() {

    // if (!this.props.searchResults) {
    //   return null;
    // }

    if(this.props.searchResults.length === 0) {
      return (
        <div>
          No Results Found
        </div>
      );
    }

    let billResultComponents = this.props.searchResults.map(
      function(bill) {
        return <BillResultSummary key={bill.bill_id} info={bill} legislatorCache={this.props.legislatorCache}/>;
      }.bind(this));

    return (
      <div>
        {this.props.isFetching && 
          <p>Fetching Results</p>
        }
        {billResultComponents}
      </div>
    );
  }
}

module.exports = SearchResults;