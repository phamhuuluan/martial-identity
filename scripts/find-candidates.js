const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data/facebook-raw.json', 'utf8'));

const posts = data.posts.filter(p => p.remoteImages && p.remoteImages.length > 0);
console.log("Total posts with images:", posts.length);

const isCompetition = p => /giải|vô địch|cúp|championship|tournament|liên hoan|võ thuật/i.test(p.message);
const isCharity = p => /thiện nguyện|từ thiện|trao quà|tặng quà|cứu trợ|trồng cây|đắp đường|nhặt rác/i.test(p.message);

const comps = posts.filter(isCompetition).slice(0, 3);
const chars = posts.filter(isCharity).slice(0, 3);

console.log("\n--- COMPETITIONS ---");
comps.forEach(p => console.log(p.publishedAt, p.facebookPostId, "\n" + p.message.substring(0, 100) + "...", "\nImages:", p.remoteImages.length, "\n"));

console.log("\n--- CHARITY ---");
chars.forEach(p => console.log(p.publishedAt, p.facebookPostId, "\n" + p.message.substring(0, 100) + "...", "\nImages:", p.remoteImages.length, "\n"));
