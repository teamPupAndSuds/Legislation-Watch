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

    // Initiate AJAX calls to external API for legislator and district info
    this.setState({
      isFetchingRepData: true,
      isFetchingElectoralData: true
    });

    this.fetchLegislatorDataFromExternalSources();
    this.fetchElectoralDataFromExternalSources();
  }

  fetchLegislatorDataFromExternalSources() {
    let queryParameters = {
      latitude: this.props.userLat,
      longitude: this.props.userLong
    };

    $.get('https://congress.api.sunlightfoundation.com/legislators/locate', queryParameters, onLegislatorInfoFetchComplete.bind(this), 'json');

    function onLegislatorInfoFetchComplete(data, textStatus, jqXHR) {
      this.setState({
        electoralRepresentativesInfo: data.results,
        isFetchingRepData: false});
    }
  }

  fetchElectoralDataFromExternalSources() {
    let queryParameters = {
      latitude: this.props.userLat,
      longitude: this.props.userLong
    };

    $.get('https://congress.api.sunlightfoundation.com/districts/locate', queryParameters, onElectoralInfoFetchComplete.bind(this), 'json');

    function onElectoralInfoFetchComplete(data, textStatus, jqXHR) {
      this.setState({
        electoralInfo: data.results[0],
        isFetchingElectoralData: false});
    }
  }

  // Converts district API data to a more readable format for display
  getElectoralInfo() {
    let readableElectoralInfo = {};

    // Assign values from electoralInfo as default to the readableElectoralInfo
    readableElectoralInfo.state = this.state.electoralInfo.state;
    readableElectoralInfo.districtName = this.state.electoralInfo.districtName + '';

    // Use the State name from the House Rep instead of 2 letter symbol 
    if (this.getHouseRepInfo() !== undefined) {
      readableElectoralInfo.state = this.getHouseRepInfo().state_name;
    }

    // Handle case where the state is a district At-large
    if (this.state.electoralInfo.district === 0) {
      readableElectoralInfo.districtName = 'At-Large Congressional District';
    } else {
      readableElectoralInfo.districtName = this.state.electoralInfo.district + 'th Congressional District';
    }

    return readableElectoralInfo;
  }

  getHouseRepInfo() {
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
UserLegislatorsInfo.defaultProps = { 
  userLat: 37.795,
  userLong: -122.40
};


class UserLegislatorsInfoPresentational extends React.Component {
  render() {
    return (
      <div className="panel panel-default">
        <div className="panel-heading">
          <h3 className="panel-title">Your Electoral Info:</h3>
          <h4>{this.props.electoralInfo.state} - {this.props.electoralInfo.districtName}</h4>
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