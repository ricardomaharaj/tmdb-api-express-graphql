require('dotenv').config()
let express = require('express')
let { graphqlHTTP } = require('express-graphql')
let { buildSchema } = require('graphql')
let { readFileSync } = require('fs')
const axios = require('axios').default

const PORT = process.env.PORT || 4000
const api_key = process.env.TMDB_API_KEY
const API_URL = 'https://api.themoviedb.org/3'

let schema = buildSchema(readFileSync(__dirname + '/schema.gql').toString('utf-8'))

let rootValue = {
    search: async function ({ query }) {
        let x = await axios.get(API_URL + '/search/multi', {
            params: {
                api_key,
                query,
                page: 1,
                language: 'en-US'
            }
        })
        return x.data.results
    },
    movie: async function ({ id }) {
        let x = await axios.get(API_URL + '/movie/' + id, {
            params: {
                api_key,
                language: 'en-US'
            }
        })
        return x.data
    },
    tv: async function ({ id }) {
        let x = await axios.get(API_URL + '/tv/' + id, {
            params: {
                api_key,
                language: 'en-US'
            }
        })
        return x.data
    }
}

let app = express()
app.use('/', graphqlHTTP({ schema, rootValue, graphiql: true }))

app.listen(PORT)
