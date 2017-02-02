const React = require('react');

class UserLogout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogoutError: false,
      logoutErrorMessage: ''
    };
  }
  componentDidMount() {
    $.get('logout')
      .done(function(data) {
        hashHistory.push('/login');
      })
      .fail(error => {
        this.setState({
          isLogoutError: true,
          logoutErrorMessage: error.status + '-' + error.statusText
        });
      });
  }

  render() {
    return (
      <div className="container-fluid">
        <div className="panel panel-primary">
          <div className="panel-heading">
            <h4>Logout</h4>
          </div>
          <div className="panel-body">
            Logging Out...
            {(this.state.isLogoutError) ? <h5 style={{'color': 'red'}}>Logout Failure: {this.state.logoutErrorMessage}</h5> : <p></p> }
          </div>
        </div>
      </div>
    );
  }
}

module.exports = UserLogout;