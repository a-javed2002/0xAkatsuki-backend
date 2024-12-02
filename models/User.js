const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  githubId: { type: String, required: true },
  name: { type: String },
  avatar: { type: String },
  repositories: [String],
  experienceLevel: String,
  expertise: String,
  techStack: [String],
  accessToken: { type: String, required: true }, // Add this field
});

module.exports = mongoose.model('User', UserSchema);
