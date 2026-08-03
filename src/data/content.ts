/**
 * Immutable catalogue content — PHẬT QUANG QUYỀN
 * Source: catalogue_so tay gioi thieu_27_02_2023.pdf (40 pages)
 * Text is preserved exactly from the catalogue. Do not rewrite.
 */

export const site = {
  name: "Phật Quang Quyền",
  nameUpper: "PHẬT QUANG QUYỀN",
  federationLine: "VÕ CỔ TRUYỀN VIỆT NAM",
  motto: "KHIÊM NHU ĐỒNG CẢM",
  title: "Phật Quang Quyền — Võ Cổ Truyền Việt Nam",
  description:
    "Môn phái Phật Quang Quyền — lịch sử hình thành và phát triển, tôn chỉ võ đạo, hệ thống cấp đai, chương trình huấn luyện, quy mô hoạt động trong và ngoài nước, thành tích thi đấu và hoạt động xã hội thiện nguyện.",
  logo: "/images/extracted/img-007-p06.jpeg",
  heroImage: "/images/extracted/img-029-p21.jpeg",
  heroFallback: "/images/extracted/img-009-p09.jpeg",
};

export const toc = [
  {
    title: "LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN",
    page: 2,
    href: "#lich-su",
  },
  {
    title: "TÔN CHỈ VÀ VÕ ĐẠO CỦA MÔN PHÁI",
    page: 6,
    href: "#ton-chi",
  },
  {
    title: "QUY MÔ HOẠT ĐỘNG TRONG VÀ NGOÀI NƯỚC",
    page: 10,
    href: "#quy-mo",
  },
  {
    title: "HỆ THỐNG CẤP ĐAI VÀ CHƯƠNG TRÌNH HUẤN LUYỆN MÔN PHÁI",
    page: 14,
    href: "#he-thong-dai",
  },
  {
    title: "CÁC GIẢI ĐẤU ĐÃ THAM GIA TỪ KHI MÔN PHÁI THÀNH LẬP",
    page: 18,
    href: "#giai-dau",
  },
  {
    title: "CÁC HOẠT ĐỘNG XÃ HỘI THIỆN NGUYỆN",
    page: 29,
    href: "#thien-nguyen",
  },
] as const;

export const thaiToSu = {
  number: "1",
  title: "Thái Tổ Sư của môn phái",
  body: "Môn phái bái tôn giả Rahula (La Hầu La), một trong thập đại đệ tử của Đức Phật với danh hiệu Mật Hạnh Đệ Nhất làm Thái Tổ Sư của môn phái.",
  image: "/images/extracted/img-003-p03.jpeg",
};

export const sangToSu = {
  number: "2",
  title: "Sáng Tổ Sư của môn phái",
  image: "/images/extracted/thich-chan-quang-17237738923882100136850.png",
  fields: [
    { label: "Thế danh", value: "Vương Tấn Việt" },
    { label: "Pháp danh", value: "Thích Chân Quang" },
    { label: "Đạo hiệu", value: "Thượng Tọa Thượng Chân Hạ Quang" },
    { label: "Năm sinh", value: "1959" },
    { label: "Giáo Phẩm", value: "Thượng Tọa" },
  ],
  positions: [
    "Viện chủ Thiền tôn Phật Quang - tỉnh Bà Rịa Vũng Tàu",
    "Giảng sư Phật học",
    "Tiến sĩ Luật học",
  ],
};

export const formation = {
  yearTitle: "Năm thành lập môn phái",
  yearNumber: "3",
  yearBody:
    "Môn phái được thành lập song song với quá trình hình thành và phát triển của thiền tôn Phật Quang. Thiền Tôn Phật Quang được chính thức thành lập năm 1992 do Thượng tọa Thích Chân Quang làm viện chủ.",
  toDinh: {
    number: "4",
    title: "Tổ Đình",
    body: "Thiền Tôn Phật Quang, Tân Hải, Tân Thành, Bà Rịa - Vũng Tàu.",
  },
  nhanDuyen: {
    number: "5",
    title: "Nhân duyên thành lập",
    bullets: [
      "Thượng Tọa được rèn luyện võ thuật từ thời niên thiếu nhưng do nhiều yếu tố khách quan, với vai trò là một tu sĩ Phật Giáo nên Thượng Tọa có rất nhiều công tác Phật sự nên không có cơ hội luyện tập một môn võ xuyên suốt. Tuy nhiên Thượng Tọa lại có cơ duyên được tham học nhiều Võ sư của các môn phái khác nhau từ đó đúc kết được những tinh hoa trong võ học.",
      "Thượng Tọa ôm ấp ước mơ phục dựng lại truyền thống võ học nơi chốn Thiền môn, đồng thời giúp các Tăng Ni có được sức khỏe dẻo dai, phục vụ cho việc tu học và giáo hóa, cũng như thực hiện hoài bão lớn lao, xây dựng một thế hệ thanh niên Việt Nam văn võ song toàn.",
      "Nên trong những ngày đầu thành lập nên chùa Thiền Tôn Phật Quang, võ sư sáng Tổ môn phái đã kết hợp song song việc dạy đạo lý tu hành cho đệ tử của mình tu học mà còn truyền dạy võ nghệ để rèn luyện thân thể. Từ đó môn phái PQQ cũng được được hình thành.",
    ],
  },
  chuongMon: {
    number: "6",
    title: "Chưởng môn của môn phái",
    body: "Đại Đức Thích Nghiêm Giám - Phó chủ tịch liên đoàn võ cổ truyền thành phố Hồ Chí Minh",
  },
  truongBan: {
    number: "7",
    title: "Trưởng ban chuyên môn",
    body: "Đại đức Thích Toàn Tĩnh",
  },
};

export const organization = {
  title: "SƠ ĐỒ TỔ CHỨC MÔN PHÁI PHẬT QUANG",
  sectionTitle: "LỊCH SỬ HÌNH THÀNH VÀ PHÁT TRIỂN",
  pageImage: "/images/pages/page-02.jpg",
  lineage: [
    { role: "THÁI TỔ SƯ", name: "Tôn giả Rahula (La Hầu La)" },
    { role: "SÁNG TỔ SƯ", name: "Thượng Tọa Thích Chân Quang" },
    { role: "CHƯỞNG MÔN", name: "Đại Đức Thích Nghiêm Giám" },
  ],
  committees: [
    "BAN VÕ HỌC",
    "BAN CHUYÊN MÔN",
    "BAN HUẤN LUYỆN",
    "BAN THƯ KÝ",
    "BAN TRUYỀN THÔNG",
  ],
  dojos: [
    "VÕ ĐƯỜNG TỔ ĐÌNH",
    "VÕ ĐƯỜNG PHÁP QUANG",
    "VÕ ĐƯỜNG VIÊN QUANG",
    "VÕ ĐƯỜNG THẮNG QUANG",
  ],
};

export const logoMeaning = {
  sectionTitle: "TÔN CHỈ VÀ VÕ ĐẠO CỦA MÔN PHÁI",
  number: "1",
  title: "Ý nghĩa biểu tượng môn phái Phật Quang Quyền",
  logo: "/images/extracted/img-007-p06.jpeg",
  paragraphs: [
    "Cả logo là một hình tròn biểu trưng như bánh xe chuyển Pháp luân của nhà Phật.",
    "Nền màu logo màu vàng đất màu hoại sắc. Màu biểu trưng của Phật giáo, cao quý và thoát tục.",
    "Bên trong có 8 hình elip móc nối vào nhau theo chiều hình tròn, trên mỗi cặp hình elip là một màu.",
    "Gồm có 4 màu: Xanh Dương, Xanh Lá, Đỏ, Vàng.",
    "Tượng trưng cho 4 tính chất của 1 người môn sinh Phật Quang Quyền cần phải hội đủ:",
  ],
  qualities: ["Công Đức", "Đạo Đức", "Khí Công", "Thiền Định"],
  closing:
    "Cũng như bốn chân lý, trong nhà Phật là tứ Thánh Đế, 8 hình elip mang biểu tượng 8 con đường tu tập chân chính là bát chánh đạo, người môn sinh Phật Quang Quyền phải thực hành.",
  colors: [
    { name: "Xanh Dương", hex: "#2B6CB0" },
    { name: "Xanh Lá", hex: "#2F855A" },
    { name: "Đỏ", hex: "#C53030" },
    { name: "Vàng", hex: "#D69E2E" },
  ],
};

export const philosophy = {
  number: "2",
  title: "Môn phái Phật Quang Quyền được xây dựng trên 2 yếu tố",
  factors: [
    {
      label: "Thứ nhất về mặt nội công",
      body: "môn phái được xây dựng dựa trên nền tảng khí công Phật gia được đúc kết qua một bề dày lịch sử. Khí công Phật gia là sự kết hợp của cả triết lý âm dương, vừa mang tính cương giúp người luyện tập tăng cường khả năng chịu đựng, độ rắn chắc của cơ thể, phù hợp với chiến đấu thực tế, vừa là sự nhu nhuyễn giúp võ sinh đạt được sự linh hoạt, uyển chuyển, nhanh nhẹn trong quyền thuật.",
    },
    {
      label: "Thứ hai về mặt võ đạo",
      body: "môn sinh Phật Quang Quyền lấy đạo đức trong Phật giáo làm nền tảng cho sự phát triển tinh thần võ đạo của môn phái. Những khái niệm về đạo đức căn bản như luật nhân quả, sự khiêm nhu, tinh thần dũng cảm, lòng từ bi, lòng yêu nước,….., đều được các võ sư môn phái chuyển tải một cách ngắn gọn, xúc tích, sâu sắc nhất giúp các môn sinh hiểu rõ và nâng cao phẩm chất đạo đức trở thành người võ sinh, người công dân có ích cho xã hội, cho sự phát triển của đất nước",
    },
  ],
  silhouettePage: "/images/pages/page-07.jpg",
};

export const phuongCham = {
  number: "3",
  title: "Phương châm môn phái",
  body: [
    "Chúng tôi đã xác định mục tiêu xây dựng thế hệ thanh niên thời hiện đại dựa trên 3 tiêu chí.",
    "Một trí tuệ thông minh sáng suốt biết thế nào là đúng sai để ứng biến trong những hoàn cảnh khó khăn. Một tâm hồn hướng thượng biết cống hiến và phụng sự. Hai tiêu chí đó chỉ có thể hình thành trên khi có được một cơ thể khỏe mạnh dẻo dai qua quá trình rèn luyện võ thuật.",
    "Chúng tôi mong muốn thế hệ trẻ Việt Nam hướng đến con đường chân thiện mỹ ngày càng hoàn thiện bản thân.",
    "Nhưng nền tảng căn bản xây để có con người toàn diện đó chính là đạo đức. Và thật may mắn thay môn phái Phật Quang Quyền kết hợp được hai yếu đó đó chính là những giá trị đạo đức cao đẹp trong đạo Phật và những tinh hoa trong võ thuật cổ truyền Việt Nam. Những giá trị ấy được thể hiện qua sáu lời thề của môn sinh Phật Quang Quyền.",
  ],
};

/** Order confirmed by catalogue: lời thề thứ 6 = Yêu thích lao động giúp đời */
export const sixOaths = [
  "Tập võ để chiến thắng sự sợ hãi trong lòng mình và đạt được hạnh nhẫn nhục tận cùng.",
  "Tập võ để bảo vệ đất nước.",
  "Tập võ để bảo vệ chánh pháp.",
  "Tập võ để bênh vực kẻ vô tội bị ức hiếp.",
  "Rất trung thành với thầy tổ, rất tín nghĩa với huynh đệ.",
  "Yêu thích lao động giúp đời.",
] as const;

export const martialSpirit = {
  paragraphs: [
    "Chúng tôi lấy giá trị đạo đức làm kim chỉ nam sao cho mỗi môn sinh Phật Quang Quyền phải thấm nhuần và hiểu rõ đường lối của môn phái cũng như đường lối của đạo Phật, thể hiện được tinh thần yêu nước, luôn đồng hành cùng của dân tộc như các bậc tiền bối của võ thuật cổ truyền Việt Nam đã thực hiện.",
    "Ngoài các giá trị phương châm đạo đức cao đẹp thì khi đến tập luyện tại môn phái các võ sinh phải tập trung nhiều vào kỹ năng chiến đấu, tự vệ mang tính chất thực dụng cho người tập luyện để đạt hiệu quả cao nhất trong chiến đấu và đặc trưng là các thế đối luyện. Phải trải qua quá trình tập luyện gian khổ thông qua 12 cấp đai thì võ sinh mới chính thức được trở thành môn sinh của môn phái.",
  ],
  groupImage: "/images/extracted/img-009-p09.jpeg",
};

export const scaleIntro = {
  sectionTitle: "QUY MÔ HOẠT ĐỘNG TRONG VÀ NGOÀI NƯỚC",
  body: "Trải qua hơn 20 năm âm thầm tập luyện thì môn phái đã phát triển được nhiều điểm tập ở trong và ngoài nước nổi bật nhất là 4 võ đường trong nước và 1 võ đường ở Hàn Quốc bao gồm:",
  image: "/images/extracted/img-010-p11.jpeg",
};

export const locations = {
  south: {
    region: "I         Khu vực miền Nam",
    dojos: [
      {
        name: "Võ đường Tổ đình",
        locations: [
          "Chùa Thiền Tôn Phật Quang, núi Dinh, thôn Chu Hải, xã Tân Hải, huyện Tân Thành, tỉnh Bà Rịa Vũng Tàu.",
          "Trường THCS Trần Đại Nghĩa.",
          "Trường THCS Nguyễn Trãi.",
        ],
      },
      {
        name: "Võ đường Pháp Quang",
        locations: [
          "Công ty văn hóa Pháp Quang - Số 28 Hoàng Diệu, thành phố Hồ Chí Minh.",
          "Nhà thi đấu quân khu 7 - Số 202 Hoàng Văn Thụ, phường 9, quận Phú Nhuận, thành phố Hồ Chí Minh.",
          "Nhà thi đấu đa năng quận 7- Số 506 Huỳnh Tấn Phát, Bình Thuận, quận 7, thành phố Hồ Chí Minh.",
          "Thiền Thất Bảo Quang - Hẻm Nguyễn Thị Sương, tỉnh lộ 8, ấp 3A, xã Tân Thạch Tây, huyện Củ Chi.",
          "88/1 Lê Thị Hồng Giấm, kp 4, thị trấn Hóc Môn.",
          "Chùa Tịnh Xá Ngọc Thành - Số 37/12 đường số 41, Linh Đông, thành phố Thủ Đức.",
          "Trung tâm Văn hóa - Thông tin Thể thao Thành phố Thủ Dầu Một - Số 313 đường Hùng Vương, phường Phú Mỹ, thành phố Thủ Dầu Một, tỉnh Bình Dương.",
          "Lớp võ Hồng Quang ở quận Hooc môn thành phố Hồ Chí Minh",
          "Lớp võ Bình Dương ở nhà văn hóa thiếu nhi thành phố Thủ Dầu Một tỉnh Bình Dương.",
        ],
      },
    ],
  },
  central: {
    region: "II         Khu vực miền Trung",
    dojos: [
      {
        name: "Võ đường Viên Quang",
        locations: [
          "Chùa Viên Quang Nam Thanh - Xóm 3, xã Nam Thanh, huyện Nam Đàn, tỉnh Nghệ An.",
          "CLB Phật Quang Quyền TP. Vinh - Nhà văn hóa Lao động tỉnh Nghệ An.",
          "CLB Xanh Tuệ Đức Nghệ An - Trường Xanh Tuệ Đức, phường Nghi Hương, thị xã Cửa Lò, tỉnh Nghệ An.",
          "CLB Chùa Hương Lâm - Chùa Hương Lâm, xã Xuân Hòa, huyện Nam Đàn, tỉnh Nghệ An.",
        ],
      },
    ],
  },
  north: {
    region: "III         Khu vực miền Bắc",
    dojos: [
      {
        name: "Võ đường Thắng Quang",
        locations: [
          "Lớp võ Hà Nội - Chùa Linh Thông, ngõ 80 Hoàng Ngân, Trung Hòa, Cầu Giấy, Hà Nội.",
          "Lớp võ Hà Nội - Chùa Phổ Quang, đường Đê Vàng, làng Tình Quang, Long Biên, Hà Nội.",
          "Lớp võ Hà Nội - Chùa Quang Phúc, số 32, ngõ 570, đường Kim Giang, Hà Nội.",
          "Lớp võ Hà Nội - Chùa Hoàng Xá, ngõ 2 Đường Liên Mạc, Bắc Từ Liêm, Hà Nội.",
          "Lớp võ Thái Nguyên - Chùa Thịnh Đán, Phường Thịnh Đán, thành phố Thái Nguyên.",
          "Lớp võ Bắc Giang - Chùa Linh Quang, Thôn Mai Hạ, xã Hiệp Hòa, tỉnh Bắc Giang.",
          "Lớp võ Bắc Ninh - Số 713 đường Thiên Đức, Dốc Đặng, Vạn An, Bắc Ninh.",
          "Lớp võ Hải Phòng - Chùa Hàng Kênh, Đường Dư Hàng, Lê Chân, Hải Phòng.",
          "Lớp võ Hưng Yên - Đường Châm Nhị, Vân Du, Ân Thi, Hưng Yên",
          "Lớp võ Nam Định - Chùa Phúc Lê, Yên Ninh, Ý Yên, Nam Định.",
          "Lớp võ Thái Bình - Trung Hòa, Hòa Bình, Kiến Xương, Thái Bình.",
        ],
      },
    ],
  },
  korea: {
    region: "IV         Lớp võ tại Hàn Quốc",
    dojos: [
      {
        name: "Khu vực miền Bắc",
        locations: ["Chùa 수원사", "경기도 수원시 팔달구 수원천로 300"],
      },
      {
        name: "Khu vực miền Nam",
        locations: ["Chùa 불지사", "경상남도 창원시 성산구 상남로 172"],
      },
    ],
  },
};

export const beltSystem = {
  sectionTitle: "HỆ THỐNG CẤP ĐAI VÀ CHƯƠNG TRÌNH HUẤN LUYỆN MÔN PHÁI",
  chartTitle: "HỆ THỐNG ĐẲNG CẤP MÔN PHÁI PHẬT QUANG QUYỀN",
  pageImages: [
    "/images/pages/page-14.jpg",
    "/images/extracted/img-011-p14.jpeg",
  ],
  note: "Bảng hệ thống đẳng cấp đầy đủ được hiển thị nguyên bản từ catalogue. Hỗ trợ phóng to để xem mọi chi tiết.",
};

export const curriculum = {
  title: "Chương trình huấn luyện môn phái",
  pages: [
    {
      label: "Cấp Lam Đai & Cấp Lục Đai",
      src: "/images/pages/page-15.jpg",
      extracted: [
        "/images/extracted/img-013-p15.jpeg",
        "/images/extracted/img-014-p15.jpeg",
      ],
    },
    {
      label: "Cấp Hồng Đai & tiếp theo",
      src: "/images/pages/page-16.jpg",
      extracted: [
        "/images/extracted/img-016-p16.jpeg",
        "/images/extracted/img-017-p16.jpeg",
      ],
    },
    {
      label: "Cấp cao & Thượng đẳng",
      src: "/images/pages/page-17.jpg",
      extracted: [
        "/images/extracted/img-019-p17.jpeg",
        "/images/extracted/img-020-p17.jpeg",
      ],
    },
  ],
};

export const competitions = {
  sectionTitle: "CÁC GIẢI ĐẤU ĐÃ THAM GIA TỪ KHI MÔN PHÁI THÀNH LẬP",
  intro: [
    "Trải qua hơn 20 năm âm thầm tập luyện, với sự phát triển của chùa và mong muốn quảng bá môn phái ra bên ngoài của Tăng Ni, Phật Tử thì năm 2015 môn phái đã chính thức tham gia vào liên đoàn VCTVN để xây dựng và phát triển môn phái theo hướng phát triển phong trào võ thuật trong quần chúng phù hợp với mục đích tôn chỉ của LĐVTCTVN.",
    "Tuy mới gia nhập Liên đoàn Võ cổ truyền Việt Nam nhưng môn phái Phật Quang Quyền cũng đã có những đóng góp nhất định cho nền võ học nước nhà. Dưới sự chỉ dạy của Sư Phụ, thầy Chưởng Môn và quý thầy trong hội đồng chưởng quản môn phái, các võ sinh đã đạt được hàng chục huy chương vàng, bạc, đồng trong các kỳ thi của liên đoàn từ năm 2016 đến nay tiêu biểu trong đó như:",
  ],
  events: [
    {
      title: "LIÊN HOAN VÕ VIỆT ĐẤT PHƯƠNG NAM",
      pages: [20, 21],
      images: [
        "/images/extracted/img-024-p20.jpeg",
        "/images/extracted/img-025-p20.jpeg",
        "/images/extracted/img-026-p20.jpeg",
        "/images/extracted/img-027-p20.jpeg",
        "/images/extracted/img-028-p20.jpeg",
        "/images/extracted/img-029-p21.jpeg",
        "/images/extracted/img-030-p21.jpeg",
        "/images/extracted/img-031-p21.jpeg",
      ],
    },
    {
      title:
        "THI LÊN ĐAI VÕ CỔ TRUYỀN TỈNH BÀ RỊA VŨNG TÀU VÀ TP.HỒ CHÍ MINH",
      pages: [22, 23],
      images: [
        "/images/extracted/img-032-p22.jpeg",
        "/images/extracted/img-033-p22.jpeg",
        "/images/extracted/img-034-p23.jpeg",
        "/images/extracted/img-035-p23.jpeg",
      ],
    },
    {
      title: "GIẢI ĐẠI HỘI TDTT TỈNH NGHỆ AN",
      pages: [24],
      images: [
        "/images/extracted/img-036-p24.jpeg",
        "/images/extracted/img-037-p24.jpeg",
      ],
    },
    {
      title: "GIẢI VÕ THUẬT LÀNG SEN TÌNH NGHỆ AN",
      pages: [25],
      images: [
        "/images/extracted/img-038-p25.jpeg",
        "/images/extracted/img-039-p25.jpeg",
      ],
    },
    {
      title: "GIẢI CÚP VÔ ĐỊCH VCT NGHỆ AN MỞ RỘNG",
      pages: [26],
      images: [
        "/images/extracted/img-040-p26.jpeg",
        "/images/extracted/img-041-p26.jpeg",
      ],
    },
    {
      title: "LỚP VÕ TẠI HÀN QUỐC",
      pages: [27, 28],
      images: [
        "/images/extracted/img-042-p27.jpeg",
        "/images/extracted/img-043-p27.jpeg",
        "/images/extracted/img-044-p28.jpeg",
        "/images/extracted/img-045-p28.jpeg",
      ],
    },
  ],
  posterImages: [
    "/images/extracted/img-022-p18.jpeg",
    "/images/extracted/img-023-p19.jpeg",
  ],
};

export const volunteer = {
  sectionTitle: "CÁC HOẠT ĐỘNG XÃ HỘI THIỆN NGUYỆN",
  intro:
    "Ngoài việc tham gia tập luyện, các võ sinh môn phái trên cả nước luôn tích cực tham gia các hoạt động xã hội thiện nguyện theo đúng lời thề thứ 6 là Yêu thích lao động giúp đời với các hoạt động như đắp đường, nhặt rác, trồng cây, tham quan các di tích lịch sử,….",
  activities: [
    {
      title: "VIẾNG NGHĨA TRANG LIỆT SĨ",
      pages: [29, 30, 31],
      images: [
        "/images/extracted/img-046-p29.jpeg",
        "/images/extracted/img-047-p30.jpeg",
        "/images/extracted/img-048-p30.jpeg",
        "/images/extracted/img-049-p31.jpeg",
      ],
    },
    {
      title: "THAM QUAN DI TÍCH LỊCH SỬ",
      pages: [32, 33, 34],
      images: [
        "/images/extracted/img-050-p32.jpeg",
        "/images/extracted/img-051-p32.jpeg",
        "/images/extracted/img-052-p33.jpeg",
        "/images/extracted/img-053-p33.jpeg",
        "/images/extracted/img-054-p34.jpeg",
        "/images/extracted/img-055-p34.jpeg",
      ],
    },
    {
      title: "TRỒNG CÂY VÀ NHẶT RÁC",
      pages: [35, 36, 37, 38, 39, 40],
      images: [
        "/images/extracted/img-056-p35.jpeg",
        "/images/extracted/img-057-p35.jpeg",
        "/images/extracted/img-058-p35.jpeg",
        "/images/extracted/img-059-p35.jpeg",
        "/images/extracted/img-060-p36.jpeg",
        "/images/extracted/img-061-p36.jpeg",
        "/images/extracted/img-062-p36.jpeg",
        "/images/extracted/img-063-p37.jpeg",
        "/images/extracted/img-064-p37.jpeg",
        "/images/extracted/img-065-p38.jpeg",
        "/images/extracted/img-066-p38.jpeg",
        "/images/extracted/img-067-p38.jpeg",
        "/images/extracted/img-068-p39.jpeg",
        "/images/extracted/img-069-p39.jpeg",
        "/images/extracted/img-070-p39.jpeg",
        "/images/extracted/img-071-p40.jpeg",
        "/images/extracted/img-072-p40.jpeg",
      ],
    },
  ],
};

export const navItems = [
  { label: "Lịch sử", href: "#lich-su" },
  { label: "Tôn chỉ", href: "#ton-chi" },
  { label: "Quy mô", href: "#quy-mo" },
  { label: "Cấp đai", href: "#he-thong-dai" },
  { label: "Giải đấu", href: "#giai-dau" },
  { label: "Thiện nguyện", href: "#thien-nguyen" },
  { label: "Liên hệ", href: "#lien-he" },
] as const;
