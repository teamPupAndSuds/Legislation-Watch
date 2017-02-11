////////////////////////////////////////////////////////////////////////////////
// UserDashBoardKeywordsEntryBar.jsx
// --------------------------
// This is the component "bar" that allows users to add a new monitored keyword
//
// It relies on its parent component to handle actual submit events
////////////////////////////////////////////////////////////////////////////////

const React = require('react');

class UserDashBoardKeywordsEntryBar extends React.Component {
  constructor(props) {
    super(props);
    this.userMonitorKeywords = '';

    this.handleKeywordInputChange = this.handleKeywordInputChange.bind(this);
    this.handleKeywordSubmit = this.handleKeywordSubmit.bind(this);
  }

  handleKeywordInputChange(event) {
    this.userMonitorKeywords = event.target.value;
  }

  handleKeywordSubmit(event) {
    event.preventDefault();
    this.props.onAddMonitoredWords(this.userMonitorKeywords);
  }

  render() {
    return (
      <div>
        <UserDashBoardKeywordsEntryBarPresentational onSubmit={this.handleKeywordSubmit} onKeywordChange={this.handleKeywordInputChange} />
      </div>
    );
  }
}

class UserDashBoardKeywordsEntryBarPresentational extends React.Component {
  render() {
    return (
      <div>
        <form className="form-group" onSubmit={this.props.onSubmit}>
          <span>
            <input autoFocus className="form-control" type="text" id="keySearchTerms" placeholder="Keywords" onChange={this.props.onKeywordChange}></input>
          </span>
          <span>
            <button type="submit" id="searchButton"><span className="glyphicon glyphicon-plus" aria-hidden="true"></span></button>
          </span>
        </form> 
      </div>
    );
  }
}

module.exports = UserDashBoardKeywordsEntryBar;


