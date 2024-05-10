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