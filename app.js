
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
app.engine('.hbs', engine({extname: ".hbs", partialsDir:[path.join(__dirname, 'views/partials')]})); // Create an instance of the handlebars engine to process templates
app.set('view engine', '.hbs');                 // Tell express to use handlebars engine whenever it encounters .hbs file

// Routes
app.get('/', function(req, res) {
    res.render('index');
});

app.get('/users', function(req, res) {
    let query1 = 'SELECT * FROM Users;';
    db.pool.query(query1, function(err, rows, fields){
        let users = rows;
        return res.render('users', {data: users});
    })
});


app.get('/edit-user-form', function(req, res) {
    let query1 = 'SELECT * FROM Users;';
    let query2 = 'SELECT * FROM Organizations;';
    let query3 = 'SELECT * FROM Subscriptions;';
    db.pool.query(query1, function(err, rows, fields){
        let users = rows;
        db.pool.query(query2, function(err, rows, fields){
            let organizations = rows;

            db.pool.query(query3, function(err, rows, fields){
                let subscriptions = rows;
                return res.render('editUsers', {data: users, organizations: organizations, subscriptions: subscriptions});
            })
        })
    })
});

app.get('/edit-user-form/:userID', function(req, res) {
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
                    let userData = rows[0];
                    console.log(userData);
                    let userSubscription = userData.subscriptionID;
                    let userOrganization = userData.organizationID;
                    console.log(userSubscription);
                    console.log(userOrganization);
                    let querySubName;
                    let queryOrgName;
                    if (userSubscription !== null) {
                        querySubName = `SELECT subscriptionName FROM Subscriptions WHERE subscriptionID = ${userSubscription};`;
                    }
                    if (userOrganization !== null){
                        queryOrgName = `SELECT organizationName FROM Organizations WHERE organizationID = ${userOrganization};`;
                    }
                    console.log(queryOrgName);
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
                                'editUsers', 
                                {data: users, organizations: organizations, subscriptions: subscriptions, userData: userData});
                        })
                    })
                })           
            })
        })
    })
});

app.post('/add-user-form', function(req, res) {

    let data = req.body;
    organization = data.organization;
    if (organization == '0') {
        organization = null;
    };

    subscription = data.subscription;
    if (subscription == '0') {
        subscription = null;
    };

    query1 = `INSERT INTO Users (userName, email, password, remainingCredits, organizationID, subscriptionID) 
              VALUES ('${data.username}', '${data.email}', '${data.password}', ${data.remainingCredits}, ${organization}, ${subscription})`
    db.pool.query(query1, function (error, rows, fields) {

        if (error) {

            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else {
            return res.redirect('/users');
        }
    });
});


app.delete('/delete-user-ajax/', function(req, res, next) {
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