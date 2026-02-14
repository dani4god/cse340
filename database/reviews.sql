-- =============================================
-- CSE Motors - Vehicle Reviews System
-- Database Setup
-- =============================================

-- Create the reviews table
CREATE TABLE IF NOT EXISTS public.review (
  review_id SERIAL PRIMARY KEY,
  review_text TEXT NOT NULL,
  review_rating INTEGER NOT NULL CHECK (review_rating >= 1 AND review_rating <= 5),
  inv_id INTEGER NOT NULL,
  account_id INTEGER NOT NULL,
  review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  review_status VARCHAR(20) DEFAULT 'pending',
  FOREIGN KEY (inv_id) REFERENCES inventory(inv_id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES account(account_id) ON DELETE CASCADE,
  CONSTRAINT unique_user_vehicle_review UNIQUE (inv_id, account_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_review_inv_id ON review(inv_id);
CREATE INDEX IF NOT EXISTS idx_review_account_id ON review(account_id);
CREATE INDEX IF NOT EXISTS idx_review_status ON review(review_status);

-- Add some sample reviews (optional - for testing)
-- Make sure to use actual inv_id and account_id from your database

-- Example:
-- INSERT INTO review (review_text, review_rating, inv_id, account_id, review_status)
-- VALUES 
-- ('Great car! Very reliable and comfortable.', 5, 1, 1, 'approved'),
-- ('Good value for money. Fuel efficient.', 4, 1, 2, 'approved'),
-- ('Decent vehicle but could use better features.', 3, 2, 1, 'approved');

-- View to get review statistics per vehicle
CREATE OR REPLACE VIEW vehicle_review_stats AS
SELECT 
  inv_id,
  COUNT(*) as total_reviews,
  AVG(review_rating) as average_rating,
  COUNT(*) FILTER (WHERE review_rating = 5) as five_star_count,
  COUNT(*) FILTER (WHERE review_rating = 4) as four_star_count,
  COUNT(*) FILTER (WHERE review_rating = 3) as three_star_count,
  COUNT(*) FILTER (WHERE review_rating = 2) as two_star_count,
  COUNT(*) FILTER (WHERE review_rating = 1) as one_star_count
FROM review
WHERE review_status = 'approved'
GROUP BY inv_id;

COMMENT ON TABLE review IS 'Customer reviews for vehicles';
COMMENT ON COLUMN review.review_status IS 'Status: pending, approved, rejected';
