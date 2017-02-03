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
    // PUT message to server to add a new monitored word(s) string
    $.ajax('user/' + this.props.username + '/keywords', {
      method: 'PUT',
      context: this,
      data: {
        keyword: words
      },
      dataType: 'json'
    })
      .done(function(data) {

        let revisedMonitoringResults = this.state.monitoringResults.slice();
        revisedMonitoringResults.unshift(data);

        console.log(revisedMonitoringResults);
        // Add the new entry into our dashboard, along with the monitored keywords 'hits' returned
        // by our server
        if (data !== undefined) {
          this.setState({
            monitoringResults: revisedMonitoringResults
          });
        }
      });
  }

  handleRemoveMonitoredWords(words) {
    //DELETE message to server to remove a monitored word(s) string
    $.ajax('user/' + this.props.username + '/keywords', {
      method: 'DELETE',
      context: this,
      data: {
        keyword: words
      },
      dataType: 'json'
    })
    .done(function() {
      // We will now remove the keyword and associated relevant bills from our results
      // but we're making copies (and not splice) because any modification must be done via setState
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
        <h3>Dash Board</h3>
        <UserDashBoardKeywordsEntryBar onAddMonitoredWords={this.handleAddMonitoredWords}/>

        {this.state.isFetching &&
          <div><h3>Fetching Data</h3></div>
        }

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