////////////////////////////////////////////////////////////////////////////////
// UserDashBoard.jsx
// --------------------------
// This is the parent component for displaying the dashboard user interface.
// 
// It is responsible for AJAX call to the back-end to retrieve the user's
// monitored keywords and associated bills. It is also responsible for
// reacting to user request to add and remove monitored keywords and translating
// it into calls to the back-end
//
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const UserDashBoardKeywordsEntryBar = require('./UserDashBoardKeywordsEntryBar.jsx');
const UserDashBoardMonitoredWordResult = require('./UserDashBoardMonitoredWordResult.jsx');

class UserDashBoard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFetching: false,
      monitoringResults: this.props.userMonitoredKeywords,
      errorMessage: ''
    };

    this.handleAddMonitoredWords = this.handleAddMonitoredWords.bind(this);
    this.handleRemoveMonitoredWords = this.handleRemoveMonitoredWords.bind(this);
  }

  handleAddMonitoredWords(words) {
    // Send a PUT AJAX message to back-end server to add a new monitored word(s) string
    $.ajax('user/' + this.props.username + '/keywords', {
      method: 'PUT',
      contentType: 'application/json',      
      context: this,
      data: JSON.stringify({
        keywords: words
      }),
      dataType: 'json'
    })
      .done(function(data) {
        // Add the new monitored keywords and the results into our dash-board
        if (data !== undefined) {
          console.log('UserDashBoard.jsx: handleAddMonitoredWords: ', data);
          this.setState({
            monitoringResults: data.keywords
          });
        }
      });
  }

  handleRemoveMonitoredWords(words) {
    //Send a DELETE AJAX message to back-end server to remove a monitored word(s) string
    $.ajax('user/' + this.props.username + '/keywords', {
      method: 'DELETE',
      contentType: 'application/json',          
      context: this,
      data: JSON.stringify({
        keywords: words
      }),
      dataType: 'json'
    })
      .done(function(data) {
        // Add the revised monitored keywords and the results into our dash-board
        if (data !== undefined) {
          this.setState({
            monitoringResults: data.keywords
          });
        }
      });
  }  

  render() {
    return (
      <div>
        <h3>Dashboard</h3>
        <UserDashBoardKeywordsEntryBar onAddMonitoredWords={this.handleAddMonitoredWords}/>

        {/* Display 'Loading' messages when user monitored keywords and results is being fetched */}
        {this.state.isFetching &&
          <div><h3>Fetching Data</h3></div>
        }

        {/* Render monitored keyword entries and results */}
        {this.state.monitoringResults.map(function(bill) {
          console.log(bill);
          return (
            <UserDashBoardMonitoredWordResult 
              key={bill.keyword}
              monitoredWords={bill.keyword}
              billIds={bill.relatedBills} 
              onMonitoredWordsRemove={this.handleRemoveMonitoredWords} />
          );
        }.bind(this))}

      </div>
    );
  }
}

// defaultProps for testing purposes
UserDashBoard.defaultProps = {
  userMonitoredKeywords: [
    {
      word: 'Testing',
      relevantBills: ['hr1761-112', 'hr2276-114', 'hr2279-114']
    }
  ]
};

module.exports = UserDashBoard;