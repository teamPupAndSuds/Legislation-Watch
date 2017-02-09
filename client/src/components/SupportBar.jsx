const React = require('react');
const Tooltip = require('react-bootstrap').Tooltip;
const OverlayTrigger = require('react-bootstrap').OverlayTrigger;


class Support {
  constructor() {
    this.republican = 0;
    this.democrat = 0;
    this.independent = 0;
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
    // var proportion = {};
    var supportString = '';
    var sum = this.republican + this.democrat + this.independent;
    if (this.republican !== 0) {
      this.republican = Math.round(this.republican / sum * 100);
      supportString += this.republican + '% Republican ';
    }
    if (this.democrat !== 0) {
      this.democrat = Math.round(this.democrat / sum * 100);
      supportString += this.democrat + '% Democrat ';
    }
    if (this.independent !== 0) {
      this.independent = Math.round(this.independent / sum * 100);
      supportString += this.independent + '% Independent ';
    }
    return supportString;
  }
}

class SupportBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlay: (<Tooltip id="tooltip">{this.props.tooltip}</Tooltip>)
    };
  }

  // showTooltip(e) {
  //   e.target.tooltip();
  // }

  render() {
    return (
      <OverlayTrigger className="supportBar">
        <div className="republican" style={{width: `${this.props.support.republican}%`}} overlay={this.state.overlay} >{`${this.props.support.republican}% Republican`}</div>
        <div className="democrat" style={{width: `${this.props.support.democrat}%`}}>{`${this.props.support.democrat}% Democrat`}</div>
        <div className="independent" style={{width: `${this.props.support.independent}%`}}>{`${this.props.support.independent}% Independent`}</div>
      </OverlayTrigger>
    );
  }
}

module.exports.Support = Support;
module.exports.SupportBar = SupportBar;