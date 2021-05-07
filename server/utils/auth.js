const jwt = require( 'jsonwebtoken' );

// Set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';


module.exports = {
   /* The signToken() function expects a user object and will add that user's
   username, email, and _id properties to the token. Optionally, tokens can
   be given an expiration date and a secret to sign the token with. Note that
   the secret has nothing to do with encoding. The secret merely enables the
   server to verify whether it recognizes this token. */
   signToken: function({ username, email, _id }) {
      const payload = { username, email, _id };

      return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
   },

   // Function for authenticated routes
   authMiddleware: function ( req, res, next ) {
      // allows token to be sent via req.query or headers
      // let token = req.query.token || req.headers.authorization;
      let token = req.body.token || req.query.token || req.headers.authorization;

      // Separate ["Bearer", "<tokenvalue>"]
      if ( req.headers.authorization ) {
         token = token.split( ' ' ).pop().trim();
      };

      if ( !token ) {
         //return res.status( 400 ).json({ message: 'You have no token!' });
         return ( req );
      };

      // Verify token and get user data out of it
      try {
         const { data } = jwt.verify( token, secret, { maxAge: expiration });
         req.user = data;
       }
       catch {
          console.log( 'Invalid token!' );
          //return res.status( 400 ).json({ message: 'Invalid token!' });
       }

       return req;
      // send to next endpoint
      //next();
   }
};
