# LLM Subscription Manager
LLM Subscription Manager is an application designed to support the LLM needs of organizations and users. This app allows users of organizations to choose between different language models (such as APIs from OpenAI, Claude, open source models running locally, etc.) in a subscription-based model.
The system is implemented to manage subscriptions by allocating funds to users in the form of credits, which can then be spent on queries to the LLM of their choice. By tracking the model usage of each user and organization, it allows them to optimize the cost using the subscription of their choice.


# Citations
The CS340 starter code was used as a template for:

* App.js for express setup, initial route setup, listener
  * Adapted from Step 0 - Copied setup express/app declarations and listen method
  * https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%200%20-%20Setting%20Up%20Node.js
  * Date: 05/16/2024
* Database/db-connector.js for the connection to mysql instance
  * Adapted from Step 1 - Copied db-connector.js for importing mysql and creating pool and adjusted with teams values
  * https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%201%20-%20Connecting%20to%20a%20MySQL%20Database
  * Date: 05/16/2024
* Handlebar files and structures and app.js for setting up express-handlebars
  * Adapted from Step 3 - Used main.hbs as a guide to create our hbs files 
  * https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%203%20-%20Integrating%20a%20Templating%20Engine%20(Handlebars)
  * Date: 05/24/2024
* Adding/Updating/Deleting/Dynamic display of data in handlebars files for the tables, and querying the database from app.js
  * Adapted from Step 4 - 8 - Based on table structures and form structures in hbs files, adapted the templates for querying data from database in route functions, Delete User from Ajax template used for delete_user.js
  * [https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%204%20-%20Dynamically%20Displaying%20Data](https://github.com/osu-cs340-ecampus/nodejs-starter-app)
  * Date: 05/24/2024 - 05/30-2024
