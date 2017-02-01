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

// This is pre-download trimmed down version of Legislator data
var LegislatorData = require(__dirname + '/src/data/LegislatorData.js');

class App extends React.Component {
  constructor(props) {
    super(props);

    // This is an cache for storing legislator info retrieved from the Sunlight API.
    // This is design to reduce the number of API call to sunlight for legislator information

    // Now handled by Router, to be removed
    // this.legislatorInfoCache = LegislatorData;
  }

  render() {
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
}

//<LegislationSearch legislatorCache={this.legislatorInfoCache}/> 

App.defaultProps = {
  main: (<UserDashBoard />)
};

class Test extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Router history = {hashHistory}>
        <Route path="/" component={App}>
          <Route path="/search" components = {{main: () => <LegislationSearch legislatorCache={LegislatorData} />}} />
          <Route path="/dashboard" components = {{main: () => <UserDashBoard />}} />
        </Route>
      </Router>
    );
  }
} 



ReactDOM.render(<Test />, document.getElementById('app'));