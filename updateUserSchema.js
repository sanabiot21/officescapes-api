const { MongoClient } = require('mongodb');

async function updateUserSchema() {
  let client;
  try {
    console.log('Starting MongoDB schema update...');
    
    // Connect to MongoDB
    const uri = "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
    client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Reference the database
    const db = client.db('officescapes');
    
    // Check if users collection exists
    const collections = await db.listCollections({ name: "users" }).toArray();
    if (collections.length === 0) {
      console.log('Users collection does not exist. No update needed.');
      return;
    }
    
    console.log('Found users collection. Proceeding with schema update...');
    
    // Updated schema with 'organization' in userType enum
    const updatedSchema = {
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
    
    // Update the collection with the new validation schema
    console.log('Updating validation schema...');
    const result = await db.command({
      collMod: 'users',
      validator: updatedSchema.validator
    });
    
    console.log('Schema update result:', result);
    console.log('Successfully updated users collection schema');
    
  } catch (error) {
    console.error('Error updating schema:', error);
  } finally {
    // Close the connection if client was initialized
    if (client) {
      try {
        await client.close();
        console.log('MongoDB connection closed');
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
}

// Run the update function
updateUserSchema().catch(err => console.error('Unhandled error:', err)); 