// Citation for setup/database/templating engine
// Adapted from Step 0 - Copied setup express/app declarations and listen method
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Date: 05/16/2024

// Credit for setup and ajax from nodejs-starter template
let express = require('express');
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
const path = require('path');
PORT = 9343;

// database
let db = require('./database/db-connector.js');

// templating engine
const { engine } = require('express-handlebars');  // Import engine function from express handlebars module
var exphbs = require('express-handlebars');  // Import express-handlebars
const { errorMonitor } = require('events');
app.engine('.hbs', engine({extname: ".hbs", partialsDir:[path.join(__dirname, 'views/partials')]})); // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use handlebars engine whenever it encounters .hbs file


// Citation for Route functions
// Adding/Updating/Deleting/Dynamic display of data in handlebars files for the tables, and querying the database from app.js
// Adapted from Step 4 - 8 - Based on table structures and form structures in hbs files, adapted the templates for querying data from database in route functions, Delete User from Ajax template used for delete_user.js
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data
// Date: 05/24/2024 for Users routes and 05/30/2024 for other entities
// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/subscriptions', function(req, res) {
    let query1 = "SELECT * FROM Subscriptions;"
    db.pool.query(query1, function(err, rows, fields){
        // Format date strings
        rows.forEach(element => {
            let stringDate = element.startDate.toISOString();
            element.startDate = stringDate.slice(0,10);
        });
        res.render('subscriptions', {subscriptions: rows});
    })
});

// CREATE Subscriptions
app.post('/subscriptions/add', function(req, res) {
    let subscriptions = req.body;

    // Error Handle
    let query = `INSERT INTO Subscriptions (subscriptionName, startDate, costPerMonth, creditsGivenPerMonth)
                 VALUES ('${subscriptions.subscriptionName}', '${subscriptions.startDate}', '${subscriptions.costPerMonth}', '${subscriptions.creditsGivenPerMonth}')`;
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/subscriptions');
        }
    });
})

// DELETE Subscriptions
app.post('/subscriptions/delete', function(req, res) {
    let subscriptions = req.body;
    let subscriptionID = parseInt(subscriptions.subscriptionID);

    // Error Handle
    let query = `DELETE FROM Subscriptions WHERE subscriptionID = '${subscriptionID}';`
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/subscriptions');
        }
    });
})

// Populate UPDATE Subscriptions Form
app.get('/subscriptions/:subscriptionID', function(req, res) {
    let subscriptionID = req.params.subscriptionID;
    let query1 = "SELECT * FROM Subscriptions;";
    let subQuery = `SELECT * FROM Subscriptions WHERE subscriptionID = ${subscriptionID}`

    db.pool.query(query1, function(err, rows, fields){
        let subscriptions = rows;
        // Format date for table
        subscriptions.forEach(element => {
            let stringDate = element.startDate.toISOString();
            element.startDate = stringDate.slice(0,10);
        });
        db.pool.query(subQuery, function(err, rows, fields) {
            if (rows.length === 0){
                console.log("Subscription Not Found.");
                res.sendStatus(404);
                return;
            }
            // Format date strings
            rows.forEach(element => {
                let stringDate = element.startDate.toISOString();
                element.startDate = stringDate.slice(0,10);
            });
            let subData = rows[0]
            return res.render('subscriptions', {subscriptions: subscriptions, subData: subData})
        })
    })

});

// UPDATE Subscriptions
app.post('/subscriptions/update', function(req, res) {
    let data = req.body;
    console.log(data);
    let costPerMonth = parseInt(data.costPerMonth);
    let creditsGivenPerMonth = parseInt(data.creditsGivenPerMonth);
    let query = `UPDATE Subscriptions SET subscriptionName = '${data.subscriptionName}', startDate = '${data.startDate}', costPerMonth = ${costPerMonth}, creditsGivenPerMonth = ${creditsGivenPerMonth} WHERE subscriptionID = ${data.subscriptionID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/subscriptions');
        }
    });
});


// ORGANIZATIONS -------------------------------
app.get('/organizations', function(req, res) {
    let query1 = 'SELECT * FROM Organizations;'
    let query2 = 'SELECT * FROM Subscriptions;'

    db.pool.query(query2, function(err, rows, fields) {
        let subscriptions = rows;
        db.pool.query(query1, function(err, rows, fields) {
            let organizations = rows;
            return res.render('organizations', {organizations: organizations, subscriptions: subscriptions});
        })
    })
});

// CREATE organizations
app.post('/organizations/add', function(req, res) {
    let organizations = req.body;

    // Error Handle
    let query = `INSERT INTO Organizations (organizationName, organizationDescription, subscriptionID)
                 VALUES ('${organizations.organizationName}', '${organizations.organizationDescription}', '${organizations.subscriptionID}')`;
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/organizations');
        }
    });
})

// DELETE organizations
app.post('/organizations/delete', function(req, res) {
    let organizations = req.body;
    let organizationID = parseInt(organizations.organizationID);

    // Error Handle
    let query = `DELETE FROM Organizations WHERE organizationID = '${organizationID}';`
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/organizations');
        }
    });
})

// Populate UPDATE organizations from
app.get('/organizations/:organizationID', function(req, res) {
    let organizationID = req.params.organizationID;
    console.log(organizationID);
    let orgQuery = `SELECT * FROM Organizations WHERE organizationID = ${organizationID}`;
    let query1 = 'SELECT * FROM Organizations;';
    let query2 = 'SELECT * FROM Subscriptions;';

    db.pool.query(query1, function(err, rows, fields){
        let organizations = rows;
        db.pool.query(query2, function(err, rows, fields){
            let subscriptions = rows;
            db.pool.query(orgQuery, function(err, rows, fields) {
                console.log(rows);
                if (rows.length === 0) {
                    console.log("Organization Not Found.");
                    res.sendStatus(404);
                    return;
                }

                // Get organization data to populate update form
                let orgData = rows[0];
                let orgSubscription = orgData.subscriptionID;
                console.log(orgSubscription);
                let query3 = `SELECT subscriptionName FROM Subscriptions WHERE subscriptionID = '${orgSubscription}'`;
                db.pool.query(query3, function(err, rows, fields){
                    console.log(rows);
                    orgData.subscriptionName = rows[0].subscriptionName;

                    return res.render('organizations', {orgData: orgData, organizations: organizations, subscriptions: subscriptions})
                })
            })
        })
    })
});

// UPDATE organizations
app.post("/organizations/update", function(req, res){
    let data = req.body;
    console.log(data);
    let query = `UPDATE Organizations SET organizationName = '${data.organizationName}', organizationDescription = '${data.organizationDescription}', subscriptionID = ${data.subscriptionID} WHERE organizationID = ${data.organizationID}`;

    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/organizations');
        }
    });
})

// GET Language Models
app.get('/languageModels', function(req, res) {
    let queryAllModels = 'SELECT * FROM LanguageModels;';
    db.pool.query(queryAllModels, function(err, models) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            let specificModelData = null;
            if (req.query.languageModelID) {
                let languageModelID = req.query.languageModelID;
                specificModelData = models.find(model => model.languageModelID.toString() === languageModelID);
            }
            res.render('languageModels', {
                models: models,
                modelData: specificModelData
            });
        }
    });
});

// ADD Language Model
app.post('/languageModels/add', function(req, res) {
    let { languageModelName, languageModelDescription, creditsPerToken } = req.body;
    let query = 'INSERT INTO LanguageModels (languageModelName, languageModelDescription, creditsPerToken) VALUES (?, ?, ?)';
    db.pool.query(query, [languageModelName, languageModelDescription, parseFloat(creditsPerToken)], function(error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/languageModels');
        }
    });
});

// DELETE Language Model
app.post('/languageModels/delete', function(req, res) {
    let { languageModelID } = req.body;
    let query = 'DELETE FROM LanguageModels WHERE languageModelID = ?';
    db.pool.query(query, [parseInt(languageModelID)], function(error, results) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            res.redirect('/languageModels');
        }
    });
});

// UPDATE Language Model
app.post('/languageModels/update', function(req, res) {
    let { languageModelID, languageModelName, languageModelDescription, creditsPerToken } = req.body;
    let query = `UPDATE LanguageModels SET languageModelName = ?, languageModelDescription = ?, creditsPerToken = ? WHERE languageModelID = ?`;
    db.pool.query(query, [languageModelName, languageModelDescription, parseFloat(creditsPerToken), parseInt(languageModelID)], function(error, results) {
        if (error) {
            console.log('SQL Error: ', error);
            res.sendStatus(400);
        } else {
            res.redirect('/languageModels');
        }
    });
});



// GET specific Language Model by ID
app.get('/languageModels/:languageModelID', function(req, res) {
    let languageModelID = req.params.languageModelID;
    let queryModel = 'SELECT * FROM LanguageModels WHERE languageModelID = ?;';
    let queryAllModels = 'SELECT * FROM LanguageModels;';

    db.pool.query(queryAllModels, function(err, models) {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            db.pool.query(queryModel, [languageModelID], function(err, result) {
                if (err) {
                    console.log(err);
                    res.sendStatus(500);
                } else if (result.length === 0) {
                    console.log("Language Model Not Found.");
                    res.sendStatus(404);
                } else {
                    let modelData = result[0];
                    res.render('languageModels', {
                        models: models,
                        modelData: modelData
                    });
                }
            });
        }
    });
});




// SUBSCRIPTION LANGUAGE MODELS -------------------------------
app.get('/subscriptionLanguageModels', function(req, res) {
    // Queries to fetch necessary names and details
    let queryModels = `SELECT sLM.subscriptionLanguageModelID, sLM.subscriptionID, sLM.languageModelID, 
                         s.subscriptionName AS subscription, l.languageModelName AS modelName
                       FROM SubscriptionLanguageModels sLM
                       JOIN Subscriptions s ON sLM.subscriptionID = s.subscriptionID
                       JOIN LanguageModels l ON sLM.languageModelID = l.languageModelID;`;
    let querySubscriptions = `SELECT * FROM Subscriptions;`;
    let queryLanguageModels = `SELECT * FROM LanguageModels;`;

    // Execute query for Subscriptions
    db.pool.query(querySubscriptions, function(err, subscriptions) {
        if (err) {
            console.error('Error fetching subscriptions:', err);
            return res.sendStatus(500); // Internal Server Error
        }

        // Execute query for Language Models
        db.pool.query(queryLanguageModels, function(err, languageModels) {
            if (err) {
                console.error('Error fetching language models:', err);
                return res.sendStatus(500);
            }

            // Execute query for Subscription Language Models
            db.pool.query(queryModels, function(err, subscriptionLanguageModels) {
                if (err) {
                    console.error('Error fetching subscription language models:', err);
                    return res.sendStatus(500);
                }

                // Render the page with all fetched data
                res.render('subscriptionLanguageModels', {
                    subscriptionLanguageModels: subscriptionLanguageModels,
                    subscriptions: subscriptions,
                    languageModels: languageModels
                });
            });
        });
    });
});



app.post('/subscriptionLanguageModels/add', function(req, res) {
    const { subscriptionID, languageModelID } = req.body;

    const query = `INSERT INTO SubscriptionLanguageModels (subscriptionID, languageModelID)
                   VALUES (?, ?);`;
    db.pool.query(query, [subscriptionID, languageModelID], function(error, results) {
        if (error) {
            console.error('Failed to add subscription language model:', error);
            res.status(400).send('Error adding new subscription language model');
        } else {
            console.log('Added new subscription language model:', results);
            res.redirect('/subscriptionLanguageModels');
        }
    });
});


app.post('/subscriptionLanguageModels/delete', function(req, res) {
    let subscriptionLanguageModelID = parseInt(req.body.subscriptionLanguageModelID);

    let query = `DELETE FROM SubscriptionLanguageModels WHERE subscriptionLanguageModelID = ${subscriptionLanguageModelID}`;
    db.pool.query(query, function(error) {
        if (error) {
            console.log(error);
            res.sendStatus(400);
        } else {
            return res.redirect('/subscriptionLanguageModels');
        }
    });
});


app.get('/subscriptionLanguageModels/:subscriptionLanguageModelID', function(req, res) {
    const subscriptionLanguageModelID = req.params.subscriptionLanguageModelID;
    
    // Query to fetch the specific Subscription Language Model with joined names for update form
    const querySLMData = `
        SELECT sLM.subscriptionLanguageModelID, sLM.subscriptionID, sLM.languageModelID, 
               s.subscriptionName, l.languageModelName
        FROM SubscriptionLanguageModels sLM
        JOIN Subscriptions s ON sLM.subscriptionID = s.subscriptionID
        JOIN LanguageModels l ON sLM.languageModelID = l.languageModelID
        WHERE sLM.subscriptionLanguageModelID = ?;
    `;

    // Query to fetch all Subscription Language Models for the table
    const queryAllSLMData = `
        SELECT sLM.subscriptionLanguageModelID, sLM.subscriptionID, sLM.languageModelID, 
               s.subscriptionName AS subscription, l.languageModelName AS modelName
        FROM SubscriptionLanguageModels sLM
        JOIN Subscriptions s ON sLM.subscriptionID = s.subscriptionID
        JOIN LanguageModels l ON sLM.languageModelID = l.languageModelID;
    `;

    // Queries to fetch all Subscriptions and Language Models for dropdowns
    const querySubscriptions = 'SELECT * FROM Subscriptions;';
    const queryLanguageModels = 'SELECT * FROM LanguageModels;';

    // Execute the query for all Subscription Language Models
    db.pool.query(queryAllSLMData, function(err, subscriptionLanguageModels) {
        if (err) {
            console.error('Error fetching subscription language models:', err);
            res.sendStatus(500); // Internal Server Error
            return;
        }

        // Execute the query for the specific Subscription Language Model
        db.pool.query(querySLMData, [subscriptionLanguageModelID], function(err, slmData) {
            if (err) {
                console.error('Error fetching specific subscription language model:', err);
                res.sendStatus(500);
                return;
            }

            // Execute the query for all Subscriptions
            db.pool.query(querySubscriptions, function(err, subscriptions) {
                if (err) {
                    console.error('Error fetching subscriptions:', err);
                    res.sendStatus(500);
                    return;
                }

                // Execute the query for all Language Models
                db.pool.query(queryLanguageModels, function(err, languageModels) {
                    if (err) {
                        console.error('Error fetching language models:', err);
                        res.sendStatus(500);
                        return;
                    }

                    // Render the page with all models and specific model data for forms
                    res.render('subscriptionLanguageModels', {
                        subscriptionLanguageModels: subscriptionLanguageModels,
                        slmData: slmData[0],  // for the update form
                        subscriptions: subscriptions,
                        languageModels: languageModels
                    });
                });
            });
        });
    });
});



app.post('/subscriptionLanguageModels/update', function(req, res) {
    const { subscriptionLanguageModelID, subscriptionID, languageModelID } = req.body;

    // Use parameterized queries here as well.
    const query = `UPDATE SubscriptionLanguageModels 
                   SET subscriptionID = ?, languageModelID = ? 
                   WHERE subscriptionLanguageModelID = ?;`;
    db.pool.query(query, [subscriptionID, languageModelID, subscriptionLanguageModelID], function(error, results) {
        if (error) {
            console.error('Failed to update subscription language model:', error);
            res.status(400).send('Error updating subscription language model');
        } else {
            console.log('Updated subscription language model:', results);
            res.redirect('/subscriptionLanguageModels');
        }
    });
});




// USERS -------------------------------
// READ User Data
app.get('/users', function(req, res) {
    let query1 = 'SELECT * FROM Users;';
    let query2 = 'SELECT * FROM Organizations;';
    let query3 = 'SELECT * FROM Subscriptions;';
    let errorMessage = req.query.errorMessage;
    db.pool.query(query1, function(err, rows, fields){
        let users = rows;
        db.pool.query(query2, function(err, rows, fields){
            let organizations = rows;
            db.pool.query(query3, function(err, rows, fields){
                let subscriptions = rows;
                return res.render('users', {data: users, organizations: organizations, subscriptions: subscriptions, errorMessage: errorMessage});
            })
        })
    })
});

// User Update page
app.get('/users/:userID', function(req, res) {
    let userID = req.params.userID;
    let userQuery = `SELECT * FROM Users WHERE userID = ${userID}`
    let query1 = 'SELECT * FROM Users;';
    let query2 = 'SELECT * FROM Organizations;';
    let query3 = 'SELECT * FROM Subscriptions;';
    db.pool.query(query1, function(err, rows, fields){
        let users = rows;
        db.pool.query(query2, function(err, rows, fields){
            let organizations = rows;
            db.pool.query(query3, function(err, rows, fields){
                let subscriptions = rows;
                db.pool.query(userQuery, function(err, rows, fields){
                    if (rows.length === 0) {
                        console.log("User Not Found.");
                        res.sendStatus(404);
                        return;
                    }
                    // Get Specific user data to populate update form
                    let userData = rows[0];
                    let userSubscription = userData.subscriptionID;
                    let userOrganization = userData.organizationID;
                    let querySubName;
                    let queryOrgName;
                    if (userSubscription !== null) {
                        querySubName = `SELECT subscriptionName FROM Subscriptions WHERE subscriptionID = ${userSubscription};`;
                    }
                    if (userOrganization !== null){
                        queryOrgName = `SELECT organizationName FROM Organizations WHERE organizationID = ${userOrganization};`;
                    }
                    db.pool.query(querySubName, function(err, rows, fields){
                        let userSubName;
                        if (userSubscription !== null) {
                            userSubName = rows[0].subscriptionName;
                        }
                        else {
                            userSubName = null
                        }
                        db.pool.query(queryOrgName, function(err, rows, fields){
                            let userOrgName;
                            console.log(userOrganization)
                            if (userOrganization !== null) {
                                userOrgName = rows[0].organizationName;
                            }
                            else {
                                userOrgName = null
                            }
                            userData.organizationName = userOrgName;
                            userData.subscriptionName = userSubName;
                            return res.render(
                                'users', 
                                {data: users, organizations: organizations, subscriptions: subscriptions, userData: userData});
                        })
                    })
                })           
            })
        })
    })
});


// UPDATE User Data
app.post('/users/update', function(req, res) {
    let data = req.body;
    console.log('data: ', data);
    let userID = data.userID;
    let organization = data.organization;
    if (organization == '' || organization == '0') {
        organization = null;
    }

    let subscription = data.subscription;
    if (subscription == '' || subscription == '0') {
        subscription = null;
    }

    // User cannot have an organization and subscription. At least 1 must be null
    if ((organization !== null && subscription !== null) || (organization === null && subscription === null)) {
        res.sendStatus(400);
        return;
    };

    let query = `UPDATE Users SET userName = '${data.username}', email = '${data.email}', password = '${data.password}', remainingCredits = ${data.remainingCredits}, organizationID = ${organization}, subscriptionID = ${subscription} WHERE userID = ${userID}`;
    db.pool.query(query, function(error, rows, fields) {
        if (error) {
            // Log error and redirect to entity page
            let errorMessage = encodeURIComponent(`Error: ${error.sqlMessage}. Please try again`);
            console.log(errorMessage);
            return res.redirect(`/users/?errorMessage=${errorMessage}`);
        } else {
            return res.redirect('/users');
        }
    });
});

// CREATE User data
app.post('/users/add', function(req, res) {

    let data = req.body;
    organization = data.organization;
    if (organization == '0') {
        organization = null;
    };

    subscription = data.subscription;
    if (subscription == '0') {
        subscription = null;
    };

    // User cannot have an organization and subscription. At least 1 must be null
    if ((organization !== null && subscription !== null) || (organization === null && subscription === null)) {
        res.sendStatus(400);
        return;
    };

    query1 = `INSERT INTO Users (userName, email, password, remainingCredits, organizationID, subscriptionID) 
              VALUES ('${data.username}', '${data.email}', '${data.password}', ${data.remainingCredits}, ${organization}, ${subscription})`
    db.pool.query(query1, function (error, rows, fields) {
        if (error) {
            // Log error and redirect to entity page
            let errorMessage = encodeURIComponent(`Error: ${error.sqlMessage}. Please try again`);
            console.log(errorMessage);

            return res.redirect(`/users/?errorMessage=${errorMessage}`);
        }
        else {
            return res.redirect('/users');
        }
    });
});


// DELTE User data
app.delete('/users/deleteAjax/', function(req, res, next) {
    let data = req.body;
    let userID = parseInt(data.id);
    let deleteUserQuery = `DELETE FROM Users WHERE userID = ?;`

    db.pool.query(deleteUserQuery, [userID], function(error, rows, fields){
        if (error) {
            console.log(error);
            res.sendStatus(400);
        }
        else {
            res.sendStatus(204);
        }
    })
})



// Citation for setup listener
// Adapted from Step 0 - Copied setup express/app declarations and listen method
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
// Date: 05/16/2024

// Listener
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});