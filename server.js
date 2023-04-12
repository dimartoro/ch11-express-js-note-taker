const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const fs = require('fs');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

var theNotes = [];

// Middleware
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(express.static("public"));


// GET Route for homepage
app.get('/', (req, res) =>{
    console.info("Called");
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

// GET Route for notes page
app.get('/notes', (req, res) =>{
  res.sendFile(path.join(__dirname, '/public/notes.html'))
});


// GET API Notes
app.get('/api/notes',(req,res)=>{
    console.info("Called");
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
        console.error(err);
        } else {
        // Convert string into JSON object
        const parsedNotes = JSON.parse(data);

        // Add a new note
        return res.json(parsedNotes);
        }
    });
});

// POST API Test
app.post('/api/test',(req,res)=>{
    console.info("Data: ", req.body);
    res.json("data was good");
});

// POST API Notes

app.post('/api/notes',(req,res)=>{
    var newNote = req.body;
    console.info("Data: ", req.body);
    if(newNote && newNote.title){
        newNote.id = uuid();
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
    
            // Add a new note
            parsedNotes.push(newNote);
    
            // Write updated notes back to the file
            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
            );
            }
        });
    }
    res.json("Note has been saved succesfully");
});

// Delete action will receive a parameter that needs to be defined in the signature of the route. 
app.delete('/api/notes/:id',(req,res)=>{
    console.info("params: ", req.params);
    // req.params will have an object of parameters, and they can be retrieved by getting the attribute name. 
    var targetId = req.params.id;
    var targetIndex = -1;
    if(req){
        
        fs.readFile('./db/db.json', 'utf8', (err, data) => {
            if (err) {
            console.error(err);
            } else {
            // Convert string into JSON object
            const parsedNotes = JSON.parse(data);
            for(var x=0; x<parsedNotes.length; x++){
                if(targetId == parsedNotes[x].id ){
                    targetIndex = x;
                }
            }
            parsedNotes.splice(targetIndex,1);
            // Write updated notes back to the file
            fs.writeFile(
                './db/db.json',
                JSON.stringify(parsedNotes, null, 4),
                (writeErr) =>
                writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully updated notes!')
            );
            }
        });
        
    }
    res.json("data was deleted successfully");
});

app.listen(PORT, function(){
    console.log(`server is listening on http://localhost:${PORT}`);
});
