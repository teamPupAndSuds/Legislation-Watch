const React = require('react');

class LegislatorInfo extends React.Component {
  constructor(props) {
    super(props);

    // Dummy Data for Testing Purposes
    this.legislatorData = {
      "bioguide_id": "C001109",
      "birthday": "1966-07-28",
      "chamber": "house",
      "contact_form": null,
      "crp_id": "N00035504",
      "district": 0,
      "fax": null,
      "fec_ids": [
        "H6WY00159"
      ],
      "first_name": "Liz",
      "gender": "F",
      "govtrack_id": "412732",
      "in_office": true,
      "last_name": "Cheney",
      "leadership_role": null,
      "middle_name": null,
      "name_suffix": null,
      "nickname": null,
      "oc_email": "Rep.Cheney@opencongress.org",
      "ocd_id": "ocd-division/country:us/state:wy",
      "office": "416 Cannon House Office Building",
      "party": "R",
      "phone": "202-225-2311",
      "state": "WY",
      "state_name": "Wyoming",
      "term_end": "2019-01-03",
      "term_start": "2017-01-03",
      "thomas_id": "",
      "title": "Rep",
      "votesmart_id": 145932,
      "website": "https://cheney.house.gov"
    };

    this.legislatorData1 = {
      'bioguide_id': 'B001261',
      'birthday': '1952-07-21',
      'chamber': 'senate',
      'contact_form': 'http://www.barrasso.senate.gov/public/index.cfm?FuseAction=ContactUs.ContactForm',
      'crp_id': 'N00006236',
      'district': null,
      'facebook_id': '21146775942',
      'fax': '202-224-1724',
      'fec_ids': [
        'S6WY00068'
      ],
      'first_name': 'John',
      'gender': 'M',
      'govtrack_id': '412251',
      'icpsr_id': 40707,
      'in_office': true,
      'last_name': 'Barrasso',
      'leadership_role': null,
      'lis_id': 'S317',
      'middle_name': 'A.',
      'name_suffix': null,
      'nickname': null,
      'oc_email': 'Sen.Barrasso@opencongress.org',
      'ocd_id': 'ocd-division/country:us/state:wy',
      'office': '307 Dirksen Senate Office Building',
      'party': 'R',
      'phone': '202-224-6441',
      'senate_class': 1,
      'state': 'WY',
      'state_name': 'Wyoming',
      'state_rank': 'junior',
      'term_end': '2019-01-03',
      'term_start': '2013-01-03',
      'thomas_id': '01881',
      'title': 'Sen',
      'twitter_id': 'SenJohnBarrasso',
      'votesmart_id': 52662,
      'website': 'http://www.barrasso.senate.gov',
      'youtube_id': 'barrassowyo'
    };
  }
  render() {
    return (
      <LegislatorInfoPresentational info={this.legislatorData}/>
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
            <tr>
              <td>Email:</td>
              <td><a href={'mailto:' + info.oc_email}>{info.oc_email}</a></td>
            </tr>
            {info.website &&
            <tr>
              <td>Website:</td>
              <td><a href={info.website}>{info.website}</a></td>
            </tr>
            }
            {info.contact_form &&
              <tr>
                <td>Contact Form:</td>
                <td><a href={info.contact_form}>Link</a></td>
              </tr>
            }
            {info.facebook_id &&
              <tr>
                <td>Facebook ID:</td>
                <td><a href={'http://facebook.com/' + info.facebook_id}>{info.facebook_id}</a></td>
              </tr>
            }
            {info.twitter_id && 
              <tr>
                <td>Twitter:</td>
                <td><a href={'http://twitter.com/' + info.twitter_id}>{info.twitter_id}</a></td>
              </tr>  
            }
            {info.youtube_id &&
              <tr>
                <td>Youtube:</td>
                <td><a href={'http://youtube.com/' + info.youtube_id}>{info.youtube_id}</a></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = LegislatorInfo;