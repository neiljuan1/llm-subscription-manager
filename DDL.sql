SET FOREIGN_KEY_CHECKS = 0;
SET AUTOCOMMIT = 0;

DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Organizations;
DROP TABLE IF EXISTS Subscriptions;
DROP TABLE IF EXISTS LanguageModels;
DROP TABLE IF EXISTS SubscriptionLanguageModels;


-- Create tables
CREATE TABLE Subscriptions(
	subscriptionID INT NOT NULL UNIQUE AUTO_INCREMENT,
	subscriptionName VARCHAR(100) NOT NULL,
	startDate DATE NOT NULL,
	costPerMonth DECIMAL(6,2) NOT NULL,
	creditsGivenPerMonth DECIMAL(12,2) NOT NULL,
	PRIMARY KEY (subscriptionID)
);

CREATE TABLE Organizations (
    organizationID INT UNIQUE NOT NULL AUTO_INCREMENT,
    subscriptionID INT NOT NULL,
    organizationName VARCHAR(100) NOT NULL,
    organizationDescription VARCHAR(100) NOT NULL,
    PRIMARY KEY (organizationID),
    FOREIGN KEY (subscriptionID) REFERENCES Subscriptions(subscriptionID) ON DELETE CASCADE
);

CREATE TABLE Users (
    userID INT NOT NULL UNIQUE AUTO_INCREMENT,
    organizationID INT,
    subscriptionID INT,
    userName VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    remainingCredits decimal(12,2) UNSIGNED NOT NULL,
    PRIMARY KEY (userID),
    FOREIGN KEY (organizationID) REFERENCES Organizations(organizationID)
        ON DELETE CASCADE,
    FOREIGN KEY (subscriptionID) REFERENCES Subscriptions(subscriptionID)
        ON DELETE CASCADE
);

CREATE TABLE LanguageModels(
	languageModelID INT NOT NULL UNIQUE AUTO_INCREMENT,
	creditsPerToken DECIMAL(6,2) NOT NULL,
	languageModelName VARCHAR(100) NOT NULL,
	languageModelDescription VARCHAR(100) NOT NULL,
	PRIMARY KEY (languageModelID)
);

CREATE TABLE SubscriptionLanguageModels (
    	subscriptionLanguageModelID INT NOT NULL AUTO_INCREMENT,
    	subscriptionID INT NOT NULL,
    	languageModelID INT NOT NULL,
    	PRIMARY KEY (subscriptionLanguageModelID),
    	FOREIGN KEY (subscriptionID) REFERENCES Subscriptions(subscriptionID)
			ON DELETE CASCADE,
    	FOREIGN KEY (languageModelID) REFERENCES LanguageModels(languageModelID)
        	ON DELETE CASCADE
);


-- Insert data into Subscriptions
INSERT INTO Subscriptions (subscriptionName, startDate, costPerMonth, creditsGivenPerMonth) VALUES
("CRL", "2023-12-27", 250, 1000000),
("ESL", "2024-03-01", 1000, 200000000),
("RAC", "2024-04-01", 5000, 500000000),
("barnes-indv", "2024-01-14", 40, 5000);


-- Insert data into LanguageModels
INSERT INTO LanguageModels (languageModelName, languageModelDescription, creditsPerToken) VALUES
("gpt-4-turbo", "General knowledge and domain epertise with vision model", 3),
("gpt-3.5 turbo", "Cost effective, general knowledge", 1),
("DALLE 3", "Generates images and art", 1),
("tts", "Text to speech converter", 10),
("whisper", "Speech to text converter", 10);


-- Insert data into Organizations
INSERT INTO Organizations (organizationID, organizationName, organizationDescription, subscriptionID)
VALUES
    (1, 'Combustion Research Lab', 'Combustion, particulate emissions, nanomaterial synthesis', 1),
    (2, 'Energy and Sustainability Lab', 'Research lab in the Engineering department focused on green energy', 2),
    (3, 'RRC AI Club', 'Student organization focused on Artificial Intelligence', 3);


-- Insert data into Users
INSERT INTO Users (userID, userName, email, password, remainingCredits, organizationID, subscriptionID)
VALUES
    (1, 'johnSmith', 'jsmith@gmail.com', 'eKv98W%p', 500000, 1, NULL),
    (2, 'kyleLowry', 'klowry@outlook.com', 'mJ%63\#d', 500000, 1, NULL),
    (3, 'kelvinLi', 'kli@gmail.com', 'We}7up.>', 1000000, 2, NULL),
    (4, 'aliZahir', 'azahir@gmail.com', 'Gx(-,6;&', 14000, 3, NULL),
    (5, 'scootBarnes', 'sbarnes@torontomu.ca', 'tor!2204', 5000, NULL, 4);


-- Insert data into bridge
INSERT INTO SubscriptionLanguageModels (subscriptionID, languagemodelID) VALUES 
(1, 2),
(2, 1),
(4, 4),
(3, 1),
(3, 5);


SET FOREIGN_KEY_CHECKS = 1;
COMMIT;
