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
      this.democrat = Math.round(this.democrat / sum * 100);
      this.supportString += this.democrat + '% Democrat ';
    }
    if (this.independent !== 0) {
      this.independent = Math.round(this.independent / sum * 100);
      this.supportString += this.independent + '% Independent ';
    }
    if (this.republican !== 0) {
      this.republican = Math.round(this.republican / sum * 100);
      this.supportString += this.republican + '% Republican ';
    }
  }
}

class SupportBar extends React.Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   overlay: (<Tooltip id="tooltip">{this.props.tooltip}</Tooltip>)
    // };
  }

  render() {
    var supportToolTip = (<Tooltip id="tooltip">{this.props.tooltip}</Tooltip>);
    return (
      <OverlayTrigger placement="top" overlay={supportToolTip}>
        <div className="supportBar">
          <div className={this.props.support.democrat === 100 ? 'democrat fullSupport' : 'democrat'} style={{width: `${this.props.support.democrat}%`}}></div>
          <div className={this.props.support.independent === 100 ? 'independent fullSupport' : 'independent'} style={{width: `${this.props.support.independent}%`}}></div>
          <div className={this.props.support.republican === 100 ? 'republican fullSupport' : 'republican'} style={{width: `${this.props.support.republican}%`}} ></div>
        </div>
      </OverlayTrigger>
    );
  }
}

module.exports.Support = Support;
module.exports.SupportBar = SupportBar;