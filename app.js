const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const Recipe = require('./models/recipe');

const app = express();

// Connecting to MongoDB Atlas
mongoose.connect('mongodb+srv://recipeAdmin:bkyUbrdwqM9TaPcn@recipe-njvpa.mongodb.net/test?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => {
        console.log('Connected to MongoDB');
    }).catch((error) => {
        console.log('Unable to connect to MongoDB');
        console.error(error);
    });

// CORS 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

// BodyParser Middleware
app.use(bodyParser.json());

// POST RECIPE ROUTE
app.post('/api/recipes', (req, res, next) => {
    const recipe = new Recipe({
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    recipe.save().then((recipe) => {
        console.log(recipe);
        res.status(201).json({
            message: 'Post saved successfully',
            data: recipe
        });
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
});

// GET SINGLE RECIPE ROUTE
app.get('/api/recipes/:id', (req, res, next) => {
    Recipe.findOne({
        _id: req.params.id
    }).then(
        (recipe) => {
            if (!recipe) {
                console.log("err >>", recipe);
            }
            res.status(200).json(recipe);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});

// EDIT RECIPE ROUTE
app.put('/api/recipes/:id', (req, res, next) => {
    const recipe = new Recipe({
        _id: req.params.id,
        title: req.body.title,
        ingredients: req.body.ingredients,
        instructions: req.body.instructions,
        difficulty: req.body.difficulty,
        time: req.body.time
    });
    Recipe.updateOne({
            _id: req.params.id
        }, recipe)
        .then(() => {
            res.status(201).json({
                message: 'Recipe Update Successfully'
            })
        }).catch((error) => {
            res.status(400).json({
                error: error
            });
        });
});

// DELETE RECIPE ROUTE
app.delete('/api/recipes/:id', (req, res, next) => {
    Recipe.deleteOne({
        _id: req.params.id
    }).then(() => {
        res.status(200).json({
            message: 'Recipe Deleted Successfully'
        })
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    })
});

// GET ALL RECIPE ROUTE
app.use('/api/recipes', (req, res, next) => {
    Recipe.find().then((recipes) => {
        res.status(200).json(recipes);
    }).catch((error) => {
        res.status(400).json({
            error: error
        })
    });

});

module.exports = app;