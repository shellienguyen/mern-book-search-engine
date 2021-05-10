const mongoose = require( 'mongoose' );


// Make Mongoose use `findOneAndUpdate()` by setting useFindAndModify to false.
// Note that this option is `true` by default
mongoose.connect( process.env.MONGODB_URI || 'mongodb://localhost/googlebooks', {
   useNewUrlParser: true,
   useUnifiedTopology: true,
   useCreateIndex: true,
   useFindAndModify: false,
});


module.exports = mongoose.connection;