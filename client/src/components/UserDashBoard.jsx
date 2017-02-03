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
      isFetching: true,
      monitoringResults: this.props.monitoringResults,
      errorMessage: ''
    };

    this.handleAddMonitoredWords = this.handleAddMonitoredWords.bind(this);
    this.handleRemoveMonitoredWords = this.handleRemoveMonitoredWords.bind(this);
  }
  componentDidMount() { 
    // Retrieve user monitored keywords and associated bills to populate the dashboard
    $.get('user/' + this.props.username + '/keywords')
      .done(data => this.setState({
        isFetching: false,
        monitoringResults: data,
        'errorMessage': ''
      }))
      .fail(error => this.setState({
        isFetching: false,
        monitoringResults: [],
        errorMessage: error.status + '-' + error.statusText
      }));
  }

  handleAddMonitoredWords(words) {
    // Send a PUT AJAX message to back-end server to add a new monitored word(s) string
    $.ajax('user/' + this.props.username + '/keywords', {
      method: 'PUT',
      context: this,
      data: {
        keyword: words
      },
      dataType: 'json'
    })
      .done(function(data) {
        // Add the new monitored keywords and the results into our dash-board
        //
        // We need to make a copy of the existing results because the component state is suppose to be
        // immutable

        let revisedMonitoringResults = this.state.monitoringResults.slice();
        revisedMonitoringResults.unshift(data);

        if (data !== undefined) {
          this.setState({
            monitoringResults: revisedMonitoringResults
          });
        }
      });
  }

  handleRemoveMonitoredWords(words) {
    //Send a DELETE AJAX message to back-end server to remove a monitored word(s) string
    $.ajax('user/' + this.props.username + '/keywords', {
      method: 'DELETE',
      context: this,
      data: {
        keyword: words
      },
      dataType: 'json'
    })
    .done(function() {
      // Once the back-end server successfully removed the monitored keyword, we will remove the entry
      // from our dashboard on the client-side to save on a AJAX request to the back-end.
      //
      // We need to make a copy of the existing results because the component state is suppose to be
      // immutable
      let revisedMonitoringResults = [];
      
      this.state.monitoringResults.forEach(function(bill) {
        if (bill.word !== words) {
          revisedMonitoringResults.push(bill);
        }
      });

      this.setState({
        monitoringResults: revisedMonitoringResults
      });
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
          return (
            <UserDashBoardMonitoredWordResult 
              key={bill.word} 
              monitoredWords={bill.word} 
              billIds={bill.relevantBills} 
              onMonitoredWordsRemove={this.handleRemoveMonitoredWords} />
          );
        }.bind(this))}

      </div>
    );
  }
}

// defaultProps for testing purposes
UserDashBoard.defaultProps = {
  monitoringResults: [
    {
      word: 'Testing',
      relevantBills: ['hr1761-112', 'hr2276-114', 'hr2279-114']
    }
  ]
};

module.exports = UserDashBoard;