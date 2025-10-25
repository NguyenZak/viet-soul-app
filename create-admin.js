const bcrypt = require('bcryptjs');
const { Client } = require('pg');

async function createAdmin() {
  const client = new Client({
    connectionString: 'postgresql://localhost:5432/vietsoul'
  });

  try {
    await client.connect();
    console.log('✅ Connected to database');

    // Admin credentials
    const email = 'admin@vietsoul.app';
    const password = 'admin123';
    const name = 'Admin';

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Check if user exists
    const checkResult = await client.query('SELECT id FROM users WHERE email = $1', [email]);
    
    if (checkResult.rows.length > 0) {
      // Update existing user
      await client.query(
        'UPDATE users SET password_hash = $1, name = $2 WHERE email = $3',
        [password_hash, name, email]
      );
      console.log('✅ Admin user updated!');
    } else {
      // Insert new user
      await client.query(
        'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3)',
        [email, password_hash, name]
      );
      console.log('✅ Admin user created!');
    }

    console.log('');
    console.log('📋 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Email:    admin@vietsoul.app');
    console.log('Password: admin123');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    console.log('🔗 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

createAdmin();

