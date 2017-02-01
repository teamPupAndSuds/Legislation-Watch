const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;

class NavigationBar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="glyphicon glyphicon-align-justify" aria-hidden="true"></span>
            </button>
            <a className="navbar-brand" href="#">
              Legislation Watcher
            </a>
          </div>
          
          <div className="navbar-collapse collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className="active"><Link to="/dashboard">Dashboard<span className="sr-only">(current)</span></Link></li>
              <li><Link to="/search">Search</Link></li>
            </ul>

            <div className="navbar-right">
                <p className="navbar-text">Logout</p>          
            </div>
          </div>

        </div>
      </nav>
    );
  }
}

module.exports = NavigationBar;