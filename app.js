
// Credit for setup and ajax from nodejs-starter template
let express = require('express');
let app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
const path = require('path');
PORT = 9000;

// database
let db = require('./database/db-connector.js');

// templating engine
const { engine } = require('express-handlebars');  // Import engine function from express handlebars module
var exphbs = require('express-handlebars');  // Import express-handlebars
const { errorMonitor } = require('events');
app.engine('.hbs', engine({extname: ".hbs", partialsDir:[path.join(__dirname, 'views/partials')]})); // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use handlebars engine whenever it encounters .hbs file

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/index', function(req, res) {
    res.render('index');
});

app.get('/languageModels', function(req, res) {
    res.render('languageModels');
});

app.get('/languageModels/edit', function(req, res) {
    res.render('editLanguageModels');
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


app.get('/subscriptions/:subscriptionID', function(req, res) {
    let subscriptionID = req.params.subscriptionID;
    let query1 = "SELECT * FROM Subscriptions;";
    let subQuery = `SELECT * FROM Subscriptions WHERE subscriptionID = ${subscriptionID}`

    db.pool.query(query1, function(err, rows, fields){
        let subscriptions = rows;
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

app.get('/subscriptionLanguageModels', function(req, res) {
    res.render('subscriptionLanguageModels');
});

app.get('/subscriptionLanguageModels/edit', function(req, res) {
    res.render('editSubscriptionLanguageModels');
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




// Listener
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});