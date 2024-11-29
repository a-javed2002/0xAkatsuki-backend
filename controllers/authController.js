const jwt = require('jsonwebtoken');

exports.loginSuccess = (req, res) => {
    const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Redirect to React app with token as a query parameter
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
};

exports.loginFailure = (req, res) => {
    res.status(401).json({ success: false, message: 'Authentication Failed' });
};
