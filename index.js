// exercises 3.1-3.6 / excercise 3.12 / excercise 3.13-3.14 / excercise 3.15-3.18

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

app.get("/api/persons/info", (request, response) => {
  response.send(
    `<p>Phonebook has info for ${persons.length} people</p><p>${Date()}</p>`
  );
});

/* app.get("/api/persons", (request, response) => {
  response.json(persons);
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
}); */

app.get("/api/persons/:id", (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { name, number } = request.body;

  /* const person = {
    name: name,
    number: number,
  }; */

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => next(error));
});

/* app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  response.json(persons.find((person) => person.id === id));
  persons = persons.filter((person) => person.id !== id);
  response.status(204).end();
  }); */

app.delete("/api/persons/:id", (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.json(result);
      response.status(204).end();
    })
    .catch((error) => next(error));
});

/* app.post(
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

    if (persons.find((person) => person.name === body.name)) {
      return response.status(400).json({
        error: "name must be unique",
      });
    }

    const person = {
      name: body.name,
      number: body.number,
      id: Math.round(Math.random() * 100000),
    };

    persons = persons.concat(person);

    response.json(person);
  }
); */

app.post(
  "/api/persons",
  morgan(`:method :url :status :res[content-length] - :response-time ms :body`),
  (request, response, next) => {
    const body = request.body;
    //console.log(body);

    /*  if (!body.name || !body.number) {
      return response.status(400).json({
        error: "content missing",
      });
    } */

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

    person
      .save()
      .then((personSave) => {
        response.json(personSave);
      })
      .catch((error) => next(error));
  }
);

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  //console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// /[0-9]{2}|[0-9]{3}-[0-9]/.test(number)
