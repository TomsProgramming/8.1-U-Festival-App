const webpush = require('web-push');
const k = webpush.generateVAPIDKeys();
console.log('Plak dit in server/.env :\n');
console.log('VAPID_PUBLIC=' + k.publicKey);
console.log('VAPID_PRIVATE=' + k.privateKey);
console.log('VAPID_SUBJECT=mailto:info@ufestival.nl');
