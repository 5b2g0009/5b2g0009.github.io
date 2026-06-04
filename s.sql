CREATE TABLE scores(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    score INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);