////////////////////////////////////////////////////////////////////////////////
// BillResultSummary.jsx
// --------------------------
// This component is used to display an individual bill's summary.
//
// This is based on the "Projection" by TEMPLATED
// Users are redirected to this page if they have not logged in
//
////////////////////////////////////////////////////////////////////////////////

const React = require('react');
const SupportBar = require('./SupportBar.jsx').SupportBar;
const Support = require('./SupportBar.jsx').Support;

// Load Legislator cache to minimise AJAX call to the Sunlight Server
const LegislatorData = require('../data/LegislatorData.js');
const Comments = require('./Comments.jsx');


class BillResultSummary extends React.Component {
  render() {
    return (
      <BillResultSummaryPresentational info={this.props.info} 
                                       legislatorCache={LegislatorData} 
                                       username={this.props.username} 
                                       updateList={this.props.updateList}
                                       favoriteList={this.props.favoriteList}
                                       getAllFavorites={this.props.getAllFavorites}  
                                       />
    );
  }
}

class BillResultSummaryPresentational extends React.Component {
  constructor(props) {
    super(props);
    this.toggleFavorite = this.toggleFavorite.bind(this);
    this.state = {
      favorite: false
    };
  }

  componentDidMount() {
    let favoriteState = this.getFavoriteState();
    this.setState({
      favorite: favoriteState
    });
  }

  getFavoriteState() {
    let state = false;
    if (this.props.favoriteList) {
      this.props.favoriteList.forEach((favorite) => {
        if (favorite.legislationId === this.props.info.bill_id) {
          state = true;
        }
      });
    }
    return state;
  }

  toggleFavorite() {
    
    let currentSetting = this.state.favorite;
    if (currentSetting) {
      this.removeFavorite();
    } else {
      this.addFavorite();
    }
    this.setState({
      favorite: !currentSetting
    });
  }


  addFavorite() {
    var obj = {
      legislationId: this.props.info.bill_id
    };
    var that = this;
    $.ajax({
      method: 'POST',
      url: '/user/' + this.props.username + '/favorites',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      success: function (data) {
        //data - response from server
        // that.props.updateList(that.props.info.bill_id);
        that.props.getAllFavorites();
      },
      error: function (errorThrown) {
        console.log('error');
        console.log(errorThrown);
      }
    });
  }

  removeFavorite() {
    var obj = {
      legislationId: this.props.info.bill_id
    };
    var that = this;
    $.ajax({
      method: 'DELETE',
      url: '/user/' + this.props.username + '/favorites',
      data: JSON.stringify(obj),
      contentType: 'application/json',
      success: function (data) {
        console.log('this is data ') + JSON.stringify(data);
        // CHECK IF UPDATE LIST IS NECESSARY HERE!!!
        // that.props.updateList(that.props.info.bill_id);
        that.props.getAllFavorites();      
      },
      error: function (errorThrown) {
        console.log('error');
        console.log(errorThrown);
      }
    });
  }

  render() {
    let info = this.props.info;
    let legislatorCache = this.props.legislatorCache;

    // Bills may have 'co-sponsors' that are supplied as an array of <string> Bioguide IDs
    // We match the supplied Bioguide IDs with the Legislator Cache to obtain the name and party information for display
    //
    // TODO: The Legislator Data CSV downloaded from Sunlight's website does not include *all* of legislators for some reason.
    //       In that scenario, the component renders the Bioguide IDs as-is (rather than name + party).
    //         -  we need to implement a way to update the cache on server side, probably with the client code providing
    //            a list of Bioguide ids that were not cached
    let cosponsorElements = [];

    var support = new Support();
    support.count(info.sponsor.party);

    if (info.cosponsor_ids && info.cosponsor_ids.length !== 0) {
      info.cosponsor_ids.forEach(function(id) {
        // Attempt to locate the Legislator's information from the Cache
        let cosponsor = legislatorCache[id];

        // Handle un-cached Bioguide_ids
        if (cosponsor === undefined) {
          console.log('Uncached Legislator bioguide_id:', id);
          cosponsorElements.push(id + ' ');
        } else {
          // Construct Legislator information for display
          cosponsorElements.push(' ' + cosponsor.firstname + ' ' + cosponsor.lastname + ' (' + cosponsor.party + ')');

          // Count the cosponsor's party
          support.count(cosponsor.party);
        }
      });
    }
    support.total();



    return (
      <div className="panel panel-info">
        <div className="panel-heading">
          <div className="container-fluid">
            <div className="row">
              {/* Bill title with link to full text */}
              <div className="col-sm-9" style={{padding: 0}}>
                <h3 className="panel-title"><a href={info.urls.congress + '/text'} target="_blank">{info.short_title}{!info.short_title && info.official_title}</a>
                <small className="text-uppercase panel-title"><small>&nbsp;({info.chamber}) </small></small></h3>
              </div>
              <div className="col-sm-3" style={{padding: 0}}>
                <span className="pull-right panel-title">
                  <small>
                    <h3 className="text-uppercase panel-title"><small>
                      {info.bill_id} |
                      INTRODUCED : {info.introduced_on}
                      <span id="addToFavorites" 
                            className={this.state.favorite ? 'glyphicon glyphicon-star' : 'glyphicon glyphicon-star-empty'} 
                            onClick={this.toggleFavorite}></span>
                    </small></h3>
                  </small>
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="panel-body">
          {/* Bill sponsor, co-sponsor and summary information */}
          <table>
            <tbody>
              <tr>
                <td>
                  <strong>Sponsor:</strong> {info.sponsor.first_name} {info.sponsor.last_name} ({info.sponsor.party})
                  {info.cosponsor_ids && info.cosponsor_ids.length !== 0 &&
                    <strong> Co-Sponsor(s): </strong>
                  }
                  {info.cosponsor_ids && info.cosponsor_ids.length !== 0 &&
                    <span>{cosponsorElements.join(',')}</span>
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <SupportBar support={support} 
                                tooltip={support.supportString} />
                </td>
              </tr>
              <tr>
                <td>
                  <br />
                  {info.summary_short &&
                    <div>{info.summary_short}</div>
                  }
                  {!info.summary_short &&
                    <div>No Summary Available</div>
                  }
                </td>
              </tr>
              <tr>
                <td>
                  <Comments billId={info.bill_id}
                            username={this.props.username}/>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

// <strong>Support: </strong>
// {support.total()}

module.exports = BillResultSummary;