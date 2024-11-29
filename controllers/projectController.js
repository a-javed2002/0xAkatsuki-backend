const Project = require('../models/Project');

exports.getProjects = async (req, res) => {
    const projects = await Project.find({}).limit(10);
    res.status(200).json(projects);
};

exports.likeProject = async (req, res) => {
    const projectId = req.params.id;
    // Logic to notify repository owner and save to user profile
    res.status(200).json({ success: true, message: 'Project liked!' });
};

exports.dismissProject = async (req, res) => {
    const projectId = req.params.id;
    // Logic to remove project from feed
    res.status(200).json({ success: true, message: 'Project dismissed.' });
};

exports.searchProjects = async (req, res) => {
    const { difficulty, techStack } = req.query;
    const filters = {};
    if (difficulty) filters.difficulty = difficulty;
    if (techStack) filters.techStack = { $in: techStack.split(',') };

    const projects = await Project.find(filters);
    res.status(200).json(projects);
};
