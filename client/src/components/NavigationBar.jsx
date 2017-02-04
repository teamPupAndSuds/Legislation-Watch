////////////////////////////////////////////////////////////////////////////////
// NavigationBar.jsx
// --------------------------
// This is the persistent navigation bar at the top of the dashboard page.
//
// It uses Bootstrap's collapse feature to create nav menu that is responsive 
// to mobile devices.
// 
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

class NavigationBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed btn-sm" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
            </button>
            <a className="navbar-brand" href="#">
              Legislation Watch
            </a>
          </div>
          
          <div className="navbar-collapse collapse" id="navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/search" className="nav-link">Search</Link></li>
            </ul>

            <div className="navbar-right">
              <p className="navbar-text nav-link">[{this.props.username}]</p>

              <ul className="nav navbar-nav">
                <li><Link to="/logout" className="nav-link">Logout</Link></li>      
              </ul> 
            </div>
          </div>

        </div>
      </nav>
    );
  }
}

module.exports = NavigationBar;