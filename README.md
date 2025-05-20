# OfficeScapes Node.js Server

This is the backend API server for the OfficeScapes Android application, built with Node.js, Express, and MongoDB.

## Prerequisites

- Node.js (v16 or later)
- npm (Node Package Manager)
- MongoDB Atlas account or local MongoDB server

## Installation

1. Clone the repository
2. Navigate to the project directory:
```bash
cd officescapes-node-server
```
3. Install dependencies:
```bash
npm install
```
4. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=officescapes
PORT=3000
```
Replace `<username>`, `<password>`, and `<cluster>` with your MongoDB Atlas credentials or configure for your local MongoDB.

## Running the Server

For development (with auto-reload):
```bash
npm run dev
```

For production:
```bash
npm start
```

## API Endpoints

### User Endpoints

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

More endpoints will be added as development progresses.

## MongoDB Data Models

The API uses the following data models:

- User: Authentication and user management
- UserProfile: User profile information
- Organization: Company/institution details
- Module: Learning modules
- Scenario: Training scenarios
- TrainingSession: User training sessions
- AssessmentResult: Performance evaluation results
- Skill: Skills that can be developed
- UserSkill: User's progress in specific skills
- Notification: System notifications

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the ISC License. 