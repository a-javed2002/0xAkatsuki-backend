const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  techStack: [String],
  difficulty: String,
  owner: String,
});

module.exports = mongoose.model('Project', ProjectSchema);
