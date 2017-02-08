const React = require('react');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
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
    return (
      <div>
        <h1>Inside Favorites</h1>
        <p>favorites</p>
          {this.props.list.map((value) => <div>{value.legislationId}</div>)}
      </div>
    );
  }
}

module.exports = Favorites;