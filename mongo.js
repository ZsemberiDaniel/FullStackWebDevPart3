const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument to list all people: node mongo.js <password>');
    process.exit(1);
}

const password = process.argv[2];
const url = `mongodb+srv://fullstack:${password}@cluster0.s7uhr.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
    // id: Number,
    name: {
        type: String,
        required: true,
    },
    number: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
});

const Person = mongoose.model('Person', phonebookSchema);

// display all entries
if (process.argv.length === 3) {
    Person.find({ }).then((result) => {
        console.log('List of people in database:');
        console.log('________________');
        result.forEach((person) => {
            console.log(`${person.name}\t ${person.number}`);
        });
        console.log('________________');
        mongoose.connection.close();
    });
} else if (process.argv.length === 5) { // add person
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
        date: new Date(),
    });

    person.save().then(() => {
        console.log('Person saved!');
        mongoose.connection.close();
    });
} else {
    console.log('Please provide the password as an argument to list all people: node mongo.js <password>');
    console.log('OR Please provide the password, name and phone number as an argument to add new person: node mongo.js <password> "<name>" <phone-number>');
    process.exit(1);
}
