/**
 * Module model with MongoDB schema validation
 */

// MongoDB schema validation for Module collection
const moduleSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["moduleId", "moduleName", "moduleDescription", "moduleDifficultyLevel", "estimatedDuration", "learningObjectives", "category", "status"],
      properties: {
        moduleId: {
          bsonType: "int",
          description: "Unique identifier for the module"
        },
        moduleName: {
          bsonType: "string",
          description: "Name of the learning module"
        },
        moduleDescription: {
          bsonType: "string",
          description: "Detailed description of the module"
        },
        moduleDifficultyLevel: {
          bsonType: "string",
          description: "Difficulty level of the module",
          enum: ["beginner", "intermediate", "advanced", "expert"]
        },
        prerequisites: {
          bsonType: ["int", "null"],
          description: "ID of the prerequisite module, if any"
        },
        estimatedDuration: {
          bsonType: "int",
          description: "Estimated completion time in minutes"
        },
        learningObjectives: {
          bsonType: "string",
          description: "Learning objectives for the module"
        },
        category: {
          bsonType: "string",
          description: "Category of the module"
        },
        tags: {
          bsonType: ["string", "null"],
          description: "Comma-separated tags for the module"
        },
        status: {
          bsonType: "string",
          description: "Status of the module",
          enum: ["draft", "published", "archived", "deprecated"]
        }
      }
    }
  }
};

// Function to create Module collection with validation
async function createModuleCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "modules" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("modules", { validator: moduleSchema.validator });
      console.log("Modules collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("modules").createIndex({ moduleId: 1 }, { unique: true });
      await db.collection("modules").createIndex({ category: 1 });
      await db.collection("modules").createIndex({ moduleDifficultyLevel: 1 });
      console.log("Indexes created on Module collection");
    } else {
      console.log("Modules collection already exists");
    }
  } catch (error) {
    console.error("Error creating modules collection:", error);
    throw error;
  }
}

module.exports = {
  createModuleCollection,
  moduleSchema
}; 