# Bike Rental System Updated. 

Documentation link - https://hackmd.io/AKLlIa7TQsa5ejzXQN7E0g
---

#### Database Schema and API endpoints

### Actors involved

#### Business Owner: 

The owner of the bike rental business who manages the overall operations and configuration of the system.

#### Customers: 

The customers who interact with the system to make bookings and view available bikes for specific time slots.

#### Bikes: 

The physical bikes that are part of the bike inventory and their availability status (e.g., available or booked) is managed by the system.

#### Timeslots:

The time intervals for which customers can make bookings, and their availability status (e.g., available or booked) is managed by the system.

#### System:

The software system that manages the booking process, updates bike and time slot availability, and provides information to customers about available bikes for specific time slots.

#### Timer/Scheduler:

A scheduling mechanism (e.g., timer or scheduler) that automatically updates the availability status of timeslots as they expire, ensuring that the system accurately reflects the current availability of bikes and time slots. This would be an additional component or actor involved in managing the time slot availability in the system.




---






### MongoDB: Chosen as the database to store the data models due to its flexibility, scalability, and ease of use for storing JSON-like documents.




#### Data Models:

#### 1- Bike:

Represents a bike with properties such as bikeId, bikeName, status (e.g. available, booked), and any other relevant details. 

- **bikeId**: a required string field with a unique constraint, representing the unique identifier for the bike
- **bikeName**: a required string field, representing the name of the bike
- **isAvailable**: a boolean field with a default value of true, representing whether the bike is currently available



```js
const bikeSchema = new mongoose.Schema({
  bikeId: { type: String, required: true, unique: true },
  bikeName: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

bikeSchema.index({ bikeId: 1 }, { unique: true });

bikeSchema.path('bikeId').validate(async function (value) {
  const bike = await this.constructor.findOne({ bikeId: value });
  return !bike;
}, 'Bike ID already exists');

const Bike = mongoose.model('Bike', bikeSchema);


```




---


#### 2- Timeslot:

Represents a time slot for booking a bike with properties such as timeslotId, startTime, endTime, and status (e.g. available, booked), and any other relevant details.

- **startTime**: A required Date property that stores the start time of a timeslot.
- **endTime**: A required Date property that stores the end time of a timeslot.
- **isAvailable**: A Boolean property that is set to true by default and indicates whether the timeslot is available for booking.

Index on startTime and endTime fields for optimized queries.

```js
const timeslotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
});

timeslotSchema.index({ startTime: 1, endTime: 1 }, { unique: true });

timeslotSchema.path('endTime').validate(function (value) {
  return value > this.startTime;
}, 'End time must be after start time');

const Timeslot = mongoose.model('Timeslot', timeslotSchema);

```


---


#### 3- Customer: 

Represents a customer with properties such as customerId, customerName, contactNumber, and any other relevant details.


- **fullName**: A required string property that represents the full name of the customer.
- **email**: A required string property that represents the email address of the customer. The unique option is set to true to ensure that no two documents have the same email address.
- **password**: A required string property that represents the password of the customer.

The customerSchema defines an index on the email property with the unique option set to true. This ensures that there are no two documents with the same email address.


```js
const customerSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

customerSchema.index({ email: 1 }, { unique: true });

const Customer = mongoose.model('Customer', customerSchema);


```



---


#### 4- Admin: 

Represents an admin with properties such as adminId, adminName, email, and any other relevant details.

- **fullName**: A required string field for the admin's full name.
- **email**: A required string field for the admin's email address, which is also set to be unique.
- **password**: A required string field for the admin's password.

```js
const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.index({ email: 1 }, { unique: true });

const Admin = mongoose.model('Admin', adminSchema);
```




---




#### 5- Booking: 

Represents a booking made by a customer with properties such as bookingId, customerId, bikeId, timeslotId, startTime, endTime, and any other relevant details.


- **bike**: A reference to a Bike document in the database. This field is required and represented as a mongoose.Schema.Types.ObjectId.
- **timeslot**: A reference to a Timeslot document in the database. This field is required and represented as a mongoose.Schema.Types.ObjectId.
- **customer**: A reference to a Customer document in the database. This field is required and represented as a mongoose.Schema.Types.ObjectId.
- **bookingDate**: A Date field that defaults to the current date and time.


```js


const bookingSchema = new mongoose.Schema({
  bike: { type: mongoose.Schema.Types.ObjectId, ref: 'Bike', required: true },
  timeslot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timeslot',
    required: true,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
  bookingDate: { type: Date, default: Date.now },
});

bookingSchema.index({ bike: 1, timeslot: 1 }, { unique: true });

bookingSchema.path('timeslot').validate(async function (value) {
  const timeslot = await mongoose.model('Timeslot').findById(value);
  return timeslot && timeslot.isAvailable;
}, 'Selected timeslot is not available');

const Booking = mongoose.model('Booking', bookingSchema);

```








---





### API Documentation


#### 1- Retrieve all available bikes

```bash!
GET /api/bikes
```


Returns a JSON array of all available bikes.

##### Response
```
200 OK: Successfully retrieved all available bikes
500 Internal Server Error: Failed to retrieve bikes
```


---


#### 2- Retrieve all available timeslots
```bash
GET /api/timeslots
```
Returns a JSON array of all available timeslots.

##### Response
```
200 OK: Successfully retrieved all available timeslots
500 Internal Server Error: Failed to retrieve timeslots
```



---

#### 3-  Create a new booking

```bash 
POST /api/bookings
```

Creates a new booking based on the provided request body parameters. The bike and timeslot must be available for the booking to be created.

##### Request Body

```
customerId (required): The ID of the customer making the booking.
bikeId (required): The ID of the bike being booked.
timeslotId (required): The ID of the timeslot being booked.
startTime (required): The start time of the booking in ISO 8601 format.
endTime (required): The end time of the booking in ISO 8601 format.
```

#### Response
```
201 Created: Booking created successfully
400 Bad Request: Bike or timeslot is not available
500 Internal Server Error: Failed to create booking
```



---


#### 4 - Retrieve all bookings for a customer
```bash
GET /api/customers/:customerId/bookings
```
Returns a JSON array of all bookings for the specified customer.

#### Path Parameters

```
customerId (required): The ID of the customer whose bookings should be retrieved.
  ```         

##### Response
```
200 OK: Successfully retrieved all bookings for the specified customer
           500 Internal Server Error: Failed to retrieve bookings
```




---

#### 5-  Retrieve all bookings for an admin

```
GET /api/admins/:adminId/bookings
```
Returns a JSON array of all bookings for the specified admin.

##### Path Parameters
```
adminId (required): The ID of the admin whose bookings should be retrieved.
Response
200 OK: Successfully retrieved all bookings for the specified admin
500 Internal Server Error: Failed to retrieve bookings
```



---

#### 6-  Update a booking status

```bash
PUT /api/bookings/:bookingId
```
Updates the status of the specified booking. The bike and timeslot statuses will be updated based on the new booking status.

##### Path Parameters

```
bookingId (required): The ID of the booking to be updated.
Request Body
status (required): The new status of the booking.
```

##### Response
```
200 OK: Booking status updated successfully
404 Not Found: Booking not found
500 Internal Server Error: Failed to update booking status
```



---


#### 7- Delete a booking
```bash 
DELETE /api/bookings/:bookingId
```

Deletes the specified booking and updates the bike and timeslot statuses to available.

##### Path Parameters
```
bookingId (required): The ID of the booking to be deleted.
Response
200 OK: Booking deleted successfully
404 Not Found: Booking not found
500 Internal Server Error: Failed to delete booking

```



---
