const express = require('express');
const app = express();
const PORT = 8080;

//parses JSON requests
app.use(express.json())

//array of existing data, "make-shift database"
const dataStore = [];


// Define a simple data model
class Tshirt {
    constructor(id, logo) {
      this.id = id;
      this.logo = logo;
    }
  }

app.get('/tshirts', (req, res) => {

    if (!res.headersSent) {
        res.status(200).json(dataStore);
    }

});


app.get('/tshirt/:id', (req, res) => {
    const { id } = req.params;

    const foundTshirt = dataStore.find((tshirt) => tshirt.id === id);

    if (!foundTshirt) {
        return res.status(404).json({ message: 'T-shirt not found' });
    }

    return res.status(200).json(foundTshirt);
});

//define a route for the /tshirt endpoint
app.post('/tshirt/:id', (req, res) => {
    const { id } = req.params;
    let logo; //declare logo but doesn't init yet
    if (req.body && req.body.logo) {
        logo  = req.body.logo; //assign value  based on data in request body
    }

    if (!logo) {
        res.status(418).send({ message: 'Error Missing Logo'})
    } else {
        const newTshirt = new Tshirt(id, logo);
        dataStore.push(newTshirt); //push element into database
        res.status(200).send({ tshirt: `shirt with your ${logo} and ID of ${id}`})
    }
});

//DELETE endpoint for tshirt/:id
app.delete('/tshirt/:id', (req, res) => {
    const { id } = req.params;
    const index = dataStore.findIndex((tshirt) => tshirt.id === id);
  
    //strict equality operator checks whether its two operands are equal, returning a bool result
    if (index === -1) {
      return res.status(404).json({ message: 'T-shirt not found' });
    }
    //splice removes element from array
    dataStore.splice(index, 1);
    res.status(200).json({ message: 'T-shirt deleted successfully' });
  });

// PUT endpoint for /tshirt/:id
app.put('/tshirt/:id', (req, res) => {
    const { id } = req.params;
    const { logo } = req.body;
  
    const index = dataStore.findIndex((tshirt) => tshirt.id === id);
  
    if (index === -1) {
      return res.status(404).json({ message: 'T-shirt not found' });
    }

    // Update the logo of the existing T-shirt
  dataStore[index].logo = logo;

  res.status(200).json(dataStore[index]);
});




//fires up the local server
app.listen(PORT, () => {
    console.log(`its alive on http://localhost:${PORT}`);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
  });
  
