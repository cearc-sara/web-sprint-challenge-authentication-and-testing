const router = require('express').Router();
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
const config = require("../api/config-secret")
const Users = require("../users/users-model")
const {isValid} = require("../users/users-validation")

router.post("/register", (req, res) => {
  const credentials = req.body

  if(isValid(credentials)){
      const rounds = process.env.BCRYPT_ROUNDS || 8

      const hash = bcryptjs.hashSync(credentials.password, rounds)

      credentials.password = hash

      Users.add(credentials)
      .then(user => {
          res.status(201).json({ users: user })
      })
      .catch(err => {
          res.status(500).json({error: err.message})
      })
  }else{
      res.status(400).json({message: "please provide username and password"})
  }
})

router.post("/login", (req, res) => {
  const {username, password} = req.body

  if(isValid(req.body)){
      Users.findBy({username: username})
      .then(([user]) => {
          if(user && bcryptjs.compareSync(password, user.password)){
              const token = getJwt(user)
              res.status(200).json({message: "Welcome to the Shire", token})
          }else{
              res.status(401).json({message: "invalid credentials"})
          }
      })
      .catch(err => {
          res.status(500).json({error: err.message})
      })
  }else{
      res.status(400).json({message: "please provide username and password"})
  }
})

function getJwt(user){
  const payload = {
      username: user.username,
      department: user.department
  }
  const jwtOptions = {
      expiresIn: "8h"
  }
  return jwt.sign(payload, config.jwtSecret, jwtOptions)
}

module.exports = router
