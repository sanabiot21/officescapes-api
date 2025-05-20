/**
 * UserSkill model with MongoDB schema validation
 */

// MongoDB schema validation for UserSkill collection
const userSkillSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["userSkillId", "userId", "skillId", "proficiencyLevel", "lastAssessed"],
      properties: {
        userSkillId: {
          bsonType: "int",
          description: "Unique identifier for the user skill relationship"
        },
        userId: {
          bsonType: "int",
          description: "ID of the user who possesses the skill"
        },
        skillId: {
          bsonType: "int",
          description: "ID of the skill the user possesses"
        },
        proficiencyLevel: {
          bsonType: "int",
          description: "Level of proficiency from 1-5",
          minimum: 1,
          maximum: 5
        },
        lastAssessed: {
          bsonType: "string",
          description: "Date and time when the skill was last assessed"
        },
        endorsedBy: {
          bsonType: ["string", "null"],
          description: "Name of the person who endorsed this skill, if any"
        }
      }
    }
  }
};

// Function to create UserSkill collection with validation
async function createUserSkillCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "userSkills" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("userSkills", { validator: userSkillSchema.validator });
      console.log("UserSkills collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("userSkills").createIndex({ userSkillId: 1 }, { unique: true });
      await db.collection("userSkills").createIndex({ userId: 1 });
      await db.collection("userSkills").createIndex({ skillId: 1 });
      await db.collection("userSkills").createIndex({ userId: 1, skillId: 1 }, { unique: true });
      console.log("Indexes created on UserSkill collection");
    } else {
      console.log("UserSkills collection already exists");
    }
  } catch (error) {
    console.error("Error creating userSkills collection:", error);
    throw error;
  }
}

module.exports = {
  createUserSkillCollection,
  userSkillSchema
}; 