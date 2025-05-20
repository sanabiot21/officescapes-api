/**
 * TrainingSession model with MongoDB schema validation
 */

// MongoDB schema validation for TrainingSession collection
const trainingSessionSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["sessionId", "userId", "scenarioId", "startTime", "completionStatus", "performanceMetrics"],
      properties: {
        sessionId: {
          bsonType: "int",
          description: "Unique identifier for the training session"
        },
        userId: {
          bsonType: "int",
          description: "ID of the user participating in the session"
        },
        scenarioId: {
          bsonType: "int",
          description: "ID of the scenario being used for the session"
        },
        startTime: {
          bsonType: "string",
          description: "Timestamp when the session started"
        },
        endTime: {
          bsonType: ["string", "null"],
          description: "Timestamp when the session ended, null if in progress"
        },
        completionStatus: {
          bsonType: "string",
          description: "Status of session completion",
          enum: ["not-started", "in-progress", "completed", "abandoned", "failed"]
        },
        performanceMetrics: {
          bsonType: "string",
          description: "JSON representation of performance metrics for the session"
        },
        aiFeedback: {
          bsonType: ["string", "null"],
          description: "Feedback provided by AI for the session"
        }
      }
    }
  }
};

// Function to create TrainingSession collection with validation
async function createTrainingSessionCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "trainingSessions" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("trainingSessions", { validator: trainingSessionSchema.validator });
      console.log("TrainingSessions collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("trainingSessions").createIndex({ sessionId: 1 }, { unique: true });
      await db.collection("trainingSessions").createIndex({ userId: 1 });
      await db.collection("trainingSessions").createIndex({ scenarioId: 1 });
      await db.collection("trainingSessions").createIndex({ completionStatus: 1 });
      console.log("Indexes created on TrainingSession collection");
    } else {
      console.log("TrainingSessions collection already exists");
    }
  } catch (error) {
    console.error("Error creating trainingSessions collection:", error);
    throw error;
  }
}

module.exports = {
  createTrainingSessionCollection,
  trainingSessionSchema
}; 