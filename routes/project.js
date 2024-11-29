const express = require('express');
const { getProjects, likeProject, dismissProject, searchProjects } = require('../controllers/projectController');
// const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/discover', getProjects);
router.post('/like/:id', likeProject);
router.post('/dismiss/:id', dismissProject);
router.get('/search', searchProjects);

module.exports = router;
