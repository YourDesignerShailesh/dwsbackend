const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String } // new field added for link
});

module.exports = mongoose.model('Portfolio', PortfolioSchema);
