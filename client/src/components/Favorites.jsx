const React = require('react');
class Favorites extends React.Component {
  constructor(props) {
    super(props);
  }
  
  render() {
    return (
      <div>
        <h1>Inside Favorites</h1>
        <p>favorites</p>
      </div>
    );
  }
}

module.exports = Favorites;