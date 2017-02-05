////////////////////////////////////////////////////////////////////////////////
// UserLegislatorsInfo.jsx
// --------------------------
// This is the "Legislation Side Panel" component that include the user's
// congress and senate representatives based on their location (lat/long)
// information.
//
// It is responsible for the AJAX call to the Sunlight API to retrieve the 
// relevant legislator information.
// 
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const LegislatorInfo = require('./LegislatorInfo.jsx');

class UserLegislatorsInfo extends React.Component {
  constructor(props) {
    super(props);

    // Default State
    this.state = {
      isFetchingRepData: true,
      isFetchingElectoralData: true,
      electoralRepresentativesInfo: undefined,
      electoralInfo: undefined
    };

    this.render = this.render.bind(this);
    this.getHouseRepInfo = this.getHouseRepInfo.bind(this);
    this.getSenatorsInfo = this.getSenatorsInfo.bind(this);
    this.fetchLegislatorDataFromExternalSources = this.fetchLegislatorDataFromExternalSources.bind(this);
  }

  
  render() {
    let isFechingData = this.state.isFechingData;
    return (
      <div>
      {(this.state.isFetchingRepData || this.state.isFetchingElectoralData) && 
        <p>Fetching Data</p>
      }

      {!this.state.isFetchingRepData && !this.state.isFetchingElectoralData && 
        <UserLegislatorsInfoPresentational 
          electoralInfo={this.getElectoralInfo()} 
          houseRepInfo={this.getHouseRepInfo()} 
          senatorsInfo={this.getSenatorsInfo()}
        />
      }
      </div>
    );
  }
  componentDidMount() {

    // Initiate AJAX calls to Sunlight server for legislator and district info
    // based on user supplied lat and long information
    this.setState({
      isFetchingRepData: true,
      isFetchingElectoralData: true
    });

    this.fetchLegislatorDataFromExternalSources();
    this.fetchElectoralDataFromExternalSources();
  }

  // Retrieves the User's representatives' information
  fetchLegislatorDataFromExternalSources() {
    let queryParameters = {
      latitude: this.props.userLat,
      longitude: this.props.userLong
    };

    $.get('https://congress.api.sunlightfoundation.com/legislators/locate', queryParameters, onLegislatorInfoFetchComplete.bind(this), 'jsonp');

    function onLegislatorInfoFetchComplete(data, textStatus, jqXHR) {
      this.setState({
        electoralRepresentativesInfo: data.results,
        isFetchingRepData: false});
    }
  }

  // Retrieves the electrol information (Congressional District & State) for the user
  fetchElectoralDataFromExternalSources() {
    let queryParameters = {
      latitude: this.props.userLat,
      longitude: this.props.userLong
    };

    $.get('https://congress.api.sunlightfoundation.com/districts/locate', queryParameters, onElectoralInfoFetchComplete.bind(this), 'jsonp');

    function onElectoralInfoFetchComplete(data, textStatus, jqXHR) {
      this.setState({
        electoralInfo: data.results[0],
        isFetchingElectoralData: false});
    }
  }

  // Format the Congressional Data from the Sunlight server to a more readable format
  getElectoralInfo() {
    let readableElectoralInfo = {};

    // Assign values from electoralInfo as default to the readableElectoralInfo
    readableElectoralInfo.state = this.state.electoralInfo.state;
    readableElectoralInfo.districtName = this.state.electoralInfo.districtName + '';

    // Use the State name from the House Rep instead of 2 letter symbol 
    if (this.getHouseRepInfo() !== undefined) {
      readableElectoralInfo.state = this.getHouseRepInfo().state_name;
    }

    // Handle case where the state is a district 'At-large'
    // TODO: We need to better handle the suffix to the district number (ie. 2nd, 3rd, 21st, etc)
    if (this.state.electoralInfo.district === 0) {
      readableElectoralInfo.districtName = 'At-Large Congressional District';
    } else {
      readableElectoralInfo.districtName = this.state.electoralInfo.district + 'th Congressional District';
    }

    return readableElectoralInfo;
  }

  getHouseRepInfo() {
    // note that there is only ever one House Rep for a particular Congressional District
    return this.state.electoralRepresentativesInfo.filter(isHouseRep)[0];

    function isHouseRep(legislatorInfo) {
      return (legislatorInfo.chamber === 'house');
    }
  }

  getSenatorsInfo() {
    return this.state.electoralRepresentativesInfo.filter(isSenator);

    function isSenator(legislatorInfo) {
      return (legislatorInfo.chamber === 'senate');
    }
  }
}      

// Temporary Default Props for Testing
// UserLegislatorsInfo.defaultProps = { 
//   userLat: 37.795,
//   userLong: -122.40
// };


class UserLegislatorsInfoPresentational extends React.Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Your Electoral Info:</h3>
          <h4>{this.props.electoralInfo.state} - {this.props.electoralInfo.districtName}</h4>
        </div>
        <div className = "panel-body">
          <h3>House of Representatives</h3>
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