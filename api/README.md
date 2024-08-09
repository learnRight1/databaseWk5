This project is a Node.js application for tracking expenses. It allows users to register, log in, add expenses, and view their past expenses. Passwords are securely stored using hashing techniques, and the application is connected to a MySQL database.

## Project Setup

### Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [MySQL](https://www.mysql.com/) (or any compatible MySQL database)

### Installation

1. **Clone the Repository:**

   git clone

2. **Navigate to the Project Directory:**

   cd week-5-assignment-learnRight1

3. **Install Dependencies:**

   npm install

4. **Configure Environment Variables:**

   Create a `.env` file in the root directory with the following content:

   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_DATABASE=your_database
   PORT=3000

### Running the Application

1. **Start the Server:**

   npm start

   The server will be running on `http://localhost:3000`.

## API Endpoints

### User Authentication

- **Register User**

  - **Endpoint:** `/api/register`
  - **Method:** POST
  - **Request Body:**
    json
    {
    "username": "exampleuser",
    "password": "password123"
    }
  - **Response:** Success message or error

- **Login User**
  - **Endpoint:** `/api/login`
  - **Method:** POST
  - **Request Body:**
    json
    {
    "username": "exampleuser",
    "password": "password123"
    }
  - **Response:** JWT token or error

### Expense Management

- **Add Expense**

  - **Endpoint:** `/api/expenses`
  - **Method:** POST
  - **Request Headers:**
    - `Authorization: Bearer <JWT_TOKEN>`
  - **Request Body:**
    json
    {
    "amount": 50.0,
    "date": "2024-08-08",
    "category": "Food"
    }
  - **Response:** Success message or error

- **View Expenses**
  - **Endpoint:** `/api/expenses`
  - **Method:** GET
  - **Request Headers:**
    - `Authorization: Bearer <JWT_TOKEN>`
  - **Response:**
    json
    [
    {
    "id": 1,
    "amount": 50.0,
    "date": "2024-08-08",
    "category": "Food"
    }
    ]

## Database Schema

### Users Table

- **id**: INT, AUTO_INCREMENT, PRIMARY KEY
- **username**: VARCHAR(50), UNIQUE, NOT NULL
- **password**: VARCHAR(255), NOT NULL

### Expenses Table

- **id**: INT, AUTO_INCREMENT, PRIMARY KEY
- **user_id**: INT, FOREIGN KEY REFERENCES `users(id)`
- **amount**: DECIMAL(10,2)
- **date**: DATE
- **category**: VARCHAR(50)

## Security

- Passwords are hashed using `bcryptjs` for secure storage.
- Ensure to keep your `.env` file secure and do not expose it publicly.

## Troubleshooting

- **Error Connecting to MySQL:** Verify your `.env` file has the correct database credentials and that MySQL is running.
- **JWT Token Issues:** Ensure you're sending the correct token in the `Authorization` header.

## Contributing

Feel free to submit issues or pull requests to improve the application.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
