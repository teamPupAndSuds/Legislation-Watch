const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

class UserSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupError: false
    };
  }

  handleUserNameInputChange(event) {

  }

  handlePasswordInputChange(event) {

  }

  render() {
    return (
      <div className="panel panel-primary">
        <div className="panel-heading">
          <h4>Signup</h4>
        </div>
        <div className="panel-body">

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input type="text" className="form-control" id="username" placeholder="Enter Username" onChange={this.handleUserNameInputChange}></input>

          </div>
          <div className="form-group">

            <label htmlFor="password">Password:</label>
            <input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={this.handlePasswordInputChange}></input>

          </div>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">Signup</button>
            {(this.state.isSignupError) ? <h5 style={{'color': 'red'}}>Signup Failure</h5> : <p></p> }
          </div>

          or <Link to="/signup">Signup</Link> 

        </div>
      </div>
    );
  }
}

module.exports = UserSignup;