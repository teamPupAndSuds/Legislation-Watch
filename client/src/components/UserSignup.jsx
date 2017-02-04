////////////////////////////////////////////////////////////////////////////////
// UserSignup.jsx
// --------------------------
// This is the user signup component.
// 
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const ReactRouter = require('react-router');
const hashHistory = ReactRouter.hashHistory;
const Link = ReactRouter.Link;

class UserSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupError: false,
      signupErrorMessage: ''
    };

    this.formFields = {};

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
  }

  handleFormSubmit(event) {
    event.preventDefault();

    // Construct the new user information to be sent to the back-end server
    let newUserInformation = {};
    newUserInformation.username = this.formFields.username;
    newUserInformation.email = this.formFields.email;
    newUserInformation.password = this.formFields.password;
    newUserInformation.address = {};
    newUserInformation.address.houseNum = this.formFields.houseNum;
    newUserInformation.address.streetName = this.formFields.streetName;
    newUserInformation.address.city = this.formFields.city;
    newUserInformation.address.state = this.formFields.state;

    let ajaxOptions = {
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(newUserInformation),
      dataType: 'json',      
    };

    // Send a AJAX POST request to the back-end server
    $.ajax('signup/' + this.formFields.username, ajaxOptions)
      .done(function(data) {
        hashHistory.push('/login');
      })
      .fail(error => {
        this.setState({
          isSignupError: true,
          signupErrorMessage: error.status + '-' + error.statusText
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
            <h4 className="panel-title">Signup</h4>
          </div>
          <div className="panel-body">
            <form onSubmit={this.handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username:</label>
                <input type="text" className="form-control" id="username" placeholder="Enter Username" onChange={this.handleInputFieldChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input type="text" className="form-control" id="email" placeholder="Enter Email" onChange={this.handleInputFieldChange}></input>
              </div>          

              <div className="form-group">
                <label htmlFor="password">Password:</label>
                <input type="password" className="form-control" id="password" placeholder="Enter Password" onChange={this.handleInputFieldChange}></input>
              </div>

              <hr />
              <h4> Address </h4>
              <div className="form-group">
                <label htmlFor="houseNum">House / Apartment Number:</label>
                <input type="text" className="form-control" id="houseNum" placeholder="Enter House / Apartment Number" onChange={this.handleInputFieldChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="streetName">Street Name:</label>
                <input type="text" className="form-control" id="streetName" placeholder="Enter Street Name" onChange={this.handleInputFieldChange}></input>
              </div>

              <div className="form-group">
                <label htmlFor="city">City:</label>
                <input type="text" className="form-control" id="city" placeholder="Enter City" onChange={this.handleInputFieldChange}></input>
              </div>           

              <div className="form-group">
                <label htmlFor="state">State:</label>
                <input type="text" className="form-control" id="state" placeholder="Enter State" onChange={this.handleInputFieldChange}></input>
              </div>         

              <div className="form-group">
                <button type="submit" className="btn btn-primary">Signup</button>{(this.state.isSignupError) ? <h5 style={{'color': 'red'}}>Signup Failure: {this.state.signupErrorMessage}</h5> : <p></p> }
              </div>

              or <Link to="/login">Login</Link> 
            </form>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = UserSignup;