// Citation Ajax
// Deleting a User using Ajax
// Adapted from Step 7 - Delete User from Ajax template used for delete_user.js based on Dynamically Deleting Data.
// https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
// Date: 05/24/2024

function deleteUser(userID) {
    // Put our data we want to send in a javascript object
    let data = {
        id: userID
    };
    console.log(data);

    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/users/deleteAjax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    console.log(xhttp.readyState);
    console.log(xhttp.status);


    // Tell our ajax request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            deleteRow(userID);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log('There was a problem with the input.');
        }
    }
    // Send request and wait for response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(userID) {
    let table = document.getElementById('user-table');
    for (let i = 0, row; row = table.rows[i]; i++) {
        // iterate through rows
        // rows would be accessed using the "row" variable assigned in the for loop
        if (table.rows[i].getAttribute("data-value") == userID) {
            table.deleteRow(i);
            break;
        }
    }
}