require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const Persons = require('./models/persons');

const app = express();
const { PORT } = process.env;

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

morgan.token('postBody', (req) => JSON.stringify(req.body));

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'));
// app.use(morgan('tiny'));

app.get('/api/persons', (request, response) => {
    Persons.find({}).then((people) => {
        response.json(people);
    });
});

const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' });
    }
    if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message });
    }
    if (error.code === 11000) {
        return response.status(400).json({ error: error.message });
    }
    if (error.name === 'NoBody') {
        return response.status(400).send({ error: error.error });
    }
    if (error.name === 'NotFound') {
        return response.status(400).send({ error: error.error });
    }

    return next(error);
};

app.get('/api/persons/:id', (request, response, next) => {
    const personId = request.params.id;
    Persons.findById(personId).then((person) => {
        if (person) {
            response.json(person);
        } else {
            next({ name: 'NotFound', error: 'person not found in phonebook!' });
        }
    })
        .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
    const personId = request.params.id;
    Persons.findByIdAndDelete(personId).then(() => {
        response.status(204).end();
    })
        .catch((error) => next(error));
});

app.put('/api/persons/:id', (request, response, next) => {
    if (!request.body) {
        next({ name: 'NoBody', error: 'provide a JSON body with the post request!' });
        return;
    }
    const personId = request.params.id;

    const newPerson = {};
    if (request.body.name) newPerson.name = request.body.name;
    if (request.body.number) newPerson.number = request.body.number;

    Persons.findByIdAndUpdate(personId, newPerson, { new: true, runValidators: true })
        .then((updatedPerson) => {
            response.json(updatedPerson);
        })
        .catch((error) => next(error));
});

app.post('/api/persons', (request, response, next) => {
    if (!request.body) {
        next({ name: 'NoBody', error: 'provide a JSON body with the post request!' });
        return;
    }

    const person = new Persons({
        time: new Date(),
    });

    if (request.body.name) person.name = request.body.name;
    if (request.body.number) person.number = request.body.number;

    person.save().then((savedPerson) => {
        response.json(savedPerson);
    })
        .catch((error) => next(error));
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${Persons.length} ${Persons.length <= 1 ? 'person' : 'people'}.</p>
    <p>${new Date()}</p>`);
});

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
