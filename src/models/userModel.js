/**
 * User model with MongoDB schema validation
 */

// MongoDB schema validation for User collection
const userSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["email", "passwordHash", "userType", "createdAt", "accountStatus", "verificationStatus"],
      properties: {
        userId: {
          bsonType: "int",
          description: "Unique identifier for the user"
        },
        organizationId: {
          bsonType: "int",
          description: "ID of the organization the user belongs to"
        },
        email: {
          bsonType: "string",
          description: "User's email address",
          pattern: "^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"
        },
        passwordHash: {
          bsonType: "string",
          description: "Hashed password of the user"
        },
        userType: {
          bsonType: "string",
          description: "Type of user (student, instructor, manager, etc.)",
          enum: ["student", "instructor", "manager", "admin", "graduate", "organization"]
        },
        createdAt: {
          bsonType: "string",
          description: "Date when the user account was created"
        },
        lastLogin: {
          bsonType: ["string", "null"],
          description: "Date of last login"
        },
        accountStatus: {
          bsonType: "string",
          description: "Status of the user account",
          enum: ["active", "inactive", "suspended", "pending"]
        },
        verificationStatus: {
          bsonType: "bool",
          description: "Whether the user's email is verified"
        }
      }
    }
  }
};

// Function to create User collection with validation
async function createUserCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "users" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("users", { validator: userSchema.validator });
      console.log("Users collection created with validation schema");
      
      // Create index on email for faster lookups and uniqueness
      await db.collection("users").createIndex({ email: 1 }, { unique: true });
      console.log("Index created on email field");
    } else {
      console.log("Users collection already exists");
    }
  } catch (error) {
    console.error("Error creating users collection:", error);
    throw error;
  }
}

module.exports = {
  createUserCollection,
  userSchema
}; 