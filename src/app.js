const express = require ('express'); //server ko create krna

const app = express();
app.use(express.json()); //body ko json me convert krna //middleware

const notes = [];

app.post('/notes', (req, res) => {
    notes.push(req.body); // add notes data to array
    res.status(201).json({
        //  201 means created
        message: 'Note created successfully',
    })
})

app.get('/notes', (req, res) => {
 res.status(200).json({
        //  200 means ok
        message: 'Notes retrieved successfully',
        notes: notes
    })
});


app.delete('/notes/:index', (req, res) => {
    const index = req.params.index; //index ko url se le rahe hai
   delete notes[ index ];
   res.status(200).json({
    message: 'Note deleted successfully',
   })
});

app.patch('/notes/:index', (req, res) => {

    const index = req.params.index;
    const description = req.body.description; //description ko body se le rahe hai
    notes [index].description = description; //notes ke index par description ko update krna
    res.status(200).json({
        message: 'Note updated successfully',
    })
})
module.exports = app;