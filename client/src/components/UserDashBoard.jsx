const React = require('react');
const UserDashBoardKeywordsEntryBar = require('./UserDashBoardKeywordsEntryBar.jsx');
const UserDashBoardMonitoredWordResult = require('./UserDashBoardMonitoredWordResult.jsx');

class UserDashBoard extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {
    return (
      <div>
        <h3>Dash Board</h3>
        <UserDashBoardKeywordsEntryBar />

        {this.props.monitoringResults.map(function(bill) {
          return <UserDashBoardMonitoredWordResult key={bill.word} monitoredWords={bill.word} relevantBills={bill.relevantBills} />;
        })}

      </div>

    );
  }
}

UserDashBoard.defaultProps = {
  monitoringResults: [
    {
      word: 'turtle',
      relevantBills: ['hr1761-112', 'hr2276-114', 'hr2279-114']
    },
    {
      word: 'camel',
      relevantBills: ['s2222-111', 'hr4526-112', 's2311-112', 's2312-112']
    }
  ]
};

module.exports = UserDashBoard;