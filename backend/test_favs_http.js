import http from 'http';

const data = JSON.stringify({ email: 'favtest@example.com', password: 'password123' });

const req1 = http.request(
  'http://127.0.0.1:5000/api/auth/login',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': data.length }
  },
  (res1) => {
    let body = '';
    res1.on('data', c => body += c);
    res1.on('end', () => {
      const token = JSON.parse(body).token;
      console.log("Got token!", token.substring(0, 10) + '...');
      
      const req2 = http.request(
        'http://127.0.0.1:5000/api/users/favorites',
        { method: 'GET', headers: { 'Authorization': 'Bearer ' + token } },
        (res2) => {
          let b2 = '';
          res2.on('data', c => b2 += c);
          res2.on('end', () => console.log('GET /favorites:', res2.statusCode, b2));
        }
      );
      req2.end();
    });
  }
);
req1.write(data);
req1.end();
