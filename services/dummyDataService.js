// services/dummyDataService.js - Dummy Data Service for Development
import AsyncStorage from '@react-native-async-storage/async-storage';

class DummyDataService {
  constructor() {
    this.initialized = false;
  }

  // Initialize dummy data if not exists
  async initializeDummyData() {
    if (this.initialized) return;

    const existingSubmissions = await AsyncStorage.getItem('allSubmissions');
    const existingUsers = await AsyncStorage.getItem('allUsers');

    if (!existingSubmissions) {
      await AsyncStorage.setItem('allSubmissions', JSON.stringify(this.getDummySubmissions()));
    }

    if (!existingUsers) {
      await AsyncStorage.setItem('allUsers', JSON.stringify(this.getDummyUsers()));
    }

    this.initialized = true;
  }

  // Get dummy users data
  getDummyUsers() {
    return [
      {
        id: 'user_001',
        fullName: 'Arjun Kumar',
        email: 'arjun.kumar@example.com',
        phoneNumber: '9876543210',
        dateOfBirth: '2005-03-15',
        gender: 'Male',
        city: 'Mumbai',
        state: 'Maharashtra',
        sport: 'Cricket',
        experience: '5',
        createdAt: '2024-01-10T10:30:00.000Z',
        profile: {
          isProfileComplete: true,
          currentStatus: 'submitted',
          totalSubmissions: 3,
          approvedSubmissions: 1,
          rejectedSubmissions: 1,
          pendingSubmissions: 1
        }
      },
      {
        id: 'user_002',
        fullName: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phoneNumber: '9876543211',
        dateOfBirth: '2004-07-22',
        gender: 'Female',
        city: 'Delhi',
        state: 'Delhi',
        sport: 'Badminton',
        experience: '3',
        createdAt: '2024-01-15T14:20:00.000Z',
        profile: {
          isProfileComplete: true,
          currentStatus: 'under_review',
          totalSubmissions: 2,
          approvedSubmissions: 0,
          rejectedSubmissions: 0,
          pendingSubmissions: 2
        }
      },
      {
        id: 'user_003',
        fullName: 'Rahul Singh',
        email: 'rahul.singh@example.com',
        phoneNumber: '9876543212',
        dateOfBirth: '2003-11-08',
        gender: 'Male',
        city: 'Bangalore',
        state: 'Karnataka',
        sport: 'Athletics',
        experience: '4',
        createdAt: '2024-01-20T09:15:00.000Z',
        profile: {
          isProfileComplete: true,
          currentStatus: 'approved',
          totalSubmissions: 4,
          approvedSubmissions: 2,
          rejectedSubmissions: 1,
          pendingSubmissions: 1
        }
      },
      {
        id: 'user_004',
        fullName: 'Sneha Patel',
        email: 'sneha.patel@example.com',
        phoneNumber: '9876543213',
        dateOfBirth: '2005-05-12',
        gender: 'Female',
        city: 'Ahmedabad',
        state: 'Gujarat',
        sport: 'Swimming',
        experience: '2',
        createdAt: '2024-02-01T16:45:00.000Z',
        profile: {
          isProfileComplete: true,
          currentStatus: 'registered',
          totalSubmissions: 0,
          approvedSubmissions: 0,
          rejectedSubmissions: 0,
          pendingSubmissions: 0
        }
      },
      {
        id: 'user_005',
        fullName: 'Vikash Yadav',
        email: 'vikash.yadav@example.com',
        phoneNumber: '9876543214',
        dateOfBirth: '2004-09-30',
        gender: 'Male',
        city: 'Chennai',
        state: 'Tamil Nadu',
        sport: 'Football',
        experience: '6',
        createdAt: '2024-02-05T11:30:00.000Z',
        profile: {
          isProfileComplete: true,
          currentStatus: 'submitted',
          totalSubmissions: 2,
          approvedSubmissions: 0,
          rejectedSubmissions: 1,
          pendingSubmissions: 1
        }
      }
    ];
  }

  // Get dummy submissions data
  getDummySubmissions() {
    return [
      {
        id: 'sub_001',
        userId: 'user_001',
        userName: 'Arjun Kumar',
        userEmail: 'arjun.kumar@example.com',
        sport: 'Cricket',
        subcategory: 'Batting Technique',
        videoUri: 'dummy://cricket_batting_001.mp4',
        submittedAt: '2024-01-12T10:30:00.000Z',
        status: 'approved',
        aiScore: 85,
        saiScore: 88,
        feedback: 'Excellent batting stance and follow-through. Good timing and technique demonstrated.',
        reviewedBy: 'SAI Cricket Coach - Rajesh Mehta',
        reviewedAt: '2024-01-14T15:20:00.000Z',
        strengths: ['Proper grip', 'Good balance', 'Clean hitting'],
        improvements: ['Work on back foot shots', 'Improve running between wickets'],
        nextSteps: 'Selected for regional coaching camp in Mumbai'
      },
      {
        id: 'sub_002',
        userId: 'user_001',
        userName: 'Arjun Kumar',
        userEmail: 'arjun.kumar@example.com',
        sport: 'Cricket',
        subcategory: 'Bowling Action',
        videoUri: 'dummy://cricket_bowling_001.mp4',
        submittedAt: '2024-01-18T14:15:00.000Z',
        status: 'rejected',
        aiScore: 62,
        saiScore: 58,
        feedback: 'Bowling action needs significant improvement. Action appears to have technical flaws.',
        reviewedBy: 'SAI Cricket Coach - Rajesh Mehta',
        reviewedAt: '2024-01-20T11:45:00.000Z',
        strengths: ['Good pace variation'],
        improvements: ['Correct bowling action', 'Improve line and length', 'Work on fitness'],
        nextSteps: 'Recommended for technique correction coaching'
      },
      {
        id: 'sub_003',
        userId: 'user_001',
        userName: 'Arjun Kumar',
        userEmail: 'arjun.kumar@example.com',
        sport: 'Cricket',
        subcategory: 'Fielding Skills',
        videoUri: 'dummy://cricket_fielding_001.mp4',
        submittedAt: '2024-02-05T09:20:00.000Z',
        status: 'under_review',
        aiScore: 78,
        saiScore: null,
        feedback: null,
        reviewedBy: null,
        reviewedAt: null,
        strengths: null,
        improvements: null,
        nextSteps: null
      },
      {
        id: 'sub_004',
        userId: 'user_002',
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@example.com',
        sport: 'Badminton',
        subcategory: 'Smash Technique',
        videoUri: 'dummy://badminton_smash_001.mp4',
        submittedAt: '2024-01-16T11:30:00.000Z',
        status: 'under_review',
        aiScore: 82,
        saiScore: null,
        feedback: null,
        reviewedBy: null,
        reviewedAt: null,
        strengths: null,
        improvements: null,
        nextSteps: null
      },
      {
        id: 'sub_005',
        userId: 'user_002',
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@example.com',
        sport: 'Badminton',
        subcategory: 'Footwork',
        videoUri: 'dummy://badminton_footwork_001.mp4',
        submittedAt: '2024-01-22T16:45:00.000Z',
        status: 'pending',
        aiScore: 75,
        saiScore: null,
        feedback: null,
        reviewedBy: null,
        reviewedAt: null,
        strengths: null,
        improvements: null,
        nextSteps: null
      },
      {
        id: 'sub_006',
        userId: 'user_003',
        userName: 'Rahul Singh',
        userEmail: 'rahul.singh@example.com',
        sport: 'Athletics',
        subcategory: '100m Sprint',
        videoUri: 'dummy://athletics_sprint_001.mp4',
        submittedAt: '2024-01-21T08:15:00.000Z',
        status: 'approved',
        aiScore: 92,
        saiScore: 95,
        feedback: 'Outstanding sprint technique! Excellent start and acceleration phase.',
        reviewedBy: 'SAI Athletics Coach - Dr. Sunita Rani',
        reviewedAt: '2024-01-23T10:30:00.000Z',
        strengths: ['Perfect starting position', 'Excellent acceleration', 'Good finishing form'],
        improvements: ['Work on maintaining speed in final 20m'],
        nextSteps: 'Selected for National Junior Athletics Camp'
      },
      {
        id: 'sub_007',
        userId: 'user_003',
        userName: 'Rahul Singh',
        userEmail: 'rahul.singh@example.com',
        sport: 'Athletics',
        subcategory: 'Long Jump',
        videoUri: 'dummy://athletics_longjump_001.mp4',
        submittedAt: '2024-01-25T13:20:00.000Z',
        status: 'approved',
        aiScore: 87,
        saiScore: 85,
        feedback: 'Good jump technique with room for improvement in approach run.',
        reviewedBy: 'SAI Athletics Coach - Dr. Sunita Rani',
        reviewedAt: '2024-01-27T14:15:00.000Z',
        strengths: ['Good takeoff technique', 'Proper landing form'],
        improvements: ['Improve approach run consistency', 'Work on takeoff timing'],
        nextSteps: 'Continue training with focus on approach run'
      },
      {
        id: 'sub_008',
        userId: 'user_003',
        userName: 'Rahul Singh',
        userEmail: 'rahul.singh@example.com',
        sport: 'Athletics',
        subcategory: 'High Jump',
        videoUri: 'dummy://athletics_highjump_001.mp4',
        submittedAt: '2024-02-01T10:45:00.000Z',
        status: 'rejected',
        aiScore: 68,
        saiScore: 65,
        feedback: 'High jump technique needs significant work. Approach and takeoff both need improvement.',
        reviewedBy: 'SAI Athletics Coach - Dr. Sunita Rani',
        reviewedAt: '2024-02-03T09:30:00.000Z',
        strengths: ['Good physical fitness'],
        improvements: ['Learn proper Fosbury Flop technique', 'Improve approach angle', 'Work on takeoff timing'],
        nextSteps: 'Recommended for specialized high jump coaching'
      },
      {
        id: 'sub_009',
        userId: 'user_003',
        userName: 'Rahul Singh',
        userEmail: 'rahul.singh@example.com',
        sport: 'Athletics',
        subcategory: 'Shot Put',
        videoUri: 'dummy://athletics_shotput_001.mp4',
        submittedAt: '2024-02-08T15:30:00.000Z',
        status: 'pending',
        aiScore: 71,
        saiScore: null,
        feedback: null,
        reviewedBy: null,
        reviewedAt: null,
        strengths: null,
        improvements: null,
        nextSteps: null
      },
      {
        id: 'sub_010',
        userId: 'user_005',
        userName: 'Vikash Yadav',
        userEmail: 'vikash.yadav@example.com',
        sport: 'Football',
        subcategory: 'Ball Control',
        videoUri: 'dummy://football_control_001.mp4',
        submittedAt: '2024-02-06T12:15:00.000Z',
        status: 'rejected',
        aiScore: 65,
        saiScore: 62,
        feedback: 'Ball control skills need improvement. Touch and first touch both require work.',
        reviewedBy: 'SAI Football Coach - Arun Kumar',
        reviewedAt: '2024-02-08T11:20:00.000Z',
        strengths: ['Good enthusiasm', 'Decent pace'],
        improvements: ['Improve first touch', 'Work on close ball control', 'Practice juggling'],
        nextSteps: 'Recommended for basic skills development program'
      },
      {
        id: 'sub_011',
        userId: 'user_005',
        userName: 'Vikash Yadav',
        userEmail: 'vikash.yadav@example.com',
        sport: 'Football',
        subcategory: 'Shooting Accuracy',
        videoUri: 'dummy://football_shooting_001.mp4',
        submittedAt: '2024-02-10T14:30:00.000Z',
        status: 'under_review',
        aiScore: 73,
        saiScore: null,
        feedback: null,
        reviewedBy: null,
        reviewedAt: null,
        strengths: null,
        improvements: null,
        nextSteps: null
      }
    ];
  }

  // Get SAI team members
  getSAITeamMembers() {
    return [
      {
        id: 'sai_001',
        fullName: 'Dr. Sunita Rani',
        email: 'sunita.rani@sai.gov.in',
        role: 'Senior Athletics Coach',
        department: 'Athletics Division',
        expertise: ['Sprints', 'Jumps', 'Throws'],
        experience: '15 years',
        location: 'National Institute of Sports, Patiala',
        reviewsCompleted: 45,
        avgReviewTime: '2.3 days'
      },
      {
        id: 'sai_002',
        fullName: 'Rajesh Mehta',
        email: 'rajesh.mehta@sai.gov.in',
        role: 'Cricket Development Officer',
        department: 'Cricket Division',
        expertise: ['Batting', 'Bowling', 'Fielding'],
        experience: '12 years',
        location: 'SAI Regional Center, Mumbai',
        reviewsCompleted: 38,
        avgReviewTime: '1.8 days'
      },
      {
        id: 'sai_003',
        fullName: 'Arun Kumar',
        email: 'arun.kumar@sai.gov.in',
        role: 'Football Technical Director',
        department: 'Football Division',
        expertise: ['Technical Skills', 'Tactical Play', 'Youth Development'],
        experience: '18 years',
        location: 'SAI Training Center, Goa',
        reviewsCompleted: 52,
        avgReviewTime: '2.1 days'
      },
      {
        id: 'sai_004',
        fullName: 'Meera Krishnan',
        email: 'meera.krishnan@sai.gov.in',
        role: 'Badminton Coach',
        department: 'Racket Sports Division',
        expertise: ['Singles', 'Doubles', 'Technique Analysis'],
        experience: '10 years',
        location: 'SAI Center, Hyderabad',
        reviewsCompleted: 31,
        avgReviewTime: '1.5 days'
      },
      {
        id: 'sai_005',
        fullName: 'Vikram Singh',
        email: 'vikram.singh@sai.gov.in',
        role: 'Swimming Coach',
        department: 'Aquatic Sports Division',
        expertise: ['Freestyle', 'Backstroke', 'Technique Correction'],
        experience: '14 years',
        location: 'SAI Aquatic Center, Bangalore',
        reviewsCompleted: 29,
        avgReviewTime: '2.7 days'
      }
    ];
  }

  // Get all submissions for admin view
  async getAllSubmissions() {
    await this.initializeDummyData();
    const submissions = await AsyncStorage.getItem('allSubmissions');
    return submissions ? JSON.parse(submissions) : [];
  }

  // Get submissions by status
  async getSubmissionsByStatus(status) {
    const allSubmissions = await this.getAllSubmissions();
    return allSubmissions.filter(sub => sub.status === status);
  }

  // Get submissions for a specific user
  async getUserSubmissions(userId) {
    const allSubmissions = await this.getAllSubmissions();
    return allSubmissions.filter(sub => sub.userId === userId);
  }

  // Update submission status and review
  async updateSubmissionReview(submissionId, reviewData) {
    const allSubmissions = await this.getAllSubmissions();
    const submissionIndex = allSubmissions.findIndex(sub => sub.id === submissionId);
    
    if (submissionIndex !== -1) {
      allSubmissions[submissionIndex] = {
        ...allSubmissions[submissionIndex],
        ...reviewData,
        reviewedAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));
      return allSubmissions[submissionIndex];
    }
    
    return null;
  }

  // Get statistics for dashboard
  async getStatistics() {
    const allSubmissions = await this.getAllSubmissions();
    
    return {
      total: allSubmissions.length,
      pending: allSubmissions.filter(sub => sub.status === 'pending').length,
      underReview: allSubmissions.filter(sub => sub.status === 'under_review').length,
      approved: allSubmissions.filter(sub => sub.status === 'approved').length,
      rejected: allSubmissions.filter(sub => sub.status === 'rejected').length,
      avgAiScore: Math.round(allSubmissions.reduce((sum, sub) => sum + (sub.aiScore || 0), 0) / allSubmissions.length),
      avgSaiScore: Math.round(allSubmissions.filter(sub => sub.saiScore).reduce((sum, sub) => sum + sub.saiScore, 0) / allSubmissions.filter(sub => sub.saiScore).length) || 0
    };
  }

  // Add new submission (for users)
  async addSubmission(submissionData) {
    const allSubmissions = await this.getAllSubmissions();
    const newSubmission = {
      id: `sub_${Date.now()}`,
      ...submissionData,
      submittedAt: new Date().toISOString(),
      status: 'pending',
      saiScore: null,
      feedback: null,
      reviewedBy: null,
      reviewedAt: null,
      strengths: null,
      improvements: null,
      nextSteps: null
    };
    
    allSubmissions.push(newSubmission);
    await AsyncStorage.setItem('allSubmissions', JSON.stringify(allSubmissions));
    return newSubmission;
  }

  // Get user details
  async getUser(userId) {
    await this.initializeDummyData();
    const users = await AsyncStorage.getItem('allUsers');
    const allUsers = users ? JSON.parse(users) : [];
    return allUsers.find(user => user.id === userId);
  }

  // Search submissions
  async searchSubmissions(query, filters = {}) {
    const allSubmissions = await this.getAllSubmissions();
    let results = allSubmissions;

    // Text search
    if (query) {
      results = results.filter(sub => 
        sub.userName.toLowerCase().includes(query.toLowerCase()) ||
        sub.sport.toLowerCase().includes(query.toLowerCase()) ||
        sub.subcategory.toLowerCase().includes(query.toLowerCase())
      );
    }

    // Apply filters
    if (filters.status) {
      results = results.filter(sub => sub.status === filters.status);
    }
    
    if (filters.sport) {
      results = results.filter(sub => sub.sport === filters.sport);
    }
    
    if (filters.minScore) {
      results = results.filter(sub => (sub.saiScore || sub.aiScore) >= filters.minScore);
    }

    return results;
  }
}

export default new DummyDataService();