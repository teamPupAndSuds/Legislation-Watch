const React = require('react');

class Comments extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: []
    };
  }

  componentWillMount() {
    // Pull comments from database, if any, before component mounts
    this.updateComments();

  }

  updateComments() {
    // Utility function for pulling comments
    $.ajax({
      method: 'GET',
      url: `/comments/${this.props.billId}`,
      success: function(data) {
        this.setState({
          comments: data
        });
      },
      error: function(err) {
        console.error('Comment retrieval error');
      }
    });
  }


  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">
            <h3 className="panel-title">Bill Discussion</h3>
          </div>
          {this.state.comments.map((comment) => <CommentBox 
                                                 comment={comment} 
                                                 billId={this.props.billId}/>)}
        </div>
        <CommentForm username={this.props.username}
                     billId={this.props.billId}/>
      </div>
    );
  }
}

class CommentBox extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
        <div className="panel-body">
          {this.props.comment.username}: {this.props.comment.text}
        </div>
    );
  }
}

class CommentForm extends React.Component {
  constructor() {
    super();
  }

  handleSubmit() {
    // handle for submission for comments
    $.ajax({
      method: 'POST',
      url: `/comments/${this.props.billId}/${this.props.username}`,
      success: function(newComment) {
        console.log('Comment added!');
        return;
      },
      error: function(err) {
        console.error('Comment submission error');
        console.error(err);
        return;
      }
    });
  }

  render() {
    return (
      <div>
        <form>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Comment:</label>
            <input type="text" className="form-control" placeholder="Add comment" />
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
}

module.exports = Comments;