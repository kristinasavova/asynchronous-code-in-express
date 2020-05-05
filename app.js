const express = require ('express');
const fs = require ('fs'); // allows to work with the file system on computer
const path = require ('path');

const app = express ();

app.set ('view engine', 'pug');
app.set ('views', path.join (__dirname, 'views'));
app.use (express.static ('public'));

/* Reduce error-handling code when using async/await */

/* Use a middleware to wrap each of the routes automatically in a try-catch block, so we
don't have to explicitly write it over and over again. */  

function asyncHandler (cb) {
    // return an async func that will serve as our route handlers callback 
    return async (req, res, next) => {
        try {
            // await whatever func we've passed to the asyncHandler with normal route handling params  
            await cb (req, res, next); 
        } catch (err) {
            // we have error in this object because of the error variable in the pug template
            res.render ('error', { error: err }); 
        }
    };   
}  

/* CALLBACKS */

// function getUsers (cb) {
//     fs.readFile ('data.json', 'utf8', (err, data) => {
//         if (err) return cb (err);
//         const users = JSON.parse (data);
//         return cb (null, users);
//     });
// }

// app.get ('/', (req,res) => {
//     getUsers ((err, users) => {
//         if (err) {
//             // we have error in this object because of the error variable in the pug template 
//             res.render ('error', { error: err });
//         } else {
//             res.render ('index', { title: 'Users', users: users.users})
//         }
//     });
// }); 

/* PROMISES */

/* Promises allow us to clearly outline the order in which things need to be done by 
chaining functions together in the order we wish them to exacute rather then nesting 
then one inside of another. */

function getUser () { // returns a promise 
    return new Promise ((resolve, reject) => {
        fs.readFile ('data.json', 'utf-8', (err, data) => {
            if (err) {
                reject (err);
            } else { 
                // JSON.parse turns the data into JS object    
                const users = JSON.parse (data);  
                resolve (users); 
            } 
        });
    });
}; 

// app.get ('/', (req, res) => {
//     // getUsers either provides the data or the error 
//     getUser ()
//         // get access to the data provided by getUsers 
//         .then ((users) => {
//             res.render ('index', { title: 'Users', users: users.users });
//         })
//         .catch ((err) => {
//             // we have error in this object because of the error variable in the pug template
//             res.render ('error', { error: err }); 
//         });
// });

/* ASYNC/AWAIT */

/* Async/Await is a way to work with promises by using a less verbose syntax. We don't
need to change getUsers function, because it's already returning a promise. The await
keyword can be used with any function that returns a promise. */
 
// if a func returns a non-promise value, prepending the func with the async automatically wraps that value in a promise
// app.get ('/', async (req, res) => {
//     // to handle errors we need to wrap this code in a try catch block
//     try {
//         // wait for this asynchronous func to finish before moving on to the rendering  
//         const users = await getUser ();
//         res.render ('index', { title: 'Users', users: users.users });
//     } catch (err) {
//         res.render ('error', { error: err }); 
//     }
// });

/* Reduce error-handling code when using async/await */

/* Use a middleware to wrap each of the routes automatically in a try-catch block, so we
don't have to explicitly write it over and over again. */  

app.get ('/', asyncHandler (
    // if a func returns a non-promise value, prepending the func with the async automatically wraps that value in a promise
    async (req, res) => {
        // to handle errors we need to wrap this code in a try catch block
            // wait for this asynchronous func to finish before moving on to the rendering  
            const users = await getUser ();
            res.render ('index', { title: 'Users', users: users.users });
    }) 
);

app.listen (3000, () => console.log ('App listening on port 3000!'));