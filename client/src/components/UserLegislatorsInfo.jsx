const React = require('react');
const LegislatorInfo = require('./LegislatorInfo.jsx');

class UserLegislatorsInfo extends React.Component {
  constructor(props) {
    super(props);

    this.electoralRepresentativeInfo = this.props.electoralRepresentativeInfo; 
    this.electoralInfo = this.props.electoralInfo;

    this.getHouseRepInfo = this.getHouseRepInfo.bind(this);
    this.getSenatorsInfo = this.getSenatorsInfo.bind(this);
  }

  render() {
    return (
      <UserLegislatorsInfoPresentational 
        electoralInfo={this.electoralInfo} 
        houseRepInfo={this.getHouseRepInfo()} 
        senatorsInfo={this.getSenatorsInfo()}
      />
    );
  }

  getHouseRepInfo() {
    return this.electoralRepresentativeInfo.filter(isHouseRep)[0];

    function isHouseRep(legislatorInfo) {
      return (legislatorInfo.chamber === 'house');
    }
  }

  getSenatorsInfo() {
    return this.electoralRepresentativeInfo.filter(isSenator);

    function isSenator(legislatorInfo) {
      return (legislatorInfo.chamber === 'senate');
    }
  }
}      

// Temporary Default Props for Testing
UserLegislatorsInfo.defaultProps = { 
  electoralInfo: {
    'state': 'WY',
    'district': 0
  },
  electoralRepresentativeInfo: [
    {
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
    },
    {
      "bioguide_id": "E000285",
      "birthday": "1944-02-01",
      "chamber": "senate",
      "contact_form": "http://www.enzi.senate.gov/public/index.cfm/contact?p=e-mail-senator-enzi",
      "crp_id": "N00006249",
      "district": null,
      "facebook_id": "23068049436",
      "fax": "202-228-0359",
      "fec_ids": [
        "S6WY00126"
      ],
      "first_name": "Michael",
      "gender": "M",
      "govtrack_id": "300041",
      "icpsr_id": 49706,
      "in_office": true,
      "last_name": "Enzi",
      "leadership_role": null,
      "lis_id": "S254",
      "middle_name": "B.",
      "name_suffix": null,
      "nickname": null,
      "oc_email": "Sen.Enzi@opencongress.org",
      "ocd_id": "ocd-division/country:us/state:wy",
      "office": "379a Russell Senate Office Building",
      "party": "R",
      "phone": "202-224-3424",
      "senate_class": 2,
      "state": "WY",
      "state_name": "Wyoming",
      "state_rank": "senior",
      "term_end": "2021-01-03",
      "term_start": "2015-01-06",
      "thomas_id": "01542",
      "title": "Sen",
      "twitter_id": "SenatorEnzi",
      "votesmart_id": 558,
      "website": "http://www.enzi.senate.gov",
      "youtube_id": "senatorenzi"
    },
    {
      "bioguide_id": "B001261",
      "birthday": "1952-07-21",
      "chamber": "senate",
      "contact_form": "http://www.barrasso.senate.gov/public/index.cfm?FuseAction=ContactUs.ContactForm",
      "crp_id": "N00006236",
      "district": null,
      "facebook_id": "21146775942",
      "fax": "202-224-1724",
      "fec_ids": [
        "S6WY00068"
      ],
      "first_name": "John",
      "gender": "M",
      "govtrack_id": "412251",
      "icpsr_id": 40707,
      "in_office": true,
      "last_name": "Barrasso",
      "leadership_role": null,
      "lis_id": "S317",
      "middle_name": "A.",
      "name_suffix": null,
      "nickname": null,
      "oc_email": "Sen.Barrasso@opencongress.org",
      "ocd_id": "ocd-division/country:us/state:wy",
      "office": "307 Dirksen Senate Office Building",
      "party": "R",
      "phone": "202-224-6441",
      "senate_class": 1,
      "state": "WY",
      "state_name": "Wyoming",
      "state_rank": "junior",
      "term_end": "2019-01-03",
      "term_start": "2013-01-03",
      "thomas_id": "01881",
      "title": "Sen",
      "twitter_id": "SenJohnBarrasso",
      "votesmart_id": 52662,
      "website": "http://www.barrasso.senate.gov",
      "youtube_id": "barrassowyo"
    }
  ]
};


class UserLegislatorsInfoPresentational extends React.Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Electoral Info</h3>
        </div>
        <div className = "panel-body">
          <h3>House of Representative</h3>
          <LegislatorInfo info={this.props.houseRepInfo}/>
          <h3>Senate</h3>
          {this.props.senatorsInfo.map((senatorInfo) => {
            return (
              <LegislatorInfo key={senatorInfo.bioguide_id} info={senatorInfo} />
            );
          })}
        </div>
      </div>
    );
  }
}

module.exports = UserLegislatorsInfo;