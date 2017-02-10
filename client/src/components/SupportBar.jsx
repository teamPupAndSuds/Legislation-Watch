const React = require('react');
const Tooltip = require('react-bootstrap').Tooltip;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;


class Support {
  constructor() {
    this.republican = 0;
    this.democrat = 0;
    this.independent = 0;
    this.supportString = '';
  }
  count(party) {
    if (party === 'R') {
      this.republican++;
    } else if (party === 'D') {
      this.democrat++;
    } else if (party === 'I') {
      this.independent++;
    }
  }
  total() {
    var sum = this.republican + this.democrat + this.independent;
    if (this.democrat !== 0) {
      this.democrat = (this.democrat / sum * 100);
      var demString = (this.democrat) + '';
      this.democrat = Math.floor(this.democrat);
      let demIndex = demString.indexOf('.');
      if (demIndex !== - 1) {
        demString = demString.slice(0, demIndex + 2);
      }
      this.supportString += demString + '% Democrat ';
    }
    if (this.independent !== 0) {
      this.independent = (this.independent / sum * 100);
      var indString = (this.independent) + '';
      this.independent = Math.floor(this.independent);
      let indIndex = indString.indexOf('.');
      if (indIndex !== - 1) {
        indString = indString.slice(0, indIndex + 2);
      }
      this.supportString += indString + '% Independent ';
    }
    if (this.republican !== 0) {
      this.republican = (this.republican / sum * 100);
      var repString = (this.republican) + '';
      this.republican = Math.floor(this.republican);
      let repIndex = repString.indexOf('.');
      if (repIndex !== - 1) {
        repString = repString.slice(0, repIndex + 2);
      }
      this.supportString += repString + '% Republican ';
    }
  }
}

class SupportBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var supportToolTip = (<Tooltip id="tooltip">{this.props.tooltip}</Tooltip>);
    var independent;
    if (this.props.support.independent === 100) {
      independent = 'independent fullSupport';
    } else if (this.props.support.independent === 0) {
      independent = 'hideSupport';
    } else {
      if (this.props.support.democrat === 0) {
        independent = 'independent democrat';
      } else if (this.props.support.republican === 0) {
        independent = 'independent republican';
      } else {
        independent = 'independent';
      }
    }

    return (
      <OverlayTrigger placement="top" overlay={supportToolTip}>
        <div className="supportBar">
          <div className={this.props.support.democrat === 100 ? 'democrat fullSupport' : this.props.support.democrat === 0 ? 'hideSupport' : 'democrat'} style={{width: `${this.props.support.democrat}%`}}></div>
          <div className={independent} style={{width: `${this.props.support.independent}%`}}></div>
          <div className={this.props.support.republican === 100 ? 'republican fullSupport' : this.props.support.republican === 0 ? 'hideSupport' : 'republican'} style={{width: `${this.props.support.republican}%`}} ></div>
        </div>
      </OverlayTrigger>
    );
  }
}

module.exports.Support = Support;
module.exports.SupportBar = SupportBar;