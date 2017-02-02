const React = require('react');
const ReactRouter = require('react-router');
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

    let loginUserInfo = {};
    loginUserInfo.username = this.formFields.username;
    loginUserInfo.password = this.formFields.password;

    // Send a POST request to signin
    $.post('login/', loginUserInfo)
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

  handleInputFieldChange(event) {
    this.formFields[event.target.id] = event.target.value;
  }  

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Login</h4>
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
    );
  }
}

module.exports = UserLogin;