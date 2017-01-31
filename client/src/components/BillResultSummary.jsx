const React = require('react');

class BillResultSummary extends React.Component {
  render() {
    return (
      <BillResultSummaryPresentational info={this.props.info}/>
    )
  }
}

class BillResultSummaryPresentational extends React.Component {

  render() {
    let info = this.props.info;
    return (
      <div className="panel panel-info">
        <div className="panel-heading">
          <div className="container-fluid">
            <div className="row">
              <div className="col-sm-9" style={{padding: 0}}>
                <strong>{info.short_title}{!info.short_title && info.official_title}</strong>
                <small className="text-uppercase"> ({info.chamber})</small>
              </div>
              <div className="col-sm-3" style={{padding: 0}}>
                <span className="pull-right"><small><span className="text-uppercase">{info.bill_id}</span> <strong>introduced - </strong>: {info.introduced_on}</small></span>
              </div>
            </div>
          </div>        
        </div>
        <div className="panel-body">
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Sponsor:</strong> {info.sponsor.first_name} {info.sponsor.last_name} ({info.sponsor.party})
                  {info.cosponsor_ids.length !== 0 && 
                    <strong> Co-Sponsor(s): </strong>
                  }
                  {info.cosponsor_ids.map((id) => <span key={id}>{id}, </span>)}
                </td>
              </tr>
              <tr>
                <td>
                  <br />
                  <div>{info.summary_short}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

module.exports = BillResultSummary;