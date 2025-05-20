/**
 * Application model
 * Represents an application from a graduate to an organization
 */

const createApplicationSchema = (db) => {
  /**
   * Create the applications collection if it does not exist
   */
  const createApplicationsCollection = async () => {
    const collections = await db.listCollections().toArray();
    if (!collections.some(c => c.name === 'applications')) {
      await db.createCollection('applications', {
        validator: {
          $jsonSchema: {
            bsonType: 'object',
            required: ['applicationId', 'userId', 'organizationId', 'status', 'applicationDate'],
            properties: {
              applicationId: {
                bsonType: 'int',
                description: 'must be an integer and is required'
              },
              userId: {
                bsonType: 'int',
                description: 'ID of the graduate user who is applying, must be an integer and is required'
              },
              organizationId: {
                bsonType: 'int',
                description: 'ID of the organization being applied to, must be an integer and is required'
              },
              status: {
                enum: ['pending', 'approved', 'rejected'],
                description: 'must be one of pending, approved, or rejected and is required'
              },
              applicationDate: {
                bsonType: 'string',
                description: 'Date when the application was created in ISO format and is required'
              },
              responseDate: {
                bsonType: ['string', 'null'],
                description: 'Date when the organization responded to the application in ISO format'
              },
              notes: {
                bsonType: ['string', 'null'],
                description: 'Additional notes for the application'
              },
              position: {
                bsonType: ['string', 'null'],
                description: 'Position the graduate is applying for'
              },
              skills: {
                bsonType: ['string', 'null'],
                description: 'Skills the graduate is highlighting for the application'
              },
              contactPhone: {
                bsonType: ['string', 'null'],
                description: 'Contact phone number for the application'
              }
            }
          }
        }
      });
      
      console.log('Created applications collection with schema validation');
      
      // Create indexes for faster queries
      await db.collection('applications').createIndex({ 'applicationId': 1 }, { unique: true });
      await db.collection('applications').createIndex({ 'userId': 1 });
      await db.collection('applications').createIndex({ 'organizationId': 1 });
      await db.collection('applications').createIndex({ 'status': 1 });
      
      console.log('Created indexes for applications collection');
    }
  };

  return {
    createApplicationsCollection
  };
};

module.exports = createApplicationSchema; 