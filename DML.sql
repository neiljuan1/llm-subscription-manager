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


-- ----------------- Users
-- Users Table for the Users page
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
WHERE userID = 3; -- userID = :userID

-- Populate Drop down user IDs/names for selection/deletion/updates
SELECT userID FROM Users;
SELECT userName FROM Users;
SELECT userID, userName FROM Users;


-- ----------------- Organizations

-- Populate Organization ID or name for drop downs for selection/deletion/updates
SELECT organizationID FROM Organizations;
SELECT organizationName FROM Organizations;
SELECT organizationID, organizationName FROM Organizations;

-- Populate Organization Update Form example, when selecting edit on the row. Will send organizationID
SELECT o.organizationName, o.organizationDescription, s.subscriptionName
FROM Organizations as o
INNER JOIN Subscriptions as s ON o.subscriptionID = s.subscriptionID
WHERE organizationID = 3;


-- ----------------- Subscriptions
-- Populate Subscription ID or name for drop downs for selection/deletion/updates
SELECT subscriptionID FROM Subscriptions;
SELECT subscriptionName FROM Subscriptions;
SELECT subscriptionID, subscriptionName FROM Subscriptions;
