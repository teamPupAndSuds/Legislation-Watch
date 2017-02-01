var mongoose = require('mongoose');

var billSchema = new mongoose.Schema({
  bill_id: {
    type: String,
    unique: true
  },
  chamber: String,
  introduced_on: String,
  last_action_at: String, 
  last_vote_at: String,
  last_version_on: String,
  short_title: String,
  official_title: String,
  popular_title: String,
  sponsor: {
    first_name: String,
    last_name: String,
    middle_name: String,
    title: String,
  },
  sponsor_id: String,
  last_version: {
    issued_on: String,
    urls: {
      html: String
    }
  },
  related_bill_ids: Array,
  keywords: Array,
  summary: String,
  summary_short: String,

  //list of ids of cosponsors from initial api call
  cosponsor_ids: Array,

  //list of names of cosponsors from secondary api call
  cosponsors: Array,

  //if there are no keywords, we will generate an array of keywords using another word association API
  keywords_generated: Array,

//timestamps in options, set to true for both createdAt and updatedAt
}, {timestamps: true});

var BillModel = mongoose.model('Bill', billSchema);


module.exports = BillModel;