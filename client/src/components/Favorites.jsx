const React = require('react');
const SearchResults = require('./SearchResults.jsx');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }

  // componentWillMount(){
  //   var that = this;
  //   $.ajax({
  //     method: "GET",
  //     url : "/user/" + this.props.username + "/favorites",
  //     contentType: "application/json",
  //     success: function(data)
  //     {
  //       //data - response from server
  //       that.setState({list: data});
  //       console.log('success!' + JSON.stringify(data));
        
  //     },
  //     error: function (errorThrown)
  //     {
  //       console.log('error');
  //       console.log(errorThrown);
  //     }
  //   });
  // }

  render() {
    console.log('I HOPE THIS WORKS');
    console.log(this.props.favoriteBillList);
    return (
      <div>
        <h1>Inside Favorites</h1>
        <p>favorites</p>
          {this.props.list.map((value) => <div>{value.legislationId}</div>)}
          {this.props.favoriteBillList.map((value) => <SearchResults isFetching={false} billResults={value} username={this.props.username} updateList={this.props.updateList}/>)}
      </div>
    );
  }
}

module.exports = Favorites;