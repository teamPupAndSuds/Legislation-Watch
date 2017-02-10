const React = require('react');
const ProgressBar = require('react-bootstrap').ProgressBar;

class BillTracker extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('history: ', this.props.history);
    var introduced, house, senate, president, enacted;
    // var current = {backgroundColor: '#6CC091 !important'};
    var off = 'trackerOff';
    var on = 'trackerOn';
    var failed = {backgroundColor: '#6CC091 !important'};
    var history = this.props.history;
    introduced = house = senate = president = enacted = off;
    if (!history.house_passage_result) {
      introduced = on;
    } else if (!history.senate_passage_result) {
      if (history.house_passage_result === 'pass') {
        introduced = house = on;
      } else {
        introduced = on;
        house = failed;
      }
      console.log('history: ', history);
    } else if (history.awaiting_signature === true) {
      if (history.senate_passage_result === 'pass') {
        introduced = house = senate = on;
      } else {
        introduced = house = on;
        senate = failed;
      }
      president = pending;
      console.log('history: ', history);
    } else if (history.awaiting_signature === false) {
      introduced = house = senate = president = on;
      if (history.enacted === true) {
        enacted = on;
      } else {
        enacted = failed;
      }
      console.log('history: ', history);
    }

    return (
      <ProgressBar>
        <ProgressBar className={introduced} now={20} label={'Introduced'}></ProgressBar>
        <ProgressBar className={house} now={20} label={'Passed House'}></ProgressBar>
        <ProgressBar className={senate} now={20} label={'Passed Senate'}></ProgressBar>
        <ProgressBar className={president} now={20} label={'To President'}></ProgressBar>
        <ProgressBar className={enacted} now={20} label={'Enacted'}></ProgressBar>
      </ProgressBar>
    );

  }
}


module.exports.BillTracker = BillTracker;