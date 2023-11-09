# Yachiyo Backend

## Features

### 1. User Authentication
   - Implemented JWT-based user authentication to secure API endpoints.
   - Utilized cookies for storing and managing authentication tokens.

### 2. MongoDB Integration
   - Established a connection to MongoDB Atlas for seamless data storage and retrieval.
   - Organized data into collections for rooms, bookings, and reviews.

### 3. Room Management
   - Developed APIs for retrieving all rooms, room details, and handling room bookings.
   - Incorporated seat availability logic, updating seat counts upon successful bookings.

### 4. Booking Operations
   - Created APIs for retrieving, inserting, updating, and deleting booking records.
   - Implemented date modification functionality for existing bookings.

### 5. Review System
   - Integrated APIs for fetching and submitting reviews for rooms.
   - Utilized MongoDB to store and retrieve review data.

## Struggles

### 1. CORS Configuration
   - Setting up CORS configurations to allow specific origins while ensuring security was challenging. Debugging and testing were crucial to ensure proper functioning.

### 2. MongoDB Connection
   - Establishing a connection to MongoDB Atlas posed initial challenges, including handling connection errors and ensuring secure credentials.

### 3. JWT Implementation
   - Implementing JWT-based authentication required careful consideration of security measures, token validation, and handling expired tokens.

### 4. Error Handling
   - Ensuring robust error handling throughout the application was a continuous struggle, especially dealing with various HTTP status codes and error scenarios.

### 5. Seat Availability Logic
   - Implementing and testing the logic for seat availability during room bookings required careful consideration to avoid race conditions and ensure accurate updates.

These struggles contributed to a valuable learning experience and enhanced the overall robustness of the backend system. Each challenge provided an opportunity for growth and improvement in building a secure and functional API.
