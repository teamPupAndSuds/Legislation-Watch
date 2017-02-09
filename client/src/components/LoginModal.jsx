const React = require('react');
const ReactRouter = require('react-router');
const Link = ReactRouter.Link;
const Login = require('./UserLogin.jsx')
import { Popover, Tooltip, Modal, Button } from 'react-bootstrap'

class LoginModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.close}>
          <Modal.Body>
            <Login close={this.props.close} openSignup={this.props.openSignup}/>
          </Modal.Body>
          <Modal.Footer>
            <button onClick={this.props.close}>Close</button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

module.exports = LoginModal;