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
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-collapse-1" aria-expanded="false">
                <span className="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
            </button>
            <a className="navbar-brand" href="#">
              Legislation Watcher
            </a>
          </div>
          
          <div className="navbar-collapse collapse" id="navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li><Link to="/dashboard" className="nav-link">Dashboard</Link></li>
              <li><Link to="/search" className="nav-link">Search</Link></li>
            </ul>

            <div className="navbar-right">
                <p className="navbar-text">[{this.props.username}]</p>
                <Link to="/logout" className="navbar-text nav-link">Logout</Link>          
            </div>
          </div>

        </div>
      </nav>
    );
  }
}

module.exports = NavigationBar;