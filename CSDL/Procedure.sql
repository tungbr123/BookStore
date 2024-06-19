--Tạo mã salt để băm mật khẩu
CREATE PROCEDURE dbo.GenerateSalt
    @length INT,
    @salt NVARCHAR(255) OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @characters CHAR(36)
    SET @characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    DECLARE @i INT = 1
    SET @salt = ''
    WHILE @i <= @length
    BEGIN
        DECLARE @index INT
        SET @index = CEILING(RAND() * LEN(@characters))
        SET @salt = @salt + SUBSTRING(@characters, @index, 1)
        SET @i = @i + 1
    END
END;
DECLARE @inputPassword NVARCHAR(100) = '123'
DECLARE @saltt NVARCHAR(255) = '8803QAS5BK1NRTXEH6VLBQE4ZC6A4F4Q' -- Salt được lấy từ cơ sở dữ liệu
DECLARE @hashedInputPassword NVARCHAR(255)

-- Hash mật khẩu nhập vào
SET @hashedInputPassword = @inputPassword + @saltt
SELECT @hashedInputPassword
-- So sánh hashed_password mới với hashed_password trong cơ sở dữ liệu
IF EXISTS (SELECT * FROM [User] WHERE hashed_password = @hashedInputPassword)
BEGIN
    -- Mật khẩu nhập vào đúng
    PRINT 'Correct password'
END
ELSE
BEGIN
    -- Mật khẩu nhập vào sai
    PRINT 'Incorrect password'
END
-- Tạo người dùng mới 
CREATE PROCEDURE sp_AddUser
    @firstname VARCHAR(32),
    @lastname VARCHAR(32),
    @CMND VARCHAR(20),
    @email VARCHAR(255),
    @phone VARCHAR(20),
	@password varchar(255),
    @role INT,
    @address VARCHAR(200),
    @avatar VARCHAR(255),
    @cover VARCHAR(255)
AS
BEGIN
    INSERT INTO [User] (firstname, lastname, CMND, email, phone, hashed_password, [role], [address], avatar, cover)
    VALUES (@firstname, @lastname, @CMND, @email, @phone, @password, @role, @address, @avatar, @cover)
END;
--Xóa người dùng mới
CREATE PROCEDURE sp_DeleteUser
    @userId INT
AS
BEGIN
    DELETE FROM [User]
    WHERE id = @userId
END;
--Sửa thông tin người dùng
CREATE PROCEDURE sp_UpdateUser
    @userId INT,
    @firstname VARCHAR(32),
    @lastname VARCHAR(32),
    @CMND VARCHAR(20),
    @email VARCHAR(255),
    @phone VARCHAR(20),
	@password varchar(255),
    @role INT,
    @address VARCHAR(200),
    @avatar VARCHAR(255),
    @cover VARCHAR(255)
AS
BEGIN
    UPDATE [User]
    SET firstname = @firstname,
        lastname = @lastname,
        CMND = @CMND,
        email = @email,
        phone = @phone,
		hashed_password=@password,
        [role] = @role,
        [address] = @address,
        avatar = @avatar,
        cover = @cover
    WHERE id = @userId
END;

--Thêm một đánh giá mới
CREATE PROCEDURE sp_AddReview
    @userId INT,
    @productId INT,
    @content VARCHAR(1000),
    @stars INT
AS
BEGIN
    INSERT INTO Review (userId, productId, content, stars)
    VALUES (@userId, @productId, @content, @stars)
END;

--Lấy thông tin đơn hàng của một người dùng
CREATE PROCEDURE sp_GetUserOrders
    @userId INT
AS
BEGIN
    SELECT *
    FROM Orders
    WHERE userId = @userId
END;

--Lấy danh sách các sản phẩm trong giỏ hàng của người dùng
CREATE PROCEDURE sp_GetUserCartItems
    @userId INT
AS
BEGIN
    SELECT ci.*, p.name AS productName, p.price AS productPrice
    FROM CartItem ci
    INNER JOIN Product p ON ci.productId = p.id
    WHERE ci.cartId = (SELECT id FROM Cart WHERE userId = @userId)
END;

--Lấy thông tin chi tiết về một sản phẩm
CREATE PROCEDURE sp_GetProductDetails
    @productId INT
AS
BEGIN
    SELECT *
    FROM Product
    WHERE id = @productId
END;

--Thêm một sản phẩm vào giỏ hàng của người dùng
CREATE PROCEDURE sp_AddToCart
    @userId INT,
    @productId INT,
    @count INT
AS
BEGIN
    INSERT INTO CartItem (cartId, productId, count)
    VALUES ((SELECT id FROM Cart WHERE userId = @userId), @productId, @count)
END;

--Xóa một sản phẩm khỏi giỏ hàng của người dùng
CREATE PROCEDURE sp_RemoveFromCart
    @userId INT,
    @productId INT
AS
BEGIN
    DELETE FROM CartItem
    WHERE cartId = (SELECT id FROM Cart WHERE userId = @userId)
    AND productId = @productId
END;

--Cập nhật lại trạng thái của đơn hàng
CREATE PROCEDURE sp_UpdateOrderStatus
    @orderId INT,
    @status VARCHAR(20)
AS
BEGIN
    UPDATE Orders
    SET status = @status
    WHERE id = @orderId
END;

--Theo dõi một sản phẩm 
CREATE PROCEDURE sp_FollowProduct
    @userId INT,
    @productId INT
AS
BEGIN
    INSERT INTO UserFollowProduct (userId, productId)
    VALUES (@userId, @productId)
END;

--Hủy theo dõi sản phẩm
CREATE PROCEDURE sp_UnfollowProduct
    @userId INT,
    @productId INT
AS
BEGIN
    DELETE FROM UserFollowProduct
    WHERE userId = @userId AND productId = @productId
END;

--Thêm một sản phẩm mới
CREATE PROCEDURE sp_AddProduct
    @name VARCHAR(100),
    @description VARCHAR(1000),
    @price INT,
    @promotionalPrice INT,
    @quantity INT,
    @categoryId INT
AS
BEGIN
    INSERT INTO Product (name, description, price, promotionalPrice, quantity, categoryId)
    VALUES (@name, @description, @price, @promotionalPrice, @quantity, @categoryId)
END;

--Xóa sản phẩm
CREATE PROCEDURE sp_DeleteProduct
    @productId INT
AS
BEGIN
    DELETE FROM Product
    WHERE id = @productId
END;
--Cập nhật sản phẩm
CREATE PROCEDURE sp_UpdateProduct
    @productId INT,
    @name VARCHAR(100),
    @description VARCHAR(1000),
    @price INT,
    @promotionalPrice INT,
	@Image varchar(max),
    @quantity INT,
    @categoryId INT
AS
BEGIN
    UPDATE Product
    SET name = @name, description = @description, price = @price,
        promotionalPrice = @promotionalPrice, [Image]=@Image, quantity = @quantity,
        categoryId = @categoryId
    WHERE id = @productId
END;








--




