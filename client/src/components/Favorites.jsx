const React = require('react');
const SearchResults = require('./SearchResults.jsx');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h3>Favorites</h3>
          {this.props.favoriteBillList.map((value, ind) => <SearchResults isFetching={false} 
                                                                     key={ind}
                                                                     billResults={value} 
                                                                     username={this.props.username} 
                                                                     updateList={this.props.updateList}
                                                                     favoriteList={this.props.favoriteList}
                                                                     getAllFavorites={this.props.getAllFavorites}   
                                                                     />)}
      </div>
    );
  }
}

module.exports = Favorites;