const http = require('http');

function makeRequest(path, method, body) {
    return new Promise((resolve, reject) => {
        const data = JSON.stringify(body);
        const options = {
            hostname: 'localhost',
            port: 5000,
            path: '/api/auth' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = http.request(options, (res) => {
            let responseBody = '';
            res.on('data', (chunk) => responseBody += chunk);
            res.on('end', () => {
                resolve({
                    status: res.statusCode,
                    data: responseBody ? JSON.parse(responseBody) : {}
                });
            });
        });

        req.on('error', (error) => reject(error));
        req.write(data);
        req.end();
    });
}

async function test() {
    const uniqueName = `User${Date.now()}`;
    const newUser = {
        name: uniqueName,
        email: `${uniqueName}@example.com`,
        password: 'password123',
        role: 'employee'
    };

    console.log('Testing Signup...');
    try {
        const res = await makeRequest('/signup', 'POST', newUser);
        console.log(`Signup Status: ${res.status}`);
        console.log('Signup Response:', res.data);

        if (res.status === 201) {
            console.log('Signup Successful');
        } else {
            console.log('Signup Failed');
        }

        // Now try to signup SAME user again to see error
        console.log('Testing Duplicate Signup...');
        const res2 = await makeRequest('/signup', 'POST', newUser);
        console.log(`Duplicate Status: ${res2.status}`);
        console.log('Duplicate Response:', res2.data);

        // Test Login with WRONG password to see "Invalid credentials"
        console.log('Testing Login with Wrong Password...');
        const res3 = await makeRequest('/login', 'POST', {
            email: newUser.email,
            password: 'wrongpassword'
        });
        console.log(`Login Status: ${res3.status}`);
        console.log('Login Response:', res3.data);

    } catch (err) {
        console.error('Test Error:', err);
    }
}

test();
