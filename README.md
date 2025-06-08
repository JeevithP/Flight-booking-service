This is a base node js project template, which anyone can use as it has been prepared, by keeping some of the most important code principles and project management recommendations. Feel free to change anything. 


`src` -> Inside the src folder all the actual source code regarding the project will reside, this will not include any kind of tests. (You might want to make separate tests folder)

Lets take a look inside the `src` folder

 - `config` -> In this folder anything and everything regarding any configurations or setup of a library or module will be done. For example: setting up `dotenv` so that we can use the environment variables anywhere in a cleaner fashion, this is done in the `server-config.js`. One more example can be to setup you logging library that can help you to prepare meaningful logs, so configuration for this library should also be done here. 

 - `routes` -> In the routes folder, we register a route and the corresponding middleware and controllers to it. 

 - `middlewares` -> they are just going to intercept the incoming requests where we can write our validators, authenticators etc. 

 - `controllers` -> they are kind of the last middlewares as post them you call you business layer to execute the budiness logic. In controllers we just receive the incoming requests and data and then pass it to the business layer, and once business layer returns an output, we structure the API response in controllers and send the output. 

 - `repositories` -> this folder contains all the logic using which we interact the DB by writing queries, all the raw queries or ORM queries will go here.

 - `services` -> contains the buiness logic and interacts with repositories for data from the database

 - `utils` -> contains helper methods, error classes etc.

### Setup the project

 - Download this template from github and open it in your favourite text editor. 
 - Go inside the folder path and execute the following command:
  ```
  npm install
  ```
 - In the root directory create a `.env` file and add the following env variables
    ```
        PORT=<port number of your choice>
    ```
    ex: 
    ```
        PORT=3000
    ```
 - go inside the `src` folder and execute the following command:
    ```
      npx sequelize init
    ```
 - By executing the above command you will get migrations and seeders folder along with a config.json inside the config folder. 
 - If you're setting up your development environment, then write the username of your db, password of your db and in dialect mention whatever db you are using for ex: mysql, mariadb etc
 - If you're setting up test or prod environment, make sure you also replace the host with the hosted db url.

 - To run the server execute
 ```
 npm run dev
 ```

✈️ Flight Booking Service
Microservice responsible for handling bookings, user payments, and seat locking logic in a flight booking system.

📌 Overview
This service is part of a distributed Flight Booking System, designed with a microservices architecture. It works in coordination with the Flight-Service to enable booking lifecycle management.

🛠️ Tech Stack
Node.js with Express.js

MySQL with Sequelize ORM

Winston logger

RabbitMQ (for future async communication with flight service)

Cron Jobs for auto-expiry of unconfirmed bookings

RESTful API design

🧩 Architecture
arduino
Copy
Edit
Flight Booking Service
├── controllers/
├── services/
├── repositories/
├── models/
├── config/
├── routes/
└── utils/
Responsibilities:
Create Bookings

Cancel Bookings

Handle Payment Status (Pending, Success, Failed)

Periodic Booking Expiry (via cron)

Sync seat updates with Flight Service (via REST or message queue)

⚙️ Setup Instructions
Clone the repo

bash
Copy
Edit
git clone https://github.com/JeevithP/Flight-booking-service
cd Flight-booking-service
Install dependencies

bash
Copy
Edit
npm install
Set environment variables in .env:

ini
Copy
Edit
PORT=4000
DB_NAME=booking_db
DB_USER=root
DB_PASS=yourpassword
DB_HOST=localhost
Run DB migrations

bash
Copy
Edit
npx sequelize db:migrate
Start the server

bash
Copy
Edit
npm run dev
🔁 API Endpoints
Method	Route	Description
POST	/api/v1/bookings	Create a booking
GET	/api/v1/bookings/:id	Get a booking
PATCH	/api/v1/bookings/:id	Update status (e.g., mark as paid)
DELETE	/api/v1/bookings/:id	Cancel a booking

⏱️ Cron Job
A cron service runs every 15 minutes (or your defined interval)

It finds unpaid bookings older than threshold and cancels them

Frees seats for reuse

🔗 Inter-service Communication
Flight Service is queried to:

Check seat availability

Lock seats during booking

Release seats on cancellation
