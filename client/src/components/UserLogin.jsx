////////////////////////////////////////////////////////////////////////////////
// UserLogin.jsx
// --------------------------
// This is the user login component.
// 
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const ReactRouter = require('react-router');
const hashHistory = ReactRouter.hashHistory;
const Link = ReactRouter.Link;

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginError: false,
      loginErrorMessage: ''
    };

    this.formFields = {};

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
  }

  handleFormSubmit(event) {
    event.preventDefault();

    // Construct the data object to be sent to the back-end server
    let loginUserInfo = {};
    loginUserInfo.username = this.formFields.username;
    loginUserInfo.password = this.formFields.password;

    let ajaxOptions = {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(loginUserInfo),
      dataType: 'json',      
    };

    // Send a AJAX POST request to the back-end server
    $.ajax('login/', ajaxOptions)
      .done(function(data) {
        hashHistory.push('/dashboard');
      })
      .fail(error => {
        this.setState({
          isLoginError: true,
          loginErrorMessage: error.status + '-' + error.statusText
        });
      });

  }

  // Event handler to populate all values into the formFields object
  // for later use by handleFormSubmit()
  handleInputFieldChange(event) {
    this.formFields[event.target.id] = event.target.value;
  }  

  render() {
    return (
      <div className="container-fluid">
        <h2>Legislation Watch</h2>      
        <div className="panel panel-info">
          <div className="panel-heading">
            <h4 className="panel-title">Login</h4>
          </div>
          <div className="panel-body">
            <form onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" id="username" placeholder="Enter Username" onChange={this.handleInputFieldChange}></input>

              </div>
              <div className="form-group">

                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={this.handleInputFieldChange}></input>

              </div>
              <div className="form-group">
                <button type="submit" className="btn btn-primary">Login</button>
                {(this.state.isLoginError) ? <h5 style={{'color': 'red'}}>Login Failure: {this.state.loginErrorMessage}</h5> : <p></p> }
              </div>

              or <Link to="/signup">Signup</Link> 
            </form>

          </div>
        </div>
      </div>
    );
  }
}

module.exports = UserLogin;