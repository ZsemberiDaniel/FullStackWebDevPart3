const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

morgan.token('postBody', req => {
    return JSON.stringify(req.body);
});

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postBody'))
// app.use(morgan('tiny'));

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
];

app.get('/api/persons', (request, response) => {
    response.json(persons);
});

app.get('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id);
    const person = persons.find(person => person.id == personId);

    if (person)
    {
        response.json(person);
    }
    else
    {
        response.status(404).end();
    }
});

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id);
    persons = persons.filter(person => person.id !== personId);

    response.status(204).end();
});

app.post('/api/persons', (request, response) => {
    function randomIntFromInterval(min, max) { // min and max included 
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    console.log(request.body);
    if (!request.body)
    {
        return response.status(400).json({ error: 'provide a JSON body with the post request!' });
    }

    if (!request.body.name)
    {
        return response.status(400).json({ error: 'provide a name field in the JSON body!' });
    }
    
    if (!request.body.number)
    {
        return response.status(400).json({ error: 'provide a number field in the JSON body!' });
    }

    if (persons.find(person => person.name === request.body.name) !== undefined)
    {
        return response.status(400).json({ error: 'person with given name already exists!' });
    }

    const person = {
        id: randomIntFromInterval(0, 10000000),
        time: new Date(),
        name: request.body.name,
        number: request.body.number
    }

    persons = persons.concat(person);
    response.json(person);
});

app.get('/info', (request, response) => {
    response.send(`<p>Phonebook has info for ${persons.length} ${persons.length <= 1 ? 'person' : 'people'}.</p>
    <p>${new Date()}</p>`);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}.`);
});
