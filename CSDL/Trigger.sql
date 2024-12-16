--Order
--1 Trigger cập nhật lại số lượng sách đã bán trong table product khi một đơn hàng chuyển sang trạng thái delivered
CREATE TRIGGER trg_UpdateProductSold
ON Orders
AFTER UPDATE
AS
BEGIN
IF EXISTS (SELECT 1 FROM inserted WHERE [status] = 'delivered')
    BEGIN
        -- Khai báo biến
        DECLARE @orderid INT
        DECLARE @productId INT
        DECLARE @quantity INT
        -- Khai báo cursor để lặp qua các mặt hàng trong đơn hàng
        DECLARE order_cursor CURSOR FOR
        SELECT oi.orderId, oi.productId, oi.count
        FROM inserted i
        INNER JOIN OrderItem oi ON i.id = oi.orderId
        WHERE i.[status] = 'delivered'
        -- Mở cursor
        OPEN order_cursor
        -- Fetch dữ liệu đầu tiên từ cursor
        FETCH NEXT FROM order_cursor INTO @orderid, @productId, @quantity
        -- Bắt đầu vòng lặp
        WHILE @@FETCH_STATUS = 0
        BEGIN
            -- Cập nhật số lượng đã bán cho sản phẩm tương ứng
            UPDATE Product
            SET sold = sold + @quantity
            WHERE id = @productId

			UPDATE Product
            SET quantity = quantity - @quantity
            WHERE id = @productId
            -- Fetch dữ liệu tiếp theo từ cursor
            FETCH NEXT FROM order_cursor INTO @orderid, @productId, @quantity
        END
        -- Đóng cursor
        CLOSE order_cursor
        DEALLOCATE order_cursor
    END
END;
--2 Trigger đảm bảo trạng thái đơn hàng chỉ nằm trong các khoảng 'not processed', 'in process' và 'delivered'
CREATE TRIGGER trg_EnsureValidStatus
ON Orders
AFTER UPDATE
AS
BEGIN
    UPDATE Orders
    SET status = 'not processed'
    WHERE status NOT IN ('not processed', 'in process', 'delivered')
END;


--User
--1 Hàm tạo hash và salt cho mật khẩu khi thêm mới người dùng
ALTER TRIGGER trg_GeneratePasswordHashSalt
ON [User]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @userId INT
    DECLARE @salt NVARCHAR(255)
    DECLARE @hashedPassword NVARCHAR(255)
    -- Lặp qua từng người dùng mới được thêm vào
    DECLARE user_cursor CURSOR FOR
    SELECT id FROM inserted
    OPEN user_cursor
    FETCH NEXT FROM user_cursor INTO @userId
    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Lấy mật khẩu của người dùng
        DECLARE @userPassword NVARCHAR(255)
        SELECT @userPassword = hashed_password FROM inserted WHERE id = @userId
        
        -- Tạo salt cho mật khẩu
        EXEC dbo.GenerateSalt @length = 32, @salt = @salt OUTPUT
        
        -- Tạo hash mật khẩu từ salt và mật khẩu của người dùng
        SET @hashedPassword = HASHBYTES('MD5',@userPassword + @salt)
        UPDATE [User]
        SET salt = @salt,
            hashed_password = @hashedPassword
        WHERE id = @userId
        
        FETCH NEXT FROM user_cursor INTO @userId
    END
    CLOSE user_cursor
    DEALLOCATE user_cursor
END;


--2 Kiểm tra tính duy nhất của mail người dùng khi mới thêm vào
CREATE TRIGGER trg_CheckUniqueEmail
ON [User]
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
    -- Kiểm tra sự duy nhất của email trong bảng User
    IF EXISTS (SELECT 1 FROM [User] u INNER JOIN inserted i ON u.email = i.email WHERE u.id <> i.id)
    BEGIN
        -- Nếu tồn tại email trùng lặp, rollback và thông báo lỗi
        RAISERROR('Email must be unique.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END
--3 Đặt giá trị mặc định cho cột role là 1
CREATE TRIGGER trg_SetDefaultValues
ON [User]
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    -- Thiết lập giá trị mặc định cho các cột
    UPDATE [User]
    SET role = 1
    WHERE id IN (SELECT id FROM inserted)
END;

--Product
--1 Xóa các product có liên quan đến bảng cartitem,orderitem,review,userfollowproduct
CREATE TRIGGER trg_DeleteRelatedData
ON Product
INSTEAD OF DELETE
AS
BEGIN
    SET NOCOUNT ON;

    -- Xóa các mục đơn hàng (OrderItem) liên quan đến sản phẩm sẽ bị xóa
    DELETE FROM OrderItem
    WHERE productId IN (SELECT id FROM deleted);

    -- Xóa các đánh giá (Review) liên quan đến sản phẩm sẽ bị xóa
    DELETE FROM Review
    WHERE productId IN (SELECT id FROM deleted);

    -- Cập nhật các giỏ hàng (CartItem) mà chứa sản phẩm sẽ bị xóa để không còn liên kết với sản phẩm đó
    DELETE CartItem
    WHERE productId IN (SELECT id FROM deleted);

    -- Xóa các sản phẩm liên quan từ bảng UserFollowProduct
    DELETE FROM UserFollowProduct
    WHERE productId IN (SELECT id FROM deleted);

	DELETE FROM Product
    WHERE id IN (SELECT id FROM deleted);
END;

--CartItem
--1 Cập nhật lại số lượng và tổng trị giá của giỏ hàng khi một đơn hàng bị hủy
CREATE TRIGGER trg_UpdateCart
ON CartItem
AFTER INSERT, DELETE, UPDATE
AS
BEGIN
    DECLARE @cartId INT
    IF EXISTS(SELECT 1 FROM inserted)
    BEGIN
        SELECT @cartId = cartId FROM inserted
    END
    -- Kiểm tra nếu là lệnh DELETE
    ELSE IF EXISTS(SELECT 1 FROM deleted)
    BEGIN
        SELECT @cartId = cartId FROM deleted
    END

    UPDATE Cart
    SET totalQuantity = (SELECT SUM(count) FROM CartItem WHERE cartId = @cartId),
        totalPrice = (SELECT SUM(count * price) FROM CartItem ci INNER JOIN Product p ON ci.productId = p.id WHERE ci.cartId = @cartId)
    WHERE id = @cartId
END;

--Review
--2. Cập lại rating cho product khi có sự thêm vào, cập nhật hay xóa review
CREATE TRIGGER trg_UpdateProductRating
ON Review
AFTER INSERT, UPDATE, DELETE
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @productId INT;
    DECLARE @newRating DECIMAL(5, 2);

    -- Lấy productId của sản phẩm từ bảng inserted hoặc deleted
    IF EXISTS (SELECT TOP 1 productId FROM inserted)
    BEGIN
        SELECT @productId = productId FROM inserted;
    END
    ELSE IF EXISTS (SELECT TOP 1 productId FROM deleted)
    BEGIN
        SELECT @productId = productId FROM deleted;
    END

    -- Tính toán lại giá trị rating cho sản phẩm
    SELECT @newRating = AVG(CONVERT(DECIMAL(5, 2), stars))
    FROM Review
    WHERE productId = @productId;

    -- Cập nhật giá trị rating mới vào bảng Product
    UPDATE Product
    SET rating = CASE WHEN @newRating IS NOT NULL THEN CAST(@newRating AS DECIMAL(5, 2)) ELSE 3 END
    WHERE id = @productId;
END;

--Category
--1 Kiểm tra lại tính duy nhất của cột name
CREATE TRIGGER trg_UniqueCategoryName
ON Category
AFTER INSERT, UPDATE
AS
BEGIN
    IF EXISTS (SELECT 1 FROM Category GROUP BY name HAVING COUNT(*) > 1)
    BEGIN
        RAISERROR('Duplicate category name is not allowed.', 16, 1)
        ROLLBACK TRANSACTION
    END
END;










