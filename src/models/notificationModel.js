/**
 * Notification model with MongoDB schema validation
 */

// MongoDB schema validation for Notification collection
const notificationSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["notificationId", "userId", "notificationTitle", "content", "createdAt", "readStatus", "priority"],
      properties: {
        notificationId: {
          bsonType: "int",
          description: "Unique identifier for the notification"
        },
        userId: {
          bsonType: "int",
          description: "ID of the user who receives the notification"
        },
        notificationTitle: {
          bsonType: "string",
          description: "Title of the notification"
        },
        content: {
          bsonType: "string",
          description: "Content of the notification message"
        },
        createdAt: {
          bsonType: "string",
          description: "Date and time when the notification was created"
        },
        readStatus: {
          bsonType: "bool",
          description: "Whether the notification has been read"
        },
        priority: {
          bsonType: "string",
          description: "Priority level of the notification",
          enum: ["low", "medium", "high", "urgent"]
        },
        actionUrl: {
          bsonType: ["string", "null"],
          description: "URL or path to navigate to when the notification is clicked"
        },
        expiryDate: {
          bsonType: ["string", "null"],
          description: "Date and time when the notification expires"
        }
      }
    }
  }
};

// Function to create Notification collection with validation
async function createNotificationCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "notifications" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("notifications", { validator: notificationSchema.validator });
      console.log("Notifications collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("notifications").createIndex({ notificationId: 1 }, { unique: true });
      await db.collection("notifications").createIndex({ userId: 1 });
      await db.collection("notifications").createIndex({ createdAt: -1 });
      await db.collection("notifications").createIndex({ readStatus: 1 });
      await db.collection("notifications").createIndex({ priority: 1 });
      console.log("Indexes created on Notification collection");
    } else {
      console.log("Notifications collection already exists");
    }
  } catch (error) {
    console.error("Error creating notifications collection:", error);
    throw error;
  }
}

module.exports = {
  createNotificationCollection,
  notificationSchema
}; 