# Smart Society Express Backend

This is the backend for the Smart Society Express application. It handles user authentication, society registration, and other related functionalities.

# Send OTP
*Endpoint*: `POST /api/auth/sendOtp`

*Description*: Send the OTP to the user's mobile number.

*Request Body*: 
{
  mb_no: string;
  type: 'register' | 'login';
}

*Return type:*
200 OK:
{
  "msg": "OTP verified successfully"
}
_______________________________________________

# verify otp

*Endpoint:* `POST /api/auth/verifyOtp`

*Description:* Verifies the OTP sent to the user's mobile number.

*Request Body:*
{
  "mb_no": "string",
  "otp": "string"
}

*Return type:*
200 OK:
{
  "msg": "OTP verified successfully"
}
_______________________________________________

# Temp Register Society

*Endpoint*: `POST /api/auth/registerSociety/tempRegisterSociety`

*Description*: Temporarily registers a new society and its admin into a single temporary collection.

*Request Body:*
{
  "name": "string",
  "mb_no": "string",
  "email": "string",
  "password": "string",
  "society_name": "string",
  "society_add": "string",
  "society_city": "string",
  "society_state": "string",
  "society_pincode": "string",
  "no_of_flats": "string",
  "no_of_flats_sold": "string",
  "flat_no": "string";
  "flat_type": "string";
  "floor_no": "string";
}

*return type*
{ 
    "msg": "Registration request submitted successfully",
    "data": savedTempRegistration
}

_______________________________________________

# List Pending Registrations
*Endpoint*: `GET /api/auth/registerSociety/pending`

*Description*: Lists all pending society registration requests.

*Request Body:*
none

*return type*
{ 
    data: pendingRegistrations
}
_______________________________________________

# Process Registration
*Endpoint*: `POST /api/auth/registerSociety/process`

*Description*: Registers a society to the permanent database and delete the society from temporary database.

*Request Body:*
{
    "id" : "string"    //society id
}

*return type*
{ 
    msg1: "Admin registered successfully", newAdmin: savedAdmin,
    msg2: "Society registered successfully", savedSociety: savedSociety,
    token    //jwt token
}
_______________________________________________

# User Register
*Endpoint*: `POST /api/auth/userRegister`

*Description*: Registers a new user in temporary database by sending a request to the admin for approval.

*Request Body:*
{
  name: string;    
  mb_no: string;    
  email: string;    
  password: string;    
  society_code: string;    
  flat_no: string;
  flat_type: string;
  floor_no: string;
}

*return type*
{ 
  msg: "Request sent to admin successfully"
}
_______________________________________________

# Pending Users
*Endpoint*: `POST /api/auth/userRegister/pending`

*Description*: Lists all pending user registration requests for a specific society.

*Request Body:*
{
  "society_code": "string"
}

*return type*
{
    data: pendingUsers
}
_______________________________________________

# Process User Registration
*Endpoint*: `POST /api/auth/userRegister/process`

*Description*: Processes a pending user registration request by creating a new user and deleting the temporary request.

*Request Body:*
{
  "id": "string"    //user id
}

*return type*
{
    msg: "User registered successfully",
    newUser: savedUser,
    token 
}
_______________________________________________

# User Login
*Endpoint*: POST /api/auth/login

*Description*: Authenticates a user using their mobile number and password.

*Request Body:*
{
  "mb_no": "string",
  "password": "string"
}

*return type*
{
    msg: "Login successful",
    user,
    token
}