-- Thêm dữ liệu vào bảng Delivery
INSERT INTO Delivery (name, description, price) VALUES 
('Standard', 'Standard delivery', 5),
('Express', 'Express delivery', 10);

-- Thêm dữ liệu vào bảng Category
INSERT INTO Category (name, categoryId, image) VALUES 
('Electronics', NULL, null),
('Clothing', NULL, null),
('Books', NULL, null);

-- Thêm dữ liệu vào bảng Role
INSERT INTO Role (name) VALUES 
('Admin'),
('User');

-- Thêm dữ liệu vào bảng User
INSERT INTO [User] (firstname, lastname, CMND, email, phone, isEmailActive, isPhoneActive, hashed_password, role) VALUES 
('John', 'Doe', '123456789', 'john@example.com', '123456789', 1, 1, 'hashed_password_admin', 1),
('Alice', 'Smith', '987654321', 'alice@example.com', '987654321', 1, 1, 'hashed_password_user', 2);

-- Thêm dữ liệu vào bảng Product
INSERT INTO Product (name, description, price, promotionalPrice, quantity, sold, Image, categoryId) VALUES 
('Laptop', 'High performance laptop', 1000, 900, 50, 10, null, 1),
('T-shirt', 'Cotton T-shirt', 20, 15, 100, 50, null, 2),
('Book', 'Bestseller book', 30, 25, 200, 100, null, 3);

-- Thêm dữ liệu vào bảng UserFollowProduct (có thể thay đổi tùy thuộc vào dữ liệu mẫu bạn muốn tạo)
INSERT INTO UserFollowProduct (userId, productId) VALUES 
(1, 1),
(1, 3),
(2, 2);

-- Thêm dữ liệu vào bảng Review (có thể thay đổi tùy thuộc vào dữ liệu mẫu bạn muốn tạo)
INSERT INTO Review (userId, productId, content, stars) VALUES 
(1, 1, 'Great laptop', 5),
(2, 2, 'Nice T-shirt', 4),
(1, 3, 'Interesting book', 4);

-- Thêm dữ liệu vào bảng Orders (có thể thay đổi tùy thuộc vào dữ liệu mẫu bạn muốn tạo)
INSERT INTO Orders (userId, deliveryId, address, phone, status, isPaidBefore, moneyFromUser) VALUES 
(1, 1, '123 Main Street', '123456789', 'shipped', 1, 1000),
(2, 2, '456 Oak Avenue', '987654321', 'not processed', 0, 200);

-- Thêm dữ liệu vào bảng OrderItem (có thể thay đổi tùy thuộc vào dữ liệu mẫu bạn muốn tạo)
INSERT INTO OrderItem (orderId, productId, count) VALUES 
(1, 1, 2),
(1, 2, 3),
(2, 3, 1);

-- Thêm dữ liệu vào bảng Cart (có thể thay đổi tùy thuộc vào dữ liệu mẫu bạn muốn tạo)
INSERT INTO Cart (userId, totalPrice, totalQuantity) VALUES 
(1, 1500, 5),
(2, 50, 4);

-- Thêm dữ liệu vào bảng CartItem (có thể thay đổi tùy thuộc vào dữ liệu mẫu bạn muốn tạo)
INSERT INTO CartItem (cartId, productId, count) VALUES 
(1, 1, 1),
(1, 2, 2),
(2, 3, 1);
