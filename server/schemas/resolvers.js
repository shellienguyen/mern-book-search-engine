const { Book, User } = require( '../models' );
const { AuthenticationError } = require( 'apollo-server-express' );
const { signToken } = require( '../utils/auth' );


const resolvers = {
   Query: {
      // Retrieve a user using username
      me: async( parent, args, context ) => {
         if ( context.user ) {
            const userData = await User.findOne({})
               .select( '-__v -password' )
               .populate( 'books' )

               return userData;
         };

         throw new AuthenticationError( 'User is not logged in!' );
      }
   },
   /* Upon successful operation, a token is generated.  After receiving this token,
   the client can continue to send it with any other requests. The back end will
   then decode the token and know exactly who was making the request, because all
   of the user's information is saved on the token itself. */
   Mutation: {
      addUser: async( parent, args ) => {
         const user = await User.create( args );
         const token = signToken( user );

         return { token, user };
      },
      login: async( parent, { email, password } ) => {
         console.log( 'resolvers.js' );

         const user = await User.findOne({ email });

         console.log( 'resolvers.js' );
         console.log( 'email: ' + email );
         console.log( 'password: ' + password );

         if ( !user ) {
            console.log( 'resolvers.js if( !user )' );
            throw new AuthenticationError( 'Incorrect credentials deteced!' );
         };

         const correctPassword = await user.isCorrectPassword( password );

         console.log( 'correctPassword: ' );
         console.log( correctPassword );

         if ( !correctPassword ) {
            console.log( 'resolvers.js if( !correctPassword )' );
            throw new AuthenticationError( 'Incorrect credentials detected!' );
         };

         const token = signToken( user );

         console.log( 'resolvers.js' );
         console.log( 'token: ' + token );

         return { token, user };
      },
      saveBook: async( parent, args, context ) => {
         if ( context.user ) {
            const updatedUser = await User.findByIdAndUpdate(
               { _id: context.user._id },
               { $addToSet: { savedBooks: args.input }},
               { new: true }
            );

            return updatedUser;
         };

         throw new AuthenticationError( 'User must be logged in!' );
      },
      removeBook: async( parent, args, context ) => {
         if ( context.user ) {
            const updatedUser = await User.findOneAndUpdate (
               { _id: context.user._id },
               { $pull: { savedBooks: { bookId: args. bookId }}},
               { new: true } 
            );

            return updatedUser;
         };

         throw new AuthenticationError( 'User must be logged in!' );
      }
   }
};


module.exports = resolvers;