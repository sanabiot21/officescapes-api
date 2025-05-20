const { MongoClient } = require('mongodb');

async function checkScenarios() {
  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Reference the database
    const db = client.db('officescapes');
    
    // Check schema validation
    console.log('Checking scenarios collection info...');
    const collections = await db.listCollections({ name: 'scenarios' }).toArray();
    console.log('Collection info:', JSON.stringify(collections, null, 2));
    
    // Try to read scenarios
    console.log('Attempting to read scenarios collection...');
    const scenarios = await db.collection('scenarios').find().toArray();
    console.log(`Found ${scenarios.length} scenarios`);
    
    // Try to insert a test scenario
    console.log('Attempting to insert a test scenario...');
    const testScenario = {
      scenarioId: 100,
      moduleId: 1,
      scenarioTitle: "Test Scenario",
      scenarioDescription: "This is a test scenario",
      difficultyLevel: "beginner",
      durationMinutes: 15,
      requiresVoice: true,
      maxParticipants: 1,
      passingScore: Number(70.0),
      aiModelConfig: '{"responseStyle":"professional","personalities":["supportive"],"contextAwareness":"high"}',
      feedbackType: "immediate",
      version: "1.0.0"
    };
    
    try {
      const result = await db.collection('scenarios').insertOne(testScenario);
      console.log('Inserted test scenario:', result);
    } catch (error) {
      console.error('Error inserting test scenario:', error);
      
      // If there's a validation error, examine it closely
      if (error.code === 121) {
        console.log('Validation error details:', JSON.stringify(error.errInfo, null, 2));
      }
    }
    
    // Try to insert all scenarios from seed data
    console.log('Attempting to insert all scenarios from seed data...');
    const seedScenarios = [
      {
        scenarioId: 1,
        moduleId: 1,
        scenarioTitle: "First Day Introductions",
        scenarioDescription: "Practice introducing yourself professionally in a new workplace environment.",
        difficultyLevel: "beginner",
        durationMinutes: 15,
        requiresVoice: true,
        maxParticipants: 1,
        passingScore: 70.0,
        aiModelConfig: '{"responseStyle":"professional","personalities":["supportive","attentive"],"contextAwareness":"high"}',
        feedbackType: "immediate",
        version: "1.0.0"
      },
      {
        scenarioId: 2,
        moduleId: 1,
        scenarioTitle: "Client Meeting Simulation",
        scenarioDescription: "Handle a challenging client meeting with competing priorities.",
        difficultyLevel: "intermediate",
        durationMinutes: 25,
        requiresVoice: true,
        maxParticipants: 3,
        passingScore: 75.0,
        aiModelConfig: '{"responseStyle":"business","personalities":["demanding","detail-oriented"],"contextAwareness":"high"}',
        feedbackType: "comprehensive",
        version: "1.0.0"
      }
    ];
    
    try {
      const result = await db.collection('scenarios').insertMany(seedScenarios);
      console.log('Inserted seed scenarios:', result);
    } catch (error) {
      console.error('Error inserting seed scenarios:', error);
      
      // If there's a validation error, examine it closely
      if (error.code === 121) {
        console.log('Validation error details:', JSON.stringify(error.errInfo, null, 2));
      }
    }
    
    // Close the connection
    await client.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('Database test error:', err);
  }
}

// Run the test
checkScenarios(); 