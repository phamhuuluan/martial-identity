const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync('data/facebook-raw.json', 'utf8'));

const selectedPosts = [
  {
    id: "2011422782420944_1377550321175507",
    category: "competitions",
    slug: "lien-hoan-vo-viet-dat-phuong-nam-2026",
    title: "Liên Hoan Võ Việt Đất Phương Nam 2026",
    summary: "Khoảnh khắc của các võ sinh, môn sinh Phật Quang Quyền tại lễ trao giải Liên hoan Võ Việt Đất Phương Nam 2026."
  },
  {
    id: "2011422782420944_1312290197701520",
    category: "charity",
    slug: "trong-cay-lai-nho-den-nguoi",
    title: "Trồng cây lại nhớ đến Người",
    summary: "Các môn sinh chung tay trồng cây xanh, hòa mình vào thiên nhiên và làm đẹp môi trường."
  },
  {
    id: "2011422782420944_1351287413801798",
    category: "charity",
    slug: "gieo-dieu-tu-te",
    title: "Gieo Điều Tử Tế Bằng Những Việc Làm Bình Dị",
    summary: "Huấn luyện viên CLB Võ Cổ Truyền tham gia dọn dẹp vệ sinh đường phố, nhặt rác bảo vệ môi trường."
  }
];

async function downloadImage(url, dest) {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

async function run() {
  for (const selection of selectedPosts) {
    const post = data.posts.find(p => p.facebookPostId === selection.id);
    if (!post) continue;

    const dateStr = post.publishedAt.split('T')[0];
    const mdFile = `content/${selection.category}/${dateStr}-${selection.slug}.md`;
    const imgDir = `public/images/news/${selection.id}`;
    
    fs.mkdirSync(`content/${selection.category}`, { recursive: true });
    fs.mkdirSync(imgDir, { recursive: true });

    const images = [];
    for (let i = 0; i < post.remoteImages.length; i++) {
      const imgName = `${String(i + 1).padStart(2, '0')}.jpg`;
      const imgPath = `${imgDir}/${imgName}`;
      await downloadImage(post.remoteImages[i], imgPath);
      images.push(`/images/news/${selection.id}/${imgName}`);
    }

    const fm = `---
title: "${selection.title}"
summary: "${selection.summary}"
date: "${dateStr}"
category: ${selection.category}
tags: []
facebookUrl: "${post.facebookUrl}"
facebookPostId: "${post.facebookPostId}"
engagementScore: ${post.engagementScore}
coverImage: "${images[0]}"
gallery:
${images.slice(1).map(img => `  - "${img}"`).join('\n')}
---

${post.message}
`;
    fs.writeFileSync(mdFile, fm);
    console.log(`Created ${mdFile} with ${images.length} images`);
  }
}

run().catch(console.error);
