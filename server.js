require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const POKEDEX = require('./pokedex.json')

console.log(process.env.API_TOKEN)

const app = express()

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
    // const bearerToken = req.get('Authorization').split(' ')[1]
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')

    // undefined - can't access query params
    console.log(req.get('Authorization'))

    console.log('validate bearer token middleware')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Unauthorized request' })
    }
 
    // move to the next middleware
    next()
})

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

// request handlers such as the below are called middleware

// middleware and Express allows us to "compose" multiple middlewares
// if difference sequences and configurations
function handleGetTypes(req, res) {
    res.json(validTypes)
}

// pass handleGetTypes (a middleware function/callback function) as the 2nd argument
app.get('/types', handleGetTypes)

// also middleware
function handleGetPokemon(req, res) {
    res.send('Hello, Pokemon!')
}

app.get('/pokemon', handleGetPokemon)

const PORT = 8080

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`)
})
