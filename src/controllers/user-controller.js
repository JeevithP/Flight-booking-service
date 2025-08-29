const UserService = require('../services/user-service');

exports.register = async (req, res) => {
    try {
        const user = await UserService.registerUser(req.body);
        res.status(201).json({ user });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        // console.log('Login request body:', req.body);
        const result = await UserService.loginUser(req.body);
        res.status(200).json(result);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};