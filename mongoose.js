var mongoose = require('mongoose');

//connect to mongodb
mongoose.connect('mongodb://localhost:27017/test');

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
	console.log('open')
});

// define a schema
var kittySchema = mongoose.Schema({
	name: String
});

// add functionality to our documents;
// methods must be added to the schema before compiling it with mongoose.model()
kittySchema.methods.speak = function () {
	var greeting = this.name
		? "Meow name is " + this.name
		: "I don't hava a name";
	console.log(greeting)
};

// compiling schema into a Model;
// in this case ,mongoose set collection name kittens.
var Kitten = mongoose.model('Kitten', kittySchema);

//construct documents by Model
var silence = new Kitten({name: 'Silence'});

silence.save(function (err, silence) {
	if (err) return console.error(err);
	silence.speak();
});


Kitten.find({ name: /^Silen/ }, callback);