require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const helmet = require('helmet')
const cors = require('cors')
const POKEDEX = require('./pokedex.json')

const app = express()

// app.use(morgan('dev'))

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))
app.use(helmet())
app.use(cors())

app.use(function validateBearerToken(req, res, next) {
    const apiToken = process.env.API_TOKEN
    const authToken = req.get('Authorization')
    
    if (!authToken || authToken.split(' ')[1] !== apiToken) {
      return res.status(401).json({ error: 'Hello! Unauthorized request' })
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
    let response = POKEDEX.pokemon;
    
    // read req.query object (for the params) and store them
    const { name='', type='' } = req.query;
    // const name = req.query;

    if (name) {
        response = response.filter(pokemon => 
            pokemon.name.toLowerCase().includes(name.toLowerCase())
        )
    }

    if (type) {
        response = response.filter(pokemon => 
            pokemon.type.includes(type)    
        )
    }

    res.json(response);
    // use .filter array method and .includes

// search options for either name or type are provided in query string params

// name search should be case insensitive and look for if a name includes the string
// type search should check if user specified type is one of the valid types

}

app.get('/pokemon', handleGetPokemon)

app.use((error, req, res, next) => {
    let response
    if (process.env.NODE_ENV === 'production') {
        response = { error: { message: 'server error' }}
    } else {
        response = { error }
    }
    res.status(500).json(response)
})

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
    console.log(`Server listening`)
})
