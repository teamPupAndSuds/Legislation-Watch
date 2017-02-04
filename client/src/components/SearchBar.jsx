////////////////////////////////////////////////////////////////////////////////
// SearchBar.jsx
// --------------------------
// This is the component for a simple search bar
// 
////////////////////////////////////////////////////////////////////////////////

var React = require('react');

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.userSearchTerms = '';

    this.handleSearchInputChange = this.handleSearchInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // This update the userSearchTerm property as the user type into the input element
  handleSearchInputChange(event) {
    this.userSearchTerms = event.target.value;
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSubmit(this.userSearchTerms);
  }

  render() {
    return (
      <SearchBarPresentational onSearchInputChange={this.handleSearchInputChange} onSubmit={this.handleSubmit} />
    );
  }
}

class SearchBarPresentational extends React.Component {
  render() {
    return (
      <div>
        <form className="form-group" onSubmit={this.props.onSubmit}>
          <label htmlFor="searchTerms">Search by Keywords:</label><br />
          <div className="input-group">
            <span className="input-group-addon"><span className="glyphicon glyphicon-search" aria-hidden="true"></span></span>
            <input className="form-control" type="text" id="searchTerms" placeholder="Enter Keywords" onChange={this.props.onSearchInputChange}></input>
             <span className="input-group-btn">
                <button type="submit" className="btn btn-default">Search</button>
             </span>   
          </div>           
        </form> 
      </div>
    );
  }
}

module.exports = SearchBar;