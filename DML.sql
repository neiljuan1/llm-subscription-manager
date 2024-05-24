-- Group 74 LLM Subscription Manager
-- Neil Juan & Jacob Berger
-- DML Queries

-- ----------------- Home
-- Home page queries select queries
-- View for User to subscriptions
SELECT u.userName as "userName", o.organizationName as "organizationName", s.subscriptionName as "subscriptionName", s.startDate as "startDate", s.costPerMonth as "costPerMonth", s.creditsGivenPerMonth as "creditsGivenPerMonth"
FROM Users as u
LEFT JOIN Organizations as o ON u.organizationID = o.organizationID
LEFT JOIN Subscriptions as s ON u.subscriptionID = s.subscriptionID OR o.subscriptionID = s.subscriptionID;

-- View for subscriptions to Models
SELECT s.subscriptionName as "subscriptionName", s.creditsGivenPerMonth as "creditsGivenPerMonth", lm.languageModelName as "languageModelName", lm.languageModelDescription as "languageModelDescription", lm.creditsPerToken as "creditsPerToken"
FROM Subscriptions as s
INNER JOIN SubscriptionLanguageModels as slm ON s.subscriptionID = slm.subscriptionID
INNER JOIN LanguageModels as lm ON slm.languageModelID = lm.languageModelID;

-- View for Users' Models
SELECT u.userName, lm.languageModelName, s.subscriptionName
FROM SubscriptionLanguageModels as slm
INNER JOIN LanguageModels as lm ON slm.subscriptionLanguageModelID = lm.languageModelID
INNER JOIN Subscriptions as s ON slm.subscriptionID = s.subscriptionID
LEFT OUTER JOIN Organizations as o ON s.subscriptionID = o.subscriptionID
INNER JOIN Users as u ON s.subscriptionID = u.subscriptionID OR o.organizationID = u.organizationID
WHERE u.userName = :userName; -- Example username aliZahir

-- ----------------- Users
-- Users Table
SELECT * FROM Users;
 
-- Create new User. Values starting with colon (:) are variables from request.
INSERT INTO Users (userID, userName, email, password, remainingCredits, organizationID, subscriptionID)
VALUES
    (:userID, :username, :email, :password, :remainingCredits, :organizationID, :subscriptionID);
 
-- Update User. Values starting with colon (:) are variables from request.
UPDATE Users SET
    userName = :username,
    email = :email,
    password = :password,
    remainingCredits = :remainingCredits,
    organizationID = :organizationID,
    subscriptionID = :subscriptionID
WHERE Users.userID = :userID;

-- Delete User. Values starting with colon (:) are variables from request.
DELETE FROM Users WHERE User.userID = :userID;
DELETE FROM Users WHERE User.userName = :userName;

-- Populate User Update Form example, when selecting edit on the row. Will send userID
SELECT u.userName, u.email, u.password, u.remainingCredits, o.organizationName, s.subscriptionName
FROM Users as u
LEFT JOIN Organizations as o ON u.organizationID = o.organizationID
LEFT JOIN Subscriptions as s ON u.subscriptionID = s.subscriptionID or o.subscriptionID = s.subscriptionID
WHERE userID = :userID; -- example - :userID = 3

-- Populate Drop down user IDs/names for selection/deletion/updates
SELECT userID FROM Users;
SELECT userName FROM Users;
SELECT userID, userName FROM Users;

SELECT CONCAT(userID, '. ', userName)
FROM Users
WHERE userID = :userID;
SELECT * FROM Users WHERE userID = ${userID}

-- ----------------- Organizations
-- Organizations Table
SELECT * FROM Organizations;

-- Create new Organization. Values starting with colon (:) are variables from request.
INSERT INTO Organizations (organizationID, subscriptionID, organizationName, organizationDescription)
VALUES
    (:organizationID, :subscriptionID, :organizationName, :organizationDescription);

-- Update Organization. Values starting with colon (:) are variables from request.
UPDATE Organizations SET
    subscriptionID = :subscriptionID,
    organizationName = :organizationName,
    organizationDescription = :organizationDescription
WHERE Organizations.organizationID = :organizationID;

-- Delete Organization. Values starting with colon (:) are variables from request.
DELETE FROM Organizations WHERE Organizations.organizationID = :organizationID;

-- Populate Organization ID or name for drop downs for selection/deletion/updates
SELECT organizationID FROM Organizations;
SELECT organizationName FROM Organizations;
SELECT organizationID, organizationName FROM Organizations;

SELECT CONCAT(organizationID, '. ', organizationName)
FROM Organizations
WHERE organizationID = :organizationID;

-- Populate Organization Update Form example, when selecting edit on the row. Will send organizationID
SELECT o.organizationName, o.organizationDescription, s.subscriptionName
FROM Organizations as o
INNER JOIN Subscriptions as s ON o.subscriptionID = s.subscriptionID
WHERE organizationID = :organizationID; -- example - :organizationID = 3;
SELECT organizationName FROM Organizations WHERE organizationID = ${userOrganization};
SELECT * FROM Organizations WHERE organizationID = ${userOrganization};



-- ----------------- Subscriptions
-- Subscriptions Table
SELECT * FROM Subscriptions;

-- Create new Subscription. Values starting with colon (:) are variables from request.
INSERT INTO Subscriptions (subscriptionID, subscriptionName, startDate, costPerMonth, creditsGivenPerMonth)
VALUES
    (:subscriptionID, :subscriptionName, :startDate, :costPerMonth, :creditsGivenPerMonth);

-- Update Subscription. Values starting with colon (:) are variables from request.
UPDATE Subscriptions SET
    subscriptionName = :subscriptionName,
    startDate = :startDate,
    costPerMonth = :costPerMonth,
    creditsGivenPerMonth = :creditsGivenPerMonth
WHERE Subscriptions.subscriptionID = :subscriptionID;

-- Delete Subscription. Values starting with colon (:) are variables from request.
DELETE FROM Subscriptions WHERE Subscriptions.subscriptionID = :subscriptionID;

-- Populate Subscription ID or name for drop downs for selection/deletion/updates
SELECT subscriptionID FROM Subscriptions;
SELECT subscriptionName FROM Subscriptions;
SELECT subscriptionID, subscriptionName FROM Subscriptions;
SELECT subscriptionName FROM Subscriptions WHERE subscriptionID = ${userSubscription};
SELECT * FROM Subscriptions WHERE subscriptionID = ${userSubscription};

SELECT CONCAT(subscriptionID, '. ', subscriptionName)
FROM Subscriptions
WHERE subscriptionID = :subscriptionID;

-- Populate Subscription Update Form example, when selecting edit on the row. Will send subscriptionID
SELECT subscriptionName, startDate, costPerMonth, creditsGivenPerMonth
FROM Subscriptions
WHERE subscriptionID = :subscriptionID;  -- example - :subscriptionID = 2;


-- ----------------- Language Models
-- Language Models Table
SELECT * FROM LanguageModels;

-- Create new Language Model. Values starting with colon (:) are variables from request.
INSERT INTO LanguageModels (languageModelID, creditsPerToken, languageModelName, languageModelDescription)
VALUES
    (:languageModelID, :creditsPerToken, :languageModelName, :languageModelDescription);

-- Update Language Model. Values starting with colon (:) are variables from request.
UPDATE LanguageModels SET
    creditsPerToken = :creditsPerToken,
    languageModelName = :languageModelName,
    languageModelDescription = :languageModelDescription
WHERE LanguageModels.languageModelID = :languageModelID;

-- Delete Language Model. Values starting with colon (:) are variables from request.
DELETE FROM LanguageModels WHERE LanguageModels.languageModelID = :languageModelID;

-- Populate Language Model ID or name for drop downs for selection/deletion/updates
SELECT languageModelID FROM LanguageModels;
SELECT languageModelName FROM LanguageModels;
SELECT languageModelID, languageModelName FROM LanguageModels;

-- Populate Language Model Update Form example, when selecting edit on the row. Will send languageModelID
SELECT languageModelName, languageModelDescription, creditsPerToken
FROM LanguageModels
WHERE languageModelID = :languageModelID; -- example - :languageModelID = 4

SELECT CONCAT(languageModelID, '. ', languageModelName)
FROM LanguageModels
WHERE languageModelID = :languageModelID;

-- ----------------- Subscription Language Models Intersection table (M:N)
-- Subscription Language Models Table
SELECT * FROM SubscriptionLanguageModels;

-- Subscription Language Models Table with names
SELECT slm.subscriptionLanguageModelID, s.subscriptionID, lm.languageModelID, s.subscriptionName as "Subscription", lm.languageModelName as "Model Name"
FROM Subscriptions as s
INNER JOIN SubscriptionLanguageModels as slm ON s.subscriptionID = slm.subscriptionID
INNER JOIN LanguageModels as lm ON slm.languageModelID = lm.languageModelID;

-- Create new Subscription Language Model. Values starting with colon (:) are variables from request.
INSERT INTO SubscriptionLanguageModels (subscriptionLanguageModelID, subscriptionID, languageModelID)
VALUES
    (:subscriptionLanguageModelID, :subscriptionID, :languageModelID);

-- Update Subscription Language Model. Values starting with colon (:) are variables from request.
UPDATE SubscriptionLanguageModels SET
    subscriptionID = :subscriptionID,
    languageModelID = :languageModelID
WHERE SubscriptionLanguageModels.subscriptionLanguageModelID = :subscriptionLanguageModelID;

-- Delete Subscription Language Model. Values starting with colon (:) are variables from request.
DELETE FROM SubscriptionLanguageModels WHERE SubscriptionLanguageModels.subscriptionLanguageModelID = :subscriptionLanguageModelID;

-- Populate subscriptionLanguageModelID or name for drop downs for selection/deletion/updates
SELECT subscriptionLanguageModelID FROM SubscriptionLanguageModels;

-- Populate Subscription Language Model Update Form (M:N) example, when selecting edit on the row. Will send languageModelID
SELECT s.subscriptionID, s.subscriptionName, lm.languageModelID, lm.languageModelName
FROM Subscriptions as s
INNER JOIN SubscriptionLanguageModels as slm ON s.subscriptionID = slm.subscriptionID
INNER JOIN LanguageModels as lm ON slm.languageModelID = lm.languageModelID
WHERE slm.subscriptionLanguageModelID = :subscriptionLanguageModelID; -- example - :subscriptionLanguageModelID = 1
