////////////////////////////////////////////////////////////////////////////////
// LegislatorInfo.jsx
// --------------------------
// This is the reusable component for display a particular legislator's info.
// 
////////////////////////////////////////////////////////////////////////////////

const React = require('react');

class LegislatorInfo extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <LegislatorInfoPresentational info={this.props.info}/>
    );
  }
}

class LegislatorInfoPresentational extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    let info = this.props.info;
    return (
      <div className="panel panel-default" key={info.bioguide_id} >
        <div className="panel-heading">
          <h3 className="panel-title">{info.title} {info.first_name} {info.last_name} ({info.party})</h3>
        </div>

        <table className="table">
          <tbody>
            <tr>
              <td>Office Address:</td>
              <td>{info.office} , Washington, DC 20515</td>
            </tr>
            <tr>
              <td>Phone:</td>
              <td><a href={'tel:' + info.phone}>{info.phone}</a></td>
            </tr>
            {info.fax &&
              <tr>
                <td>Fax:</td>
                <td>{info.fax}</td>
              </tr>
            }
            {info.email &&
              <tr>
                <td>Email:</td>
                <td><a href={'mailto:' + info.oc_email}>{info.oc_email}</a></td>
              </tr>
            }
            {info.website &&
            <tr>
              <td>Website:</td>
              <td><a href={info.website} target="_blank">{info.website}</a></td>
            </tr>
            }
            {info.contact_form &&
              <tr>
                <td>Contact Form:</td>
                <td><a href={info.contact_form} target="_blank">Link</a></td>
              </tr>
            }
            {info.facebook_id &&
              <tr>
                <td>Facebook ID:</td>
                <td><a href={'http://facebook.com/' + info.facebook_id} target="_blank">{info.facebook_id}</a></td>
              </tr>
            }
            {info.twitter_id && 
              <tr>
                <td>Twitter:</td>
                <td><a href={'http://twitter.com/' + info.twitter_id} target="_blank">{info.twitter_id}</a></td>
              </tr>  
            }
            {info.youtube_id &&
              <tr>
                <td>Youtube:</td>
                <td><a href={'http://youtube.com/' + info.youtube_id} target="_blank">{info.youtube_id}</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = LegislatorInfo;