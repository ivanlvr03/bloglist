const bcrypt = require('bcrypt')
const userRouter = require('express').Router()

const User = require('../models/users')

userRouter.post('/', async (req, res) => {
        const {username, name, password} = req.body
        
        if (!username || !password) {
            return res.status(400).json({error: 'username and password are required'})
        }
        
        if (username.length < 3 ||password.length < 3){
            return res.status(400).json({error: 'password must be at least 3 characters long'})
        }
        
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password, saltRounds)
        
        const user = new User({
            username,
            name,
            passwordHash
        })
        
        const savedUser = await user.save()
        res.status(201).json(savedUser)
})

userRouter.get('/', async (req, res) => {  
        const users = await User.find({}).populate('blogs', {title: 1, author: 1, url: 1})
        res.json(users)
})

module.exports = userRouter

