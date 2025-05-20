# OfficeScapes Seed Data

This directory contains scripts for populating the OfficeScapes MongoDB database with seed data for scenarios and modules. These scripts are useful for development, testing, and demonstration purposes.

## Available Seed Scripts

The package.json file includes several scripts for seeding data:

- `npm run seed-modules` - Seeds only the modules collection
- `npm run seed-scenarios` - Seeds only the scenarios collection
- `npm run seed-all` - Seeds both collections in the correct order (recommended)

## Data Structure

### Modules

The seed data includes 5 modules that provide structure for skill development:

1. **Communication Essentials** - Fundamental communication skills for workplace success
2. **Professional Problem-Solving** - Techniques for handling workplace challenges
3. **Leadership Development** - Skills for management and team leadership
4. **Workplace Adaptability** - Building resilience in diverse workplace settings
5. **Job Interview Preparation** - Preparation for successful job interviews

### Scenarios

The seed data includes 15 scenarios (3 per module) that simulate realistic workplace situations:

- **Module 1: Communication Essentials**
  - First Day Introductions
  - Client Communication Basics
  - Team Meeting Participation

- **Module 2: Professional Problem-Solving**
  - Technical Support Call
  - Project Deadline Crisis
  - Conflict Resolution

- **Module 3: Leadership Development**
  - Leading a Project Meeting
  - Delegating Tasks Effectively
  - Performance Review Conversation

- **Module 4: Workplace Adaptability**
  - Remote Work Collaboration
  - Company Restructuring
  - Cross-Cultural Communication

- **Module 5: Job Interview Preparation**
  - Technical Interview
  - Behavioral Interview Questions
  - Salary Negotiation

## Usage in Application

These scenarios and modules can be used in the OfficeScapes application to:

1. Allow users to practice professional skills in simulated environments
2. Provide structured learning paths through progressive modules
3. Offer varied difficulty levels (beginner, intermediate, advanced)
4. Support voice-based interactions with AI characters
5. Provide feedback on performance based on configurable criteria

## Customization

To customize or extend the seed data:

1. Edit the scenario or module arrays in the respective seed files
2. Add new scenarios following the existing format
3. Ensure all required fields are included according to the schema validation
4. Run the appropriate seed script to update the database

## Notes

- Seeding will drop existing collections before creating new ones
- The MongoDB connection string is hardcoded in the seed files and should be updated if necessary
- All scenarios are linked to parent modules via the `moduleId` field 