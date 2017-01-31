const React = require('react');
const ReactDOM = require('react-dom');
const LegislatorInfo = require(__dirname + '/src/components/LegislatorInfo.jsx');
const UserLegislatorsInfo = require(__dirname + '/src/components/UserLegislatorsInfo.jsx');

ReactDOM.render(<UserLegislatorsInfo />, document.getElementById('hello'));