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
import { DropdownButton, MenuItem } from 'react-bootstrap';

var usStates = [
'AL', 'AK', 'AZ', 'AR', 'CA', 
'CO', 'CT', 'DE', 'FL', 'GA', 
'HI', 'ID', 'IL', 'IN', 'IA', 
'KS', 'KY', 'LA', 'ME', 'MD', 
'MA', 'MI', 'MN', 'MS', 'MO', 
'MT', 'NE', 'NV', 'NH', 'NJ', 
'NM', 'NY', 'NC', 'ND', 'OH', 
'OK', 'OR', 'PA', 'RI', 'SC', 
'SD', 'TN', 'TX', 'UT', 'VT', 
'VA', 'WA', 'WV', 'WI', 'WY'];

class UserSignup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignupError: false,
      signupErrorMessage: '',
      usState: 'AL'
    };

    this.formFields = {'state': 'AL'};

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleInputFieldChange = this.handleInputFieldChange.bind(this);
    this.handleUsStateClick = this.handleUsStateClick.bind(this);
    this.switchToLogin = this.switchToLogin.bind(this);
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
    var that = this;
    $.ajax('signup/' + this.formFields.username, ajaxOptions)
      .done(function(data) {
        // hashHistory.push('/login');
        that.switchToLogin();
      })
      .fail(error => {
        that.setState({
          isSignupError: true,
          signupErrorMessage: error.status + '-' + error.statusText
        });
      });

  }

  // handles click events on the usStates dropdown
  handleUsStateClick(event) {
    if (this.state.isSignupError) {
      this.setState({isSignupError: false, usState: event.target.innerHTML});
    } else {
      this.setState({usState: event.target.innerHTML});
    }
    this.formFields['state'] = event.target.innerHTML;
  }

  // Event handler to populate all values into the formFields object
  // for later use by handleFormSubmit()
  handleInputFieldChange(event) {
    if (this.state.isSignupError) {
      this.setState({isSignupError: false});
    }
    if (event.target.id === 'streetName') {
      var address = event.target.value.split(' ');
      var houseNum = address.shift();
      var street = address.join(' ');
      // console.log('houseNum = ', houseNum);
      // console.log('street = ', street);
      this.formFields['houseNum'] = houseNum;
      this.formFields[event.target.id] = street;
    } else {
      this.formFields[event.target.id] = event.target.value;
    }
  }

  switchToLogin() {
    this.props.close();
    this.props.openLogin();
  }

  render() {
    return (
      <div className="container-fluid">
        <h2>Sign Up</h2>
        <div className="panel-body">
          <form onSubmit={this.handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username:</label>
              <input autoFocus type="text" className={this.state.isSignupError ? 'form-control form-error' : 'form-control'} id="username" placeholder="Enter Username" onChange={this.handleInputFieldChange}></input>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="text" className={this.state.isSignupError ? 'form-control form-error' : 'form-control'} id="email" placeholder="Enter Email" onChange={this.handleInputFieldChange}></input>
            </div>

            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <input type="password" className={this.state.isSignupError ? 'form-control form-error' : 'form-control'} id="password" placeholder="Enter Password" onChange={this.handleInputFieldChange}></input>
            </div>
            <hr />
            <div className="form-inline">
              <label htmlFor="address">Address:</label>
              <input type="text" className={this.state.isSignupError ? 'form-control signup-streetname form-error' : 'form-control signup-streetname'} id="streetName" placeholder="Enter Street Address" onChange={this.handleInputFieldChange}></input>
              <input type="text" className={this.state.isSignupError ? 'form-control signup-city form-error' : 'form-control signup-city'} id="city" placeholder="Enter City" onChange={this.handleInputFieldChange}></input>
 
              <div className="btn-group signup-dropdown">
                <button type="button" className={this.state.isSignupError ? 'form-control signup-dropdown-button dropdown-error' : 'form-control signup-dropdown-button' } data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  {this.state.usState}
                </button>
                <div className="dropdown-menu states-dropdown">
                  {usStates.map((state, i) => <div className="dropdown-item" onClick={this.handleUsStateClick}>{state}</div>)}
                </div>
              </div>

            </div>
            <div className="form-group"></div>

            <div className="form-group">
              <button type="submit">Signup</button>{this.state.isSignupError ? <span style={{color: 'rgba(255, 0, 0, 0.73)', marginLeft: '1rem'}}>Sorry. There seems to be an issue please try again.</span> : '' }
            </div>

            or <span className="login-link" onClick={this.switchToLogin}>Login</span>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = UserSignup;