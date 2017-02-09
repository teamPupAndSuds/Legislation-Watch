////////////////////////////////////////////////////////////////////////////////
// index.jsx
// --------------------------
// This is the entry point for the single page application.
//
// The AppRoutes class defines the client side routes
// The App class is the main view after a user has logged-in
// Other view with non-nested component: login, signup, logout and about
// 
////////////////////////////////////////////////////////////////////////////////
const React = require('react');
const ReactDOM = require('react-dom');

const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
const hashHistory = ReactRouter.hashHistory;

// Import project custom components
const NavigationBar = require(__dirname + '/src/components/NavigationBar.jsx');
const UserDashBoard = require(__dirname + '/src/components/UserDashBoard.jsx');
const UserLegislatorsInfo = require(__dirname + '/src/components/UserLegislatorsInfo.jsx');
const LegislationSearch = require(__dirname + '/src/components/LegislationSearch.jsx');
const UserLogin = require(__dirname + '/src/components/UserLogin.jsx');
const UserSignup = require(__dirname + '/src/components/UserSignup.jsx');
const UserLogout = require(__dirname + '/src/components/UserLogout.jsx');
const About = require(__dirname + '/src/components/About.jsx');
const Favorites = require(__dirname + '/src/components/Favorites.jsx');

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isVerifyingUserSession: true,
      isUserLoggedIn: false,
      username: '',
      userLocation: {
        lat: undefined,
        long: undefined
      },
      userMonitoredKeywords: [],
      favoriteList: [],
      favoriteBillList: []
    };
    this.updateList = this.updateList.bind(this);
    this.updateFavoriteBillList = this.updateFavoriteBillList.bind(this);
    this.handleSearchComplete = this.handleSearchComplete.bind(this);
  }

  // Checks the authentication status of the user
  componentDidMount() {
    $.get('login')
      .done((data) => {
        // Debug
        this.setState({        
          isVerifyingUserSession: false,
          isUserLoggedIn: true,
          username: data.username,
          userLocation: data.geoLocation,
          userMonitoredKeywords: data.keywords,
        });
        var that = this;
        $.ajax({
          method: "GET",
          url : "/user/" + data.username + "/favorites",
          contentType: "application/json",
          success: function(success)
          {
            //data - response from server
            that.setState({favoriteList: success});            
          },
          error: function (errorThrown)
          {
            console.log('error');
            console.log(errorThrown);
          }
        });
      })
      .fail(error => {
        // If user is not logged in:

        // // Production
        this.setState({
          isVerifyingUserSession: false,
          isUserLoggedIn: false
        });

        hashHistory.push('/about');

        // Testing
        // this.setState({
        //   // Testing Only:
        //   isVerifyingUserSession: false,          
        //   isUserLoggedIn: true,
        //   username: 'boba',
        //   userLocation: {
        //     lat: 37.795,
        //     long: -122.40
        //   }      
        // });

      });  
  }

  updateList(){
    $.get('login')
      .done((data) => {
        // Debug
        this.setState({        
          isVerifyingUserSession: false,
          isUserLoggedIn: true,
          username: data.username,
          userLocation: data.geoLocation,
          userMonitoredKeywords: data.keywords,
        });
        var that = this;
        $.ajax({
          method: "GET",
          url : "/user/" + data.username + "/favorites",
          contentType: "application/json",
          success: function(success)
          {
            //data - response from server
            console.log('updating state...');
            that.setState({favoriteList: success});
            that.updateFavoriteBillList(that.state.favoriteList);         
          },
          error: function (errorThrown)
          {
            console.log('error');
            console.log(errorThrown);
          }
        });
      })
      .fail(error => {
        // If user is not logged in:

        // // Production
        this.setState({
          isVerifyingUserSession: false,
          isUserLoggedIn: false
        });

        hashHistory.push('/about');
      });
  }

  updateFavoriteBillList(favoriteIds) {
    // let ajaxSettings = {
    //   method: 'GET',
    //   context: this,
    //   data: {
    //     query: searchTerms,
    //     fields: 'bill_id,bill_type,chamber,introduced_on,last_action_at,short_title,official_title,keywords,summary_short,urls,sponsor,sponsor_id,cosponsor_ids,cosponsors.legislator,related_bill_ids,upcoming'
    //   },
    //   dataType: 'jsonp',
    //   success: this.handleSearchComplete.bind(this)

    // };
    var that = this
    favoriteIds.forEach(function(id) {
      $.ajax({
        method: "GET",
        url: "https://congress.api.sunlightfoundation.com/bills/search?bill_id=" + id.legislationId,
        dataType: 'jsonp',
        success: function(success) {
          console.log('success calling congress api');
          that.handleSearchComplete(success);
        },
        error: function(err) {
          console.log('error calling congress api');
          console.log(err);
        }
      });
    });

    // var that = this;
    // favoriteIds.forEach(function(id) {
    //   console.log('line 164 ' + id.legislationId);
    //   let ajaxSettings = {
    //     method: 'GET',
    //     context: this,
    //     data: {
    //       query: id.legislationId,
    //       fields: 'bill_id,bill_type,chamber,introduced_on,last_action_at,short_title,official_title,keywords,summary_short,urls,sponsor,sponsor_id,cosponsor_ids,cosponsors.legislator,related_bill_ids,upcoming'
    //     },
    //     dataType: 'jsonp',
    //     success: that.handleSearchComplete.bind(that)
    //   };
    //   $.ajax('https://congress.api.sunlightfoundation.com/bills/search?bill_id=', ajaxSettings);
    // });
  }

  handleSearchComplete(data) {
    console.log('this is the data frmo the ajax ' + JSON.stringify(data));
    var temp = this.state.favoriteBillList.slice();
    temp.push(data.results);
    this.setState({
      favoriteBillList: temp
    });
  }

  render() {
    let mainScreen = this.props.main.type;
    function isShowing(mainPage) {
      if (mainScreen === mainPage) {
        return {display: 'initial'};
      } else {
        return {display: 'none'};
      }
    }
    // If we are in the progress of checking if the user is logged in or not...
    if (this.state.isVerifyingUserSession === true) {
      return (
        <div>
          <h1>Authenticating...</h1>
        </div>
      );
    }

    // If the user is logged in, we render the main "dashboard"
    if (this.state.isUserLoggedIn === true) {
      return (
        <div>
          <NavigationBar username={this.state.username}/>
          <div className="container-fluid">
            <div className="row">
              <div className="col-lg-8 col-lg-push-4">
                <span style={isShowing('UserDashBoard')}>
                  <UserDashBoard username={this.state.username} userMonitoredKeywords={this.state.userMonitoredKeywords} />
                </span>

                <span style={isShowing('LegislationSearch')}>
                  <LegislationSearch style={isShowing('LegislationSearch')} username={this.state.username} updateList={this.updateList}/>
                </span>
                <span style={isShowing('Favorites')}>
                  <Favorites style={isShowing('Favorites')} username={this.state.username} list={this.state.favoriteList} updateList={this.updateList} favoriteBillList={this.state.favoriteBillList}/>
                </span>
              </div>
              <div className="col-lg-4 col-lg-pull-8">
                <UserLegislatorsInfo userLat={this.state.userLocation.lat} userLong={this.state.userLocation.long} />
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
  main: 'UserDashBoard'
};

// Routes definitions
class AppRoutes extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history = {hashHistory}>
        <Route path="/about" component={About} />
        <Route path="/login" component={UserLogin} />
        <Route path="/signup" component={UserSignup} />
        <Route path="/logout" component={UserLogout} /> 
        <Route path="/" component={App}>
          <Route path="/search" components = {{main: 'LegislationSearch'}} />
          <Route path="/dashboard" components = {{main: 'UserDashBoard'}} />
          <Route path="/favorites" components = {{main: 'Favorites'}} />
        </Route>
      </Router>
    );
  }
} 

ReactDOM.render(<AppRoutes />, document.getElementById('app'));