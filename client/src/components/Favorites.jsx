const React = require('react');
const SearchResults = require('./SearchResults.jsx');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(this.props.favoriteBillList);
    return (
      <div>
        <h1>Favorites</h1>
        <p>Favorites</p>
          {this.props.favoriteBillList.map((value) => <SearchResults isFetching={false} billResults={value} username={this.props.username} updateList={this.props.updateList}/>)}
      </div>
    );
  }
}

module.exports = Favorites;