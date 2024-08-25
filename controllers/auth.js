const User = require("../Model/user"); // Correct model import path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.signup = async (req, res) => {
    try {
        const { username, email, password, confirmpassword } = req.body;

        console.log('Signup request:', req.body); // Debugging log

        if (password !== confirmpassword) {
            return res.status(400).json({ message: 'Passwords do not match' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            confirmpassword: hashedPassword
        });

        await newUser.save();
        res.status(201).json({ success: true, message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Please sign up first' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password is not correct' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            success: true,
            message: 'User logged in successfully',
            token,
            user: user._id  // Include the user ID in the response
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { username, email, newpassword, oldpassword } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (oldpassword && newpassword) {
            const isMatch = await bcrypt.compare(oldpassword, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Old password is not correct' });
            }
            user.password = await bcrypt.hash(newpassword, 12);
        }

        if (username) user.username = username;
        if (email) user.email = email;

        await user.save();

        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.userDetails = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                success: false,
                message: "User ID is required",
            });
        }
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            userDetails,
            message: "User details fetched successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user details",
        });
    }
};
