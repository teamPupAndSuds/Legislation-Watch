const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

class UserLogin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginError: false
    };
  }

  handleUserNameChange(event) {

  }

  handlePasswordChange(event) {

  }

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Login</h4>
        </div>
        <div className="panel-body">

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" className="form-control" id="username" placeholder="Enter Username" onChange={this.handleUserNameChange}></input>

          </div>
          <div className="form-group">

            <label htmlFor="password">Password:</label>
            <input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={this.handlePasswordChange}></input>

          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Login</button>
            {(this.state.isLoginError) ? <h5 style={{'color': 'red'}}>Login Failure</h5> : <p></p> }
          </div>

          or <Link to="/signup">Signup</Link> 

        </div>
      </div>
    );
  }
}

module.exports = UserLogin;