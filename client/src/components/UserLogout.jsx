////////////////////////////////////////////////////////////////////////////////
// UserLogout.jsx
// --------------------------
// This is the user logout component. This component will attempt to logout
// the user prior to rendering.
// 
////////////////////////////////////////////////////////////////////////////////
const React = require('react');
const ReactRouter = require('react-router');
const hashHistory = ReactRouter.hashHistory;
const Link = ReactRouter.Link;

class UserLogout extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLogoutError: false,
      logoutErrorMessage: ''
    };
  }

  // Send AJAX call to server for logging out
  componentDidMount() {
    $.get('logout')
      .done(function(data) {
        hashHistory.push('/about');
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
        <div className="panel panel-info">
          <div className="panel-heading">
            <h4 className="panel-title">Logout</h4>
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