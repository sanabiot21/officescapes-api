/**
 * Seed data utility for initial database setup
 * Using Project Sekai (PJSK) characters as sample data
 */

// Sample user data (Project Sekai characters)
const users = [
  {
    userId: 1,
    organizationId: 1,
    email: "hatsune.miku@vsingers.com",
    passwordHash: "$2a$10$XYZ123ABC456DEF789GHI", // In a real app, use bcrypt to hash passwords
    userType: "instructor",
    createdAt: new Date().toISOString(),
    lastLogin: null,
    accountStatus: "active",
    verificationStatus: true
  },
  {
    userId: 2,
    organizationId: 2,
    email: "megurine.luka@vsingers.com",
    passwordHash: "$2a$10$XYZ123ABC456DEF789GHI",
    userType: "instructor",
    createdAt: new Date().toISOString(),
    lastLogin: null,
    accountStatus: "active",
    verificationStatus: true
  },
  {
    userId: 3,
    organizationId: 3,
    email: "hoshino.ichika@leo.co.jp",
    passwordHash: "$2a$10$XYZ123ABC456DEF789GHI",
    userType: "student",
    createdAt: new Date().toISOString(),
    lastLogin: null,
    accountStatus: "active",
    verificationStatus: true
  },
  {
    userId: 4,
    organizationId: 3,
    email: "tenma.saki@leo.co.jp",
    passwordHash: "$2a$10$XYZ123ABC456DEF789GHI",
    userType: "student",
    createdAt: new Date().toISOString(),
    lastLogin: null,
    accountStatus: "active",
    verificationStatus: true
  },
  {
    userId: 5,
    organizationId: 4,
    email: "mochizuki.honami@leo.co.jp",
    passwordHash: "$2a$10$XYZ123ABC456DEF789GHI",
    userType: "student",
    createdAt: new Date().toISOString(),
    lastLogin: null,
    accountStatus: "active",
    verificationStatus: true
  },
  {
    userId: 6,
    organizationId: 4,
    email: "hinomori.shiho@leo.co.jp",
    passwordHash: "$2a$10$XYZ123ABC456DEF789GHI",
    userType: "student",
    createdAt: new Date().toISOString(),
    lastLogin: null,
    accountStatus: "active",
    verificationStatus: true
  }
];

// Sample user profile data
const userProfiles = [
  {
    profileId: 1,
    userId: 1,
    firstName: "Hatsune",
    lastName: "Miku",
    phone: "1234567890",
    bio: "Virtual singer and idol with a passion for music and teaching.",
    profilePicture: "https://example.com/profiles/miku.jpg",
    darkModePref: true,
    preferredLanguage: "Japanese",
    lastUpdated: new Date().toISOString()
  },
  {
    profileId: 2,
    userId: 2,
    firstName: "Megurine",
    lastName: "Luka",
    phone: "0987654321",
    bio: "Experienced instructor specializing in communication skills.",
    profilePicture: "https://example.com/profiles/luka.jpg",
    darkModePref: false,
    preferredLanguage: "English",
    lastUpdated: new Date().toISOString()
  },
  {
    profileId: 3,
    userId: 3,
    firstName: "Hoshino",
    lastName: "Ichika",
    phone: "1122334455",
    bio: "Guitar enthusiast and leader of Leo/need. Looking to improve leadership skills.",
    profilePicture: "https://example.com/profiles/ichika.jpg",
    darkModePref: false,
    preferredLanguage: "Japanese",
    lastUpdated: new Date().toISOString()
  },
  {
    profileId: 4,
    userId: 4,
    firstName: "Tenma",
    lastName: "Saki",
    phone: "2233445566",
    bio: "Energetic and cheerful. Wants to improve communication skills.",
    profilePicture: "https://example.com/profiles/saki.jpg",
    darkModePref: false,
    preferredLanguage: "Japanese",
    lastUpdated: new Date().toISOString()
  },
  {
    profileId: 5,
    userId: 5,
    firstName: "Mochizuki",
    lastName: "Honami",
    phone: "3344556677",
    bio: "Kind and caring. Wants to improve leadership skills.",
    profilePicture: "https://example.com/profiles/honami.jpg",
    darkModePref: true,
    preferredLanguage: "Japanese",
    lastUpdated: new Date().toISOString()
  },
  {
    profileId: 6,
    userId: 6,
    firstName: "Hinomori",
    lastName: "Shiho",
    phone: "4455667788",
    bio: "Serious and focused. Interested in professional communication.",
    profilePicture: "https://example.com/profiles/shiho.jpg",
    darkModePref: true,
    preferredLanguage: "Japanese",
    lastUpdated: new Date().toISOString()
  }
];

// Sample organization data
const organizations = [
  {
    organizationId: 1,
    organizationName: "Crypton Future Media",
    industry: "Entertainment",
    contactEmail: "contact@crypton.co.jp",
    contactPhone: "1234567890",
    address: "Sapporo, Japan"
  },
  {
    organizationId: 2,
    organizationName: "Internet Co., Ltd.",
    industry: "Entertainment",
    contactEmail: "contact@internetco.jp",
    contactPhone: "0987654321",
    address: "Tokyo, Japan"
  },
  {
    organizationId: 3,
    organizationName: "Leo/need",
    industry: "Music",
    contactEmail: "contact@leoneed.jp",
    contactPhone: "1122334455",
    address: "Miyamasuzaka, Japan"
  },
  {
    organizationId: 4,
    organizationName: "MORE MORE JUMP!",
    industry: "Entertainment",
    contactEmail: "contact@mmj.jp",
    contactPhone: "2233445566",
    address: "Miyamasuzaka, Japan"
  }
];

// Sample module data
const modules = [
  {
    moduleId: 1,
    moduleName: "Effective Communication Basics",
    moduleDescription: "Learn the fundamentals of effective professional communication.",
    moduleDifficultyLevel: "beginner",
    prerequisites: null,
    estimatedDuration: 60,
    learningObjectives: "Understand basic communication principles, practice active listening, develop clear messaging.",
    category: "Communication",
    tags: "communication,basics,professional",
    status: "published"
  },
  {
    moduleId: 2,
    moduleName: "Leadership Fundamentals",
    moduleDescription: "Introduction to leadership principles for new team leaders.",
    moduleDifficultyLevel: "intermediate",
    prerequisites: 1,
    estimatedDuration: 90,
    learningObjectives: "Understand leadership styles, develop team building skills, learn delegation techniques.",
    category: "Leadership",
    tags: "leadership,teamwork,management",
    status: "published"
  },
  {
    moduleId: 3,
    moduleName: "Conflict Resolution",
    moduleDescription: "Techniques for resolving workplace conflicts effectively.",
    moduleDifficultyLevel: "intermediate",
    prerequisites: 1,
    estimatedDuration: 75,
    learningObjectives: "Identify conflict sources, apply mediation techniques, develop win-win solutions.",
    category: "Communication",
    tags: "conflict,resolution,workplace",
    status: "published"
  }
];

// Sample scenario data
const scenarios = [
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
  },
  {
    scenarioId: 3,
    moduleId: 2,
    scenarioTitle: "Team Leadership Challenge",
    scenarioDescription: "Lead a team through a crisis situation with limited resources.",
    difficultyLevel: "advanced",
    durationMinutes: 40,
    requiresVoice: true,
    maxParticipants: 5,
    passingScore: 80.0,
    aiModelConfig: '{"responseStyle":"varied","personalities":["stressed","collaborative","resistant"],"contextAwareness":"dynamic"}',
    feedbackType: "comprehensive",
    version: "1.1.0"
  },
  {
    scenarioId: 4,
    moduleId: 3,
    scenarioTitle: "Workplace Conflict Mediation",
    scenarioDescription: "Mediate a conflict between two team members with different working styles.",
    difficultyLevel: "intermediate",
    durationMinutes: 30,
    requiresVoice: true,
    maxParticipants: 3,
    passingScore: 75.0,
    aiModelConfig: '{"responseStyle":"emotional","personalities":["frustrated","defensive"],"contextAwareness":"medium"}',
    feedbackType: "delayed",
    version: "1.0.0"
  }
];

// Sample training session data
const trainingSessions = [
  {
    sessionId: 1,
    userId: 3,
    scenarioId: 1,
    startTime: "2024-05-10T14:30:00.000Z",
    endTime: "2024-05-10T14:48:23.000Z",
    completionStatus: "completed",
    performanceMetrics: '{"clarity":85,"confidence":78,"professionalism":82,"overallScore":81.7}',
    aiFeedback: "Good introduction overall. Consider maintaining more consistent eye contact and speaking at a slightly slower pace for better clarity."
  },
  {
    sessionId: 2,
    userId: 4,
    scenarioId: 1,
    startTime: "2024-05-10T15:10:00.000Z",
    endTime: "2024-05-10T15:24:45.000Z",
    completionStatus: "completed",
    performanceMetrics: '{"clarity":90,"confidence":85,"professionalism":88,"overallScore":87.7}',
    aiFeedback: "Excellent introduction with clear articulation and appropriate enthusiasm. Your personal anecdote was relevant and effectively built rapport."
  },
  {
    sessionId: 3,
    userId: 5,
    scenarioId: 2,
    startTime: "2024-05-11T10:00:00.000Z",
    endTime: "2024-05-11T10:32:12.000Z",
    completionStatus: "completed",
    performanceMetrics: '{"clientEngagement":76,"problemSolving":82,"negotiation":74,"overallScore":77.3}',
    aiFeedback: "You handled the client's concerns well but could improve on presenting alternative solutions more confidently. Good job maintaining professionalism throughout."
  },
  {
    sessionId: 4,
    userId: 6,
    scenarioId: 3,
    startTime: "2024-05-11T13:15:00.000Z",
    endTime: null,
    completionStatus: "in-progress",
    performanceMetrics: '{"currentProgress":60,"timeElapsed":"00:24:18"}',
    aiFeedback: null
  }
];

// Sample assessment result data
const assessmentResults = [
  {
    resultId: 1,
    userId: 3,
    scenarioId: 1,
    sessionId: 1,
    score: 81.7,
    detailedFeedback: "Demonstrated good understanding of professional introduction protocols. Maintained appropriate formality and provided relevant information concisely.",
    completionDate: "2024-05-10T14:48:23.000Z",
    reviewerNotes: "Student showed significant improvement from previous assessments.",
    skillsRatings: '{"communication":82,"selfPresentation":80,"listeningSkills":83}',
    improvementAreas: "Work on maintaining more consistent eye contact and managing speaking pace."
  },
  {
    resultId: 2,
    userId: 4,
    scenarioId: 1,
    sessionId: 2,
    score: 87.7,
    detailedFeedback: "Excellent introduction that effectively combined professionalism with personalization. Good voice modulation and confident delivery.",
    completionDate: "2024-05-10T15:24:45.000Z",
    reviewerNotes: null,
    skillsRatings: '{"communication":88,"selfPresentation":89,"listeningSkills":86}',
    improvementAreas: "Continue practicing with more challenging introduction scenarios."
  },
  {
    resultId: 3,
    userId: 5,
    scenarioId: 2,
    sessionId: 3,
    score: 77.3,
    detailedFeedback: "Handled client meeting satisfactorily. Maintained professionalism throughout and addressed key concerns.",
    completionDate: "2024-05-11T10:32:12.000Z",
    reviewerNotes: "Student struggles with confidence when presenting alternative solutions.",
    skillsRatings: '{"communication":78,"problemSolving":75,"clientManagement":79}',
    improvementAreas: "Practice articulating solutions more confidently and preparing fallback options."
  }
];

// Sample skill data
const skills = [
  {
    skillId: 1,
    skillName: "Active Listening",
    skillCategory: "Communication",
    skillDescription: "The ability to fully concentrate, understand, respond, and remember what is being said in a conversation.",
    evaluationCriteria: "Response relevance, clarification questions, summarization ability, nonverbal cues"
  },
  {
    skillId: 2,
    skillName: "Clear Communication",
    skillCategory: "Communication",
    skillDescription: "The ability to convey information clearly and effectively to different audiences.",
    evaluationCriteria: "Message clarity, audience adaptation, conciseness, engagement"
  },
  {
    skillId: 3,
    skillName: "Conflict Resolution",
    skillCategory: "Interpersonal",
    skillDescription: "The ability to address and resolve conflicts constructively and professionally.",
    evaluationCriteria: "Problem identification, emotional management, solution generation, mediation skills"
  },
  {
    skillId: 4,
    skillName: "Team Leadership",
    skillCategory: "Leadership",
    skillDescription: "The ability to guide and motivate a team toward achieving common goals.",
    evaluationCriteria: "Vision setting, delegation, motivation, accountability, feedback provision"
  },
  {
    skillId: 5,
    skillName: "Time Management",
    skillCategory: "Productivity",
    skillDescription: "The ability to plan and control how to allocate time effectively to specific activities.",
    evaluationCriteria: "Prioritization, deadline management, efficiency, focus maintenance"
  }
];

// Sample user skill data
const userSkills = [
  {
    userSkillId: 1,
    userId: 3,
    skillId: 1,
    proficiencyLevel: 3,
    lastAssessed: "2024-05-10T14:48:23.000Z",
    endorsedBy: "Hatsune Miku"
  },
  {
    userSkillId: 2,
    userId: 3,
    skillId: 2,
    proficiencyLevel: 4,
    lastAssessed: "2024-05-10T14:48:23.000Z",
    endorsedBy: null
  },
  {
    userSkillId: 3,
    userId: 4,
    skillId: 1,
    proficiencyLevel: 4,
    lastAssessed: "2024-05-10T15:24:45.000Z",
    endorsedBy: "Megurine Luka"
  },
  {
    userSkillId: 4,
    userId: 4,
    skillId: 2,
    proficiencyLevel: 5,
    lastAssessed: "2024-05-10T15:24:45.000Z",
    endorsedBy: "Megurine Luka"
  },
  {
    userSkillId: 5,
    userId: 5,
    skillId: 1,
    proficiencyLevel: 3,
    lastAssessed: "2024-05-11T10:32:12.000Z",
    endorsedBy: null
  },
  {
    userSkillId: 6,
    userId: 5,
    skillId: 3,
    proficiencyLevel: 2,
    lastAssessed: "2024-05-11T10:32:12.000Z",
    endorsedBy: null
  }
];

// Sample notification data
const notifications = [
  {
    notificationId: 1,
    userId: 3,
    notificationTitle: "Assessment Completed",
    content: "Your assessment for 'First Day Introductions' has been evaluated. Check your results!",
    createdAt: "2024-05-10T14:50:00.000Z",
    readStatus: true,
    priority: "medium",
    actionUrl: "/assessment/1",
    expiryDate: "2024-06-10T14:50:00.000Z"
  },
  {
    notificationId: 2,
    userId: 4,
    notificationTitle: "Assessment Completed",
    content: "Your assessment for 'First Day Introductions' has been evaluated. You scored 87.7/100!",
    createdAt: "2024-05-10T15:30:00.000Z",
    readStatus: true,
    priority: "medium",
    actionUrl: "/assessment/2",
    expiryDate: "2024-06-10T15:30:00.000Z"
  },
  {
    notificationId: 3,
    userId: 5,
    notificationTitle: "Assessment Completed",
    content: "Your assessment for 'Client Meeting Simulation' has been evaluated. Check your results!",
    createdAt: "2024-05-11T10:35:00.000Z",
    readStatus: false,
    priority: "medium",
    actionUrl: "/assessment/3",
    expiryDate: "2024-06-11T10:35:00.000Z"
  },
  {
    notificationId: 4,
    userId: 6,
    notificationTitle: "Session In Progress",
    content: "You have an ongoing session for 'Team Leadership Challenge'. Click to resume.",
    createdAt: "2024-05-11T13:45:00.000Z",
    readStatus: false,
    priority: "high",
    actionUrl: "/session/4",
    expiryDate: "2024-05-12T13:45:00.000Z"
  },
  {
    notificationId: 5,
    userId: 3,
    notificationTitle: "New Module Available",
    content: "A new module 'Advanced Communication Techniques' is now available for you.",
    createdAt: "2024-05-12T09:00:00.000Z",
    readStatus: false,
    priority: "low",
    actionUrl: "/modules/4",
    expiryDate: "2024-06-12T09:00:00.000Z"
  }
];

// Function to seed data into MongoDB
async function seedDatabase(db) {
  try {
    console.log("Starting database seeding...");
    
    // Insert users if collection is empty
    const usersCount = await db.collection('users').countDocuments();
    if (usersCount === 0) {
      try {
        await db.collection('users').insertMany(users);
        console.log(`${users.length} users inserted`);
      } catch (error) {
        console.error("Error inserting users:", error);
        return; // Stop if this fails as other collections depend on users
      }
    } else {
      console.log("Users collection already has data. Skipping users seed.");
    }
    
    // Insert user profiles if collection is empty
    const userProfilesCount = await db.collection('userProfiles').countDocuments();
    if (userProfilesCount === 0) {
      try {
        await db.collection('userProfiles').insertMany(userProfiles);
        console.log(`${userProfiles.length} user profiles inserted`);
      } catch (error) {
        console.error("Error inserting user profiles:", error);
      }
    } else {
      console.log("UserProfiles collection already has data. Skipping profiles seed.");
    }
    
    // Insert organizations if collection is empty
    const organizationsCount = await db.collection('organizations').countDocuments();
    if (organizationsCount === 0) {
      try {
        await db.collection('organizations').insertMany(organizations);
        console.log(`${organizations.length} organizations inserted`);
      } catch (error) {
        console.error("Error inserting organizations:", error);
      }
    } else {
      console.log("Organizations collection already has data. Skipping organizations seed.");
    }
    
    // Insert modules if collection is empty
    const modulesCount = await db.collection('modules').countDocuments();
    if (modulesCount === 0) {
      try {
        await db.collection('modules').insertMany(modules);
        console.log(`${modules.length} modules inserted`);
      } catch (error) {
        console.error("Error inserting modules:", error);
      }
    } else {
      console.log("Modules collection already has data. Skipping modules seed.");
    }
    
    // Insert scenarios if collection is empty
    const scenariosCount = await db.collection('scenarios').countDocuments();
    if (scenariosCount === 0) {
      try {
        await db.collection('scenarios').insertMany(scenarios);
        console.log(`${scenarios.length} scenarios inserted`);
      } catch (error) {
        console.error("Error inserting scenarios:", error);
        console.error("Validation details:", JSON.stringify(error.errorResponse?.errInfo?.details, null, 2));
      }
    } else {
      console.log("Scenarios collection already has data. Skipping scenarios seed.");
    }
    
    // Insert training sessions if collection is empty
    const trainingSessionsCount = await db.collection('trainingSessions').countDocuments();
    if (trainingSessionsCount === 0) {
      try {
        await db.collection('trainingSessions').insertMany(trainingSessions);
        console.log(`${trainingSessions.length} training sessions inserted`);
      } catch (error) {
        console.error("Error inserting training sessions:", error);
        console.error("Validation details:", JSON.stringify(error.errorResponse?.errInfo?.details, null, 2));
      }
    } else {
      console.log("TrainingSessions collection already has data. Skipping training sessions seed.");
    }
    
    // Insert assessment results if collection is empty
    const assessmentResultsCount = await db.collection('assessmentResults').countDocuments();
    if (assessmentResultsCount === 0) {
      try {
        await db.collection('assessmentResults').insertMany(assessmentResults);
        console.log(`${assessmentResults.length} assessment results inserted`);
      } catch (error) {
        console.error("Error inserting assessment results:", error);
        console.error("Validation details:", JSON.stringify(error.errorResponse?.errInfo?.details, null, 2));
      }
    } else {
      console.log("AssessmentResults collection already has data. Skipping assessment results seed.");
    }
    
    // Insert skills if collection is empty
    const skillsCount = await db.collection('skills').countDocuments();
    if (skillsCount === 0) {
      try {
        await db.collection('skills').insertMany(skills);
        console.log(`${skills.length} skills inserted`);
      } catch (error) {
        console.error("Error inserting skills:", error);
        console.error("Validation details:", JSON.stringify(error.errorResponse?.errInfo?.details, null, 2));
      }
    } else {
      console.log("Skills collection already has data. Skipping skills seed.");
    }
    
    // Insert user skills if collection is empty
    const userSkillsCount = await db.collection('userSkills').countDocuments();
    if (userSkillsCount === 0) {
      try {
        await db.collection('userSkills').insertMany(userSkills);
        console.log(`${userSkills.length} user skills inserted`);
      } catch (error) {
        console.error("Error inserting user skills:", error);
        console.error("Validation details:", JSON.stringify(error.errorResponse?.errInfo?.details, null, 2));
      }
    } else {
      console.log("UserSkills collection already has data. Skipping user skills seed.");
    }
    
    // Insert notifications if collection is empty
    const notificationsCount = await db.collection('notifications').countDocuments();
    if (notificationsCount === 0) {
      try {
        await db.collection('notifications').insertMany(notifications);
        console.log(`${notifications.length} notifications inserted`);
      } catch (error) {
        console.error("Error inserting notifications:", error);
        console.error("Validation details:", JSON.stringify(error.errorResponse?.errInfo?.details, null, 2));
      }
    } else {
      console.log("Notifications collection already has data. Skipping notifications seed.");
    }
    
    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

module.exports = seedDatabase; 