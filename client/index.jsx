const React = require('react');
const ReactDOM = require('react-dom');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Router = ReactRouter.Router;
const IndexRoute = ReactRouter.IndexRoute;
const hashHistory = ReactRouter.hashHistory;

const NavigationBar = require(__dirname + '/src/components/NavigationBar.jsx');
const UserLegislatorsInfo = require(__dirname + '/src/components/UserLegislatorsInfo.jsx');
const LegislationSearch = require(__dirname + '/src/components/LegislationSearch.jsx');
const LegislatorData = require(__dirname + '/src/data/LegislatorData.js');

class App extends React.Component {
  constructor(props) {
    super(props);

    // This is an cache for storing legislator info retrieved from the Sunlight API.
    // This is design to reduce the number of API call to sunlight for legislator information

    this.legislatorInfoCache = LegislatorData;
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
              <LegislationSearch legislatorCache={this.legislatorInfoCache}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));