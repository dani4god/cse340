
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

