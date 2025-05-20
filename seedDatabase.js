const { MongoClient, Int32, Double } = require('mongodb');

async function seedDatabase() {
  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Reference the database
    const db = client.db('officescapes');
    
    // =========== SEED MODULES ==============
    console.log('===== SEEDING MODULES =====');
    
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
    const moduleResult = await db.collection('modules').insertMany(modules);
    console.log(`${moduleResult.insertedCount} modules inserted successfully`);
    
    // =========== SEED SCENARIOS ==============
    console.log('===== SEEDING SCENARIOS =====');
    
    // Drop existing scenarios collection if it exists
    try {
      await db.collection('scenarios').drop();
      console.log('Dropped existing scenarios collection');
    } catch (error) {
      console.log('No existing scenarios collection to drop');
    }
    
    // Create scenarios collection with validation
    await db.createCollection('scenarios', {
      validator: {
        $jsonSchema: {
          bsonType: "object",
          required: ["scenarioId", "moduleId", "scenarioTitle", "scenarioDescription", 
                    "difficultyLevel", "durationMinutes", "requiresVoice", 
                    "maxParticipants", "passingScore", "aiModelConfig", 
                    "feedbackType", "version"],
          properties: {
            scenarioId: { bsonType: "int" },
            moduleId: { bsonType: "int" },
            scenarioTitle: { bsonType: "string" },
            scenarioDescription: { bsonType: "string" },
            difficultyLevel: { 
              bsonType: "string",
              enum: ["beginner", "intermediate", "advanced"]
            },
            durationMinutes: { bsonType: "int" },
            requiresVoice: { bsonType: "bool" },
            maxParticipants: { bsonType: "int" },
            passingScore: { bsonType: "double" },
            aiModelConfig: { bsonType: "string" },
            feedbackType: { 
              bsonType: "string",
              enum: ["immediate", "delayed", "comprehensive"]
            },
            version: { bsonType: "string" }
          }
        }
      }
    });
    console.log('Created scenarios collection with validation');
    
    // Seed data for scenarios
    const scenarios = [
      // Module 1: Communication Essentials
      {
        scenarioId: new Int32(1),
        moduleId: new Int32(1),
        scenarioTitle: "First Day Introductions",
        scenarioDescription: "Practice introducing yourself professionally in a new workplace environment. Learn how to make a positive first impression with your team members and supervisor.",
        difficultyLevel: "beginner",
        durationMinutes: new Int32(15),
        requiresVoice: true,
        maxParticipants: new Int32(1),
        passingScore: new Double(70.0),
        aiModelConfig: '{"responseStyle":"professional","personalities":["supportive","attentive"],"contextAwareness":"high"}',
        feedbackType: "immediate",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(2),
        moduleId: new Int32(1),
        scenarioTitle: "Client Communication Basics",
        scenarioDescription: "Learn to communicate effectively with clients via email and phone. Practice handling basic inquiries and providing clear information.",
        difficultyLevel: "beginner",
        durationMinutes: new Int32(20),
        requiresVoice: true,
        maxParticipants: new Int32(1),
        passingScore: new Double(70.0),
        aiModelConfig: '{"responseStyle":"customer-focused","personalities":["professional","helpful"],"contextAwareness":"medium"}',
        feedbackType: "immediate",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(3),
        moduleId: new Int32(1),
        scenarioTitle: "Team Meeting Participation",
        scenarioDescription: "Practice active participation in a team meeting. Learn to share ideas clearly, ask relevant questions, and provide constructive feedback.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(25),
        requiresVoice: true,
        maxParticipants: new Int32(5),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"collaborative","personalities":["engaged","thoughtful","challenging"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      
      // Module 2: Professional Problem-Solving
      {
        scenarioId: new Int32(4),
        moduleId: new Int32(2),
        scenarioTitle: "Technical Support Call",
        scenarioDescription: "Handle a simulated technical support call where you must troubleshoot a client's issue while maintaining professionalism under pressure.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(20),
        requiresVoice: true,
        maxParticipants: new Int32(2),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"technical","personalities":["frustrated-customer","detail-oriented"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(5),
        moduleId: new Int32(2),
        scenarioTitle: "Project Deadline Crisis",
        scenarioDescription: "Navigate a scenario where a project deadline is at risk. Practice prioritizing tasks, communicating with stakeholders, and problem-solving under time constraints.",
        difficultyLevel: "advanced",
        durationMinutes: new Int32(30),
        requiresVoice: true,
        maxParticipants: new Int32(4),
        passingScore: new Double(80.0),
        aiModelConfig: '{"responseStyle":"urgent","personalities":["stressed-manager","concerned-client","supportive-teammate"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(6),
        moduleId: new Int32(2),
        scenarioTitle: "Conflict Resolution",
        scenarioDescription: "Mediate a workplace conflict between team members with different perspectives. Practice active listening, empathy, and finding constructive solutions.",
        difficultyLevel: "advanced",
        durationMinutes: new Int32(25),
        requiresVoice: true,
        maxParticipants: new Int32(3),
        passingScore: new Double(80.0),
        aiModelConfig: '{"responseStyle":"diplomatic","personalities":["confrontational","defensive","neutral"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      
      // Module 3: Leadership Development
      {
        scenarioId: new Int32(7),
        moduleId: new Int32(3),
        scenarioTitle: "Leading a Project Meeting",
        scenarioDescription: "Take charge of a project meeting with cross-functional team members. Practice agenda setting, facilitating discussion, and ensuring action items are assigned.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(30),
        requiresVoice: true,
        maxParticipants: new Int32(5),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"leadership","personalities":["detail-oriented","creative","analytical","skeptical"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(8),
        moduleId: new Int32(3),
        scenarioTitle: "Delegating Tasks Effectively",
        scenarioDescription: "Practice the art of delegation by assigning tasks to team members based on their strengths. Learn to set clear expectations and provide necessary resources.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(25),
        requiresVoice: true,
        maxParticipants: new Int32(4),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"managerial","personalities":["eager","overwhelmed","detail-oriented","independent"],"contextAwareness":"high"}',
        feedbackType: "delayed",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(9),
        moduleId: new Int32(3),
        scenarioTitle: "Performance Review Conversation",
        scenarioDescription: "Conduct a balanced performance review with a team member. Practice giving constructive feedback, acknowledging achievements, and setting development goals.",
        difficultyLevel: "advanced",
        durationMinutes: new Int32(25),
        requiresVoice: true,
        maxParticipants: new Int32(2),
        passingScore: new Double(80.0),
        aiModelConfig: '{"responseStyle":"coaching","personalities":["sensitive","defensive","open-to-feedback"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      
      // Module 4: Workplace Adaptability
      {
        scenarioId: new Int32(10),
        moduleId: new Int32(4),
        scenarioTitle: "Remote Work Collaboration",
        scenarioDescription: "Navigate the challenges of remote work by participating in a virtual team project. Practice digital communication, collaboration tools usage, and maintaining productivity.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(30),
        requiresVoice: true,
        maxParticipants: new Int32(4),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"digital-first","personalities":["tech-savvy","tech-challenged","efficient","detail-oriented"],"contextAwareness":"high"}',
        feedbackType: "delayed",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(11),
        moduleId: new Int32(4),
        scenarioTitle: "Company Restructuring",
        scenarioDescription: "Handle a major organizational change scenario where roles and responsibilities are shifting. Practice adaptability, information gathering, and maintaining productivity during uncertainty.",
        difficultyLevel: "advanced",
        durationMinutes: new Int32(35),
        requiresVoice: true,
        maxParticipants: new Int32(3),
        passingScore: new Double(80.0),
        aiModelConfig: '{"responseStyle":"strategic","personalities":["concerned","optimistic","pragmatic"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(12),
        moduleId: new Int32(4),
        scenarioTitle: "Cross-Cultural Communication",
        scenarioDescription: "Engage in a business discussion with colleagues from different cultural backgrounds. Practice cultural sensitivity, clarity in communication, and avoiding misunderstandings.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(25),
        requiresVoice: true,
        maxParticipants: new Int32(4),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"inclusive","personalities":["direct-communicator","indirect-communicator","relationship-focused","task-focused"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      
      // Module 5: Job Interview Preparation
      {
        scenarioId: new Int32(13),
        moduleId: new Int32(5),
        scenarioTitle: "Technical Interview",
        scenarioDescription: "Face a technical job interview with industry-specific questions. Practice articulating your skills, solving problems under pressure, and asking relevant questions.",
        difficultyLevel: "advanced",
        durationMinutes: new Int32(30),
        requiresVoice: true,
        maxParticipants: new Int32(2),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"evaluative","personalities":["technical-interviewer","challenging"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(14),
        moduleId: new Int32(5),
        scenarioTitle: "Behavioral Interview Questions",
        scenarioDescription: "Respond to common behavioral interview questions using the STAR method. Practice showcasing your experiences and skills through structured storytelling.",
        difficultyLevel: "intermediate",
        durationMinutes: new Int32(25),
        requiresVoice: true,
        maxParticipants: new Int32(2),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"analytical","personalities":["hr-professional","attentive"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      },
      {
        scenarioId: new Int32(15),
        moduleId: new Int32(5),
        scenarioTitle: "Salary Negotiation",
        scenarioDescription: "Practice negotiating salary and benefits in a job offer scenario. Learn to research market rates, articulate your value, and respond professionally to counteroffers.",
        difficultyLevel: "advanced",
        durationMinutes: new Int32(20),
        requiresVoice: true,
        maxParticipants: new Int32(2),
        passingScore: new Double(75.0),
        aiModelConfig: '{"responseStyle":"business","personalities":["hiring-manager","firm-but-fair"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      }
    ];
    
    // Insert scenarios into the collection
    const scenarioResult = await db.collection('scenarios').insertMany(scenarios);
    console.log(`${scenarioResult.insertedCount} scenarios inserted successfully`);
    
    // =========== VERIFICATION ==============
    // Verify insertion by retrieving all records
    const insertedModules = await db.collection('modules').find().toArray();
    console.log(`Verified ${insertedModules.length} modules in database`);
    
    const insertedScenarios = await db.collection('scenarios').find().toArray();
    console.log(`Verified ${insertedScenarios.length} scenarios in database`);
    
    // Close the connection
    await client.close();
    console.log('Database seeding completed successfully');
    
  } catch (err) {
    console.error('Database seeding error:', err);
  }
}

// Run the seed function
seedDatabase(); 