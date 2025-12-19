const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user.js')

const saltRounds = 10

const signUp = async (req, res) => {
    try {
        const { name, email, password, role } = req.body

        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already in use' })
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds)

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        console.log('User created successfully:', { email: newUser.email, role: newUser.role });

        const token = jwt.sign(
            {
                userId: newUser._id,
                role: newUser.role
            },
            process.env.JWT_SECRET)

        res.status(201).json(
            {
                token,
                user: {
                    _id: newUser._id,
                    name: newUser.name,
                    email: newUser.email,
                    role: newUser.role
                }
            })

    } catch (error) {
        console.log('Signup error:', error);
        res.status(500).json({ error: 'Signup Failed' })
    }
}

const signIn = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Unable to log in' })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'Unable to log in' })
        }

        const token = jwt.sign(
            {
                userId: user._id,
                role: user.role
            },
            process.env.JWT_SECRET
        )

        res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        })

    } catch (error) {
        console.log('Signin error:', error);
        res.status(500).json({ error: 'Signin Failed' })
    }
}

const signOut = async (req, res) => {
    try {
        res.status(200).json({ message: "Signed Out" })
    } catch (error) {
        res.status(500).json({ error: 'Unable to Sign Out' })
    }
}

module.exports = { signUp, signIn, signOut}