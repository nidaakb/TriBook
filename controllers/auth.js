const User = require('../models/user.model');

// Render the login form
const getLoginForm = (req, res) => {
    res.render('login', {
        error_msg: req.flash('error_msg'),
        success_msg: req.flash('success_msg')
    });
};

// Handle the signup form submission
const postSignupForm = async (req, res) => {
    const { username, email, password, isAdmin } = req.body; // Add isAdmin parameter

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash('error_msg', 'Username already exists.');
            return res.redirect('/signup');
        }

        // Determine the role based on isAdmin flag
        const role = isAdmin ? 'admin' : 'customer';

        // Create a new user with the determined role and store the plain password
        const newUser = new User({
            username,
            email,
            password, // Plain text password (not secure for production)
            role
        });

        await newUser.save();
        req.flash('success_msg', 'User created successfully! You can now log in.');
        res.redirect('/login');
    } catch (err) {
        console.error(err);
        req.flash('error_msg', 'Error creating user. Please try again.');
        res.redirect('/signup');
    }
};

// Handle the login form submission
const postLoginForm = async (req, res) => {
    console.log('Request body:', req.body);
    
    const { username, password } = req.body;
    console.log('Login attempt for:', username);

    try {
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found.');
            req.flash('error_msg', 'Invalid username or password.');
            return res.redirect('/login');
        }

        // Compare the plain password with the stored password
        const isMatch = password === user.password;
        if (!isMatch) {
            req.flash('error_msg', 'Invalid username or password.');
            console.log('Password mismatch.');
            return res.redirect('/login');
        }

        // Successful login
        req.session.isAuthenticated = true;
        req.session.role = user.role;
        req.session.user = {
            id: user._id,
            username: user.username
        };

        req.flash('success_msg', 'You are now logged in.');
        console.log('Login successful:', user.username);
        return res.redirect('/');
    } catch (err) {
        console.error('Error during login:', err);
        req.flash('error_msg', 'Error logging in. Please try again.');
        res.redirect('/login');
    }
};

// Render the signup form
const getSignupForm = (req, res) => {
    res.render('signup');
};

// Handle user logout
const logout = (req, res) => {
    console.log('Logout');
    req.session.destroy(err => {
        if (err) {
            return res.send('Error logging out.');
        }
        res.redirect('/');
    });
};

module.exports = {
    getLoginForm,
    postLoginForm,
    getSignupForm,
    postSignupForm,
    logout
};
