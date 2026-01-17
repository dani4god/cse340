-- ============================================
-- DATABASE SETUP - Create Tables
-- ============================================

-- Create account_type enum type 
DO $$ BEGIN
    CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create classification table
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL
);

-- Create account table
CREATE TABLE IF NOT EXISTS account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(255) NOT NULL,
    account_type account_type DEFAULT 'Client'
);

-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INTEGER NOT NULL,
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(255) NOT NULL,
    inv_thumbnail VARCHAR(255) NOT NULL,
    inv_price DECIMAL(10,2) NOT NULL,
    inv_miles INTEGER NOT NULL,
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER NOT NULL,
    FOREIGN KEY (classification_id) REFERENCES classification(classification_id)
);

-- Insert sample data into classification table
INSERT INTO classification (classification_name) VALUES
('Sport'),
('SUV'),
('Truck'),
('Sedan'),
('Custom');

-- Insert sample data into inventory table
INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES
('GM', 'Hummer', 2016, 'This is a Hummer vehicle with small interiors and great power.', '/images/hummer.jpg', '/images/hummer-tn.jpg', 35000.00, 45000, 'Yellow', 2),
('Chevy', 'Camaro', 2018, 'Fast and sporty car perfect for racing.', '/images/camaro.jpg', '/images/camaro-tn.jpg', 42000.00, 18000, 'Red', 1),
('Ford', 'Mustang', 2019, 'Classic American muscle car.', '/images/mustang.jpg', '/images/mustang-tn.jpg', 38000.00, 22000, 'Blue', 1);

-- ============================================
-- TASK 1 QUERIES
-- ============================================

-- Task 1: Insert new record for Tony Stark

INSERT INTO account (account_firstname, account_lastname, account_email, account_password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Task 2: Modify Tony Stark record to change account_type to "Admin"
-- Using account_id (primary key) as identifier

UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- Task 3: Delete the Tony Stark record from the database
-- Using account_id (primary key) as identifier
-- NOTE: Replace '1' with the actual account_id value after running the INSERT query
DELETE FROM account
WHERE account_id = 1;

-- Task 4: Modify GM Hummer description to replace "small interiors" with "a huge interior"
-- Using REPLACE function to update only the specific text
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Task 5: Select make, model, and classification name for Sport category items
-- Using INNER JOIN between inventory and classification tables
SELECT inv_make, inv_model, classification_name
FROM inventory
INNER JOIN classification ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

-- Task 6: Update all inventory records to add "/vehicles" to image paths
-- Using REPLACE function to insert "/vehicles" in the middle of the file path
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');

