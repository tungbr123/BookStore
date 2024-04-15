CREATE TABLE Delivery (
    id INT identity(1,1) NOT NULL,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(1000) NOT NULL,
    price int NOT NULL CHECK (price >= 0)
	Primary key(id)
);
CREATE TABLE Category (
    id INT identity(1,1) PRIMARY KEY,
    name VARCHAR(32) UNIQUE NOT NULL,
    categoryId INT,
    image VARCHAR(255),
    FOREIGN KEY (categoryId) REFERENCES Category(id)
);
CREATE TABLE Role (
    id INT identity(1,1) PRIMARY KEY ,
    name VARCHAR(255) NOT NULL
);


CREATE TABLE [User] (
    id INT identity(1,1) PRIMARY KEY,
    firstname VARCHAR(32) NOT NULL,
    lastname VARCHAR(32) NOT NULL,
    CMND VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(20) UNIQUE,
    isEmailActive bit DEFAULT 0,
    isPhoneActive bit DEFAULT 0,
    salt VARCHAR(255) DEFAULT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    role int not null,
    avatar VARCHAR(255),
    cover VARCHAR(255)
	foreign key (role) references Role(id)
);
ALTER TABLE [User]
ALTER COLUMN hashed_password NVARCHAR(255);
ALTER TABLE [User]
ALTER COLUMN salt NVARCHAR(255);

CREATE TABLE UserRole (
    id INT PRIMARY KEY IDENTITY(1,1),
    userID INT NOT NULL,
    roleID INT NOT NULL,
    FOREIGN KEY (userID) REFERENCES [User](id),
    FOREIGN KEY (roleID) REFERENCES [Role](id)
);

CREATE TABLE Address (
    id INT PRIMARY KEY IDENTITY(1,1),
    userID INT NOT NULL,
    city NVARCHAR(255) NOT NULL,
    district NVARCHAR(255) NOT NULL,
    ward NVARCHAR(255) NOT NULL,
    street NVARCHAR(255) NOT NULL,
    apartNum NVARCHAR(255) NOT NULL,
    FOREIGN KEY (userID) REFERENCES [User](id)
);


CREATE TABLE Product (
    id INT identity(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000) NOT NULL,
    price int NOT NULL CHECK (price >= 0),
    promotionalPrice int NOT NULL CHECK (promotionalPrice >= 0 ),
    quantity INT NOT NULL CHECK (quantity >= 0),
    sold INT DEFAULT 0 CHECK (sold >= 0),
    Image VARCHAR(MAX),
    categoryId INT NOT NULL,
    FOREIGN KEY (categoryId) REFERENCES Category(id)
);
ALTER TABLE Product
ADD rating DECIMAL(5, 2) DEFAULT 3 CHECK (rating >= 0 AND rating <= 5);

CREATE TABLE UserFollowProduct (
    id int identity(1,1),
    userId INT NOT NULL,
    productId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES [User](id),
    FOREIGN KEY (productId) REFERENCES Product(id),
    CONSTRAINT PK_UserFollowProduct PRIMARY KEY (id, userId, productId)
);
CREATE TABLE Review (
    id INT identity(1,1),
    userId INT NOT NULL,
    productId INT NOT NULL,
    content VARCHAR(1000) NOT NULL,
    stars INT NOT NULL CHECK (stars >= 0 AND stars <= 5),
    FOREIGN KEY (userId) REFERENCES [User](id),
    FOREIGN KEY (productId) REFERENCES Product(id),
    CONSTRAINT PK_Review PRIMARY KEY (id, userId, productId)
);
CREATE TABLE Orders (
    id INT identity(1,1) PRIMARY KEY,
    userId INT NOT NULL,
    deliveryId INT NOT NULL,
    address VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'not processed',
    isPaidBefore bit DEFAULT 0,
    moneyFromUser int NOT NULL CHECK (moneyFromUser >= 0),
    FOREIGN KEY (userId) REFERENCES [User](id),
    FOREIGN KEY (deliveryId) REFERENCES Delivery(id)
);
CREATE TABLE OrderItem (
    id INT identity(1,1),
    orderId INT NOT NULL,
    productId INT NOT NULL,
    count INT NOT NULL CHECK (count >= 1),
    FOREIGN KEY (orderId) REFERENCES [Orders](id),
    FOREIGN KEY (productId) REFERENCES Product(id),
	CONSTRAINT PK_OrderItem PRIMARY KEY (id, orderId, productId)
);
CREATE TABLE Cart (
    id INT identity(1,1) PRIMARY KEY ,
    userId INT NOT NULL,
    totalPrice INT,
    totalQuantity INT,
    FOREIGN KEY (userId) REFERENCES [User](id)
);
CREATE TABLE CartItem (
    id INT identity(1,1) PRIMARY KEY,
    cartId INT NOT NULL,
    productId INT NOT NULL,
    count INT NOT NULL CHECK (count >= 1),
    FOREIGN KEY (cartId) REFERENCES Cart(id),
    FOREIGN KEY (productId) REFERENCES Product(id)
);






