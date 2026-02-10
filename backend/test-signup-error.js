const axios = require('axios');

const API_URL = 'http://localhost:5000/api/auth';

async function testSignup() {
    const uniqueName = `User${Date.now()}`;
    const newUser = {
        name: uniqueName,
        email: `${uniqueName}@example.com`,
        password: 'password123',
        role: 'employee'
    };

    console.log('Attempting signup with:', newUser);

    try {
        const response = await axios.post(`${API_URL}/signup`, newUser);
        console.log('Signup Successful:', response.status);
        console.log('Response data:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Signup Failed:', error.response.status);
            console.error('Error Data:', error.response.data);
        } else {
            console.error('Signup Error:', error.message);
        }
    }
}

// Also test submitting existing user
async function testDuplicateSignup() {
    // ... logic for duplicate ...
}

testSignup();
