import http from 'http';

const data = JSON.stringify({ name: 'Fav Test', email: 'favtest75@example.com', password: 'password123' });

const options = {
  hostname: '127.0.0.1',
  port: 5000,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    try {
      const respData = JSON.parse(body);
      const token = respData.token;
      console.log('Registered token:', token ? 'YES' : 'NO');
      if (!token) return console.log(respData);
      
      const favData = JSON.stringify({
        tmdb_id: 1234,
        title: "Test Movie",
        media_type: "movie"
      });

      const req2 = http.request({
        hostname: '127.0.0.1',
        port: 5000,
        path: '/api/users/favorites',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': favData.length,
          'Authorization': `Bearer ${token}`
        }
      }, (res2) => {
        let b2 = '';
        res2.on('data', c => b2 += c);
        res2.on('end', () => console.log('POST /favorites:', res2.statusCode, b2));
      });
      req2.write(favData);
      req2.end();
    } catch(e) {
      console.log('Parse error', e, body);
    }
  });
});

req.on('error', error => console.error(error));
req.write(data);
req.end();
