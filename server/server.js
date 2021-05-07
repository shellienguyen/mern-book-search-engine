const express = require( 'express' );
const path = require( 'path' );
const db = require( './config/connection' );
const routes = require( './routes' );
const app = express();
const PORT = process.env.PORT || 3001;
const { ApolloServer } = require( 'apollo-server-express' );
const { authMiddleware } = require( './utils/auth' );

// Import backend typeDefs and resolvers
const { typeDefs, resolvers } = require( './schemas' );

app.use( express.urlencoded({ extended: true }));
app.use( express.json());

// Create new Apollo server and pass in our schema data
const server = new ApolloServer({
   typeDefs,
   resolvers,
   context: authMiddleware
})

server.applyMiddleware({ app });

// If we're in production, serve client/build as static assets
if ( process.env.NODE_ENV === 'production' ) {
   app.use( express.static( path.join( __dirname, '../client/build' )));
}

app.use( routes );


db.once('open', () => {
   app.listen(PORT, () => {
     console.log(`API server running on port ${PORT}!`);

     // Consold log the location to test our gql API
     console.log( `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}` );
   });
});
