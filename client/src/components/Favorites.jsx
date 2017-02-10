const React = require('react');
const SearchResults = require('./SearchResults.jsx');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Favorites</h1>
        <p>Favorites</p>
          {this.props.favoriteBillList.map((value, ind) => <SearchResults isFetching={false} 
                                                                     key={ind}
                                                                     billResults={value} 
                                                                     username={this.props.username} 
                                                                     updateList={this.props.updateList}
                                                                     favoriteList={this.props.favoriteList} 
                                                                     />)}
      </div>
    );
  }
}

module.exports = Favorites;