# RabbitMQ with Node.js

- **RabbitMQ Integration**: This project demonstrates a real-time, dual-panel system using RabbitMQ as the message broker, Prisma ORM for the admin panel, and Mongoose ORM for the consumer side. It efficiently synchronizes operations between PostgreSQL and MongoDB databases.

- **Project Overview**:

## Admin Panel (Producer)

The admin panel allows users to perform CRUD operations on projects. All operations are stored in a PostgreSQL database using Prisma ORM. Any changes made trigger an event sent through RabbitMQ to the consumer panel.

## Consumer Panel (User)

The consumer panel listens to RabbitMQ messages and mirrors the CRUD operations performed in the admin panel. It uses Mongoose ORM to manage a MongoDB database, ensuring real-time synchronization with the admin panel.

---

# Getting Started

## Prerequisites

- **Node.js**
- **PostgreSQL**
- **MongoDB**
- **RabbitMQ**

## Installation

- **Clone the repository and install dependencies for both panels:**

```
    # Clone the repository
    git clone https://github.com/iamRajatSharma/rabbitMQ-with-nodeJS.git

    # Navigate to the project directory
    cd rabbitMQ-with-nodeJS
```

---

## Key Features

- **Real-Time Synchronization: Admin panel changes instantly reflect in the consumer panel.**
- **Dual Database Integration: Uses PostgreSQL (admin) and MongoDB (consumer).**
- **ORM Usage: Prisma for PostgreSQL and Mongoose for MongoDB.**
- **RabbitMQ Integration: Reliable message passing between the admin and consumer panels.**

---

## Technologies Used

- **Node.js**
- **TypeScript**
- **RabbitMQ**
- **Prisma ORM**
- **Mongoose ORM**
- **PostgreSQL**
- **MongoDB**

---

## How It Works

1. The admin panel sends messages to RabbitMQ whenever a CRUD operation is performed.
2. The consumer panel listens to RabbitMQ for messages and applies the same operations to its MongoDB database.
3. This ensures data consistency across both systems in real-time.

---

## Contributions

Feel free to fork this repository and submit pull requests. Contributions and suggestions are always welcome!

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Author

Developed by [Rajat Sharma](https://github.com/iamRajatSharma).

For any queries or suggestions, feel free to reach out!
