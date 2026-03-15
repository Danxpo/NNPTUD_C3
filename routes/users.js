var express = require('express');
var router = express.Router();
var User = require('../schemas/user');

// GET all users
router.get('/', async function(req, res, next) {
    try {
        let users = await User.find({ isDeleted: false }).populate('role');
        res.status(200).send({ success: true, data: users });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// GET user by ID
router.get('/:id', async function(req, res, next) {
    try {
        let user = await User.findOne({ _id: req.params.id, isDeleted: false }).populate('role');
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// CREATE user
router.post('/', async function(req, res, next) {
    try {
        let newUser = new User({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            status: req.body.status,
            role: req.body.role,
            loginCount: req.body.loginCount
        });
        await newUser.save();
        res.status(201).send({ success: true, data: newUser });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// UPDATE user
router.put('/:id', async function(req, res, next) {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            req.body,
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// SOFT DELETE user
router.delete('/:id', async function(req, res, next) {
    try {
        let user = await User.findOneAndUpdate(
            { _id: req.params.id, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );
        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }
        res.status(200).send({ success: true, message: "User soft deleted" });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// POST /enable
router.post('/enable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ success: false, message: "Email and username are required" });
        }

        let user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: true },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found with matching email and username" });
        }

        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

// POST /disable
router.post('/disable', async function(req, res, next) {
    try {
        const { email, username } = req.body;
        if (!email || !username) {
            return res.status(400).send({ success: false, message: "Email and username are required" });
        }

        let user = await User.findOneAndUpdate(
            { email: email, username: username, isDeleted: false },
            { status: false },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found with matching email and username" });
        }

        res.status(200).send({ success: true, data: user });
    } catch (error) {
        res.status(500).send({ success: false, message: error.message });
    }
});

module.exports = router;
