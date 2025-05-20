/**
 * Scenario model with MongoDB schema validation
 */

// MongoDB schema validation for Scenario collection
const scenarioSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["scenarioId", "moduleId", "title", "description", "difficulty", "duration", "requiresVoice", "maxParticipants", "passingScore", "creatorId", "organizationId"],
      properties: {
        scenarioId: {
          bsonType: "int",
          description: "Unique identifier for the scenario"
        },
        moduleId: {
          bsonType: "int",
          description: "ID of the module this scenario belongs to"
        },
        title: {
          bsonType: "string",
          description: "Title of the scenario"
        },
        description: {
          bsonType: "string",
          description: "Detailed description of the scenario"
        },
        difficulty: {
          bsonType: "string",
          description: "Difficulty level of the scenario",
          enum: ["Beginner", "Intermediate", "Advanced", "Expert"]
        },
        duration: {
          bsonType: "int",
          description: "Estimated duration of the scenario in minutes"
        },
        requiresVoice: {
          bsonType: "bool",
          description: "Whether the scenario requires voice interaction"
        },
        maxParticipants: {
          bsonType: "int",
          description: "Maximum number of participants allowed in the scenario"
        },
        passingScore: {
          bsonType: "double",
          description: "Minimum score required to pass the scenario"
        },
        creatorId: {
          bsonType: "int",
          description: "User ID of the creator of this scenario"
        },
        organizationId: {
          bsonType: "int",
          description: "Organization ID that this scenario belongs to"
        },
        aiModelConfig: {
          bsonType: "string",
          description: "JSON configuration for the AI model used in the scenario"
        },
        feedbackType: {
          bsonType: "string",
          description: "Type of feedback provided for the scenario",
          enum: ["immediate", "delayed", "comprehensive", "minimal"]
        },
        version: {
          bsonType: "string",
          description: "Version number of the scenario"
        },
        imageUrl: {
          bsonType: ["string", "null"],
          description: "URL to the scenario image"
        }
      }
    }
  }
};

// Function to create Scenario collection with validation
async function createScenarioCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "scenarios" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("scenarios", { validator: scenarioSchema.validator });
      console.log("Scenarios collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("scenarios").createIndex({ scenarioId: 1 }, { unique: true });
      await db.collection("scenarios").createIndex({ moduleId: 1 });
      await db.collection("scenarios").createIndex({ difficulty: 1 });
      await db.collection("scenarios").createIndex({ organizationId: 1 });
      await db.collection("scenarios").createIndex({ creatorId: 1 });
      console.log("Indexes created on Scenario collection");
    } else {
      console.log("Scenarios collection already exists");
    }
  } catch (error) {
    console.error("Error creating scenarios collection:", error);
    throw error;
  }
}

module.exports = {
  createScenarioCollection,
  scenarioSchema
}; 