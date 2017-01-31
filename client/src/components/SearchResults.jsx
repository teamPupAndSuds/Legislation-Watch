const React = require('react');
const BillResultSummary = require('./BillResultSummary.jsx');

class SearchResults extends React.Component {
  render() {
    console.log('SearchResults,jsx', this.props.billResults);
    return (
      <SearchResultsPresentational isFetching={this.props.isFetching} searchResults={this.props.billResults} />
    );
  }

}


class SearchResultsPresentational extends React.Component {
  render() {

    if (!this.props.searchResults) {
      return null;
    }


    let billResultComponents = this.props.searchResults.map(
      function(bill) {
        return <BillResultSummary key={bill.bill_id} info={bill} />;
      });

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