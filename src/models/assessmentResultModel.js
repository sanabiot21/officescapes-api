/**
 * AssessmentResult model with MongoDB schema validation
 */

// MongoDB schema validation for AssessmentResult collection
const assessmentResultSchema = {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["resultId", "userId", "scenarioId", "sessionId", "score", "detailedFeedback", "completionDate", "skillsRatings"],
      properties: {
        resultId: {
          bsonType: "int",
          description: "Unique identifier for the assessment result"
        },
        userId: {
          bsonType: "int",
          description: "ID of the user who completed the assessment"
        },
        scenarioId: {
          bsonType: "int",
          description: "ID of the scenario that was assessed"
        },
        sessionId: {
          bsonType: "int",
          description: "ID of the training session associated with this assessment"
        },
        score: {
          bsonType: "double",
          description: "Numerical score achieved in the assessment"
        },
        detailedFeedback: {
          bsonType: "string",
          description: "Detailed feedback for the assessment"
        },
        completionDate: {
          bsonType: "string",
          description: "Date and time when the assessment was completed"
        },
        reviewerNotes: {
          bsonType: ["string", "null"],
          description: "Additional notes from the reviewer, if any"
        },
        skillsRatings: {
          bsonType: "string",
          description: "JSON representation of skills ratings for different competencies"
        },
        improvementAreas: {
          bsonType: ["string", "null"],
          description: "Specific areas identified for improvement"
        }
      }
    }
  }
};

// Function to create AssessmentResult collection with validation
async function createAssessmentResultCollection(db) {
  try {
    // Check if collection exists
    const collections = await db.listCollections({ name: "assessmentResults" }).toArray();
    
    if (collections.length === 0) {
      // Create collection with validation
      await db.createCollection("assessmentResults", { validator: assessmentResultSchema.validator });
      console.log("AssessmentResults collection created with validation schema");
      
      // Create indexes for faster lookups
      await db.collection("assessmentResults").createIndex({ resultId: 1 }, { unique: true });
      await db.collection("assessmentResults").createIndex({ userId: 1 });
      await db.collection("assessmentResults").createIndex({ scenarioId: 1 });
      await db.collection("assessmentResults").createIndex({ sessionId: 1 });
      console.log("Indexes created on AssessmentResult collection");
    } else {
      console.log("AssessmentResults collection already exists");
    }
  } catch (error) {
    console.error("Error creating assessmentResults collection:", error);
    throw error;
  }
}

module.exports = {
  createAssessmentResultCollection,
  assessmentResultSchema
}; 