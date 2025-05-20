/**
 * Organization model with MongoDB schema validation
 */

// MongoDB schema validation for Organization collection
const organizationSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["organizationId", "organizationName", "industry", "description", "contactEmail"],
      properties: {
        organizationId: {
          bsonType: "int",
          description: "Unique identifier for the organization"
        },
        organizationName: {
          bsonType: "string",
          description: "Name of the organization"
        },
        industry: {
          bsonType: "string",
          description: "Industry the organization operates in"
        },
        description: {
          bsonType: "string",
          description: "Detailed description of the organization"
        },
        contactEmail: {
          bsonType: "string",
          description: "Primary contact email for the organization",
          pattern: "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"
        },
        contactPhone: {
          bsonType: ["string", "null"],
          description: "Primary contact phone for the organization"
        },
        address: {
          bsonType: ["string", "null"],
          description: "Physical address of the organization"
        }
      }
    }
  }
};

// Function to create Organization collection with validation
async function createOrganizationCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "organizations" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("organizations", { validator: organizationSchema.validator });
      console.log("Organizations collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("organizations").createIndex({ organizationId: 1 }, { unique: true });
      await db.collection("organizations").createIndex({ organizationName: 1 });
      console.log("Indexes created on Organization collection");
    } else {
      console.log("Organizations collection already exists");
    }
  } catch (error) {
    console.error("Error creating organizations collection:", error);
    throw error;
  }
}

module.exports = {
  createOrganizationCollection,
  organizationSchema
}; 