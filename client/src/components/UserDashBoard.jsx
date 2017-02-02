const React = require('react');
const UserDashBoardKeywordsEntryBar = require('./UserDashBoardKeywordsEntryBar.jsx');

class UserDashBoard extends React.Component {
  render() {
    return (
      <div>
        <h3>Dash Board</h3>
        <UserDashBoardKeywordsEntryBar />
      </div>

    );
  }
}

module.exports = UserDashBoard;