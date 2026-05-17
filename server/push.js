const webpush = require('web-push');
require('dotenv').config();

const pub  = process.env.VAPID_PUBLIC  || '';
const priv = process.env.VAPID_PRIVATE || '';
const subj = process.env.VAPID_SUBJECT || 'mailto:info@ufestival.nl';

if (pub && priv) {
  webpush.setVapidDetails(subj, pub, priv);
} else {
  console.warn('[push] VAPID keys ontbreken — push staat uit. Run: npm run gen-vapid');
}

async function sendTo(subscription, payload) {
  return webpush.sendNotification(subscription, JSON.stringify(payload));
}

module.exports = { webpush, sendTo, publicKey: pub };
