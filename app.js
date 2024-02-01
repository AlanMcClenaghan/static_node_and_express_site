// Create an app.js file at the root of your directory.

// Require Express
const express = require('express');

// Require data
const {projects} = require('./data.json');

const app = express();

// Set View Engine to Pug
app.set('view engine', 'pug');

// use a static route and the express.static method to serve the static files located in the public folder
app.use('/static', express.static('public'));

/*
SET ROUTES
*/

// Render Index
app.get('/', (req, res) => {
    res.render('index', {projects});
});

// Render About page
app.get('/about', (req, res) => {
    res.render('about');
});

// Render Project routes
app.get('/projects/:id', (req, res, next ) => {
    const projectId = req.params.id;
    const project = projects.find( ({id}) => id === +projectId );

    if (project) {
        res.render("project", { project });
    } else {
        // Set error if no project found
        const err = new Error('Page Not Found!');
        err.status = 404;
        next(err);
    }
});

/*
Handle errors
*/

// 404 handler to catch undefined or non-existent route requests
app.use((err, req, res, next ) => {
    res.locals.error = err;
    res.status(err.status);
    res.render('page-not-found');
});

// Global error handler
app.use((req, res, next ) => {

    const err = new Error('Page Not Found');
    err.status = err.status || 500;

    if (err.status === 404) {
        res.locals.error = err;
        res.status(err.status);
        res.render('error', err);
    } else {
        err.message = "Something went wrong with the server";
        res.locals.error = err;
        res.status(err.status);
        res.render('error', err);
    }
});

// Listerner on port 3000
app.listen(3000, () => {
    console.log('The app is running on localhost: 3000');
});