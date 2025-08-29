const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserRepository = require('../repositories/user-repository');
const { ServerConfig } = require('../config');

const userRepository = new UserRepository();

async function registerUser({ email, password }) {
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
        throw new Error('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ email, password: hashedPassword });
    return { id: user.id, email: user.email };
}

async function loginUser({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) {
        throw new Error('Invalid email or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, ServerConfig.JWT_SECRET, { expiresIn: '1h' });
    return { token };
}

module.exports = {
    registerUser,
    loginUser
};