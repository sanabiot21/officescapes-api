/**
 * UserProfile model with MongoDB schema validation
 */

// MongoDB schema validation for UserProfile collection
const userProfileSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["profileId", "userId", "firstName", "lastName"],
      properties: {
        profileId: {
          bsonType: "int",
          description: "Unique identifier for the profile"
        },
        userId: {
          bsonType: "int",
          description: "Foreign key to the User collection"
        },
        firstName: {
          bsonType: "string",
          description: "User's first name"
        },
        lastName: {
          bsonType: "string",
          description: "User's last name"
        },
        phone: {
          bsonType: ["string", "null"],
          description: "User's phone number"
        },
        bio: {
          bsonType: ["string", "null"],
          description: "User's biography"
        },
        profilePicture: {
          bsonType: ["string", "null"],
          description: "URL to user's profile picture"
        },
        darkModePref: {
          bsonType: "bool",
          description: "Whether user prefers dark mode"
        },
        preferredLanguage: {
          bsonType: ["string", "null"],
          description: "User's preferred language"
        },
        lastUpdated: {
          bsonType: ["string", "null"],
          description: "Date when the profile was last updated"
        }
      }
    }
  }
};

// Function to create UserProfile collection with validation
async function createUserProfileCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "userProfiles" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("userProfiles", { validator: userProfileSchema.validator });
      console.log("UserProfiles collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("userProfiles").createIndex({ userId: 1 }, { unique: true });
      await db.collection("userProfiles").createIndex({ profileId: 1 }, { unique: true });
      console.log("Indexes created on UserProfile collection");
    } else {
      console.log("UserProfiles collection already exists");
    }
  } catch (error) {
    console.error("Error creating userProfiles collection:", error);
    throw error;
  }
}

module.exports = {
  createUserProfileCollection,
  userProfileSchema
}; 