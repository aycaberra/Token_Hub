export type Role = "admin" | "employee";
export type Lang = "en" | "tr";
export type PortalPage =
  | "dashboard"
  | "announcements"
  | "announcement-request"
  | "announcement-requests"
  | "announcement-create"
  | "announcement-edit"
  | "blog"
  | "publish"
  | "documents"
  | "courses"
  | "welcome-on-board"
  | "forms"
  | "social-hub"
  | "social-hub-edit";

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
  publishedAt: string;
  hasForm?: boolean;
};

const announcementBase = [
  {
    slug: "quarterly-all-hands",
    title: "Quarterly All-Hands On Friday",
    detail:
      "Company-wide roadmap review, team wins, and leadership Q&A at 3:00 PM.",
    body: [
      "This Friday we will hold our quarterly all-hands meeting with leadership updates, team highlights, and a roadmap review for the upcoming period.",
      "The session starts at 3:00 PM in the main event space and will also be streamed for remote employees. Please send your questions in advance if you would like them included in the Q&A.",
    ],
    publishedAt: "June 9, 2026 · 11:00",
  },
  {
    slug: "office-access-update",
    title: "Office Access Update",
    detail:
      "New badge activation process starts next Monday. Complete the form before 5:00 PM.",
    body: [
      "Starting next Monday, all employees will need to use the updated badge activation process to enter the office building and shared floors.",
      "Please complete the required internal form before 5:00 PM so the facilities team can activate your access without delays.",
    ],
    publishedAt: "June 8, 2026 · 16:40",
  },
  {
    slug: "summer-onboarding-cohort",
    title: "Summer Onboarding Cohort",
    detail:
      "Welcome sessions, buddy assignments, and starter resources are now available in the HR Hub.",
    body: [
      "Our summer onboarding cohort officially begins this week. Welcome sessions and department introductions are now scheduled in the onboarding calendar.",
      "Buddy assignments, first-week checklists, and starter documents are now available in the HR Hub for both new joiners and managers.",
    ],
    publishedAt: "June 7, 2026 · 09:15",
  },
  {
    slug: "tshirt-gift",
    title: "Tshirt Gift",
    detail: "Please submit your information for the company tshirt gift.",
    body: [
      "We are preparing company tshirt gifts for employees.",
      "Please fill out the form below with your email, name, and size so the team can prepare your package correctly.",
    ],
    publishedAt: "June 6, 2026 · 14:20",
    hasForm: true,
  },
  {
    slug: "concert-ticket-gift",
    title: "Concert Ticket Gift",
    detail: "Enter the draw for the company concert ticket gift.",
    body: [
      "We are gifting concert tickets to a limited number of employees as part of our summer social activities.",
      "Please fill out the form below with your details and concert preference so we can include you in the draw.",
    ],
    publishedAt: "June 10, 2026 · 10:15",
    hasForm: true,
  },
] as const satisfies Announcement[];

const announcementTr: Record<string, Omit<Announcement, "slug" | "hasForm">> = {
  "quarterly-all-hands": {
    title: "Cuma Günü Çeyrek Dönem Şirket Toplantısı",
    detail:
      "Şirket genelinde yol haritası değerlendirmesi, ekip başarıları ve 15:00'te liderlik soru-cevap oturumu.",
    body: [
      "Bu cuma liderlik güncellemeleri, ekip öne çıkanları ve önümüzdeki dönem yol haritası değerlendirmesiyle çeyrek dönem şirket toplantımızı yapacağız.",
      "Oturum ana etkinlik alanında saat 15:00'te başlayacak ve uzaktan çalışanlar için yayınlanacaktır. Soru-cevap bölümüne dahil edilmesini istediğiniz soruları önceden paylaşabilirsiniz.",
    ],
    publishedAt: "9 Haziran 2026 · 11:00",
  },
  "office-access-update": {
    title: "Ofis Giriş Güncellemesi",
    detail:
      "Yeni kart aktivasyon süreci gelecek pazartesi başlıyor. Formu 17:00'ye kadar doldurun.",
    body: [
      "Gelecek pazartesiden itibaren tüm çalışanların ofis binası ve ortak katlara giriş için güncellenmiş kart aktivasyon sürecini kullanması gerekecek.",
      "Tesis ekibinin erişiminizi gecikme olmadan aktif edebilmesi için gerekli iç formu saat 17:00'ye kadar doldurun.",
    ],
    publishedAt: "8 Haziran 2026 · 16:40",
  },
  "summer-onboarding-cohort": {
    title: "Yaz Onboarding Grubu",
    detail:
      "Karşılama oturumları, buddy atamaları ve başlangıç kaynakları artık HR Hub'da mevcut.",
    body: [
      "Yaz onboarding grubumuz bu hafta resmi olarak başlıyor. Karşılama oturumları ve departman tanışmaları onboarding takvimine eklendi.",
      "Buddy atamaları, ilk hafta kontrol listeleri ve başlangıç dokümanları artık hem yeni başlayanlar hem de yöneticiler için HR Hub'da mevcut.",
    ],
    publishedAt: "7 Haziran 2026 · 09:15",
  },
  "tshirt-gift": {
    title: "Tişört Hediyesi",
    detail: "Şirket tişörtü hediyesi için bilgilerinizi gönderin.",
    body: [
      "Çalışanlar için şirket tişörtü hediyeleri hazırlıyoruz.",
      "Paketinizi doğru hazırlayabilmemiz için lütfen aşağıdaki formu e-posta, ad ve beden bilgilerinizle doldurun.",
    ],
    publishedAt: "6 Haziran 2026 · 14:20",
  },
  "concert-ticket-gift": {
    title: "Konser Bileti Hediyesi",
    detail: "Şirket konser bileti hediyesi çekilişi için bilgilerinizi girin.",
    body: [
      "Yaz sosyal etkinlikleri kapsamında sınırlı sayıda çalışanımıza konser bileti hediye ediyoruz.",
      "Sizi çekilişe dahil edebilmemiz için lütfen aşağıdaki formu bilgileriniz ve konser tercihinizle doldurun.",
    ],
    publishedAt: "10 Haziran 2026 · 10:15",
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
  publishedAt: string;
  body: string[];
  likes: number;
  comments: PostComment[];
};

const postBase = [
  {
    slug: "selling-iphone-13",
    title: "Selling My iPhone 13 Second-Hand, Message Me If Interested",
    summary: "",
    author: "Selin A.",
    publishedAt: "June 9, 2026 · 10:30",
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
    title: "Need Advice For Choosing A Middle School In Beşiktaş",
    summary: "",
    author: "Ece T.",
    publishedAt: "June 8, 2026 · 13:10",
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
    title: "Seeking A Rental Close To The Office Area",
    summary: "",
    author: "Bora N.",
    publishedAt: "June 7, 2026 · 18:45",
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
    title: "İkinci El iPhone 13 Satıyorum, İlgilenen Yazabilir",
    summary: "",
    author: "Selin A.",
    publishedAt: "9 Haziran 2026 · 10:30",
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
    title: "Beşiktaş'ta Ortaokul Seçimi İçin Tavsiyeye İhtiyacım Var",
    summary: "",
    author: "Ece T.",
    publishedAt: "8 Haziran 2026 · 13:10",
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
    title: "Ofise Yakın Kiralık Ev Arıyorum",
    summary: "",
    author: "Bora N.",
    publishedAt: "7 Haziran 2026 · 18:45",
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

export type DocumentItem = {
  slug: string;
  name: string;
  action: string;
  href: string;
  description: string;
  updatedAt: string;
  body: string[];
};

const documentBase = [
  {
    slug: "employee-handbook-2026",
    name: "Employee Handbook 2026",
    action: "Open",
    href: "/documents/employee-handbook-2026",
    description: "Company culture, policies, benefits, and everyday working principles.",
    updatedAt: "June 5, 2026 · 09:30",
    body: [
      "This handbook brings together the core policies, benefits information, and day-to-day working principles used across Token.",
      "Employees can use it as a quick reference for leave rules, workplace expectations, communication norms, and people processes.",
    ],
  },
  {
    slug: "leave-request-template",
    name: "Leave Request Template",
    action: "Open",
    href: "/documents/leave-request-template",
    description: "Standard request format for annual leave, personal leave, and manager approval.",
    updatedAt: "June 4, 2026 · 14:10",
    body: [
      "Use this template when preparing a leave request that needs a documented format before submission in the internal systems.",
      "It includes the dates, leave type, handover notes, and approval fields expected by managers and HR.",
    ],
  },
  {
    slug: "expense-reimbursement-guide",
    name: "Expense Reimbursement Guide",
    action: "Open",
    href: "/documents/expense-reimbursement-guide",
    description: "Steps for submitting expenses, uploading receipts, and tracking reimbursement status.",
    updatedAt: "June 3, 2026 · 11:45",
    body: [
      "This guide explains how employees can submit expense claims, upload receipts correctly, and follow the approval flow.",
      "It also outlines the reimbursement timing, required categories, and common mistakes to avoid during submission.",
    ],
  },
  {
    slug: "new-hire-onboarding-checklist",
    name: "New Hire Onboarding Checklist",
    action: "Open",
    href: "/documents/new-hire-onboarding-checklist",
    description: "Starter checklist for first-week setup, introductions, tools, and access needs.",
    updatedAt: "June 2, 2026 · 16:00",
    body: [
      "The onboarding checklist helps new joiners and managers track first-week setup items, introductions, and required access steps.",
      "It is designed to keep the onboarding experience clear, welcoming, and consistent across teams.",
    ],
  },
] as const satisfies DocumentItem[];

const documentTr: Record<string, Omit<DocumentItem, "slug" | "href">> = {
  "employee-handbook-2026": {
    name: "Çalışan El Kitabı 2026",
    action: "Aç",
    description: "Şirket kültürü, politikalar, yan haklar ve günlük çalışma prensipleri.",
    updatedAt: "5 Haziran 2026 · 09:30",
    body: [
      "Bu el kitabı, Token genelinde kullanılan temel politikaları, yan hak bilgilerini ve günlük çalışma prensiplerini bir araya getirir.",
      "Çalışanlar bunu izin kuralları, işyeri beklentileri, iletişim normları ve insan süreçleri için hızlı bir referans olarak kullanabilir.",
    ],
  },
  "leave-request-template": {
    name: "İzin Talep Şablonu",
    action: "Aç",
    description: "Yıllık izin, mazeret izni ve yönetici onayı için standart talep formatı.",
    updatedAt: "4 Haziran 2026 · 14:10",
    body: [
      "Bu şablonu, iç sistemlerde gönderim öncesinde belgeli format gerektiren izin taleplerinde kullanabilirsiniz.",
      "Yönetici ve İK tarafından beklenen tarih, izin türü, devir notları ve onay alanlarını içerir.",
    ],
  },
  "expense-reimbursement-guide": {
    name: "Masraf Geri Ödeme Rehberi",
    action: "Aç",
    description: "Masraf gönderme, fiş yükleme ve geri ödeme durumunu takip etme adımları.",
    updatedAt: "3 Haziran 2026 · 11:45",
    body: [
      "Bu rehber, çalışanların masraf taleplerini nasıl oluşturacağını, fişleri doğru biçimde nasıl yükleyeceğini ve onay akışını nasıl takip edeceğini açıklar.",
      "Ayrıca geri ödeme zamanlamasını, gerekli kategorileri ve gönderim sırasında kaçınılması gereken yaygın hataları özetler.",
    ],
  },
  "new-hire-onboarding-checklist": {
    name: "Yeni Başlayan Kontrol Listesi",
    action: "Aç",
    description: "İlk hafta kurulumları, tanışmalar, araçlar ve erişim ihtiyaçları için başlangıç listesi.",
    updatedAt: "2 Haziran 2026 · 16:00",
    body: [
      "Onboarding kontrol listesi, yeni başlayanların ve yöneticilerin ilk hafta kurulumlarını, tanışmalarını ve gerekli erişim adımlarını takip etmesine yardımcı olur.",
      "Tüm ekiplerde onboarding deneyimini daha net, sıcak ve tutarlı hale getirmek için hazırlanmıştır.",
    ],
  },
};

export const documents: DocumentItem[] = documentBase.map((item) => ({ ...item }));

export function getDocuments(lang: Lang) {
  if (lang === "en") return documents;

  return documents.map((document) => ({
    ...document,
    ...documentTr[document.slug],
  }));
}

export function getDocumentBySlug(slug: string, lang: Lang = "en") {
  return getDocuments(lang).find((document) => document.slug === slug);
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
        { label: "Form gönderimleri", value: "126", helper: "Dışa aktarıma hazır" },
        { label: "Portal girişleri", value: "1,284", helper: "Bu ay toplam giriş" },
      ]
    : [
        { label: "Form submissions", value: "126", helper: "Export ready" },
        { label: "Portal logins", value: "1,284", helper: "Total this month" },
      ];
}
