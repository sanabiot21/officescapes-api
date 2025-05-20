const { MongoClient, Int32, Double } = require('mongodb');

async function seedScenarios() {
  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Reference the database
    const db = client.db('officescapes');
    
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
    const result = await db.collection('scenarios').insertMany(scenarios);
    console.log(`${result.insertedCount} scenarios inserted successfully`);
    
    // Verify insertion by retrieving all scenarios
    const insertedScenarios = await db.collection('scenarios').find().toArray();
    console.log(`Verified ${insertedScenarios.length} scenarios in database`);
    
    // Close the connection
    await client.close();
    console.log('Connection closed');
    
  } catch (err) {
    console.error('Error seeding scenarios:', err);
  }
}

// Run the seed function
seedScenarios(); 