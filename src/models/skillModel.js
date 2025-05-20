/**
 * Skill model with MongoDB schema validation
 */

// MongoDB schema validation for Skill collection
const skillSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["skillId", "skillName", "skillCategory", "skillDescription", "evaluationCriteria"],
      properties: {
        skillId: {
          bsonType: "int",
          description: "Unique identifier for the skill"
        },
        skillName: {
          bsonType: "string",
          description: "Name of the skill"
        },
        skillCategory: {
          bsonType: "string",
          description: "Category the skill belongs to"
        },
        skillDescription: {
          bsonType: "string",
          description: "Detailed description of the skill"
        },
        evaluationCriteria: {
          bsonType: "string",
          description: "Criteria used to evaluate this skill"
        }
      }
    }
  }
};

// Function to create Skill collection with validation
async function createSkillCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "skills" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("skills", { validator: skillSchema.validator });
      console.log("Skills collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("skills").createIndex({ skillId: 1 }, { unique: true });
      await db.collection("skills").createIndex({ skillCategory: 1 });
      await db.collection("skills").createIndex({ skillName: 1 });
      console.log("Indexes created on Skill collection");
    } else {
      console.log("Skills collection already exists");
    }
  } catch (error) {
    console.error("Error creating skills collection:", error);
    throw error;
  }
}

module.exports = {
  createSkillCollection,
  skillSchema
}; 