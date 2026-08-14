/**
 * Immutable site content — PHẬT QUANG QUYỀN
 * Source: so_tay_gioi_thieu_27_02_2023.pdf (40 pages)
 * Text is preserved exactly from the sổ tay giới thiệu. Do not rewrite.
 */

export const site = {
  name: "Phật Quang Quyền",
  nameUpper: "PHẬT QUANG QUYỀN",
  federationLine: "",
  motto: "",
  title: "Phật Quang Quyền — Võ Cổ Truyền Việt Nam",
  tagline:
    "Môn phái võ cổ truyền — rèn luyện thân thể, đạo đức và tinh thần phụng sự Đạo pháp và dân tộc",
  description:
    "Phật Quang Quyền — lịch sử hình thành và phát triển, tôn chỉ võ đạo, hệ thống cấp đai, chương trình huấn luyện, quy mô hoạt động trong và ngoài nước, thành tích thi đấu và hoạt động xã hội thiện nguyện.",
  logo: "/images/extracted/logo-phat-quang-quyen-transparent.webp",
  heroImage: "/images/extracted/hero-home-a1.webp",
  heroFallback: "/images/site/gioiThieu_MonPhai.png",
  introImage: "/images/site/gioiThieu_MonPhai.png",
};

/** Tổ Đình — canonical address & maps (master: docs/danh-sach-clb-*.md). */
export const toDinh = {
  templeName: "Chùa Phật Quang",
  address: "Núi Dinh, thôn Chu Hải, xã Tân Hải, TP. Hồ Chí Minh",
  fullAddress:
    "Chùa Phật Quang, Núi Dinh, thôn Chu Hải, xã Tân Hải, TP. Hồ Chí Minh",
  mapEmbed:
    "https://maps.google.com/maps?q=Thi%E1%BB%81n+T%C3%B4n+Ph%E1%BA%ADt+Quang,+N%C3%BAi+Dinh,+th%C3%B4n+Chu+H%E1%BA%A3i,+T%C3%A2n+H%E1%BA%A3i&hl=vi&z=14&output=embed",
  mapLink:
    "https://www.google.com/maps/search/?api=1&query=Thi%E1%BB%81n+T%C3%B4n+Ph%E1%BA%ADt+Quang+N%C3%BAi+Dinh+T%C3%A2n+H%E1%BA%A3i",
} as const;

export const officialSocialLinks = [
  { name: "TikTok", href: "https://www.tiktok.com/@p.q.qtd" },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@BAN_TRUY%E1%BB%80N_TH%C3%94NG_PQQ",
  },
  { name: "Facebook", href: "https://www.facebook.com/todinh.pqq" },
] as const;

export const contactDescription =
  "Tổ Đình và các võ đường / CLB đại diện theo miền. Danh sách đầy đủ nằm tại trang Địa điểm.";

/** Representative HQ / region dojos — full list lives on /dia-diem. */
export const contactHighlights = [
  { region: "Tổ Đình", address: toDinh.fullAddress },
  { region: "Tổng Đường Pháp Quang - Miền Nam" },
  { region: "Võ Đường Viên Quang - Miền Trung" },
  { region: "Võ Đường Thắng Quang - Miền Bắc" },
  { region: "CLB Phật Quang Quyền Hàn Quốc" },
  { region: "CLB Phật Quang Quyền Nhật Bản" },
  { region: "CLB Phật Quang Quyền Đài Loan" },
  { region: "CLB Phật Quang Quyền Singapore" },
  { region: "Võ Đường Tĩnh Quang - Phật Quang Quyền Algeria" },
] as const;

/** Countries with active CLBs — used in structured data. */
export const operatingCountries = [
  "Vietnam",
  "South Korea",
  "Japan",
  "Taiwan",
  "Singapore",
  "Algeria",
] as const;

/** Collective term — always paired: võ sinh, môn sinh (Võ sinh first). */
export const memberTerm = {
  lower: "võ sinh, môn sinh",
  title: "Võ sinh, môn sinh",
  ofSchool: "võ sinh, môn sinh Phật Quang Quyền",
  ofSchoolTitle: "Võ sinh, môn sinh Phật Quang Quyền",
} as const;

export const sixOathsSection = {
  homeHeading: "Sáu lời thề võ sinh",
  sectionTitle: "Sáu lời thề của võ sinh Phật Quang Quyền",
} as const;

export const thaiToSu = {
  number: "1",
  title: "Thái Tổ Sư của môn phái",
  body: "Môn phái bái tôn giả Rahula (La Hầu La), một trong thập đại đệ tử của Đức Phật với danh hiệu Mật Hạnh Đệ Nhất Bảo hộ Tăng đoàn làm Thái Tổ Sư của môn phái.",
  image: "/images/site/thai-to-su.jpg",
};

export const sangToSu = {
  number: "2",
  title: "Sáng Tổ Sư của môn phái",
  image: "/images/site/sang-to-su.jpg",
  fields: [
    { label: "Thế danh", value: "Vương Tấn Việt" },
    { label: "Đạo hiệu", value: "Thượng Chân hạ Quang" },
    { label: "Pháp danh", value: "Thích Chân Quang" },
    { label: "Năm sinh", value: "1959" },
    { label: "Giáo Phẩm", value: "Thượng Tọa" },
  ],
  positions: [
    "Viện chủ chùa Phật Quang - núi Dinh – thành phố Hồ Chí Minh",
    "Giảng sư Phật học",
  ],
};

export const formation = {
  yearTitle: "Năm thành lập môn phái",
  yearNumber: "3",
  yearBody:
    "Phật Quang Quyền được thành lập: Năm 1992, trong những ngày đầu hình thành chùa Phật Quang. Môn phái do: Võ sư Thượng tọa Thượng Chân hạ Quang, Viện chủ chùa Phật Quang sáng lập nên (võ sư sáng tổ).",
  toDinh: {
    number: "4",
    title: "Tổ Đình",
    body: toDinh.fullAddress,
  },
  nhanDuyen: {
    number: "5",
    title: "Nhân duyên thành lập",
    bullets: [
      "Võ sư sáng tổ được rèn luyện võ thuật từ thời niên thiếu nhưng do nhiều yếu tố khách quan, với vai trò là một tu sĩ Phật Giáo nên võ sư sáng tổ có rất nhiều công tác Phật sự nên không có cơ hội luyện tập một môn võ xuyên suốt. Tuy nhiên Võ sư sáng tổ lại có cơ duyên được tham học nhiều bậc tiền bối về võ thuật từ đó đúc kết được những tinh hoa trong võ học.",
      "Mong muốn phục dựng truyền thống võ học trong Thiền môn.",
      "Giúp Tăng Ni và thanh thiếu niên rèn luyện sức khỏe, đạo đức và bản lĩnh.",
      "Xây dựng thế hệ văn võ song toàn, phụng sự Đạo pháp và dân tộc.",
    ],
  },
  chuongMon: {
    number: "6",
    title: "Chưởng môn Phật Quang Quyền",
    body: "Đại đức Thích Nghiêm Giám - Phó chủ tịch liên đoàn võ cổ truyền thành phố Hồ Chí Minh",
  },
  truongBan: {
    number: "7",
    title: "Trưởng ban chuyên môn",
    body: "Đại đức Thích Toàn Tĩnh",
  },
};

export const organization = {
  sectionTitle: "LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN",
};

export const logoMeaning = {
  sectionTitle: "TÔN CHỈ VÀ VÕ ĐẠO CỦA MÔN PHÁI",
  number: "1",
  title: "Ý nghĩa biểu tượng môn phái",
  logo: "/images/extracted/logo-phat-quang-quyen-transparent.webp",
  paragraphs: [
    "Biểu tượng môn phái là hình tròn, tượng trưng cho bánh xe Chuyển Pháp Luân của Phật giáo.",
    "Nền màu vàng đất biểu trưng cho sự cao quý, thanh tịnh và tinh thần Phật giáo.",
    "Bên trong có 8 hình elip liên kết thành bông hoa 8 cánh với 4 màu: Xanh Lam, Xanh Lục, Đỏ, Vàng, tượng trưng cho 4 phẩm chất người võ sinh, môn sinh Phật Quang Quyền cần rèn luyện:",
  ],
  qualities: ["Công đức", "Đạo đức", "Khí công", "Thiền định"],
  closing:
    "Tám hình elip còn tượng trưng cho Bát Chánh Đạo, con đường tu tập chân chính của võ sinh, môn sinh Phật Quang Quyền phải thực hành. Ý nghĩa biểu tượng của môn phái ý muốn nói: mỗi võ sinh, môn sinh Phật Quang Quyền như một bông hoa ngát hương đạo đức không ngừng tô đẹp cho đời.",
  colors: [
    { name: "Xanh Lam", hex: "#2B6CB0" },
    { name: "Xanh Lục", hex: "#2F855A" },
    { name: "Đỏ", hex: "#C53030" },
    { name: "Vàng", hex: "#D69E2E" },
  ],
};

export const philosophy = {
  number: "2",
  title: "Môn phái được xây dựng trên 2 yếu tố",
  factors: [
    {
      label: "Thứ nhất về mặt nội công",
      body: "môn phái được xây dựng dựa trên nền tảng khí công Phật gia được đúc kết qua một bề dày lịch sử. Khí công Phật gia là sự kết hợp của cả triết lý âm dương, vừa mang tính cương giúp người luyện tập tăng cường khả năng chịu đựng, độ rắn chắc của cơ thể, phù hợp với chiến đấu thực tế, vừa là sự nhu nhuyễn giúp võ sinh, môn sinh đạt được sự linh hoạt, uyển chuyển, nhanh nhẹn trong quyền thuật.",
    },
    {
      label: "Thứ hai về mặt võ đạo",
      body: "võ sinh, môn sinh Phật Quang Quyền lấy đạo đức trong Phật giáo làm nền tảng cho sự phát triển tinh thần võ đạo của môn phái. Những khái niệm về đạo đức căn bản như luật nhân quả, sự khiêm nhu, tinh thần dũng cảm, lòng từ bi, lòng yêu nước,….., đều được các võ sư môn phái chuyển tải một cách ngắn gọn, xúc tích, sâu sắc nhất giúp các võ sinh, môn sinh hiểu rõ và nâng cao phẩm chất đạo đức trở thành người công dân có ích cho xã hội, cho sự phát triển của đất nước",
    },
  ],
};

export const phuongCham = {
  number: "3",
  title: "Phương châm môn phái",
  body: [
    "Chúng tôi đã xác định mục tiêu xây dựng thế hệ thanh niên thời hiện đại dựa trên 3 tiêu chí.",
    "Một trí tuệ thông minh sáng suốt biết thế nào là đúng sai để ứng biến trong những hoàn cảnh khó khăn. Một tâm hồn hướng thượng biết cống hiến và phụng sự. Hai tiêu chí đó chỉ có thể hình thành trên khi có được một cơ thể khỏe mạnh dẻo dai qua quá trình rèn luyện võ thuật.",
    "Chúng tôi mong muốn thế hệ trẻ Việt Nam hướng đến con đường chân thiện mỹ ngày càng hoàn thiện bản thân.",
    "Nhưng nền tảng căn bản xây để có con người toàn diện đó chính là đạo đức. Và thật may mắn thay môn phái kết hợp được hai yếu đó đó chính là những giá trị đạo đức cao đẹp trong đạo Phật và những tinh hoa trong võ thuật cổ truyền Việt Nam. Những giá trị ấy được thể hiện qua sáu lời thề của võ sinh Phật Quang Quyền.",
  ],
};

/** Updated according to the latest martial arts theory documents */
export const sixOaths = [
  "Tập võ để chiến thắng sự sợ hãi trong lòng mình và đạt được hạnh nhẫn nhục tận cùng.",
  "Tập võ để bênh vực kẻ vô tội bị ức hiếp.",
  "Tập võ để bảo vệ Chánh pháp.",
  "Tập võ để bảo vệ đất nước.",
  "Rất trung thành với Thầy Tổ, rất tín nghĩa với huynh đệ.",
  "Yêu thích lao động giúp đời.",
] as const;

export const martialSpirit = {
  image: "/images/site/TinhThanVoDao.jpg",
  paragraphs: [
    "Chúng tôi lấy giá trị đạo đức làm kim chỉ nam sao cho mỗi võ sinh, môn sinh Phật Quang Quyền phải thấm nhuần và hiểu rõ đường lối của môn phái cũng như đường lối của đạo Phật, thể hiện được tinh thần yêu nước, luôn đồng hành cùng của dân tộc như các bậc tiền bối của võ thuật cổ truyền Việt Nam đã thực hiện.",
    "Ngoài các giá trị phương châm đạo đức cao đẹp thì khi đến tập luyện tại môn phái các võ sinh, môn sinh phải tập trung nhiều vào kỹ năng chiến đấu, tự vệ mang tính chất thực dụng cho người tập luyện để đạt hiệu quả cao nhất trong chiến đấu và đặc trưng là các thế đối luyện. Phải trải qua quá trình tập luyện gian khổ đạt được cấp đai Hoàng Đai Nhất Cấp (cấp 13) thì võ sinh mới chính thức được trở thành môn sinh của môn phái.",
  ],
};

export const scaleIntro = {
  sectionTitle: "QUY MÔ HOẠT ĐỘNG TRONG VÀ NGOÀI NƯỚC",
  image: "/images/site/HoatDongTrongVaNgoaiNuoc.jpg",
  body: "Trải qua hơn 20 năm âm thầm tập luyện, môn phái đã hình thành hệ thống võ đường và câu lạc bộ trên khắp cả nước — từ Tổ Đình, Tổng Đường Pháp Quang, Võ đường Trí Vũ, Hồng Quang (miền Nam), Viên Quang (miền Trung) đến Thắng Quang (miền Bắc) — cùng các điểm tập tại Hàn Quốc, Nhật Bản, Đài Loan, Singapore và Algeria:",
};

/**
 * Danh sách CLB / điểm tập.
 * name = tên CLB; locations[0] = địa chỉ; schedule = thời gian tập luyện (tuỳ chọn).
 * Chỉ các trường này được đưa lên UI — không gồm SĐT / phụ trách / liên hệ.
 */
export const locations = {
  overseas: {
    region: "IV. Nước ngoài",
    dojos: [
      {
        name: "CLB Phật Quang Quyền Hàn Quốc – Suwon (Gyeonggi)",
        locations: ["Chùa 수원사, 경기도 수원시 팔달구 수원천로 300"],
      },
      {
        name: "CLB Phật Quang Quyền Hàn Quốc – Changwon (Gyeongnam)",
        locations: ["Chùa 불지사, 경상남도 창원시 성산구 상남로 172"],
      },
      {
        name: "CLB Phật Quang Quyền Nhật Bản – Khu vực Kansai",
        locations: ["7-chōme-126 Hattorigawa, Yao, Osaka 581-0865, Nhật Bản"],
      },
      {
        name: "CLB Phật Quang Quyền Nhật Bản – Khu vực Kanagawa",
        locations: [
          "神奈川県横浜市鶴見区元宮2-5-1 (2-5-1 Motomiya, Tsurumi-ku, Yokohama, Kanagawa, Nhật Bản)",
        ],
      },
      {
        name: "CLB Phật Quang Quyền Đài Loan",
        locations: [
          "No. 31, Wenquan Rd, Guashan Village, Changhua City, Changhua County 500, Taiwan (R.O.C.)",
        ],
      },
      {
        name: "CLB Phật Quang Quyền Singapore",
        locations: ["557 Bukit Batok Street 23, Singapore 659523"],
      },
      {
        name: "Phật Quang Quyền Algeria",
        locations: ["Algiers (Thủ đô Algeria)"],
      },
    ],
  },
  north: {
    region: "III. Miền Bắc",
    dojos: [
      {
        name: "CLB Phổ Quang",
        locations: ["Phường Phúc Lợi, TP. Hà Nội"],
        schedule: "18:00 – 19:30, Thứ 3, 5, 7 hằng tuần",
      },
      {
        name: "CLB Hoàng Xá",
        locations: ["Chùa Hoàng Xá, phường Thượng Cát, TP. Hà Nội"],
        schedule: "19:00 – 21:00 Thứ 7; 17:30 – 19:00 Chủ nhật",
      },
      {
        name: "CLB Linh Thông",
        locations: ["68 Hoàng Ngân, phường Thanh Xuân, TP. Hà Nội"],
        schedule: "19:00 – 21:00, Thứ 6 và Chủ nhật",
      },
      {
        name: "CLB Quang Phúc",
        locations: [
          "Chùa Quang Phúc, số 32 ngõ 570 đường Kim Giang, phường Thanh Liệt, TP. Hà Nội",
        ],
        schedule: "19:00 – 21:00, Thứ 3 và Thứ 7",
      },
      {
        name: "CLB Thái Minh",
        locations: ["Chùa Hào, thôn La Tinh, xã An Khánh, Hoài Đức"],
        schedule: "17:00 Thứ 7 hằng tuần",
      },
      {
        name: "CLB Đông Quang",
        locations: ["thôn Đào Hoàng, xã Phượng Dực, TP. Hà Nội"],
        schedule: "16:00 – 18:30 Thứ 7 hằng tuần",
      },
      {
        name: "CLB Hưng Long",
        locations: [
          "Chùa Hưng Long, thôn Hưng Quan, xã Nam Tiên Hưng, tỉnh Hưng Yên",
        ],
        schedule: "17:30 – 19:00, Thứ 5 và Chủ nhật",
      },
      {
        name: "CLB Hải Lâm",
        locations: [
          "Chùa Hải Lâm, thôn Kinh Nhuế, xã Quang Lịch, tỉnh Hưng Yên",
        ],
        schedule: "17:15 – 19:00, Thứ 2, 4, 6",
      },
      {
        name: "CLB Chùa Thanh Lang",
        locations: [
          "Chùa Thanh Lang, thôn Lương Cả, xã Phụ Dực, tỉnh Hưng Yên",
        ],
      },
      {
        name: "CLB Linh Quang",
        locations: [
          "Chùa Linh Quang, thôn Mai Hạ, xã Xuân Cẩm, tỉnh Bắc Ninh",
        ],
        schedule: "17:30 – 19:30, Thứ 3, 5, 7",
      },
      {
        name: "CLB Bắc Ninh",
        locations: ["Chùa Phương Vỹ, phường Vũ Ninh, Bắc Ninh"],
        schedule: "18:30 – 20:30, Thứ 2 và Thứ 6",
      },
      {
        name: "CLB Thuần Minh",
        locations: ["xóm Tân Trung, xã Vạn Thắng, Ninh Bình"],
        schedule: "Thứ 6: 19:30 – 21:15; Chủ nhật: 16:30 – 18:15",
      },
      {
        name: "CLB Khánh Vân",
        locations: ["Đình Vân Thị, xã Gia Vân, Ninh Bình"],
        schedule: "Thứ 4: 17:00 – 18:45; Thứ 7: 19:15 – 21:00",
      },
      {
        name: "CLB Giao Hưng",
        locations: ["xóm Tiên Thành, xã Giao Hưng, Ninh Bình"],
        schedule: "Thứ 2, 5: 17:15 – 19:00",
      },
      {
        name: "CLB Chùa Kênh",
        locations: ["số 12 Trần Khánh Dư, phường Nam Định, Ninh Bình"],
        schedule: "Thứ 2: 20:00 – 21:45",
      },
      {
        name: "CLB Nguyên Minh",
        locations: ["Linh Sơn Tự, phường Vạn Xuân, tỉnh Thái Nguyên"],
        schedule: "18:30 – 20:30, Thứ 7 và Chủ nhật",
      },
      {
        name: "CLB Tiến Minh",
        locations: [
          "Cung Văn hóa Lao động Hữu nghị Việt Tiệp, 53 Lạch Tray, Ngô Quyền, Hải Phòng",
        ],
        schedule: "19:00 – 21:00, Thứ 4 và Chủ nhật",
      },
      {
        name: "CLB Thủy Nguyên",
        locations: [
          "Thiền đường Đạo tràng Phật Minh, phường Bạch Đằng, Thủy Nguyên, Hải Phòng",
        ],
        schedule: "Thứ 2, 6: 17:30 – 19:00; Chủ nhật: 09:00 – 11:00",
      },
      {
        name: "CLB Dưỡng Sinh Thủy Nguyên",
        locations: [
          "Thiền đường Đạo tràng Phật Minh, phường Bạch Đằng, Thủy Nguyên, Hải Phòng",
        ],
        schedule: "04:45 – 06:00, Thứ 3 đến Thứ 6",
      },
      {
        name: "CLB Thành Tô",
        locations: [
          "Trường Tiểu học Thành Tô, Đông Hải, Hải An, Hải Phòng",
        ],
        schedule: "17:30 – 19:00, Thứ 4 và Thứ 7",
      },
      {
        name: "CLB Đông Hải 2",
        locations: [
          "Trường Tiểu học Đông Hải 2, Đông Hải, Hải An, Hải Phòng",
        ],
        schedule: "17:30 – 19:00, Thứ 2 đến Thứ 6",
      },
    ],
  },
  central: {
    region: "II. Miền Trung",
    dojos: [
      {
        name: "Võ Đường Viên Quang",
        locations: ["Chùa Viên Quang, xóm Thập Thổ, xã Nam Đàn, Nghệ An"],
        schedule: "Thứ 2, 4, 7 hằng tuần, 17:30 – 19:00",
      },
      {
        name: "CLB Thành Phố Vinh 1",
        locations: ["Nhà văn hoá khối Tân Phúc, TP Vinh, Nghệ An"],
        schedule: "Thứ 2, 4 hằng tuần, 18:30 – 20:00",
      },
      {
        name: "CLB Thành Phố Vinh 2",
        locations: ["Nhà văn hoá khối Tân Phúc, TP Vinh, Nghệ An"],
        schedule: "Thứ 3, 5 hằng tuần, 18:30 – 20:00",
      },
      {
        name: "CLB Xanh Tuệ Đức",
        locations: ["103 Nguyễn Sinh Cung, phường Cửa Lò"],
        schedule: "Thứ 2, 5 hằng tuần, 17:00 – 18:45",
      },
      {
        name: "CLB Chùa Hương Lâm",
        locations: ["Chùa Hương Lâm, xóm Hồng Sơn, xã Vạn An, Nghệ An"],
        schedule: "Thứ 3, 5, 7 hằng tuần, 18:00 – 19:30",
      },
      {
        name: "CLB VCT Kim Liên",
        locations: ["Xóm Nam Lâm, xã Kim Liên, Nghệ An"],
        schedule: "Thứ 2, 4, 6 hằng tuần, 17:30 – 19:00",
      },
      {
        name: "CLB Tiến Quang – Huế",
        locations: ["36 Nguyễn Huy Tự, phường Thuận Hóa, TP Huế"],
        schedule: "Thứ 5, 7 hằng tuần, 18:00 – 20:00",
      },
    ],
  },
  south: {
    region: "I. Miền Nam",
    dojos: [
      {
        name: "TỔ ĐÌNH",
        locations: [toDinh.fullAddress],
      },
      {
        name: "CLB Võ Cổ Truyền Vũ Minh 1",
        locations: ["66/8 Hàn Mặc Tử, P. Quy Nhơn Nam, Tỉnh Gia Lai"],
        schedule: "17:30 – 19:30, Thứ 2, 4, 6",
      },
      {
        name: "CLB Võ Cổ Truyền Vũ Minh 2",
        locations: ["Chùa Linh Sơn, P. Quy Nhơn Bắc, Tỉnh Gia Lai"],
        schedule: "17:30 – 19:30, Thứ 4 & Chủ nhật",
      },
      {
        name: "CLB Võ Cổ Truyền Chùa Huệ Lâm Đà Lạt",
        locations: ["Chùa Huệ Lâm – Phước Thành, P. Lang Biang, Đà Lạt"],
        schedule: "17:30 – 19:30, Thứ 3, 6 & Chủ nhật",
      },
      {
        name: "CLB Võ Cổ Truyền Khánh Minh",
        locations: ["84/34 Chi Lăng, P. Pleiku, Tỉnh Gia Lai"],
        schedule: "17:30 – 19:30, Thứ 3, 5, 7",
      },
      {
        name: "CLB Bửu Lâm – Võ Đường Hồng Quang",
        locations: [
          "Chùa Bửu Lâm, đường Phan Văn Hớn, Đông Hưng Thuận, TP.HCM",
        ],
        schedule: "20:45 – 21:45, Thứ 3, 4, 5, 6, 7",
      },
      {
        name: "Võ Đường Hồng Quang",
        locations: ["94 Tân Thới Nhất 5, Đông Hưng Thuận, TP.HCM"],
        schedule:
          "Thứ 2–7; Ca 1: 17:30 – 19:00; Ca 2: 19:30 – 21:00; Thứ 7 & CN: 10:00 – 11:30",
      },
      {
        name: "CLB Võ Cổ Truyền Quận 7",
        locations: [
          "Nhà thi đấu đa năng Quận 7, 504–506 Huỳnh Tấn Phát, Tân Thuận, TP.HCM",
        ],
        schedule: "19:00 – 21:00, Thứ 3, 5, 6",
      },
      {
        name: "CLB Phật Quang Quyền Bảo Quang",
        locations: ["Thiền Thất Bảo Quang, Ấp 19, Phú Hòa Đông, TP.HCM"],
        schedule: "18:00 – 19:30, Thứ 2, 4, 6",
      },
      {
        name: "CLB Quân Khu 7",
        locations: ["202 Hoàng Văn Thụ, P. Đức Nhuận, TP.HCM"],
        schedule: "19:15 – 21:15, Thứ 2, 4, 6 & 3, 5, 7",
      },
      {
        name: "CLB Võ Cổ Truyền Đạo Minh",
        locations: [
          "79F/9 đường Lái Thiêu 42, P. Lái Thiêu, TP. Thuận An, Bình Dương",
        ],
        schedule: "19:00 – 21:00, Thứ 3, 4, 6",
      },
      {
        name: "CLB Võ Cổ Truyền Định Quang",
        locations: [
          "Trung tâm Văn hóa – Thông tin P. Bình Dương, đường Hùng Vương, P. Bình Dương, TP.HCM",
        ],
        schedule: "18:30 – 20:45, Thứ 3, 5, 6",
      },
      {
        name: "CLB Võ Cổ Truyền Đăng Quang",
        locations: [
          "Công viên số 3, đường Nguyễn Hữu Cảnh, Phường Thủ Dầu Một, TP. Hồ Chí Minh",
        ],
        schedule: "19:00 – 21:00, Thứ 3, 5, 6",
      },
      {
        name: "CLB Võ Cổ Truyền Pháp Minh",
        locations: [
          "19 Hồ Văn Huê, P. Phú Nhuận, TP.HCM (Làng Võ Tánh)",
        ],
        schedule: "19:00 – 20:30, Thứ 3, 5, 7",
      },
      {
        name: "CLB Võ Cổ Truyền Trường Đại học Ngân hàng TP.HCM",
        locations: [
          "32A đường số 16, P. Linh Chiểu, TP. Thủ Đức (Sảnh giảng đường B – tòa xanh dương)",
        ],
        schedule: "19:00 – 21:15, Thứ 3, 4, 5, 7",
      },
      {
        name: "CLB Võ Cổ Truyền Trường THCS Trần Đại Nghĩa",
        locations: ["Trường THCS Trần Đại Nghĩa"],
        schedule: "17:00 – 18:45, Thứ 3, 5, 7",
      },
      {
        name: "CLB Võ Cổ Truyền Trường THCS Nguyễn Trãi",
        locations: ["Trường THCS Nguyễn Trãi"],
        schedule: "17:00 – 18:45, Thứ 2, 4, 6",
      },
      {
        name: "CLB Võ Cổ Truyền Trường THPT Nguyễn Bỉnh Khiêm",
        locations: ["Trường THPT Nguyễn Bỉnh Khiêm"],
        schedule: "17:00 – 18:45, Thứ 2, 4, 6",
      },
    ],
  },
};

export const beltSystem = {
  sectionTitle: "HỆ THỐNG CẤP ĐAI VÀ CHƯƠNG TRÌNH HUẤN LUYỆN MÔN PHÁI",
  chartTitle: "HỆ THỐNG ĐẲNG CẤP MÔN PHÁI",
  charts: [
    {
      label: "Sơ đẳng",
      src: "/images/site/SoDang.webp",
    },
    {
      label: "Trung đẳng",
      src: "/images/site/TrungDang.webp",
    },
    {
      label: "Cao đẳng & Thượng đẳng",
      src: "/images/site/CaoDang_ThuongDang.webp",
    },
  ],
  note: "Bảng hệ thống đẳng cấp đầy đủ theo từng bậc: Sơ đẳng, Trung đẳng, Cao đẳng và Thượng đẳng.",
};

export const curriculum = {
  title: "Chương trình huấn luyện môn phái",
  subtitle:
    "Giáo trình Phật Quang Quyền: kỹ thuật căn bản, đối luyện & tự vệ, đơn luyện & song luyện, lý thuyết theo từng cấp đai.",
  pdf: "/images/curriculum/giao-trinh-pqq-2025-12.pdf",
  pages: [
    {
      label: "Sơ đẳng — Tự vệ, Lam & Lục đai",
      images: [
        "/images/curriculum/giao-trinh-p01.jpg",
        "/images/curriculum/giao-trinh-p02.jpg",
        "/images/curriculum/giao-trinh-p03.jpg",
        "/images/curriculum/giao-trinh-p04.jpg",
        "/images/curriculum/giao-trinh-p05.jpg",
      ],
    },
    {
      label: "Trung đẳng — Hồng & Hoàng đai",
      images: [
        "/images/curriculum/giao-trinh-p06.jpg",
        "/images/curriculum/giao-trinh-p07.jpg",
        "/images/curriculum/giao-trinh-p08.jpg",
        "/images/curriculum/giao-trinh-p09.jpg",
      ],
    },
    {
      label: "Cao đẳng & Thượng đẳng",
      images: [
        "/images/curriculum/giao-trinh-p10.jpg",
        "/images/curriculum/giao-trinh-p11.jpg",
        "/images/curriculum/giao-trinh-p12.jpg",
        "/images/curriculum/giao-trinh-p13.jpg",
      ],
    },
  ],
};

/** Primary site navigation — path-based IA (Option B). */
export const navItems = [
  { label: "Trang chủ", href: "/" },
  { label: "Giới thiệu", href: "/gioi-thieu" },
  { label: "Tập luyện", href: "/tap-luyen" },
  { label: "Hoạt động", href: "/hoat-dong" },
  { label: "Địa điểm", href: "/dia-diem" },
  { label: "Liên hệ", href: "/lien-he" },
] as const;

/** Totals derived from `locations` — keep in sync when adding CLBs. */
export function countAllLocations(): number {
  return (
    locations.south.dojos.length +
    locations.central.dojos.length +
    locations.north.dojos.length +
    locations.overseas.dojos.length
  );
}

export const locationStats = {
  total: countAllLocations(),
  south: locations.south.dojos.length,
  central: locations.central.dojos.length,
  north: locations.north.dojos.length,
  overseas: locations.overseas.dojos.length,
} as const;
