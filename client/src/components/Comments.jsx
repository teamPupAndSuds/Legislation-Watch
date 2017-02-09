const React = require('react');

class Comments extends React.Component {
  constructor() {
    super();
    this.state = {
      comments: []
    };
    this.updateComments = this.updateComments.bind(this);
  }

  componentDidMount() {
    // Pull comments from database, if any, before component mounts
    this.updateComments();

  }

  updateComments() {
    // Utility function for pulling comments
    var context = this;

    $.ajax({
      method: 'GET',
      url: `/comments/${this.props.billId}`,
      success: function(data) {
        context.setState({
          comments: data
        });
      },
      error: function(err) {
        console.error('Comment retrieval error');
      }
    });
  }


  render() {

    let style;
    if (this.state.comments.length === 0) {
      style = {display: "none"};
    }

    return (
      <div className="comment-box">
        <div style={style} className="panel panel-info">
          <div className="panel-heading">
            <h3 className="panel-title">Bill Discussion</h3>
          </div>
          {this.state.comments.map((comment, ind) => <CommentBox 
                                                      comment={comment} 
                                                      billId={this.props.billId}
                                                      key={ind}/>)}
        </div>
        <CommentForm username={this.props.username}
                     billId={this.props.billId}
                     updateComments={this.updateComments}/>
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

  handleSubmit(e) {
    // handle for submission for comments
    var context = this;
    console.log('Text Submitted: ' + this.text.value);
    var textObj = JSON.stringify({text: this.text.value});
    e.preventDefault();
    $.ajax({
      method: 'POST',
      url: `/comments/${context.props.billId}/${context.props.username}`,
      data: textObj,
      contentType: 'application/json',
      success: function(newComment) {
        console.log('Comment added!');
        context.props.updateComments();
        return;
      },
      error: function(err) {
        console.error('Comment submission error');
        console.error(err);
        return;
      }
    });
    this.commentForm.reset();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}
              ref={(input) => this.commentForm = input}>
          <div className="form-group">
            <label htmlFor="exampleInputEmail1">Comment:</label>
            <input ref={(input) => this.text = input} type="text" className="form-control" placeholder="Add comment" />
          </div>
          <button type="submit" className="btn btn-default">Submit</button>
        </form>
      </div>
    );
  }
}

module.exports = Comments;