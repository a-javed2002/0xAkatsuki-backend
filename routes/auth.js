const express = require('express');
const passport = require('passport');
const { loginSuccess, loginFailure } = require('../controllers/authController');
const router = express.Router();

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/auth/failure' }),
  loginSuccess
);

router.get('/failure', loginFailure);

module.exports = router;
