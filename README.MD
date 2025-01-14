# RabbitMQ with Node.js

- **RabbitMQ Integration**: Reliable message passing between the admin and consumer panels.

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
