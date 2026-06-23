const express = require("express"); //create an express app
const noteModel = require("./models/note.model");

const app = express(); //create an express app
app.use(express.json()); //middleware to parse incoming JSON requests

/*
CRUD operations for notes
1. Create a note POST
2. Read all notes GET
3. Update a note PATCH
4. Delete a note DELETE
*/

//Create a note POST
app.post("/notes", async (req, res) => {
  const data = req.body; //get the data from the request body
  await noteModel.create({
    title: data.title,
    description: data.description,
  });
  res.status(201).json({
    //201 means created
    message: "Note created successfully",
  });
});

app.get("/notes", async (req, res) => {
  //get all notes
  const notes = await noteModel.find(); //find all notes and notes variable mai save kare gi ... return array

  //find ... [{}, {}], []
  //findOne ... {}, null
  res.status(200).json({
    //200 means ok
    message: "Notes fetched successfully",
    notes: notes,
  });
});

app.delete("/notes/:id", async (req, res) => {
  //delete a note
  const id = req.params.id; //get the id from the request params ..... params is used to get the value of a parameter in the URL
  await noteModel.findOneAndDelete({
    _id: id,
  }); //find the note by id and delete it
  res.status(200).json({
    //200 means ok
    message: "Note deleted successfully",
  });
});

app.patch("/notes/:id", async (req, res) => {
  const id = req.params.id;
  const description = req.body.description; // description ko update karna hai
  await noteModel.findOneAndUpdate(
    {
      _id: id // kis k basis pr update krna hai 
    },
    { description: description },
  );
  res.status(200).json({
    message: "Note updated successfully",
  });
});

module.exports = app; //export the app for use in other files
