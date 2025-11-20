const axios = require('axios');

const testServer = async () => {
  try {
    console.log('Testing server connectivity...');
    
    // Test if server is running
    const response = await axios.get('http://localhost:5000/api/health');
    console.log('Server is running:', response.data);
    
    // Test auth routes
    console.log('\nTesting auth routes...');
    
    // Test register endpoint
    try {
      const registerResponse = await axios.post('http://localhost:5000/api/auth/register', {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'student',
        department: 'Computer Science',
        studentId: 'CS123456'
      });
      console.log('Register endpoint working:', registerResponse.status);
    } catch (error) {
      console.log('Register endpoint response:', error.response?.status, error.response?.data);
    }
    
    // Test login endpoint
    try {
      const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
        email: 'test@example.com',
        password: 'password123'
      });
      console.log('Login endpoint working:', loginResponse.status);
    } catch (error) {
      console.log('Login endpoint response:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('Server test failed:', error.message);
    console.log('Make sure the backend server is running on port 5000');
  }
};

testServer();