const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Signup = require('./UserSignup.jsx')
import { Popover, Tooltip, Modal, Button } from 'react-bootstrap'

class SignupModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.close}>
          <Modal.Body>
            <Signup close={this.props.close} openLogin={this.props.openLogin}/>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.props.close}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

module.exports = SignupModal;