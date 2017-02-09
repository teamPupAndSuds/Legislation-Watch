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
    this.handleSignupClick = this.handleSignupClick.bind(this);
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
    if (this.state.isLoginError) {
      this.setState({isLoginError: false})
    }
    this.formFields[event.target.id] = event.target.value;
  }  

  // Handle signup link
  handleSignupClick() {
    this.props.close()
    this.props.openSignup()
  }

  render() {
    return (
      <div className="container-fluid">
        <h2>Login</h2>      
        <form onSubmit={this.handleFormSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input autoFocus type="text" className={this.state.isLoginError ? 'form-control form-error' : 'form-control'} id="username" placeholder="Enter Username" onChange={this.handleInputFieldChange}></input>

          </div>
          <div className="form-group">

            <label htmlFor="password">Password:</label>
            <input type="password" className={this.state.isLoginError ? 'form-control form-error' : 'form-control'} id="password" placeholder="Enter Password" onChange={this.handleInputFieldChange}></input>

          </div>
          <div className="form-group">
            <button type="submit">Login</button>
            {this.state.isLoginError ? <span style={{color: 'rgba(255, 0, 0, 0.73)', marginLeft: '1rem'}}>Invalid Username or Password</span> : '' }
          </div>
          or <span className="signup-link" onClick={this.handleSignupClick}>Signup</span> 
        </form>
      </div>
    );
  }
}

module.exports = UserLogin;