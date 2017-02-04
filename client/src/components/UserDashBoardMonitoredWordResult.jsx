////////////////////////////////////////////////////////////////////////////////
// UserDashBoardMonitoredWordResult.jsx
// --------------------------
// This is the component that renders User's individual "monitored keywords"
// and the associated results.
//
// It also provide the UI to remove existing entries. The events are passed onto
// the parent component.
//
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const BillResultSummary = require('./BillResultSummary.jsx');

class UserDashBoardMonitoredWordResult extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isFetching: true,
      billData: []
    };

    this.handleMonitoredWordsRemove = this.handleMonitoredWordsRemove.bind(this);
  }

  componentDidMount() { 
    // retrieve the bill information from Sunlight API for all of the supplied billIds

    // Do not retrieve bills if there is none to retrieve
    if (this.props.billIds === undefined || this.props.billIds.length === 0) {
      this.setState({
        isFetching: false,
        billData: []
      });
      return;
    }

    let requestQueryString = {
      'bill_id__in': this.props.billIds.join('|'),
      fields: 'bill_id,bill_type,chamber,introduced_on,last_action_at,short_title,official_title,keywords,summary_short,urls,sponsor,sponsor_id,cosponsor_ids,cosponsors.legislator,related_bill_ids,upcoming',
      'per_page': 50
    };

    $.get('https://congress.api.sunlightfoundation.com/bills', requestQueryString, onGetRelevantBillsComplete.bind(this), 'jsonp');

    function onGetRelevantBillsComplete(data) {
      this.setState({
        isFetching: false,
        billData: data.results
      });
    }
  }

  handleMonitoredWordsRemove(event) {
    this.props.onMonitoredWordsRemove(this.props.monitoredWords);
  }

  render() {
    return (
      <div>
        <div>
          <div className="pull-left">
            <h3>
              + {this.props.monitoredWords}
            </h3>
          </div>
          <div className="pull-right">
            <h3 className="text-right"><span className=" glyphicon glyphicon-remove-sign" onClick={this.handleMonitoredWordsRemove}></span></h3>
          </div>
          <div className="clearfix"></div>
        </div>

        {this.state.isFetching ? <p> Loading </p> : <p> </p>}
        {!this.state.isFetching ? this.state.billData.map(bill => <BillResultSummary key={bill.bill_id} info={bill} />) : <p> </p>}
      </div>
    );
  }
}

module.exports = UserDashBoardMonitoredWordResult;