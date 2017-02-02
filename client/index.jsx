const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const hashHistory = ReactRouter.hashHistory;

const NavigationBar = require(__dirname + '/src/components/NavigationBar.jsx');
const UserDashBoard = require(__dirname + '/src/components/UserDashBoard.jsx');
const UserLegislatorsInfo = require(__dirname + '/src/components/UserLegislatorsInfo.jsx');
const LegislationSearch = require(__dirname + '/src/components/LegislationSearch.jsx');
const UserLogin = require(__dirname + '/src/components/UserLogin.jsx');
const UserSignup = require(__dirname + '/src/components/UserSignup.jsx');
const UserLogout = require(__dirname + '/src/components/UserLogout.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVerifyingUserSession: true,
      isUserLoggedIn: false 
    };
  }

  // Need check with the server to see if user is autheticated
  componentDidMount() {
    $.get('login')
      .done(function(data) {
        this.setState({        
          isVerifyingUserSession: false,
          isUserLoggedIn: true
        });
      })
      .fail(error => {
        // If user is not logged in:
        this.setState({
          isVerifyingUserSession: false,
          // isUserLoggedIn: false
          isUserLoggedIn: true          
        });

        // Redirect them to login
        // hashHistory.push('/login');
      });
  }

  render() {
    // If we are in the progress of checking if the user is logged in or not...
    if (this.state.isVerifyingUserSession === true) {
      return (
        <div>
          <h1>Authenticating...</h1>
        </div>
      );
    }

    // If the user is logged in...
    if (this.state.isUserLoggedIn === true) {
      return (
        <div>
          <NavigationBar />
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-4">
                <UserLegislatorsInfo />
              </div>
              <div className="col-md-8">
                {this.props.main}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return null;
  }
}

App.defaultProps = {
  main: (<UserDashBoard />)
};

class AppRoutes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history = {hashHistory}>
        <Route path="/login" component={UserLogin} />
        <Route path="/signup" component={UserSignup} />
        <Route path="/logout" component={UserLogout} /> 
        <Route path="/" component={App}>
          <Route path="/search" components = {{main: () => <LegislationSearch />}} />
          <Route path="/dashboard" components = {{main: () => <UserDashBoard />}} />
        </Route>
      </Router>
    );
  }
} 



ReactDOM.render(<AppRoutes />, document.getElementById('app'));