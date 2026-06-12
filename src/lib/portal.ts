export type Role = "admin" | "employee";
export type Lang = "en" | "tr";
export type PortalPage =
  | "dashboard"
  | "announcements"
  | "announcement-request"
  | "blog"
  | "publish"
  | "documents"
  | "forms"
  | "social-hub";

export function getRole(role?: string): Role {
  return role === "admin" ? "admin" : "employee";
}

export function getLang(lang?: string): Lang {
  return lang === "tr" ? "tr" : "en";
}

export function roleLabel(role: Role, lang: Lang = "en") {
  if (lang === "tr") return role === "admin" ? "Yönetici" : "Çalışan";
  return role === "admin" ? "Admin" : "Employee";
}

export type Announcement = {
  slug: string;
  title: string;
  detail: string;
  body: string[];
  hasForm?: boolean;
};

const announcementBase = [
  {
    slug: "quarterly-all-hands",
    title: "Quarterly all-hands on Friday",
    detail:
      "Company-wide roadmap review, team wins, and leadership Q&A at 3:00 PM.",
    body: [
      "This Friday we will hold our quarterly all-hands meeting with leadership updates, team highlights, and a roadmap review for the upcoming period.",
      "The session starts at 3:00 PM in the main event space and will also be streamed for remote employees. Please send your questions in advance if you would like them included in the Q&A.",
    ],
  },
  {
    slug: "office-access-update",
    title: "Office access update",
    detail:
      "New badge activation process starts next Monday. Complete the form before 5:00 PM.",
    body: [
      "Starting next Monday, all employees will need to use the updated badge activation process to enter the office building and shared floors.",
      "Please complete the required internal form before 5:00 PM so the facilities team can activate your access without delays.",
    ],
  },
  {
    slug: "summer-onboarding-cohort",
    title: "Summer onboarding cohort",
    detail:
      "Welcome sessions, buddy assignments, and starter resources are now available in the HR Hub.",
    body: [
      "Our summer onboarding cohort officially begins this week. Welcome sessions and department introductions are now scheduled in the onboarding calendar.",
      "Buddy assignments, first-week checklists, and starter documents are now available in the HR Hub for both new joiners and managers.",
    ],
  },
  {
    slug: "tshirt-gift",
    title: "Tshirt gift",
    detail: "Please submit your information for the company tshirt gift.",
    body: [
      "We are preparing company tshirt gifts for employees.",
      "Please fill out the form below with your email, name, and size so the team can prepare your package correctly.",
    ],
    hasForm: true,
  },
] as const satisfies Announcement[];

const announcementTr: Record<string, Omit<Announcement, "slug" | "hasForm">> = {
  "quarterly-all-hands": {
    title: "Cuma günü çeyrek dönem şirket toplantısı",
    detail:
      "Şirket genelinde yol haritası değerlendirmesi, ekip başarıları ve 15:00'te liderlik soru-cevap oturumu.",
    body: [
      "Bu cuma liderlik güncellemeleri, ekip öne çıkanları ve önümüzdeki dönem yol haritası değerlendirmesiyle çeyrek dönem şirket toplantımızı yapacağız.",
      "Oturum ana etkinlik alanında saat 15:00'te başlayacak ve uzaktan çalışanlar için yayınlanacaktır. Soru-cevap bölümüne dahil edilmesini istediğiniz soruları önceden paylaşabilirsiniz.",
    ],
  },
  "office-access-update": {
    title: "Ofis giriş güncellemesi",
    detail:
      "Yeni kart aktivasyon süreci gelecek pazartesi başlıyor. Formu 17:00'ye kadar doldurun.",
    body: [
      "Gelecek pazartesiden itibaren tüm çalışanların ofis binası ve ortak katlara giriş için güncellenmiş kart aktivasyon sürecini kullanması gerekecek.",
      "Tesis ekibinin erişiminizi gecikme olmadan aktif edebilmesi için gerekli iç formu saat 17:00'ye kadar doldurun.",
    ],
  },
  "summer-onboarding-cohort": {
    title: "Yaz onboarding grubu",
    detail:
      "Karşılama oturumları, buddy atamaları ve başlangıç kaynakları artık HR Hub'da mevcut.",
    body: [
      "Yaz onboarding grubumuz bu hafta resmi olarak başlıyor. Karşılama oturumları ve departman tanışmaları onboarding takvimine eklendi.",
      "Buddy atamaları, ilk hafta kontrol listeleri ve başlangıç dokümanları artık hem yeni başlayanlar hem de yöneticiler için HR Hub'da mevcut.",
    ],
  },
  "tshirt-gift": {
    title: "Tişört hediyesi",
    detail: "Şirket tişörtü hediyesi için bilgilerinizi gönderin.",
    body: [
      "Çalışanlar için şirket tişörtü hediyeleri hazırlıyoruz.",
      "Paketinizi doğru hazırlayabilmemiz için lütfen aşağıdaki formu e-posta, ad ve beden bilgilerinizle doldurun.",
    ],
  },
};

export const announcements: Announcement[] = announcementBase.map((item) => ({ ...item }));

export function getAnnouncements(lang: Lang): Announcement[] {
  if (lang === "en") return announcements;

  return announcements.map((announcement) => ({
    ...announcement,
    ...announcementTr[announcement.slug],
  }));
}

export function getAnnouncementBySlug(slug: string, lang: Lang = "en") {
  return getAnnouncements(lang).find((announcement) => announcement.slug === slug);
}

export type PostComment = {
  author: string;
  text: string;
  time: string;
};

export type Post = {
  slug: string;
  title: string;
  summary: string;
  author: string;
  body: string[];
  likes: number;
  comments: PostComment[];
};

const postBase = [
  {
    slug: "selling-iphone-13",
    title: "Selling my iPhone 13 second-hand, message me if interested",
    summary: "",
    author: "Selin A.",
    body: [
      "I’m selling my iPhone 13 because I recently upgraded. The phone is in good condition and has no repair history.",
      "If anyone is looking for a second-hand phone for themselves or a family member, feel free to reach out to me through the portal.",
    ],
    likes: 12,
    comments: [
      {
        author: "Mert K.",
        text: "Can you share the price range?",
        time: "10 min ago",
      },
      {
        author: "Ceren D.",
        text: "I may know someone interested, I’ll message you.",
        time: "4 min ago",
      },
    ],
  },
  {
    slug: "middle-school-advice",
    title: "Need advice for choosing a middle school in Beşiktaş",
    summary: "",
    author: "Ece T.",
    body: [
      "We are evaluating middle school options for next year and would really appreciate feedback from colleagues who have recent experience in Beşiktaş or nearby areas.",
      "If you know a school with strong academics and a supportive environment, I’d love to hear your thoughts.",
    ],
    likes: 8,
    comments: [
      {
        author: "Ayşe Y.",
        text: "We had a good experience with a school near Akaretler, I can share details.",
        time: "22 min ago",
      },
    ],
  },
  {
    slug: "seeking-rental-near-office",
    title: "Seeking a rental close to the office area",
    summary: "",
    author: "Bora N.",
    body: [
      "I’m currently looking for a rental apartment with a practical commute to the office. Ideally 1+1 or 2+1, and I’m open to both direct listings and neighborhood suggestions.",
      "If you know of anything suitable or have advice on where to look, please leave a comment or send me a message.",
    ],
    likes: 15,
    comments: [
      {
        author: "Deniz P.",
        text: "You may want to check Gayrettepe and nearby listings this week.",
        time: "18 min ago",
      },
      {
        author: "Onur S.",
        text: "A friend is moving out next month, I’ll ask if the flat is still available.",
        time: "7 min ago",
      },
    ],
  },
] as const satisfies Post[];

const postTr: Record<string, Omit<Post, "slug" | "likes">> = {
  "selling-iphone-13": {
    title: "İkinci el iPhone 13 satıyorum, ilgilenen yazabilir",
    summary: "",
    author: "Selin A.",
    body: [
      "Yakın zamanda telefonumu yenilediğim için iPhone 13 cihazımı satıyorum. Cihaz iyi durumda ve herhangi bir tamir geçmişi yok.",
      "Kendisi ya da aile bireyi için ikinci el telefon arayan varsa portal üzerinden bana ulaşabilir.",
    ],
    comments: [
      {
        author: "Mert K.",
        text: "Fiyat aralığını paylaşabilir misin?",
        time: "10 dk önce",
      },
      {
        author: "Ceren D.",
        text: "İlgilenebilecek birini tanıyor olabilirim, sana yazacağım.",
        time: "4 dk önce",
      },
    ],
  },
  "middle-school-advice": {
    title: "Beşiktaş'ta ortaokul seçimi için tavsiyeye ihtiyacım var",
    summary: "",
    author: "Ece T.",
    body: [
      "Önümüzdeki yıl için ortaokul seçeneklerini değerlendiriyoruz. Beşiktaş veya yakın bölgelerde güncel deneyimi olan çalışma arkadaşlarımızın görüşlerini duymak isterim.",
      "Güçlü akademik yapısı ve destekleyici ortamı olan bir okul biliyorsanız fikirlerinizi paylaşabilir misiniz?",
    ],
    comments: [
      {
        author: "Ayşe Y.",
        text: "Akaretler yakınında iyi deneyim yaşadığımız bir okul var, detay paylaşabilirim.",
        time: "22 dk önce",
      },
    ],
  },
  "seeking-rental-near-office": {
    title: "Ofise yakın kiralık ev arıyorum",
    summary: "",
    author: "Bora N.",
    body: [
      "Şu anda ofise ulaşımı kolay bir kiralık daire arıyorum. Tercihen 1+1 veya 2+1, hem doğrudan ilanlara hem de semt önerilerine açığım.",
      "Uygun bir seçenek biliyorsanız veya nerelere bakmam gerektiği konusunda tavsiyeniz varsa yorum bırakabilir ya da bana mesaj gönderebilirsiniz.",
    ],
    comments: [
      {
        author: "Deniz P.",
        text: "Bu hafta Gayrettepe ve yakın çevredeki ilanlara bakabilirsin.",
        time: "18 dk önce",
      },
      {
        author: "Onur S.",
        text: "Bir arkadaşım gelecek ay taşınıyor, daire hala boşalacak mı sorarım.",
        time: "7 dk önce",
      },
    ],
  },
};

export const posts: Post[] = postBase.map((item) => ({ ...item }));

export function getPosts(lang: Lang): Post[] {
  if (lang === "en") return posts;

  return posts.map((post) => ({
    ...post,
    ...postTr[post.slug],
    comments: postTr[post.slug].comments,
  }));
}

export function getPostBySlug(slug: string, lang: Lang = "en") {
  return getPosts(lang).find((post) => post.slug === slug);
}

export function getDocuments(lang: Lang) {
  return lang === "tr"
    ? [
        { name: "Çalışan El Kitabı 2026", action: "Aç", href: "/documents" },
        { name: "İzin Talep Şablonu", action: "Aç", href: "/forms" },
        { name: "Masraf Geri Ödeme Rehberi", action: "Aç", href: "/documents" },
        { name: "Yeni Başlayan Kontrol Listesi", action: "Aç", href: "/documents" },
      ]
    : [
        { name: "Employee Handbook 2026", action: "Open", href: "/documents" },
        { name: "Leave Request Template", action: "Open", href: "/forms" },
        { name: "Expense Reimbursement Guide", action: "Open", href: "/documents" },
        { name: "New Hire Onboarding Checklist", action: "Open", href: "/documents" },
      ];
}

export function getSubmissions(lang: Lang) {
  return lang === "tr"
    ? [
        { name: "İkinci el laptop ilanı", owner: "Elena P.", status: "İncelemede" },
        { name: "Ortaokul tavsiye talebi", owner: "48 yanıt", status: "Aktif" },
        { name: "Levent civarı kiralık ilanı", owner: "HR Team", status: "Yayında" },
      ]
    : [
        { name: "Second-hand laptop post", owner: "Elena P.", status: "Pending review" },
        { name: "Family school advice request", owner: "48 responses", status: "Active" },
        { name: "Rental post near Levent", owner: "HR Team", status: "Published" },
      ];
}

export function getEmployeeStats(lang: Lang) {
  return lang === "tr"
    ? [
        { label: "Okunmamış duyurular", value: "3", helper: "2 yüksek öncelik" },
        { label: "Mevcut dokümanlar", value: "24", helper: "6 kategoride" },
        { label: "Gönderilen formlar", value: "7", helper: "Son 30 gün" },
        { label: "Social Hub", value: "6 grup", helper: "MultiSport dahil" },
      ]
    : [
        { label: "Unread announcements", value: "3", helper: "2 high priority" },
        { label: "Available documents", value: "24", helper: "Across 6 categories" },
        { label: "Forms submitted", value: "7", helper: "Last 30 days" },
        { label: "Social Hub", value: "6 groups", helper: "MultiSport included" },
      ];
}

export function getAdminStats(lang: Lang) {
  return lang === "tr"
    ? [
        { label: "Bekleyen onaylar", value: "8", helper: "İlanlar + dokümanlar" },
        { label: "Aktif çalışan paylaşımları", value: "19", helper: "Pazar yeri, tavsiye, kiralık" },
        { label: "Form gönderimleri", value: "126", helper: "Dışa aktarıma hazır" },
        { label: "Çalışan kullanımı", value: "92%", helper: "Bu ay portal girişi" },
      ]
    : [
        { label: "Pending approvals", value: "8", helper: "Posts + documents" },
        { label: "Active employee posts", value: "19", helper: "Marketplace, advice, housing" },
        { label: "Form submissions", value: "126", helper: "Export ready" },
        { label: "Employee adoption", value: "92%", helper: "Portal logins this month" },
      ];
}
