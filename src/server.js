const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Import models
const { createUserCollection } = require('./models/userModel');
const { createUserProfileCollection } = require('./models/userProfileModel');
const { createOrganizationCollection } = require('./models/organizationModel');
const { createModuleCollection } = require('./models/moduleModel');
const { createScenarioCollection } = require('./models/scenarioModel');
const { createTrainingSessionCollection } = require('./models/trainingSessionModel');
const { createAssessmentResultCollection } = require('./models/assessmentResultModel');
const { createSkillCollection } = require('./models/skillModel');
const { createUserSkillCollection } = require('./models/userSkillModel');
const { createNotificationCollection } = require('./models/notificationModel');
const createApplicationSchema = require('./models/applicationModel');

// Import routes
const userRoutes = require('./routes/userRoutes');
const userProfileRoutes = require('./routes/userProfileRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const authRoutes = require('./routes/authRoutes');
const scenarioRoutes = require('./routes/scenarioRoutes');
const moduleRoutes = require('./routes/moduleRoutes');
const applicationRoutes = require('./routes/applicationRoutes');

// Import seed utility
const seedDatabase = require('./utils/seedData');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// For production, use environment variables
const uri = process.env.MONGODB_URI || "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
const dbName = process.env.DB_NAME || "officescapes";

// MongoDB Client
const client = new MongoClient(uri);

// Connect to MongoDB
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db = client.db(dbName);
    
    // Initialize collections with schemas
    await createUserCollection(db);
    await createUserProfileCollection(db);
    await createOrganizationCollection(db);
    await createModuleCollection(db);
    await createScenarioCollection(db);
    await createTrainingSessionCollection(db);
    await createAssessmentResultCollection(db);
    await createSkillCollection(db);
    await createUserSkillCollection(db);
    await createNotificationCollection(db);
    
    // Initialize applications collection
    const appSchema = createApplicationSchema(db);
    await appSchema.createApplicationsCollection();
    
    // Create the user_scenarios collection if it doesn't exist
    const collections = await db.listCollections({ name: "user_scenarios" }).toArray();
    if (collections.length === 0) {
      await db.createCollection("user_scenarios");
      console.log("Created user_scenarios collection");
    }
    
    // Seed database with initial data
    await seedDatabase(db);
    
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: "Welcome to OfficeScapes API" });
});

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', userProfileRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/scenarios', scenarioRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/applications', applicationRoutes);

// Start server
const PORT = process.env.PORT || 3000;

// Initialize server with database connection
async function startServer() {
  try {
    const database = await connectToDatabase();
    
    // Make database available to route handlers
    app.locals.db = database;
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
}

// Handle server shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer(); 