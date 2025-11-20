const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Test login functionality
const testLogin = async () => {
  try {
    console.log('Testing login functionality...');
    
    // Test server health endpoint first
    const healthResponse = await axios.get('http://localhost:5000/api/health');
    console.log('Server health check:', healthResponse.data);
    
    // Test registration first (if user doesn't exist)
    console.log('\nTesting user registration...');
    const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'student',
      department: 'Computer Science',
      studentId: 'CS123456'
    });
    
    console.log('Registration response:', registerResponse.data);
    
    // Test login
    console.log('\nTesting user login...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('Login response:', loginResponse.data);
    
    // Test profile access with token
    console.log('\nTesting profile access...');
    const profileResponse = await axios.get('http://localhost:5000/api/auth/profile', {
      headers: {
        Authorization: `Bearer ${loginResponse.data.token}`
      }
    });
    
    console.log('Profile response:', profileResponse.data);
    
    console.log('\nAll tests passed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error.response?.data || error.message);
  }
};

// Run the test
testLogin();