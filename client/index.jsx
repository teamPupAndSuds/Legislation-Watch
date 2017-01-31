const React = require('react');
const ReactDOM = require('react-dom');
const UserLegislatorsInfo = require(__dirname + '/src/components/UserLegislatorsInfo.jsx');
const LegislationSearch = require(__dirname + '/src/components/LegislationSearch.jsx');

class App extends React.Component {
  render() {
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4">
            <UserLegislatorsInfo />
          </div>
          <div className="col-md-8">
            <LegislationSearch />
          </div>
        </div>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));