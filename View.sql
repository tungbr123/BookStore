--danh sách các product có trong hệ thống
CREATE VIEW vw_ProductList AS
SELECT p.id AS ProductId, p.name AS ProductName, p.description AS ProductDescription,
       p.price AS ProductPrice, p.promotionalPrice AS ProductPromotionalPrice,
       p.quantity AS ProductQuantity, p.sold AS ProductSold, p.Image AS ProductImage,
       c.id AS CategoryId, c.name AS CategoryName, c.categoryId AS ParentCategoryId,
       c.image AS CategoryImage
FROM Product p
INNER JOIN Category c ON p.categoryId = c.id;

--Danh sách người dùng với vai trò và số lượng đơn hàng của người dùng
CREATE VIEW vw_UserOrderCount AS
SELECT u.id AS UserId, u.firstname AS FirstName, u.lastname AS LastName, u.email AS Email,
       r.name AS Role, COUNT(o.id) AS OrderCount
FROM [User] u
INNER JOIN Role r ON u.role = r.id
LEFT JOIN Orders o ON u.id = o.userId
GROUP BY u.id, u.firstname, u.lastname, u.email, r.name;

--Danh sách đánh giá sản phẩm với thông tin người dùng
CREATE	 VIEW vw_ProductReviews AS
SELECT r.id AS ReviewId, p.id AS ProductId, p.name AS ProductName, r.content AS ReviewContent,
       r.stars AS ReviewStars, u.id AS UserId, u.firstname AS FirstName, u.lastname AS LastName
FROM Review r
INNER JOIN [User] u ON r.userId = u.id
INNER JOIN Product p ON r.productId = p.id;

--Danh sách đơn hàng và thông tin người dùng và sản phẩm
CREATE VIEW vw_OrderDetails AS
SELECT o.id AS OrderId, o.userId AS UserId, u.firstname AS FirstName, u.lastname AS LastName,
       u.email AS Email, o.address AS Address, o.phone AS Phone, o.status AS Status,
       oi.productId AS ProductId, p.name AS ProductName, oi.count AS Quantity,
       oi.count * p.price AS TotalPrice
FROM Orders o
INNER JOIN [User] u ON o.userId = u.id
INNER JOIN OrderItem oi ON o.id = oi.orderId
INNER JOIN Product p ON oi.productId = p.id;

--Tổng số lượng sản phẩm đã bán cho mỗi sản phẩm
CREATE VIEW vw_ProductSales AS
SELECT p.id AS ProductId, p.name AS ProductName, SUM(oi.count) AS TotalSold
FROM Product p
INNER JOIN OrderItem oi ON p.id = oi.productId
INNER JOIN Orders o ON oi.orderId = o.id
WHERE o.status = 'delivered'
GROUP BY p.id, p.name;

--Số lượng đơn hàng xác nhận và chưa xác nhận
CREATE VIEW vw_OrderStatusCount AS
SELECT status AS OrderStatus, COUNT(*) AS TotalOrders
FROM Orders
GROUP BY status;

