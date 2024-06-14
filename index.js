// exercises 3.1-3.6 / excercise 3.12

require(`dotenv`).config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./modules/person");

morgan.token("body", (request) => JSON.stringify(request.body));

app.use(express.static("dist"));
app.use(express.json());
app.use(morgan(`tiny`));
app.use(cors());

/* let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
]; */

/* app.get("/api/persons/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
}); */

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

/* app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  response.json(persons.find((person) => person.id === id));
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
}); */

app.post(
  "/api/persons",
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`),
  (request, response) => {
    const body = request.body;
    //console.log(body);

    if (!body.name || !body.number) {
      return response.status(400).json({
        error: "content missing",
      });
    }

    /* if (persons.find((person) => person.name === body.name)) {
      return response.status(400).json({
        error: "name must be unique",
      });
    } */

    const person = new Person({
      name: body.name,
      number: body.number,
      //id: Math.round(Math.random() * 100000),
    });

    person.save().then((personSave) => response.json(personSave));
  }
);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
