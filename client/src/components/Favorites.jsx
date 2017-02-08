const React = require('react');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount(){
    $.ajax({
      method: "GET",
      url : "/user/" + this.props.username + "/favorites",
      contentType: "application/json",
      success: function(data)
      {
        //data - response from server
        console.log('success!' + JSON.stringify(data));
      },
      error: function (errorThrown)
      {
        console.log('error');
        console.log(errorThrown);
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Inside Favorites</h1>
        <p>favorites</p>
      </div>
    );
  }
}

module.exports = Favorites;