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
  | "document-create"
  | "document-assign"
  | "document-request"
  | "benefits"
  | "benefit-create"
  | "courses"
  | "profiles"
  | "profile-create"
  | "my-page"
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

export type BlogCategory = "main" | "sports" | "foodie" | "art";

export type Post = {
  slug: string;
  category: BlogCategory;
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
    category: "main",
    title: "Selling My iPhone 13 Second-Hand, Message Me If Interested",
    summary: "",
    author: "Ayça Berra",
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
    category: "main",
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
    category: "main",
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
  {
    slug: "weekend-run-route",
    category: "sports",
    title: "Looking For A Weekend Running Group Around Maçka",
    summary: "",
    author: "Deniz P.",
    publishedAt: "June 9, 2026 · 08:20",
    body: [
      "I usually run alone on weekends but would love to join coworkers who already have a regular route around Maçka or Beşiktaş.",
      "If anyone is planning a casual morning run this weekend, I’d be happy to join and match the group pace.",
    ],
    likes: 9,
    comments: [
      {
        author: "Can A.",
        text: "We have a small group on Saturdays, I can add you.",
        time: "12 min ago",
      },
    ],
  },
  {
    slug: "best-salad-near-office",
    category: "foodie",
    title: "Best Healthy Lunch Spots Near The Office?",
    summary: "",
    author: "Melis R.",
    publishedAt: "June 8, 2026 · 12:25",
    body: [
      "I’m trying to collect a few reliable lunch spots near the office with lighter options like bowls, salads, and grilled meals.",
      "If you have a favorite place that is quick, tasty, and office-friendly, please share it here.",
    ],
    likes: 14,
    comments: [
      {
        author: "Ece T.",
        text: "There is a very good place two streets away, I’ll send the name.",
        time: "9 min ago",
      },
    ],
  },
  {
    slug: "weekend-exhibition-picks",
    category: "art",
    title: "Any Good Exhibition Recommendations For This Weekend?",
    summary: "",
    author: "Merve A.",
    publishedAt: "June 7, 2026 · 17:05",
    body: [
      "I’m planning a museum or gallery visit this weekend and would love to hear if anyone has recently seen an exhibition worth recommending.",
      "Modern art, photography, illustration, or smaller local galleries are all welcome suggestions.",
    ],
    likes: 11,
    comments: [
      {
        author: "Selin A.",
        text: "I saw a great photography exhibition last week, I’ll drop the details.",
        time: "16 min ago",
      },
    ],
  },
] as const satisfies Post[];

const postTr: Record<string, Omit<Post, "slug" | "category" | "likes">> = {
  "selling-iphone-13": {
    title: "İkinci El iPhone 13 Satıyorum, İlgilenen Yazabilir",
    summary: "",
    author: "Ayça Berra",
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
  "weekend-run-route": {
    title: "Maçka Çevresinde Hafta Sonu Koşu Grubu Arıyorum",
    summary: "",
    author: "Deniz P.",
    publishedAt: "9 Haziran 2026 · 08:20",
    body: [
      "Hafta sonları genelde tek başıma koşuyorum ama Maçka veya Beşiktaş çevresinde düzenli rota yapan çalışma arkadaşlarına katılmak isterim.",
      "Bu hafta sonu rahat tempolu bir sabah koşusu planlayan varsa memnuniyetle katılırım.",
    ],
    comments: [
      {
        author: "Can A.",
        text: "Cumartesi küçük bir grubumuz var, seni ekleyebilirim.",
        time: "12 dk önce",
      },
    ],
  },
  "best-salad-near-office": {
    title: "Ofis Yakınında En İyi Sağlıklı Öğle Yemeği Nerede?",
    summary: "",
    author: "Melis R.",
    publishedAt: "8 Haziran 2026 · 12:25",
    body: [
      "Ofis yakınında bowl, salata ve ızgara gibi daha hafif seçenekleri olan güvenilir birkaç öğle yemeği yeri toplamak istiyorum.",
      "Hızlı, lezzetli ve ofis günleri için uygun bir favoriniz varsa burada paylaşabilir misiniz?",
    ],
    comments: [
      {
        author: "Ece T.",
        text: "İki sokak ötede çok iyi bir yer var, adını paylaşırım.",
        time: "9 dk önce",
      },
    ],
  },
  "weekend-exhibition-picks": {
    title: "Bu Hafta Sonu İçin Güzel Sergi Önerisi Var Mı?",
    summary: "",
    author: "Merve A.",
    publishedAt: "7 Haziran 2026 · 17:05",
    body: [
      "Bu hafta sonu bir müze ya da galeri ziyareti planlıyorum. Yakın zamanda görülmeye değer bir sergi gezen varsa önerilerini duymak isterim.",
      "Modern sanat, fotoğraf, illüstrasyon ya da daha küçük yerel galeriler dahil tüm önerilere açığım.",
    ],
    comments: [
      {
        author: "Selin A.",
        text: "Geçen hafta çok iyi bir fotoğraf sergisi gördüm, detayları paylaşırım.",
        time: "16 dk önce",
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
    name: "Vacation & Time Off Guide",
    action: "Open",
    href: "/documents/employee-handbook-2026",
    description: "A simple overview of annual leave, personal leave, public holidays, and planning expectations.",
    updatedAt: "June 5, 2026 · 09:30",
    body: [
      "This guide helps employees understand how vacation days, personal leave, and official holidays are handled across the company.",
      "It also explains planning expectations, handover reminders, and how to make time off feel smooth both for employees and their teams.",
    ],
  },
  {
    slug: "leave-request-template",
    name: "Career Growth & Promotion Framework",
    action: "Open",
    href: "/documents/leave-request-template",
    description: "How growth paths, promotion timing, expectations, and evaluation principles are communicated at Token.",
    updatedAt: "June 4, 2026 · 14:10",
    body: [
      "This framework outlines how employees can grow in their roles, what promotion discussions look like, and which behaviours and contributions are valued.",
      "It is designed to make career development more transparent, fair, and encouraging for people across different teams.",
    ],
  },
  {
    slug: "expense-reimbursement-guide",
    name: "Benefits & Wellbeing Overview",
    action: "Open",
    href: "/documents/expense-reimbursement-guide",
    description: "A summary of wellbeing support, learning opportunities, and employee benefit highlights.",
    updatedAt: "June 3, 2026 · 11:45",
    body: [
      "This document brings together the most important employee benefits, including wellbeing support, social programs, and learning-related opportunities.",
      "It gives teams a clear snapshot of what is available and where to go for more detailed help when they want to make use of these offerings.",
    ],
  },
  {
    slug: "new-hire-onboarding-checklist",
    name: "Performance & Feedback Principles",
    action: "Open",
    href: "/documents/new-hire-onboarding-checklist",
    description: "Shared principles for feedback culture, goal setting, development conversations, and recognition.",
    updatedAt: "June 2, 2026 · 16:00",
    body: [
      "This document explains the company approach to performance conversations, regular feedback, and development check-ins.",
      "Its purpose is to support a healthy culture where expectations are clearer, achievements are recognized, and growth conversations happen consistently.",
    ],
  },
] as const satisfies DocumentItem[];

const documentTr: Record<string, Omit<DocumentItem, "slug" | "href">> = {
  "employee-handbook-2026": {
    name: "İzin ve Tatil Rehberi",
    action: "Aç",
    description: "Yıllık izin, mazeret izni, resmi tatiller ve planlama beklentileri için sade bir özet.",
    updatedAt: "5 Haziran 2026 · 09:30",
    body: [
      "Bu rehber, çalışanların yıllık izin günlerinin, mazeret izinlerinin ve resmi tatillerin şirket genelinde nasıl ele alındığını anlamasına yardımcı olur.",
      "Ayrıca izin planlama beklentilerini, devir hatırlatmalarını ve izin sürecinin hem çalışanlar hem de ekipler için nasıl daha rahat yönetilebileceğini açıklar.",
    ],
  },
  "leave-request-template": {
    name: "Kariyer Gelişimi ve Terfi Çerçevesi",
    action: "Aç",
    description: "Gelişim yolları, terfi zamanlaması, beklentiler ve değerlendirme prensiplerinin Token'da nasıl paylaşıldığı.",
    updatedAt: "4 Haziran 2026 · 14:10",
    body: [
      "Bu çerçeve, çalışanların rollerinde nasıl gelişebileceğini, terfi görüşmelerinin nasıl ilerlediğini ve hangi davranışlarla katkıların değerli görüldüğünü açıklar.",
      "Amaç, farklı ekiplerdeki çalışanlar için kariyer gelişimini daha şeffaf, adil ve motive edici hale getirmektir.",
    ],
  },
  "expense-reimbursement-guide": {
    name: "Yan Haklar ve İyi Yaşam Özeti",
    action: "Aç",
    description: "İyi yaşam desteği, öğrenme fırsatları ve çalışan yan hakları için sıcak bir özet.",
    updatedAt: "3 Haziran 2026 · 11:45",
    body: [
      "Bu doküman, iyi yaşam desteği, sosyal programlar ve öğrenme fırsatları dahil olmak üzere en önemli çalışan yan haklarını bir araya getirir.",
      "Çalışanlara nelerin sunulduğunu net biçimde gösterir ve bu imkanlardan yararlanmak istediklerinde nereye başvurabileceklerini özetler.",
    ],
  },
  "new-hire-onboarding-checklist": {
    name: "Performans ve Geri Bildirim Prensipleri",
    action: "Aç",
    description: "Geri bildirim kültürü, hedef belirleme, gelişim görüşmeleri ve takdir yaklaşımı için ortak prensipler.",
    updatedAt: "2 Haziran 2026 · 16:00",
    body: [
      "Bu doküman, şirketin performans görüşmelerine, düzenli geri bildirime ve gelişim odaklı değerlendirme buluşmalarına nasıl yaklaştığını açıklar.",
      "Amacı, beklentilerin daha net olduğu, başarıların görünür kılındığı ve gelişim konuşmalarının süreklilik kazandığı sağlıklı bir kültürü desteklemektir.",
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
        { label: "Okunmamış Duyurular", value: "3", helper: "2 Yüksek Öncelik" },
        { label: "Mevcut Dokümanlar", value: "24", helper: "6 Kategoride" },
        { label: "Gönderilen Formlar", value: "7", helper: "Son 30 Gün" },
        { label: "Social Hub", value: "6 Grup", helper: "MultiSport Dahil" },
      ]
    : [
        { label: "Unread Announcements", value: "3", helper: "2 High Priority" },
        { label: "Available Documents", value: "24", helper: "Across 6 Categories" },
        { label: "Forms Submitted", value: "7", helper: "Last 30 Days" },
        { label: "Social Hub", value: "6 Groups", helper: "MultiSport Included" },
      ];
}

export function getAdminStats(lang: Lang) {
  return lang === "tr"
    ? [
        { label: "Form Gönderimleri", value: "126", helper: "Dışa Aktarıma Hazır" },
        { label: "Portal Girişleri", value: "1,284", helper: "Bu Ay Toplam Giriş" },
        { label: "Duyuru Talepleri", value: "18", helper: "" },
      ]
    : [
        { label: "Form Submissions", value: "126", helper: "Export Ready" },
        { label: "Portal Logins", value: "1,284", helper: "Total This Month" },
        { label: "Announcement Requests", value: "18", helper: "" },
      ];
}
