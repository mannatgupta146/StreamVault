import axios from 'axios';

async function testFavs() {
  try {
    // 1. Register a test user
    const regRes = await axios.post('http://127.0.0.1:5000/api/auth/register', {
      name: 'Test Favs',
      email: 'favtest@example.com',
      password: 'password123'
    });
    const token = regRes.data.token;
    console.log('Registered User, token:', token);

    // 2. Fetch favorites
    try {
      const favRes = await axios.get('http://127.0.0.1:5000/api/users/favorites', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Favorites:', favRes.data);
    } catch (favErr) {
      console.error('Error fetching favorites:', favErr.response ? favErr.response.data : favErr.message);
    }
  } catch (e) {
    console.error('Error:', e.response ? e.response.data : e.message);
  }
}

testFavs();
