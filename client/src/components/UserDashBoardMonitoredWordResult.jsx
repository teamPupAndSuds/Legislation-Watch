const React = require('react');

class UserDashBoardMonitoredWordResult extends React.Component {
  render() {
    return (
      <div>
        <h4>{this.props.monitoredWords}</h4>
        {this.props.relevantBills}
      </div>
    );
  }
}

module.exports = UserDashBoardMonitoredWordResult;