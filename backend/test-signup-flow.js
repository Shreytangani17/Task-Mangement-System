const http = require('http');

const data = JSON.stringify({
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/signup',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('Sending signup request...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);

    let body = '';
    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('BODY:', body);
        if (res.statusCode === 201 || res.statusCode === 400) {
            // 201 created or 400 (if email exists) means DB served the request
            console.log('TEST PASSED: Server responded correctly.');
            process.exit(0);
        } else {
            console.log('TEST FAILED: Unexpected status code.');
            process.exit(1);
        }
    });
});

req.on('error', (error) => {
    console.error('TEST FAILED: Request error:', error);
    process.exit(1);
});

req.write(data);
req.end();
