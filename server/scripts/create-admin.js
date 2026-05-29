// Gebruik: node scripts/create-admin.js <gebruikersnaam> <wachtwoord>
// Voorbeeld: node scripts/create-admin.js admin geheim
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const bcrypt = require('bcryptjs');
const db = require('../db');

const [,, username, password] = process.argv;

if (!username || !password) {
  console.error('Gebruik: node scripts/create-admin.js <gebruikersnaam> <wachtwoord>');
  process.exit(1);
}

(async () => {
  try {
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO admin_users (username, pw_hash) VALUES (?, ?) ON DUPLICATE KEY UPDATE pw_hash = VALUES(pw_hash)',
      [username, hash]
    );
    console.log(`✓ Admin-gebruiker "${username}" aangemaakt/bijgewerkt.`);
  } catch (e) {
    console.error('Fout:', e.message);
  } finally {
    process.exit(0);
  }
})();
