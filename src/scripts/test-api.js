const http = require('http');

const loginData = JSON.stringify({
  email: 'admin@hotels.com',
  password: 'admin123'
});

const loginOptions = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
};

const req = http.request(loginOptions, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log('Login Response:', data);
    const response = JSON.parse(data);
    if (response.token) {
      console.log('Login Successful!');
      testProfile(response.token);
    } else {
      console.log('Login Failed!');
      process.exit(1);
    }
  });
});

req.on('error', (error) => {
  console.error('Login Error:', error);
  process.exit(1);
});

req.write(loginData);
req.end();

function testProfile(token) {
  const profileOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/profile',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  };

  const profileReq = http.request(profileOptions, (res) => {
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    res.on('end', () => {
      console.log('Profile Response:', data);
      const profile = JSON.parse(data);
      if (profile.email === 'admin@hotels.com') {
        console.log('Profile Test Successful!');
        process.exit(0);
      } else {
        console.log('Profile Test Failed!');
        process.exit(1);
      }
    });
  });

  profileReq.on('error', (error) => {
    console.error('Profile Error:', error);
    process.exit(1);
  });

  profileReq.end();
}
