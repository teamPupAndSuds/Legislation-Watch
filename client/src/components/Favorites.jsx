const React = require('react');
const SearchResults = require('./SearchResults.jsx');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <h1>Inside Favorites</h1>
        <p>favorites</p>
          {this.props.favoriteBillList.map((value) => <SearchResults isFetching={false} billResults={value} username={this.props.username} updateList={this.props.updateList}/>)}
      </div>
    );
  }
}

module.exports = Favorites;