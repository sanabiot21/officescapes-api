/**
 * Quick test to validate user creation against MongoDB schema
 */
const { MongoClient } = require('mongodb');
const bcrypt = require('bcrypt');

// MongoDB connection string (same as main app)
const uri = 'mongodb://localhost:27017';
const dbName = 'officescapes';

async function testUserValidation() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    
    // Create test user object similar to registration endpoint
    const testUser = {
      userId: 999, // Test ID
      organizationId: 1, // Changed from 0 to 1
      email: 'test@example.com',
      passwordHash: await bcrypt.hash('password123', 10),
      userType: 'student',
      createdAt: new Date().toISOString(),
      lastLogin: null,
      accountStatus: 'active',
      verificationStatus: false // Ensure this is a boolean, not a string
    };
    
    console.log('Attempting to insert test user:', testUser);
    
    // Try to insert the user
    const result = await db.collection('users').insertOne(testUser);
    
    console.log('User inserted successfully:', result);
    
    // Clean up - remove the test user
    await db.collection('users').deleteOne({ userId: 999 });
    console.log('Test user removed');
    
  } catch (error) {
    console.error('Error in validation test:', error);
    if (error.errInfo && error.errInfo.details) {
      console.error('Validation details:', JSON.stringify(error.errInfo.details, null, 2));
    }
  } finally {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Run the test
testUserValidation(); 