# TransitEye API Documentation

This document outlines the available endpoints and their usage for the TransitEye API.

## Authentication

All API endpoints require an API key to be passed as a query parameter `key`.

Example:
```
/api/bus?key=your_api_key
```

## Endpoints

### Bus Operations

#### 1. Get All Buses Status
- **Endpoint**: `/api/bus/all`
- **Method**: GET
- **Description**: Retrieves the current status of all buses
- **Response**:
  ```json
  {
    "message": "Buses successfully fetched",
    "records": [
      {
        "id": "string",
        "bus_number": "number",
        "latitude": "number",
        "longtitude": "number",
        "passenger_count": "number",
        "created_at": "timestamp"
      }
    ]
  }
  ```

#### 2. Get Current Bus Status
- **Endpoint**: `/api/bus/{bus_id}`
- **Method**: GET
- **Parameters**:
  - `bus_id` (path parameter): Positive integer identifying the bus
- **Response**:
  ```json
  {
    "message": "Passenger count retrieved successfully",
    "bus_id": "number",
    "passenger_count": "number",
    "timestamp": "string"
  }
  ```

#### 3. Update Bus Location and Passenger Count
- **Endpoint**: `/api/bus`
- **Method**: POST
- **Required Fields**:
  ```json
  {
    "bus_id": "number",
    "geolocation": {
      "latitude": "number",
      "longtitude": "number"
    },
    "passenger_count": "number"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Bus status recorded successfully",
    "bus_id": "number",
    "timestamp": "string"
  }
  ```

### Location Operations

#### 1. Get All Locations
- **Endpoint**: `/api/location/all`
- **Method**: GET
- **Description**: Retrieves the current location of all buses
- **Response**:
  ```json
  {
    "message": "Location Fetched Successfully",
    "records": [
      {
        "id": "string",
        "created_at": "timestamp",
        "bus_number": "number",
        "latitude": "number",
        "longtitude": "number"
      }
    ]
  }
  ```

#### 2. Get Specific Bus Location
- **Endpoint**: `/api/location/{bus_id}`
- **Method**: GET
- **Parameters**:
  - `bus_id` (path parameter): Positive integer identifying the bus
- **Response**:
  ```json
  {
    "timestamp": "string",
    "coordinates": {
      "latitude": "number",
      "longtitude": "number"
    },
    "status": 200,
    "message": "geolocation retrieved",
    "bus_id": "number"
  }
  ```

### User Operations

#### 1. User Login
- **Endpoint**: `/api/user/login`
- **Method**: POST
- **Required Fields**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Login Successful",
    "user": {
      "id": "string",
      "username": "string"
    },
    "token": "string"
  }
  ```

## Error Responses

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "message": "Error description",
  "status": "HTTP status code",
  "data": "Additional error context (only in non-production)"
}
```

Common status codes:
- 400: Bad Request - Invalid input
- 401: Unauthorized - Invalid or missing API key
- 404: Not Found - Resource not found
- 500: Internal Server Error

## Rate Limiting and Data Updates

- Location data is updated every 5 seconds
- All timestamps are in ISO 8601 format
- Coordinates are provided in decimal degrees format
