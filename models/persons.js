const mongoose = require('mongoose');
require('mongoose-unique-validator');

// connect to database
const url = process.env.MONGODB_URI;
mongoose.connect(url).then(() => {
    console.log('Connected to MongoDB');
})
    .catch((error) => {
        console.log('Error connecting to MongoDB:', error.message);
    });

const phonebookSchema = new mongoose.Schema({
    // id: Number,
    name: {
        type: String,
        required: true,
        minlength: 3,
        unique: true,
    },
    number: {
        type: String,
        required: true,
        minlength: 8,
    },
    time: {
        type: Date,
        required: true,
    },
});
phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model('Person', phonebookSchema);
