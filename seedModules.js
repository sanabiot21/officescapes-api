const { MongoClient, Int32 } = require('mongodb');

async function seedModules() {
  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Reference the database
    const db = client.db('officescapes');
    
    // Drop existing modules collection if it exists
    try {
      await db.collection('modules').drop();
      console.log('Dropped existing modules collection');
    } catch (error) {
      console.log('No existing modules collection to drop');
    }
    
    // Create modules collection with validation
    await db.createCollection('modules', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["moduleId", "moduleName", "moduleDescription", "moduleDifficultyLevel", 
                     "estimatedDuration", "learningObjectives", "category", "status"],
          properties: {
            moduleId: { bsonType: "int" },
            moduleName: { bsonType: "string" },
            moduleDescription: { bsonType: "string" },
            moduleDifficultyLevel: { 
              bsonType: "string",
              enum: ["beginner", "intermediate", "advanced", "mixed"]
            },
            prerequisites: { bsonType: ["int", "null"] },
            estimatedDuration: { bsonType: "int" },
            learningObjectives: { bsonType: "string" },
            category: { bsonType: "string" },
            tags: { bsonType: ["string", "null"] },
            status: { 
              bsonType: "string",
              enum: ["active", "draft", "archived"]
            }
          }
        }
      }
    });
    console.log('Created modules collection with validation');
    
    // Seed data for modules
    const modules = [
      {
        moduleId: new Int32(1),
        moduleName: "Communication Essentials",
        moduleDescription: "Build fundamental communication skills essential for workplace success. This module focuses on verbal and written communication in various professional contexts.",
        moduleDifficultyLevel: "beginner",
        prerequisites: null,
        estimatedDuration: new Int32(60), // minutes
        learningObjectives: "Develop effective introductions, practice client communication, and participate meaningfully in team meetings.",
        category: "Soft Skills",
        tags: "communication, collaboration, teamwork, professionalism",
        status: "active"
      },
      {
        moduleId: new Int32(2),
        moduleName: "Professional Problem-Solving",
        moduleDescription: "Learn to navigate common workplace challenges through effective problem-solving techniques. Handle client issues, project crises, and interpersonal conflicts professionally.",
        moduleDifficultyLevel: "intermediate",
        prerequisites: new Int32(1),
        estimatedDuration: new Int32(75), // minutes
        learningObjectives: "Demonstrate technical troubleshooting, crisis management, and conflict resolution skills in professional settings.",
        category: "Soft Skills",
        tags: "problem-solving, critical-thinking, conflict-resolution, customer-service",
        status: "active"
      },
      {
        moduleId: new Int32(3),
        moduleName: "Leadership Development",
        moduleDescription: "Develop essential leadership skills that prepare you for management responsibilities. Practice guiding teams, delegating effectively, and providing constructive feedback.",
        moduleDifficultyLevel: "intermediate",
        prerequisites: new Int32(1),
        estimatedDuration: new Int32(80), // minutes
        learningObjectives: "Lead meetings effectively, assign tasks appropriately, and conduct performance reviews with empathy and clarity.",
        category: "Leadership",
        tags: "leadership, management, delegation, team-building",
        status: "active"
      },
      {
        moduleId: new Int32(4),
        moduleName: "Workplace Adaptability",
        moduleDescription: "Build resilience and adaptability in diverse workplace settings. Navigate remote work, organizational changes, and cross-cultural environments with confidence.",
        moduleDifficultyLevel: "intermediate",
        prerequisites: new Int32(1),
        estimatedDuration: new Int32(90), // minutes
        learningObjectives: "Demonstrate effective remote collaboration, navigate organizational changes, and communicate across cultural differences.",
        category: "Workplace Skills",
        tags: "adaptability, resilience, remote-work, cross-cultural, change-management",
        status: "active"
      },
      {
        moduleId: new Int32(5),
        moduleName: "Job Interview Preparation",
        moduleDescription: "Master the art of job interviews from technical questions to salary negotiations. Prepare for various interview formats and present yourself confidently to potential employers.",
        moduleDifficultyLevel: "mixed",
        prerequisites: null,
        estimatedDuration: new Int32(75), // minutes
        learningObjectives: "Respond effectively to technical and behavioral questions, and navigate salary negotiations professionally.",
        category: "Career Development",
        tags: "interviews, job-seeking, negotiation, career-advancement",
        status: "active"
      }
    ];
    
    // Insert modules into the collection
    const result = await db.collection('modules').insertMany(modules);
    console.log(`${result.insertedCount} modules inserted successfully`);
    
    // Verify insertion by retrieving all modules
    const insertedModules = await db.collection('modules').find().toArray();
    console.log(`Verified ${insertedModules.length} modules in database`);
    
    // Close the connection
    await client.close();
    console.log('Connection closed');
    
  } catch (err) {
    console.error('Error seeding modules:', err);
  }
}

// Run the seed function
seedModules(); 