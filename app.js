
let express = require('express');
let app = express();
const path = require('path');
PORT = 9114;

app.use(express.static('public'))

// Routes
app.get('/', function(req, res) {
    const filePath = path.join(__dirname, 'public', 'users.html');
    res.sendFile(filePath);
});


// Listener
app.listen(PORT, () => {
    console.log('Express started on http://localhost:' + PORT + '; press Ctrl-C to terminate.')
});