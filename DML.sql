-- Group 74 LLM Subscription Manager
-- Neil Juan & Jacob Berger
-- DML Queries


-- Home page queries select queries
-- View for User to subscriptions
SELECT u.userName as "User", o.organizationName as "Organization", s.subscriptionName as "Subscription", s.startDate as "Start Date", s.costPerMonth as "Monthly Cost", s.creditsGivenPerMonth as "Credits Given per Month"
FROM Users as u
LEFT JOIN Organizations as o ON u.organizationID = o.organizationID
LEFT JOIN Subscriptions as s ON u.subscriptionID = s.subscriptionID OR o.subscriptionID = s.subscriptionID;

-- View for subscriptions to Models
SELECT s.subscriptionName as "Subscription", s.creditsGivenPerMonth as "Credits Given per Month", lm.languageModelName as "Model Name", lm.languageModelDescription as "Model Description", lm.creditsPerToken as "Credits per Token"
FROM Subscriptions as s
INNER JOIN SubscriptionLanguageModels as slm ON s.subscriptionID = slm.subscriptionID
INNER JOIN LanguageModels as lm ON slm.languageModelID = lm.languageModelID;






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
DELETE FROM Users WHERE User.userID = :userID



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



-- Subscription Language Models Table
SELECT * FROM SubscriptionLanguageModels;

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
