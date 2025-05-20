const { MongoClient } = require('mongodb');

async function testDb() {
  try {
    // Connect to MongoDB
    const uri = "mongodb+srv://sanabiot21:rey123@officescapes.zspd6n0.mongodb.net/?retryWrites=true&w=majority";
    const client = new MongoClient(uri);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    
    // Reference the database
    const db = client.db('officescapes');
    
    // Get list of collections
    const collections = await db.listCollections().toArray();
    console.log('Collections in database:');
    for (const collection of collections) {
      console.log(`- ${collection.name}`);
    }
    
    // Check each collection
    const collectionNames = [
      'users', 
      'userProfiles', 
      'organizations', 
      'modules', 
      'scenarios', 
      'trainingSessions', 
      'assessmentResults', 
      'skills', 
      'userSkills', 
      'notifications'
    ];
    
    for (const name of collectionNames) {
      try {
        const count = await db.collection(name).countDocuments();
        console.log(`Collection '${name}' has ${count} documents`);
      } catch (err) {
        console.log(`Collection '${name}' error: ${err.message}`);
      }
    }
    
    // Try to get users as an example
    const users = await db.collection('users').find().toArray();
    if (users.length > 0) {
      console.log(`Found ${users.length} users. First user email: ${users[0].email}`);
    } else {
      console.log('No users found');
    }
    
    // Close the connection
    await client.close();
    console.log('Connection closed');
  } catch (err) {
    console.error('Database test error:', err);
  }
}

// Run the test
testDb(); 