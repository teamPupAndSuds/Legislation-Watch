var mongoose = require('mongoose');

var billSchema = mongoose.Schema({
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

  //we will have to make another api call to sunlight to retrieve the names of the cosponsors based on their id
  cosponsor_ids: Array,

  //if there are no keywords, we will generate an array of keywords using another word association API
  keywords_generated: Array,

  //add createdAt and updatedAt fields to schema
  timestamps: true

});

var BillModel = mongoose.model('Bill', billSchema);

module.exports = BillModel;