const mongoose = require("mongoose");

if (process.argv.length < 3) {
  console.log("give password as argument");
  console.log(process.argv[2]);
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://fausto2099:${password}@clouster0.k8bthhu.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Clouster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  content: String,
  number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
  content: `${process.argv[3]}`,
  number: `${process.argv[4]}`,
});

person.save().then((result) => {
  console.log(
    `added ${process.argv[3]} number ${process.argv[4]} to phonebook`
  );
  console.log(result);
  mongoose.connection.close();
});

/* Person.find({}).then((persons) => {
  persons.forEach((person) => {
    console.log(person);
  });
  mongoose.connection.close();
}); */
