"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  getAdminStats,
  getAnnouncementBySlug,
  getAnnouncements,
  getDocumentBySlug,
  getDocuments,
  getEmployeeStats,
  getLang,
  getPostBySlug,
  getPosts,
  getSubmissions,
  roleLabel,
  type Lang,
  type PortalPage,
  type Role,
} from "@/lib/portal";

type PortalShellProps = {
  role: Role;
  page: PortalPage;
  selectedPostSlug?: string;
  selectedAnnouncementSlug?: string;
  selectedAnnouncementRequestSlug?: string;
  selectedDocumentSlug?: string;
  selectedWelcomeOnBoardSlug?: string;
  selectedSocialHubSection?: "benefits" | "clubs";
  selectedSocialHubItem?: string;
  isAnnouncementEdit?: boolean;
};

type NotificationItem = {
  type: "like" | "comment" | "publish";
  text: string;
  href: string;
  time: string;
};
function withRole(href: string, role: Role) {
  return `${href}?role=${role}`;
}

function getRoleHref(pathname: string, role: Role) {
  if (role === "employee" && pathname === "/") {
    return withRole("/announcements", role);
  }

  return withRole(pathname, role);
}

function getNotifications(language: Lang, role: Role): NotificationItem[] {
  if (language === "tr") {
    return role === "admin"
      ? [
          { type: "like", text: "İkinci el telefon ilanına 4 yeni beğeni geldi.", href: "/blog/selling-iphone-13", time: "2 dk" },
          { type: "comment", text: "Kiralık ev paylaşımına 2 yeni yorum geldi.", href: "/blog/seeking-rental-near-office", time: "12 dk" },
          { type: "publish", text: "Yeni sprint demosu duyurusu yayınlandı.", href: "/announcements/new-sprint-demo", time: "25 dk" },
        ]
      : [
          { type: "comment", text: "Kiralık ev paylaşımına 3 yeni yorum geldi.", href: "/blog/seeking-rental-near-office", time: "5 dk" },
          { type: "like", text: "İkinci el telefon ilanınız 5 beğeni aldı.", href: "/blog/selling-iphone-13", time: "18 dk" },
          { type: "publish", text: "Tişört hediyesi için yeni bir duyuru yayınlandı.", href: "/announcements/tshirt-gift", time: "1 sa" },
        ];
  }

  return role === "admin"
    ? [
        { type: "like", text: "Your second-hand phone post received 4 new likes.", href: "/blog/selling-iphone-13", time: "2 min" },
        { type: "comment", text: "Your rental post received 2 new comments.", href: "/blog/seeking-rental-near-office", time: "12 min" },
        { type: "publish", text: "The new sprint demo announcement was published.", href: "/announcements/new-sprint-demo", time: "25 min" },
      ]
    : [
        { type: "comment", text: "Your rental post received 3 new comments.", href: "/blog/seeking-rental-near-office", time: "5 min" },
        { type: "like", text: "Your second-hand phone post got 5 likes.", href: "/blog/selling-iphone-13", time: "18 min" },
        { type: "publish", text: "A new tshirt gift announcement was published.", href: "/announcements/tshirt-gift", time: "1 h" },
      ];
}

function SearchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path strokeLinecap="round" d="m20 20-3.5-3.5" />
    </svg>
  );
}

function BellIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.857 17H20l-1.405-1.405A2.03 2.03 0 0 1 18 14.158V11a6.002 6.002 0 0 0-4-5.659V5a2 2 0 1 0-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5.143M14.857 17a3.001 3.001 0 0 1-5.714 0m5.714 0H9.143"
      />
    </svg>
  );
}

function HeartIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="m12 20-1.2-1.1C6 14.6 3 11.9 3 8.5 3 5.9 5 4 7.6 4c1.5 0 2.9.7 3.8 1.9A5 5 0 0 1 15.2 4C17.9 4 20 5.9 20 8.5c0 3.4-3 6.1-7.8 10.4L12 20Z" />
    </svg>
  );
}

function CommentIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h10M7 14h6m-2 7-4-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2l-4 4Z" />
    </svg>
  );
}

function PublishIcon({ className = "h-4 w-4" }: { className?: string }) {
  return <MegaphoneIcon className={className} />;
}

function NotificationTypeIcon({ type, className = "h-4 w-4" }: { type: NotificationItem["type"]; className?: string }) {
  if (type === "like") return <HeartIcon className={className} />;
  if (type === "comment") return <CommentIcon className={className} />;
  return <PublishIcon className={className} />;
}

function getNotificationTypeStyle(type: NotificationItem["type"]) {
  if (type === "like") return "bg-rose-50 text-rose-600 ring-1 ring-rose-100";
  if (type === "comment") return "bg-amber-50 text-amber-700 ring-1 ring-amber-100";
  return "bg-sky-50 text-sky-700 ring-1 ring-sky-100";
}

function getNotificationTypeLabel(type: NotificationItem["type"], language: Lang) {
  if (language === "tr") {
    if (type === "like") return "Beğeni";
    if (type === "comment") return "Yorum";
    return "Yayın";
  }

  if (type === "like") return "Like";
  if (type === "comment") return "Comment";
  return "Publish";
}

function MegaphoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 11.5V12a2.5 2.5 0 0 0 2.5 2.5H7l2 4h2l-1.4-4H12l6 3V6l-6 3H5.5A2.5 2.5 0 0 0 3 11.5Z" />
    </svg>
  );
}

function ArrowRightIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5 5 5-5 5" />
    </svg>
  );
}

function ClockIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="8" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l2.5 1.5" />
    </svg>
  );
}

function FileIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
    </svg>
  );
}

function UsersIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4ZM8 11c1.657 0 3-1.79 3-4S9.657 3 8 3 5 4.79 5 7s1.343 4 3 4Zm8 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4ZM8 13c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4Z" />
    </svg>
  );
}

function BrandIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      className={className}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3l2.7 5.3L20 11l-5.3 2.7L12 19l-2.7-5.3L4 11l5.3-2.7L12 3Z" />
    </svg>
  );
}

function TokenHubLogo() {
  return (
    <div className="inline-flex items-center gap-0 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm shadow-slate-100">
      <Image
        src="/token_logo.png"
        alt="Token"
        width={150}
        height={38}
        priority
        className="h-9 w-auto"
      />
      <span className="-ml-3 translate-y-[1px] text-[1.05rem] font-semibold leading-none tracking-[-0.02em] lowercase text-slate-950">
        hub
      </span>
    </div>
  );
}

function NavItemIcon({ href, className = "h-4 w-4" }: { href: string; className?: string }) {
  if (href === "/") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    );
  }

  if (href.startsWith("/announcements")) return <MegaphoneIcon className={className} />;

  if (href.startsWith("/blog")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 10h10M7 14h6m-3 7-4-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-1l-4 4Z" />
      </svg>
    );
  }

  if (href.startsWith("/documents")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5" />
      </svg>
    );
  }

  if (href.startsWith("/welcome-on-board")) return <BrandIcon className={className} />;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11c1.657 0 3-1.79 3-4s-1.343-4-3-4-3 1.79-3 4 1.343 4 3 4ZM8 11c1.657 0 3-1.79 3-4S9.657 3 8 3 5 4.79 5 7s1.343 4 3 4Zm8 2c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4ZM8 13c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4Z" />
    </svg>
  );
}

function getText(language: Lang) {
  if (language === "tr") {
    return {
      nav: {
        adminDashboard: "Yönetici Paneli",
        announcements: "Duyurular",
        blogManagement: "Blog",
        documents: "Dokümanlar",
        welcomeOnBoard: "Welcome On Board",
        formSubmissions: "Form Gönderimleri",
        socialHubSettings: "Social Hub",
        blog: "Blog",
        socialHub: "Social Hub",
      },
      headings: {
        dashboard: { title: "Panel", description: "" },
        announcements: { title: "Duyurular", description: "" },
        announcementRequest: { title: "Duyuru Talebi", description: "" },
        announcementRequests: { title: "Duyurular", description: "" },
        announcementCreate: { title: "Duyuru Oluştur", description: "" },
        announcementEdit: { title: "Duyuru Düzenle", description: "" },
        blog: { title: "Blog", description: "" },
        publish: { title: "Yayınla", description: "" },
        documents: { title: "Dokümanlar", description: "" },
        "welcome-on-board": { title: "Welcome On Board", description: "" },
        forms: { title: "Formlar", description: "Form gönderimleri ve şirket içi talepler." },
        socialHub: { title: "Social Hub", description: "" },
        socialHubEdit: { title: "Social Hub Güncelle", description: "" },
      },
      dashboard: {
        hero: "Şirket güncellemeleri, HR dokümanları, iç formlar ve sosyal aktiviteler için tek yer.",
        openAnnouncements: "Duyuruları aç",
        openHrHub: "HR Hub'ı aç",
        quickSnapshot: "Hızlı görünüm",
        adminPriorities: "",
        todayAtGlance: "Bugünün özeti",
        contentSubmissionsActivity: "",
        updatesDocumentsActions: "Güncellemeler, dokümanlar ve işlemler",
        blog: "Blog",
        reviewPosts: "Blog gönderilerini incele",
        employeePosts: "Çalışan paylaşımları",
        moderatePosts: "Çalışan paylaşımlarını düzenli şekilde yönet.",
        coworkerSharing: "Çalışanların paylaştığı ilanları ve talepleri gör.",
        forms: "Formlar",
        trackSubmissions: "Gönderimleri takip et",
        openForms: "Formları aç",
        reviewExport: "Yanıtları incele ve dışa aktar.",
        completeRequests: "Şirket içi talepleri ve anketleri doldur.",
        social: "Sosyal",
        socialHubTitle: "Social Hub",
        socialHubDesc: "Kulüpler, aktiviteler ve MultiSport seçeneklerini görüntüle.",
        monthly: "Aylık",
        weekly: "Haftalık",
        daily: "Günlük",
      },
      announcements: {
        teamAnnouncement: "Ekibimizin Bir Duyurusu Var",
        requests: "Talepler",
        back: "Geri",
        notFound: "Duyuru bulunamadı",
        tshirtForm: "Tişört Formu",
        concertForm: "Konser Bileti Formu",
        employeeEmail: "Çalışan E-Postası",
        name: "Ad",
        size: "Beden",
        concertPreference: "Konser Tercihi",
        submit: "Gönder",
        requestTitle: "Bir duyuru talebi paylaş",
        requestsTitle: "Duyuru talepleri",
        recentTitle: "Son Duyurular",
        createTitle: "Yeni duyuru oluştur",
        addForm: "Form ekle",
        formTemplate: "Form şablonu",
        attachment: "Ek dosya ekle (görsel, video)",
        requestOwner: "Talep sahibi",
        requestTeam: "Ekip",
        approve: "Onayla",
        reject: "Reddet",
        teamName: "Ekip adı",
        announcementTitle: "Duyuru başlığı",
        announcementContent: "Duyuru içeriği",
        sendToAdmin: "Yöneticiye gönder",
        edit: "Düzenle",
        editTitle: "Duyuruyu düzenle",
        save: "Değişiklikleri kaydet",
        delete: "Duyuruyu sil",
        detail: "Kısa açıklama",
        body: "Detay içeriği",
      },
      blog: {
        postModeration: "Paylaşım moderasyonu",
        recentPosts: "Son paylaşımlar",
        reviewEmployeePosts: "Çalışan paylaşımlarını yayın öncesi veya sonrası incele.",
        publish: "Yayınla",
        todaysBirthdays: "Bugünün doğum günleri",
        postNotFound: "Paylaşım bulunamadı",
        backToPosts: "Geri",
        sharedBy: "Paylaşan",
        unlike: "Beğenmekten vazgeç",
        like: "Beğen",
        delete: "Sil",
        views: "Görüntülenme",
        comments: "Yorumlar",
        writeComment: "Yorum yaz...",
        postComment: "Yorumu gönder",
        you: "Sen",
      },
      publish: {
        eyebrow: "Yayınla",
        title: "Çalışma Arkadaşlarınla Bir Şey Paylaş",
        topic: "Konu veya başlık",
        summary: "Kısa özet",
        content: "Paylaşım içeriği",
        sendForReview: "Yayınla",
        examples: "Örnekler",
        popularTypes: "Popüler paylaşım türleri",
        examplesDesc: "Bu alanı çalışanlar arasında günlük ve pratik paylaşımlar için kullanın.",
        exampleItems: [
          "İkinci el telefon veya laptop satmak",
          "Okul tavsiyesi istemek",
          "Kiralık ev veya ev arkadaşı aramak",
          "Çalışma arkadaşlarıyla faydalı yerel öneriler paylaşmak",
        ],
      },
      documents: {
        search: "Doküman, form, rehber ara...",
        notFound: "Doküman bulunamadı",
        mostUsed: "En Çok Kullanılan Dokümanlar",
      },
      welcomeOnBoard: {
        usefulLinks: "Faydalı Linkler",
        basicProcesses: "Ofis Başlangıç Bilgileri",
        expenseTitle: "Masraf Ve Satın Alma",
        expenseDesc: "Masraf girişleri, satın alma süreçleri, fiş yükleme ve onay takibi.",
        itTitle: "IT Destek Talepleri",
        itDesc: "Laptop, erişim, ekipman ve teknik destek kayıtları.",
        hrTitle: "İK Self Servis",
        hrDesc: "Kişisel bilgiler, bordro ve çalışan bilgileri.",
        printerTitle: "Şirket Yazıcısı Nasıl Kullanılır?",
        printerDesc: "Yazıcıya bağlan, güvenli baskı kodunu gir ve çıktını teslim al.",
        wifiTitle: "Şirket Wi‑Fi Ağları",
        wifiDesc: "Office-Employee ana ağ, Office-Guest misafir ağı ve bağlantı bilgileri.",
        idCardTitle: "Şirket Giriş Kartı",
        idCardDesc: "Yeni kart talebi, kayıp kart bildirimi ve ofis erişim süreci.",
        add: "Ekle",
        edit: "Düzenle",
        delete: "Sil",
        save: "Kaydet",
        cancel: "İptal",
        itemTitle: "Başlık",
        itemDescription: "Açıklama",
        itemLink: "Link",
        itemContent: "İçerik",
        },
      forms: {
        eyebrow: "Formlar",
        tracking: "Gönderim takibi",
        interactive: "Etkileşimli şirket formları",
        monitor: "Kullanımı izle, kayıtları incele ve dışa aktar.",
        complete: "Geri bildirim, talep ve anketleri portalda doldur.",
        actions: "İşlemler",
        openForms: "Formları aç",
        reviewExport: "İncele ve dışa aktar",
        chooseForm: "Bir form seç",
        keepRecords: "Kayıtları düzenli tut ve rapora hazırla.",
        startRequest: "Birkaç tıkla talep başlat veya geri bildirim ver.",
        adminItems: ["Gönderimleri dışa aktar", "HR formlarını aç", "Geri bildirimi incele", "Bekleyen talepleri takip et"],
        employeeItems: ["İzin talebi", "Masraf formu", "Geri bildirim formu", "Onboarding kontrol listesi"],
      },
      socialHub: {
        admin: "Yönetici",
        openInfo: "Sosyal Bilgileri Aç",
        manage: "Social Hub",
        benefits: "Sosyal Haklar",
        clubs: "Kulüpler",
        multiSportTitle: "MultiSport",
        dieticianTitle: "Diyetisyen",
        camblyTitle: "Cambly",
        rowingTitle: "Kürek Kulübü",
        footballTitle: "Futbol Takımı",
        readingTitle: "Kitap Kulübü",
        foodieTitle: "Foodie Club",
        haliSahaTitle: "Halı Saha Grubu",
        multiSport: "Çalışanlar şirket destekli erişim ile anlaşmalı spor salonları ve wellness noktalarında MultiSport kullanabilir.",
        dietician: "Çalışanlar şirket diyetisyen desteği ile beslenme, sağlıklı rutinler ve kişisel iyi yaşam planlaması konusunda yönlendirme alabilir.",
        cambly: "Çalışanlar Cambly üzerinden yabancı dil pratiği yapabilir ve şirket destekli konuşma seanslarına erişebilir.",
        rowing: "Kürek takımımız Golden Horn Water Sports Club'da antrenman yapıyor ve kurumsal yarışmalara hazırlanıyor. Daha fazla bilgi için Murat Yalçın ile iletişime geçebilirsiniz.",
        football: "Takıma katılmak isteyen çalışanlar için haftalık antrenmanlar ve şirket maçları düzenlenir.",
        reading: "Farklı departmanlardan ekip arkadaşlarıyla aylık kitap seçimleri ve küçük buluşmalar yapılır.",
        foodie: "Ekip öğle yemeği keşifleri, çevre önerileri ve zaman zaman iş çıkışı tadımlar düzenlenir.",
        haliSaha: "Eğlenceli haftalık futbol seansı isteyen herkes için halı saha maçları organize edilir.",
        update: "Ekle",
        edit: "Düzenle",
        updateBenefits: "Ekle",
        updateTitle: "Social Hub güncelle",
        updateSectionBenefits: "Sosyal haklar",
        updateSectionClubs: "Kulüpler",
      },
      common: {
        search: "Ara",
        notifications: "Bildirimler",
        createAnnouncement: "Duyuru Oluştur",
        adminDashboard: "Yönetici Paneli",
        announcements: "Duyurular",
        commentTimeNow: "Şimdi",
      },
    };
  }

  return {
    nav: {
      adminDashboard: "Admin Dashboard",
      announcements: "Announcements",
      blogManagement: "Blog",
      documents: "Documents",
      welcomeOnBoard: "Welcome On Board",
      formSubmissions: "Form Submissions",
      socialHubSettings: "Social Hub",
      blog: "Blog",
      socialHub: "Social Hub",
    },
    headings: {
      dashboard: { title: "Dashboard", description: "" },
      announcements: { title: "Announcements", description: "" },
      announcementRequest: { title: "Announcement Request", description: "" },
      announcementRequests: { title: "Announcements", description: "" },
      announcementCreate: { title: "Create Announcement", description: "" },
      announcementEdit: { title: "Edit Announcement", description: "" },
      blog: { title: "Blog", description: "" },
      publish: { title: "Publish", description: "" },
      documents: { title: "Documents", description: "" },
      "welcome-on-board": { title: "Welcome On Board", description: "" },
      forms: { title: "Forms", description: "Submission tracking and internal request forms." },
      socialHub: { title: "Social Hub", description: "" },
      socialHubEdit: { title: "Update Social Hub", description: "" },
    },
    dashboard: {
      hero: "One place for company updates, HR documents, internal forms, and social activities.",
      openAnnouncements: "Open announcements",
      openHrHub: "Open HR Hub",
      quickSnapshot: "Quick snapshot",
      adminPriorities: "",
      todayAtGlance: "Today at a glance",
      contentSubmissionsActivity: "",
      updatesDocumentsActions: "Updates, documents, and actions",
      blog: "Blog",
      reviewPosts: "Review posts",
      employeePosts: "Employee posts",
      moderatePosts: "Moderate employee posts and keep the board organized.",
      coworkerSharing: "See what coworkers are sharing, selling, or asking about.",
      forms: "Forms",
      trackSubmissions: "Track submissions",
      openForms: "Open forms",
      reviewExport: "Review and export responses.",
      completeRequests: "Complete internal requests and surveys.",
      social: "Social",
      socialHubTitle: "Social Hub",
      socialHubDesc: "View clubs, activities, and MultiSport options.",
      monthly: "Monthly",
      weekly: "Weekly",
      daily: "Daily",
    },
    announcements: {
      teamAnnouncement: "Our Team Has An Announcement",
      requests: "Requests",
      back: "Back",
      notFound: "Announcement not found",
      tshirtForm: "Tshirt Form",
      concertForm: "Concert Ticket Form",
      employeeEmail: "Employee Email",
      name: "Name",
      size: "Size",
      concertPreference: "Concert Preference",
      submit: "Submit",
      requestTitle: "Share an announcement request",
      requestsTitle: "Announcement requests",
      recentTitle: "Recent Announcements",
      createTitle: "Create a new announcement",
      addForm: "Add form",
      formTemplate: "Form template",
      attachment: "Add attachment (image, video)",
      requestOwner: "Request owner",
      requestTeam: "Team",
      approve: "Approve",
      reject: "Reject",
      teamName: "Team name",
      announcementTitle: "Announcement title",
      announcementContent: "Announcement content",
      sendToAdmin: "Send to admin",
      edit: "Edit",
      editTitle: "Edit announcement",
      save: "Save changes",
      delete: "Delete announcement",
      detail: "Short description",
      body: "Detail content",
    },
    blog: {
      postModeration: "Post moderation",
      recentPosts: "Recent posts",
      reviewEmployeePosts: "Review employee posts before or after publishing.",
      publish: "Publish",
      todaysBirthdays: "Today's birthdays",
      postNotFound: "Post not found",
      backToPosts: "Back",
      sharedBy: "Shared by",
      unlike: "Unlike",
      like: "Like",
      delete: "Delete",
      views: "Views",
      comments: "Comments",
      writeComment: "Write a comment...",
      postComment: "Post comment",
      you: "You",
    },
    publish: {
      eyebrow: "Publish",
      title: "Share Something With Coworkers",
      topic: "Topic or title",
      summary: "Short summary",
      content: "Content",
      sendForReview: "Publish",
      examples: "Examples",
      popularTypes: "Popular post types",
      examplesDesc: "Use this area for practical day-to-day sharing between employees.",
      exampleItems: [
        "Selling a phone or laptop second-hand",
        "Asking for school recommendations",
        "Seeking a rental or roommate",
        "Sharing useful local tips with coworkers",
      ],
    },
    documents: {
      search: "Search documents, forms, guides...",
      notFound: "Document not found",
      mostUsed: "Most Used Documents",
    },
    welcomeOnBoard: {
      usefulLinks: "Useful Links",
      basicProcesses: "Office Essentials",
      expenseTitle: "Expense And Purchasing",
      expenseDesc: "Submit expenses, manage purchasing flows, upload receipts, and track approvals.",
      itTitle: "IT Ticket Site",
      itDesc: "Create requests for laptop, access, equipment, and tech support.",
      hrTitle: "HR Self Service",
      hrDesc: "Access personal details, payroll, and employee information.",
      printerTitle: "How To Use The Company Printer",
      printerDesc: "Connect to the printer, enter your secure print code, and collect your pages.",
      wifiTitle: "Company Wi‑Fi Networks",
      wifiDesc: "Office-Employee for staff, Office-Guest for visitors, plus connection details.",
      idCardTitle: "Company ID Card",
      idCardDesc: "Request a new card, report a lost card, and review office access steps.",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      itemTitle: "Title",
      itemDescription: "Description",
      itemLink: "Link",
      itemContent: "Content",
    },
    forms: {
      eyebrow: "Forms",
      tracking: "Submission tracking",
      interactive: "Interactive company forms",
      monitor: "Monitor usage, review entries, and export records.",
      complete: "Complete feedback, requests, and surveys directly in the portal.",
      actions: "Actions",
      openForms: "Open forms",
      reviewExport: "Review and export",
      chooseForm: "Choose a form",
      keepRecords: "Keep records organized and ready for reporting.",
      startRequest: "Start a request or provide feedback in a few clicks.",
      adminItems: ["Export submissions", "Open HR forms", "Review feedback", "Track pending requests"],
      employeeItems: ["Leave request", "Expense form", "Feedback form", "Onboarding checklist"],
    },
    socialHub: {
      admin: "Admin",
      openInfo: "Open Social Information",
      manage: "Social Hub",
      benefits: "Social Benefits",
      clubs: "Clubs",
      multiSportTitle: "MultiSport",
      dieticianTitle: "Dietician",
      camblyTitle: "Cambly",
      rowingTitle: "Rowing Club",
      footballTitle: "Football Team",
      readingTitle: "Reading Club",
      foodieTitle: "Foodie Club",
      haliSahaTitle: "Halı Saha Group",
      multiSport: "Employees can use MultiSport for partner gyms and wellness locations with company-supported access.",
      dietician: "Employees can get guidance on nutrition, healthy routines, and personal wellness planning through the company dietician support option.",
      cambly: "Employees can use Cambly for language practice and access company-supported speaking sessions.",
      rowing: "Our rowing team trains at the Golden Horn Water Sports Club and prepares for corporate competitions. For more information, you can contact Murat Yalçın.",
      football: "Weekly training sessions and company matches for employees who want to join the squad.",
      reading: "Monthly book selections and small discussion meetups with teammates from different departments.",
      foodie: "Team lunch discoveries, neighborhood recommendations, and occasional after-work tastings.",
      haliSaha: "Casual five-a-side games organized for anyone who wants a fun weekly football session.",
      update: "Add",
      edit: "Edit",
      updateBenefits: "Add",
      updateTitle: "Update Social Hub",
      updateSectionBenefits: "Social benefits",
      updateSectionClubs: "Clubs",
    },
    common: {
      search: "Search",
      notifications: "Notifications",
      createAnnouncement: "Create Announcement",
      adminDashboard: "Admin Dashboard",
      announcements: "Announcements",
      commentTimeNow: "Just now",
    },
  };
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      {eyebrow ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-700">
          {eyebrow}
        </p>
      ) : null}
      {title ? <h2 className="text-xl font-semibold text-sky-800">{title}</h2> : null}
      {description ? <p className="text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

function ButtonLink({
  href,
  children,
  variant = "dark",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "outline";
}) {
  const styles = {
    dark: "bg-slate-950 !text-white shadow-sm shadow-slate-200/80",
    light: "bg-white !text-slate-950 shadow-sm",
    outline: "border border-slate-200 bg-white !text-slate-950 shadow-sm",
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium transition hover:-translate-y-0.5 hover:opacity-95 ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}

function RoleToggle({ pathname, role, language }: { pathname: string; role: Role; language: Lang }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-slate-50 p-1.5">
      <div className="grid grid-cols-2 gap-1">
        {(["employee", "admin"] as Role[]).map((option) => {
          const active = role === option;

          return (
            <Link
              key={option}
              href={getRoleHref(pathname, option)}
              aria-current={active ? "page" : undefined}
              className={`flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                active
                  ? "bg-slate-950 !text-white shadow-sm"
                  : "text-slate-500 hover:bg-white hover:!text-slate-950"
              }`}
            >
              {roleLabel(option, language)}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function DashboardPage({ role, language }: { role: Role; language: Lang }) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const stats = isAdmin ? getAdminStats(language) : getEmployeeStats(language);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        {!isAdmin ? (
          <SectionTitle
            eyebrow={t.dashboard.quickSnapshot}
            title={t.dashboard.todayAtGlance}
            description={t.dashboard.updatesDocumentsActions}
          />
        ) : null}
        <div className={`${isAdmin ? "grid gap-3 sm:grid-cols-2" : "mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1"}`}>
          {stats.map((stat) => {
            const isPortalLogins = stat.label === "Portal logins" || stat.label === "Portal girişleri";

            return (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.helper}</p>
                {isPortalLogins ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div className="rounded-xl bg-white px-2 py-2">
                      <p className="text-[11px] text-slate-500">{t.dashboard.monthly}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">1,284</p>
                    </div>
                    <div className="rounded-xl bg-white px-2 py-2">
                      <p className="text-[11px] text-slate-500">{t.dashboard.weekly}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">312</p>
                    </div>
                    <div className="rounded-xl bg-white px-2 py-2">
                      <p className="text-[11px] text-slate-500">{t.dashboard.daily}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-950">47</p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {!isAdmin ? (
        <section className="grid gap-6 xl:grid-cols-3">
          <Link
            href={withRole("/blog", role)}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
          >
            <SectionTitle
              eyebrow={t.dashboard.blog}
              title={t.dashboard.employeePosts}
              description={t.dashboard.coworkerSharing}
            />
          </Link>
          <Link
            href={withRole("/forms", role)}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
          >
            <SectionTitle
              eyebrow={t.dashboard.forms}
              title={t.dashboard.openForms}
              description={t.dashboard.completeRequests}
            />
          </Link>
          <Link
            href={withRole("/social-hub", role)}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
          >
            <SectionTitle
              eyebrow={t.dashboard.social}
              title={t.dashboard.socialHubTitle}
              description={t.dashboard.socialHubDesc}
            />
          </Link>
        </section>
      ) : null}
    </div>
  );
}

function AnnouncementsPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const announcementItems = getAnnouncements(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle title={t.announcements.recentTitle} description="" />

        <div className="flex flex-wrap gap-3">
          {role === "admin" ? (
            <ButtonLink href={withRole("/announcements/requests", role)} variant="outline">
              {t.announcements.requests}
            </ButtonLink>
          ) : null}

          {role === "employee" ? (
            <Link
              href={withRole("/announcements/request", role)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-2.5 text-sm font-medium !text-white shadow-sm shadow-slate-200/80 transition hover:-translate-y-0.5 hover:opacity-95"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-white/10">
                <MegaphoneIcon className="h-3.5 w-3.5" />
              </span>
              {t.announcements.teamAnnouncement}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {announcementItems.map((item) => (
          <Link
            key={item.slug}
            href={withRole(`/announcements/${item.slug}`, role)}
            className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-sky-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-sky-100">
              <MegaphoneIcon className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-950 transition group-hover:text-sky-900">{item.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {item.publishedAt}
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{item.detail}</p>
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
              <ArrowRightIcon className="h-5 w-5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AnnouncementDetailPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const announcement = getAnnouncementBySlug(slug, language);

  if (!announcement) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.announcements.notFound} description="" />
      </div>
    );
  }

  const isConcertGift = announcement.slug === "concert-ticket-gift";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={withRole("/announcements", role)}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
        >
          ← {t.announcements.back}
        </Link>

        {role === "admin" ? (
          <ButtonLink href={withRole(`/announcements/${slug}/edit`, role)} variant="outline">
            {t.announcements.edit}
          </ButtonLink>
        ) : null}
      </div>
      <h2 className="mt-6 text-2xl font-semibold text-sky-800">{announcement.title}</h2>
      <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
        <ClockIcon className="h-3.5 w-3.5" />
        {announcement.publishedAt}
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-600">{announcement.detail}</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        {announcement.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {role === "admin" ? (
        <div className="mt-6 flex justify-end">
          <div className="rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500">
            Views: <span className="font-semibold text-slate-900">20</span>
          </div>
        </div>
      ) : null}

      {announcement.hasForm ? (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <SectionTitle title={isConcertGift ? t.announcements.concertForm : t.announcements.tshirtForm} description="" />
          <div className="mt-4 space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
              {t.announcements.employeeEmail}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
              {t.announcements.name}
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
              {isConcertGift ? t.announcements.concertPreference : t.announcements.size}
            </div>
            <button
              type="button"
              className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
            >
              {t.announcements.submit}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function getAnnouncementRequests(language: Lang) {
  return language === "tr"
    ? [
        {
          slug: "product-sprint-demo",
          owner: "Merve A.",
          team: "Ürün Ekibi",
          title: "Yeni sprint demosu duyurusu",
          content: "Cuma günü yapılacak sprint demosunu tüm çalışanlarla paylaşmak istiyoruz.",
        },
        {
          slug: "volunteer-day-call",
          owner: "Can B.",
          team: "People & Culture",
          title: "Gönüllülük günü katılım çağrısı",
          content: "Önümüzdeki ay yapılacak gönüllülük günü için çalışan katılımı topluyoruz.",
        },
      ]
    : [
        {
          slug: "product-sprint-demo",
          owner: "Merve A.",
          team: "Product Team",
          title: "New sprint demo announcement",
          content: "We want to share Friday's sprint demo with all employees.",
        },
        {
          slug: "volunteer-day-call",
          owner: "Can B.",
          team: "People & Culture",
          title: "Volunteer day participation call",
          content: "We are collecting employee participation for next month's volunteer day.",
        },
      ];
}

function AnnouncementRequestsPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const requests = getAnnouncementRequests(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle title={t.announcements.requestsTitle} description="" />
      <div className="mt-6 space-y-4">
        {requests.map((request) => (
          <Link
            key={request.slug}
            href={withRole(`/announcements/requests/${request.slug}`, role)}
            className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-sky-50"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-medium text-slate-950">{request.title}</h3>
              <p className="text-sm text-slate-500">{t.announcements.requestOwner}: {request.owner}</p>
            </div>
            <p className="mt-2 text-sm text-slate-500">{t.announcements.requestTeam}: {request.team}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

function AnnouncementRequestDetailPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const request = getAnnouncementRequests(language).find((item) => item.slug === slug);

  if (!request) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.announcements.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link
        href={withRole("/announcements/requests", role)}
        className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
      >
        ← {t.announcements.back}
      </Link>

      <h2 className="mt-6 text-2xl font-semibold text-sky-800">{request.title}</h2>
      <p className="mt-3 text-sm text-slate-500">{t.announcements.requestOwner}: {request.owner}</p>
      <p className="mt-1 text-sm text-slate-500">{t.announcements.requestTeam}: {request.team}</p>
      <p className="mt-6 text-sm leading-6 text-slate-600">{request.content}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-2xl bg-sky-700 px-4 py-2 text-sm font-medium text-white shadow-sm"
        >
          {t.announcements.approve}
        </button>
        <button
          type="button"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm"
        >
          {t.announcements.reject}
        </button>
      </div>
    </div>
  );
}

function AnnouncementCreatePage({ language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");
  const [body, setBody] = useState("");
  const [formAdded, setFormAdded] = useState(false);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle title={t.announcements.createTitle} description="" />

      <div className="mt-6 space-y-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.announcementTitle}
        />
        <input
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.detail}
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="h-48 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.body}
        />
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
          {t.announcements.attachment}
        </div>

        {formAdded ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <SectionTitle title={t.announcements.formTemplate} description="" />
            <div className="mt-4 space-y-3">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                {t.announcements.employeeEmail}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                {t.announcements.name}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-500">
                {t.announcements.size}
              </div>
              <button
                type="button"
                className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
              >
                {t.announcements.submit}
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setFormAdded(true)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm"
        >
          {t.announcements.addForm}
        </button>
        <button
          type="button"
          className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
        >
          {t.announcements.save}
        </button>
      </div>
    </div>
  );
}

function AnnouncementEditPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const announcement = getAnnouncementBySlug(slug, language);
  const [title, setTitle] = useState(announcement?.title ?? "");
  const [detail, setDetail] = useState(announcement?.detail ?? "");
  const [body, setBody] = useState(announcement?.body.join("\n\n") ?? "");

  if (!announcement) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.announcements.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle title={t.announcements.editTitle} description="" />
        <Link
          href={withRole("/announcements", role)}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
        >
          ← {t.announcements.back}
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.announcementTitle}
        />
        <input
          value={detail}
          onChange={(event) => setDetail(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.detail}
        />
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          className="h-48 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.body}
        />
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
        >
          {t.announcements.save}
        </button>
        <button
          type="button"
          className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 shadow-sm"
        >
          {t.announcements.delete}
        </button>
      </div>
    </div>
  );
}

function AnnouncementRequestPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle title={t.announcements.requestTitle} description="" />
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          {t.announcements.teamName}
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          {t.announcements.announcementTitle}
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 h-40">
          {t.announcements.announcementContent}
        </div>
        <ButtonLink href={withRole("/announcements", role)}>{t.announcements.sendToAdmin}</ButtonLink>
      </div>
    </div>
  );
}

function BlogPage({ role, language }: { role: Role; language: Lang }) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const postItems = getPosts(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <SectionTitle
          title={isAdmin ? t.blog.postModeration : t.blog.recentPosts}
          description={isAdmin ? t.blog.reviewEmployeePosts : ""}
        />
        <ButtonLink href={withRole("/publish", role)}>
          {t.blog.publish}
        </ButtonLink>
      </div>
      <div className="mt-6 space-y-4">
        {postItems.map((post) => (
          <Link
            key={post.slug}
            href={withRole(`/blog/${post.slug}`, role)}
            className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-sky-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-sky-100">
              <CommentIcon className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-950 transition group-hover:text-sky-900">{post.title}</h3>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                <span>{post.author}</span>
                <span className="h-1 w-1 rounded-full bg-slate-300" />
                <span className="inline-flex items-center gap-1.5">
                  <ClockIcon className="h-3.5 w-3.5" />
                  {post.publishedAt}
                </span>
              </div>
              {post.summary ? <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{post.summary}</p> : null}
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
              <ArrowRightIcon className="h-5 w-5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BlogPostPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const post = getPostBySlug(slug, language);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes ?? 0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(post?.comments ?? []);

  if (!post) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.blog.postNotFound} description="" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href={withRole("/blog", role)}
            className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
          >
            ← {t.blog.backToPosts}
          </Link>

          {role === "admin" ? (
            <button
              type="button"
              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm"
            >
              {t.blog.delete}
            </button>
          ) : null}
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-sky-800">{post.title}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
          <span>{t.blog.sharedBy} {post.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" />
            {post.publishedAt}
          </span>
        </div>

        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
          {post.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setLiked((current) => {
                const next = !current;
                setLikes((value) => value + (next ? 1 : -1));
                return next;
              });
            }}
            className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${
              liked ? "border border-slate-300 bg-white text-slate-900" : "bg-slate-950 !text-white"
            }`}
          >
            {liked ? t.blog.unlike : t.blog.like} · {likes}
          </button>
        </div>

        <div className="mt-6 flex justify-end">
          <div className="rounded-full bg-slate-50 px-4 py-2 text-xs text-slate-500">
            {t.blog.views}: <span className="font-semibold text-slate-900">20</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:self-start">
        <SectionTitle title={t.blog.comments} description="" />
        <div className="mt-6 space-y-3">
          {comments.map((comment) => (
            <div key={`${comment.author}-${comment.time}-${comment.text}`} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-slate-950">{comment.author}</h3>
                <span className="text-xs text-slate-400">{comment.time}</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-slate-600">{comment.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <textarea
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            placeholder={t.blog.writeComment}
            className="h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          />
          <button
            type="button"
            onClick={() => {
              const value = commentText.trim();

              if (!value) return;

              setComments((current) => [
                ...current,
                { author: t.blog.you, text: value, time: t.common.commentTimeNow },
              ]);
              setCommentText("");
            }}
            className="w-full rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
          >
            {t.blog.postComment}
          </button>
        </div>
      </div>
    </div>
  );
}

function PublishPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle
        eyebrow={t.publish.eyebrow}
        title={t.publish.title}
        description=""
      />
      <div className="mt-6 space-y-4">
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          {t.publish.topic}
        </div>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          {t.publish.summary}
        </div>
        <div className="h-40 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">
          {t.publish.content}
        </div>
        <ButtonLink href={withRole("/blog", role)}>{t.publish.sendForReview}</ButtonLink>
      </div>
    </div>
  );
}

function DocumentsPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const documentItems = getDocuments(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle title={t.documents.mostUsed} description="" />

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
        <SearchIcon className="h-4 w-4 text-slate-400" />
        <span>{t.documents.search}</span>
      </div>

      <div className="mt-6 space-y-4">
        {documentItems.map((document) => (
          <Link
            key={document.slug}
            href={withRole(document.href, role)}
            className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-sky-50"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-sky-100">
              <FileIcon className="h-4 w-4" />
            </span>

            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-slate-950 transition group-hover:text-sky-900">{document.name}</h3>
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-slate-400">
                <ClockIcon className="h-3.5 w-3.5" />
                {document.updatedAt}
              </div>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{document.description}</p>
            </div>

            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
              <ArrowRightIcon className="h-5 w-5" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function DocumentDetailPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const document = getDocumentBySlug(slug, language);

  if (!document) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.documents.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link
        href={withRole("/documents", role)}
        className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
      >
        ← {t.announcements.back}
      </Link>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <FileIcon className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-sky-800">{document.name}</h2>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
            <ClockIcon className="h-3.5 w-3.5" />
            {document.updatedAt}
          </div>
        </div>
      </div>

      <p className="mt-6 text-sm leading-6 text-slate-600">{document.description}</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        {document.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

function WelcomeOnBoardPage({ role, language, slug }: { role: Role; language: Lang; slug?: string }) {
  if (slug) {
    return <WelcomeOnBoardDetailPage role={role} language={language} slug={slug} />;
  }

  return <WelcomeOnBoardContent key={language} role={role} language={language} />;
}

function WelcomeOnBoardContent({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const isAdmin = role === "admin";
  const defaultLinks = [
    {
      id: "expense",
      title: t.welcomeOnBoard.expenseTitle,
      description: t.welcomeOnBoard.expenseDesc,
      href: "https://t-flow.tokeninc.com/Default.aspx#596AE49D-77EB-4BF6-9D8B-5E9472670E9F/views/",
    },
    {
      id: "it",
      title: t.welcomeOnBoard.itTitle,
      description: t.welcomeOnBoard.itDesc,
      href: "https://t-hub.tokeninc.com/",
    },
    {
      id: "hr",
      title: t.welcomeOnBoard.hrTitle,
      description: t.welcomeOnBoard.hrDesc,
      href: "https://token.orchestra-bu.com/Account?ReturnUrl=%2F#/home",
    },
  ];
  const defaultProcesses = [
    {
      id: "printer",
      title: t.welcomeOnBoard.printerTitle,
      description: t.welcomeOnBoard.printerDesc,
      body: language === "tr"
        ? [
            "Yazıcıyı kullanmak için önce ofis ağına bağlı olduğunuzdan emin olun ve cihaz listesinde paylaşılan şirket yazıcısını seçin.",
            "Güvenli baskı için kişisel baskı kodunuzu girin ve çıktıktan sonra belgelerinizi yazıcı alanından teslim alın.",
          ]
        : [
            "To use the printer, first make sure you are connected to the office network and select the shared company printer from the device list.",
            "For secure printing, enter your personal print code and collect your pages from the printer area once released.",
          ],
    },
    {
      id: "wifi",
      title: t.welcomeOnBoard.wifiTitle,
      description: t.welcomeOnBoard.wifiDesc,
      body: language === "tr"
        ? [
            "Çalışanlar için Office-Employee ağı kullanılmalıdır; misafirler için ayrı olarak Office-Guest ağı mevcuttur.",
            "Bağlantı sorunu yaşarsanız IT ekibi ile iletişime geçebilir veya Welcome On Board sayfasındaki ilgili linklerden destek isteyebilirsiniz.",
          ]
        : [
            "Employees should use the Office-Employee network, while Office-Guest is available for visitors.",
            "If you have connection issues, you can contact the IT team or request support through the related links on the Welcome On Board page.",
          ],
    },
    {
      id: "id-card",
      title: t.welcomeOnBoard.idCardTitle,
      description: t.welcomeOnBoard.idCardDesc,
      body: language === "tr"
        ? [
            "Şirket giriş kartınız ofis erişimi için ilk gün size teslim edilir ve bina girişlerinde aktif olarak kullanılmalıdır.",
            "Kart kaybı veya erişim problemi durumunda İK ve ofis operasyon ekibine hemen bilgi vererek yeni kart sürecini başlatabilirsiniz.",
          ]
        : [
            "Your company ID card is provided on your first day and should be used for office access at all building entry points.",
            "If the card is lost or access stops working, inform HR and the office operations team immediately to start the replacement process.",
          ],
    },
  ];
  const [links, setLinks] = useState<Array<{ id: string; title: string; description: string; href?: string }>>(defaultLinks);
  const [processes, setProcesses] = useState<Array<{ id: string; title: string; description: string; href?: string; body?: string[] }>>(defaultProcesses);
  const [editor, setEditor] = useState<{
    section: "links" | "processes";
    itemId?: string;
    title: string;
    description: string;
    href: string;
  } | null>(null);

  const getShortUrl = (href?: string) => {
    if (!href) return "";
    try {
      return new URL(href).hostname.replace(/^www\./, "");
    } catch {
      return href;
    }
  };

  const openEditor = (section: "links" | "processes", item?: { id: string; title: string; description: string; href?: string }) => {
    setEditor({
      section,
      itemId: item?.id,
      title: item?.title ?? "",
      description: item?.description ?? "",
      href: item?.href ?? "",
    });
  };

  const closeEditor = () => setEditor(null);

  const saveEditor = () => {
    if (!editor) return;

    const nextItem = {
      id: editor.itemId ?? `${editor.section}-${Date.now()}`,
      title: editor.title,
      description: editor.description,
      href: editor.section === "links" ? editor.href : undefined,
    };

    if (editor.section === "links") {
      setLinks((current) =>
        editor.itemId
          ? current.map((item) => (item.id === editor.itemId ? nextItem : item))
          : [...current, nextItem],
      );
    } else {
      setProcesses((current) =>
        editor.itemId
          ? current.map((item) => (item.id === editor.itemId ? nextItem : item))
          : [...current, nextItem],
      );
    }

    closeEditor();
  };

  const renderSection = (
    section: "links" | "processes",
    title: string,
    items: Array<{ id: string; title: string; description: string; href?: string; body?: string[] }>,
  ) => {
    const tone = section === "links"
      ? "bg-sky-50 text-sky-700 ring-sky-100"
      : "bg-emerald-50 text-emerald-700 ring-emerald-100";

    return (
      <section className="rounded-3xl bg-slate-50 p-5">
        <div className="flex items-center justify-between gap-3">
          <SectionTitle title={title} description="" />
          {isAdmin ? (
            <button
              type="button"
              onClick={() => openEditor(section)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm"
            >
              {t.welcomeOnBoard.add}
            </button>
          ) : null}
        </div>

        {isAdmin && editor?.section === section ? (
          <div className="mt-6 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
            <div className="space-y-3">
              <input
                value={editor.title}
                onChange={(event) => setEditor((current) => (current ? { ...current, title: event.target.value } : current))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.welcomeOnBoard.itemTitle}
              />
              <textarea
                value={editor.description}
                onChange={(event) => setEditor((current) => (current ? { ...current, description: event.target.value } : current))}
                className="h-28 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.welcomeOnBoard.itemDescription}
              />
              {section === "links" ? (
                <input
                  value={editor.href}
                  onChange={(event) => setEditor((current) => (current ? { ...current, href: event.target.value } : current))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                  placeholder={t.welcomeOnBoard.itemLink}
                />
              ) : null}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveEditor}
                  className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
                >
                  {t.welcomeOnBoard.save}
                </button>
                <button
                  type="button"
                  onClick={closeEditor}
                  className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm"
                >
                  {t.welcomeOnBoard.cancel}
                </button>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {items.map((item) => {
            const internalHref = withRole(`/welcome-on-board/${item.id}`, role);
            const detailOnly = section === "processes";

            return (
              <div key={item.id} className="group flex items-center gap-4 rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:bg-sky-50/60 hover:ring-slate-300">
                {detailOnly ? (
                  <Link href={internalHref} className="flex min-w-0 flex-1 items-center gap-4">
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tone}`}>
                      <FileIcon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                    </div>
                  </Link>
                ) : (
                  <>
                    <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tone}`}>
                      <BrandIcon className="h-4 w-4" />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-slate-900">{item.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">{item.description}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 inline-flex text-xs font-medium text-sky-700 hover:text-sky-800"
                        >
                          {getShortUrl(item.href)}
                        </a>
                      ) : null}
                    </div>
                  </>
                )}

                <Link
                  href={internalHref}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700"
                  aria-label={item.title}
                >
                  <ArrowRightIcon className="h-5 w-5" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-2">
        {renderSection("links", t.welcomeOnBoard.usefulLinks, links)}
        {renderSection("processes", t.welcomeOnBoard.basicProcesses, processes)}
      </div>
    </div>
  );
}

function WelcomeOnBoardDetailPage({ role, language, slug }: { role: Role; language: Lang; slug: string }) {
  const t = getText(language);
  const isAdmin = role === "admin";
  const linkItems: Array<{ id: string; title: string; description: string; href?: string; body: string[] }> = [
    {
      id: "expense",
      title: t.welcomeOnBoard.expenseTitle,
      description: t.welcomeOnBoard.expenseDesc,
      href: "https://t-flow.tokeninc.com/Default.aspx#596AE49D-77EB-4BF6-9D8B-5E9472670E9F/views/",
      body: language === "tr"
        ? [
            "Masraf ve satın alma süreçleri için bu platform üzerinden talepler oluşturabilir, fişlerinizi yükleyebilir ve onay akışlarını takip edebilirsiniz.",
            "Özellikle yeni başlayan çalışanlar için en sık kullanılan iç sistemlerden biridir ve günlük operasyonlarda önemli bir yere sahiptir.",
          ]
        : [
            "Through this platform, you can create expense and purchasing requests, upload receipts, and track approval flows.",
            "It is one of the most frequently used internal systems for new joiners and plays an important role in daily operations.",
          ],
    },
    {
      id: "it",
      title: t.welcomeOnBoard.itTitle,
      description: t.welcomeOnBoard.itDesc,
      href: "https://t-hub.tokeninc.com/",
      body: language === "tr"
        ? [
            "IT talepleri için bu alanı kullanarak cihaz, erişim, yazılım ve teknik destek konularında kayıt açabilirsiniz.",
            "Özellikle ilk günlerde ihtiyaç duyulan erişimler ve ekipman süreçleri için en hızlı başvuru noktalarından biridir.",
          ]
        : [
            "Use this area to create tickets for devices, access, software, and technical support needs.",
            "It is one of the fastest entry points for first-day access requests and equipment-related support.",
          ],
    },
    {
      id: "hr",
      title: t.welcomeOnBoard.hrTitle,
      description: t.welcomeOnBoard.hrDesc,
      href: "https://token.orchestra-bu.com/Account?ReturnUrl=%2F#/home",
      body: language === "tr"
        ? [
            "İK self servis alanı kişisel bilgiler, bordro detayları ve çalışan kayıtlarının takip edilmesi için kullanılır.",
            "Portal deneyimi içinde en temel başvuru noktalarından biri olduğu için çalışanların bu sistemi erken dönemde tanıması önemlidir.",
          ]
        : [
            "The HR self service area is used for personal information, payroll details, and employee record tracking.",
            "Since it is one of the core reference points in the employee portal experience, it is important for new joiners to get familiar with it early.",
          ],
    },
  ];
  const processItems: Array<{ id: string; title: string; description: string; href?: string; body: string[] }> = [
    {
      id: "printer",
      title: t.welcomeOnBoard.printerTitle,
      description: t.welcomeOnBoard.printerDesc,
      body: language === "tr"
        ? [
            "Yazıcıyı kullanmak için önce ofis ağına bağlı olduğunuzdan emin olun ve cihaz listesinde paylaşılan şirket yazıcısını seçin.",
            "Güvenli baskı için kişisel baskı kodunuzu girin ve çıktıktan sonra belgelerinizi yazıcı alanından teslim alın.",
          ]
        : [
            "To use the printer, first make sure you are connected to the office network and select the shared company printer from the device list.",
            "For secure printing, enter your personal print code and collect your pages from the printer area once released.",
          ],
    },
    {
      id: "wifi",
      title: t.welcomeOnBoard.wifiTitle,
      description: t.welcomeOnBoard.wifiDesc,
      body: language === "tr"
        ? [
            "Çalışanlar için Office-Employee ağı kullanılmalıdır; misafirler için ayrı olarak Office-Guest ağı mevcuttur.",
            "Bağlantı sorunu yaşarsanız IT ekibi ile iletişime geçebilir veya Welcome On Board sayfasındaki ilgili linklerden destek isteyebilirsiniz.",
          ]
        : [
            "Employees should use the Office-Employee network, while Office-Guest is available for visitors.",
            "If you have connection issues, you can contact the IT team or request support through the related links on the Welcome On Board page.",
          ],
    },
    {
      id: "id-card",
      title: t.welcomeOnBoard.idCardTitle,
      description: t.welcomeOnBoard.idCardDesc,
      body: language === "tr"
        ? [
            "Şirket giriş kartınız ofis erişimi için ilk gün size teslim edilir ve bina girişlerinde aktif olarak kullanılmalıdır.",
            "Kart kaybı veya erişim problemi durumunda İK ve ofis operasyon ekibine hemen bilgi vererek yeni kart sürecini başlatabilirsiniz.",
          ]
        : [
            "Your company ID card is provided on your first day and should be used for office access at all building entry points.",
            "If the card is lost or access stops working, inform HR and the office operations team immediately to start the replacement process.",
          ],
    },
  ];
  const initialItem = [...linkItems, ...processItems].find((entry) => entry.id === slug);
  const [item, setItem] = useState(initialItem);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  if (!item || isDeleted) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.documents.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={withRole("/welcome-on-board", role)}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
        >
          ← {t.announcements.back}
        </Link>

        {isAdmin ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm"
            >
              {t.welcomeOnBoard.edit}
            </button>
            <button
              type="button"
              onClick={() => setIsDeleted(true)}
              className="rounded-2xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700 shadow-sm"
            >
              {t.welcomeOnBoard.delete}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-start gap-4">
        <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${item.href ? "bg-sky-50 text-sky-700 ring-sky-100" : "bg-emerald-50 text-emerald-700 ring-emerald-100"}`}>
          {item.href ? <BrandIcon className="h-5 w-5" /> : <FileIcon className="h-5 w-5" />}
        </span>
        <div>
          <h2 className="text-2xl font-semibold text-sky-800">{item.title}</h2>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
            <ClockIcon className="h-3.5 w-3.5" />
            {language === "tr" ? "Son Güncelleme: 9 Haziran 2026 · 10:00" : "Last Updated: June 9, 2026 · 10:00"}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="space-y-3">
            <input
              value={item.title}
              onChange={(event) => setItem((current) => (current ? { ...current, title: event.target.value } : current))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.welcomeOnBoard.itemTitle}
            />
            <textarea
              value={item.body.join("\n\n")}
              onChange={(event) => setItem((current) => (current ? { ...current, body: event.target.value.split("\n\n") } : current))}
              className="h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.welcomeOnBoard.itemContent}
            />
            {item.href ? (
              <input
                value={item.href}
                onChange={(event) => setItem((current) => (current ? { ...current, href: event.target.value } : current))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.welcomeOnBoard.itemLink}
              />
            ) : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
              >
                {t.welcomeOnBoard.save}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 shadow-sm"
              >
                {t.welcomeOnBoard.cancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-sm leading-6 text-slate-600">{item.description}</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        {item.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {item.href ? (
        <a
          href={item.href}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
        >
          {item.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      ) : null}
    </div>
  );
}

function FormsPage({ role, language }: { role: Role; language: Lang }) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const submissionItems = getSubmissions(language);

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          eyebrow={t.forms.eyebrow}
          title={isAdmin ? t.forms.tracking : t.forms.interactive}
          description={isAdmin ? t.forms.monitor : t.forms.complete}
        />
        <div className="mt-6 space-y-3">
          {submissionItems.map((item) => (
            <div key={item.name} className="rounded-2xl bg-slate-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-medium text-slate-950">{item.name}</h3>
                <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                  {item.status}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{item.owner}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          eyebrow={isAdmin ? t.forms.actions : t.forms.openForms}
          title={isAdmin ? t.forms.reviewExport : t.forms.chooseForm}
          description={isAdmin ? t.forms.keepRecords : t.forms.startRequest}
        />
        <div className="mt-6 grid gap-3">
          {(isAdmin ? t.forms.adminItems : t.forms.employeeItems).map((item) => (
            <ButtonLink
              key={item}
              href={withRole(isAdmin ? "/documents" : "/forms", role)}
              variant="outline"
            >
              {item}
            </ButtonLink>
          ))}
        </div>
      </div>
    </div>
  );
}

function ExpandableSocialItem({
  id,
  title,
  content,
  editHref,
  isAdmin,
  editLabel,
  open,
  onToggle,
  kind,
}: {
  id: string;
  title: string;
  content: string;
  editHref: string;
  isAdmin: boolean;
  editLabel: string;
  open: boolean;
  onToggle: (id: string) => void;
  kind: "benefit" | "club";
}) {
  const iconTone = kind === "benefit"
    ? "bg-sky-50 text-sky-700 ring-sky-100"
    : "bg-emerald-50 text-emerald-700 ring-emerald-100";

  return (
    <div className={isAdmin ? "grid grid-cols-[minmax(0,1fr)_88px] items-start gap-3" : "block"}>
      <div className="rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-slate-300">
        <button
          type="button"
          onClick={() => onToggle(id)}
          className="flex w-full items-center gap-4 text-left"
        >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconTone}`}>
            {kind === "benefit" ? <BrandIcon className="h-4 w-4" /> : <UsersIcon className="h-4 w-4" />}
          </span>

          <span className="min-w-0 flex-1 font-medium text-slate-950">{title}</span>

          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition ${open ? "rotate-90 border-sky-200 text-sky-700" : ""}`}>
            <ArrowRightIcon className="h-5 w-5" />
          </span>
        </button>
        {open ? <p className="mt-4 pl-[3.75rem] text-sm leading-6 text-slate-600">{content}</p> : null}
      </div>

      {isAdmin ? (
        <Link
          href={editHref}
          className="inline-flex h-[52px] w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm transition hover:border-sky-200 hover:text-sky-800"
        >
          {editLabel}
        </Link>
      ) : null}
    </div>
  );
}

function SocialHubPage({ role, language }: { role: Role; language: Lang }) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const [openItem, setOpenItem] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle
        title={isAdmin ? t.socialHub.manage : t.socialHub.openInfo}
        description=""
      />

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-950">{t.socialHub.benefits}</h3>
            {isAdmin ? (
              <ButtonLink href={withRole("/social-hub/edit?section=benefits", role)} variant="outline">
                {t.socialHub.updateBenefits}
              </ButtonLink>
            ) : null}
          </div>
          <div className="mt-4 space-y-3">
            <ExpandableSocialItem
              id="multisport"
              title={t.socialHub.multiSportTitle}
              content={t.socialHub.multiSport}
              editHref={withRole("/social-hub/edit?section=benefits&item=multisport", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "multisport"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="benefit"
            />

            <ExpandableSocialItem
              id="dietician"
              title={t.socialHub.dieticianTitle}
              content={t.socialHub.dietician}
              editHref={withRole("/social-hub/edit?section=benefits&item=dietician", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "dietician"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="benefit"
            />

            <ExpandableSocialItem
              id="cambly"
              title={t.socialHub.camblyTitle}
              content={t.socialHub.cambly}
              editHref={withRole("/social-hub/edit?section=benefits&item=cambly", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "cambly"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="benefit"
            />
          </div>
        </section>

        <section className="rounded-3xl bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-950">{t.socialHub.clubs}</h3>
            {isAdmin ? (
              <ButtonLink href={withRole("/social-hub/edit?section=clubs", role)} variant="outline">
                {t.socialHub.update}
              </ButtonLink>
            ) : null}
          </div>
          <div className="mt-4 space-y-3">
            <ExpandableSocialItem
              id="rowing"
              title={t.socialHub.rowingTitle}
              content={t.socialHub.rowing}
              editHref={withRole("/social-hub/edit?section=clubs&item=rowing", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "rowing"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="club"
            />

            <ExpandableSocialItem
              id="football"
              title={t.socialHub.footballTitle}
              content={t.socialHub.football}
              editHref={withRole("/social-hub/edit?section=clubs&item=football", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "football"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="club"
            />

            <ExpandableSocialItem
              id="reading"
              title={t.socialHub.readingTitle}
              content={t.socialHub.reading}
              editHref={withRole("/social-hub/edit?section=clubs&item=reading", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "reading"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="club"
            />

            <ExpandableSocialItem
              id="foodie"
              title={t.socialHub.foodieTitle}
              content={t.socialHub.foodie}
              editHref={withRole("/social-hub/edit?section=clubs&item=foodie", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "foodie"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="club"
            />

            <ExpandableSocialItem
              id="hali-saha"
              title={t.socialHub.haliSahaTitle}
              content={t.socialHub.haliSaha}
              editHref={withRole("/social-hub/edit?section=clubs&item=hali-saha", role)}
              isAdmin={isAdmin}
              editLabel={t.socialHub.edit}
              open={openItem === "hali-saha"}
              onToggle={(id) => setOpenItem((current) => (current === id ? null : id))}
              kind="club"
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function SocialHubEditPage({
  language,
  section,
  item,
}: {
  role: Role;
  language: Lang;
  section: "benefits" | "clubs";
  item?: string;
}) {
  const t = getText(language);
  const isBenefits = section === "benefits";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle title={t.socialHub.updateTitle} description="" />
      <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
        {item ?? (isBenefits ? t.socialHub.updateSectionBenefits : t.socialHub.updateSectionClubs)}
      </div>
      <div className="mt-4 space-y-4">
        <input
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={item ?? (isBenefits ? t.socialHub.updateSectionBenefits : t.socialHub.updateSectionClubs)}
        />
        <textarea
          className="h-48 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={item ?? (isBenefits ? t.socialHub.updateSectionBenefits : t.socialHub.updateSectionClubs)}
        />
        <button
          type="button"
          className="rounded-2xl bg-sky-700 px-4 py-3 text-sm font-medium text-white shadow-sm"
        >
          {t.announcements.save}
        </button>
      </div>
    </div>
  );
}

function renderPage(
  page: PortalPage,
  role: Role,
  language: Lang,
  selectedPostSlug?: string,
  selectedAnnouncementSlug?: string,
  selectedAnnouncementRequestSlug?: string,
  selectedDocumentSlug?: string,
  selectedWelcomeOnBoardSlug?: string,
  selectedSocialHubSection?: "benefits" | "clubs",
  selectedSocialHubItem?: string,
) {
  switch (page) {
    case "announcements":
      return selectedAnnouncementSlug
        ? <AnnouncementDetailPage role={role} slug={selectedAnnouncementSlug} language={language} />
        : <AnnouncementsPage role={role} language={language} />;
    case "announcement-request":
      return <AnnouncementRequestPage role={role} language={language} />;
    case "announcement-requests":
      return selectedAnnouncementRequestSlug
        ? <AnnouncementRequestDetailPage role={role} slug={selectedAnnouncementRequestSlug} language={language} />
        : <AnnouncementRequestsPage role={role} language={language} />;
    case "announcement-create":
      return <AnnouncementCreatePage role={role} language={language} />;
    case "announcement-edit":
      return selectedAnnouncementSlug
        ? <AnnouncementEditPage role={role} slug={selectedAnnouncementSlug} language={language} />
        : <AnnouncementsPage role={role} language={language} />;
    case "blog":
      return selectedPostSlug
        ? <BlogPostPage role={role} slug={selectedPostSlug} language={language} />
        : <BlogPage role={role} language={language} />;
    case "publish":
      return <PublishPage role={role} language={language} />;
    case "documents":
      return selectedDocumentSlug
        ? <DocumentDetailPage role={role} slug={selectedDocumentSlug} language={language} />
        : <DocumentsPage role={role} language={language} />;
    case "welcome-on-board":
      return <WelcomeOnBoardPage role={role} language={language} slug={selectedWelcomeOnBoardSlug} />;
    case "forms":
      return role === "admin"
        ? <AnnouncementsPage role={role} language={language} />
        : <FormsPage role={role} language={language} />;
    case "social-hub":
      return <SocialHubPage role={role} language={language} />;
    case "social-hub-edit":
      return <SocialHubEditPage role={role} language={language} section={selectedSocialHubSection ?? "benefits"} item={selectedSocialHubItem} />;
    default:
      return role === "admin"
        ? <DashboardPage role={role} language={language} />
        : <AnnouncementsPage role={role} language={language} />;
  }
}

export default function PortalShell({
  role,
  page,
  selectedPostSlug,
  selectedAnnouncementSlug,
  selectedAnnouncementRequestSlug,
  selectedDocumentSlug,
  selectedWelcomeOnBoardSlug,
  selectedSocialHubSection,
  selectedSocialHubItem,
}: PortalShellProps) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return getLang(window.localStorage.getItem("token-hub-language") ?? undefined);
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const t = getText(language);
  const notifications = getNotifications(language, role);
  const navLinks = role === "admin"
    ? [
        { label: t.nav.adminDashboard, href: "/" },
        { label: t.nav.announcements, href: "/announcements" },
        { label: t.nav.blogManagement, href: "/blog" },
        { label: t.nav.documents, href: "/documents" },
        { label: t.nav.socialHubSettings, href: "/social-hub" },
        { label: t.nav.welcomeOnBoard, href: "/welcome-on-board" },
      ]
    : [
        { label: t.nav.announcements, href: "/announcements" },
        { label: t.nav.blog, href: "/blog" },
        { label: t.nav.documents, href: "/documents" },
        { label: t.nav.socialHub, href: "/social-hub" },
        { label: t.nav.welcomeOnBoard, href: "/welcome-on-board" },
      ];
  const heading =
    page === "dashboard"
      ? {
          title: role === "admin" ? t.common.adminDashboard : t.common.announcements,
          description: "",
        }
      : page === "announcement-request"
        ? t.headings.announcementRequest
        : page === "announcement-requests"
          ? t.headings.announcementRequests
          : page === "announcement-create"
            ? t.headings.announcementCreate
            : page === "announcement-edit"
              ? t.headings.announcementEdit
          : page === "social-hub"
          ? t.headings.socialHub
          : page === "social-hub-edit"
            ? t.headings.socialHubEdit
            : t.headings[page];

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,_#f8fbff_0%,_#f8fafc_45%,_#ffffff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-200/80 bg-white/88 px-6 py-8 text-slate-900 backdrop-blur-xl lg:flex">
          <TokenHubLogo />

          <nav className="mt-8 space-y-2">
            {navLinks.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.label}
                  href={withRole(item.href, role)}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-slate-950 !text-white shadow-sm shadow-slate-200/70"
                      : "text-slate-500 hover:bg-slate-100 hover:!text-slate-950"
                  }`}
                >
                  <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${active ? "bg-white/10 !text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-slate-900"}`}>
                    <NavItemIcon href={item.href} />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-4">
            <RoleToggle pathname={pathname} role={role} language={language} />
          </div>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/82 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                    {heading.title}
                  </h1>
                  {heading.description ? (
                    <p className="mt-1 text-sm text-slate-500">{heading.description}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm lg:max-w-xs">
                    <SearchIcon className="h-4 w-4 text-slate-400" />
                    <span>{t.common.search}</span>
                  </div>

                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setNotificationsOpen((current) => !current)}
                      className="relative rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:border-slate-300"
                    >
                      <BellIcon />
                      <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-600 px-1 text-[11px] font-semibold text-white">
                        {notifications.length}
                      </span>
                    </button>

                    {notificationsOpen ? (
                      <div className="absolute right-0 top-full z-30 mt-2 w-96 rounded-[24px] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/70">
                        <div className="border-b border-slate-100 px-2 pb-3">
                          <p className="text-sm font-semibold text-slate-950">{t.common.notifications}</p>
                        </div>
                        <div className="mt-3 space-y-2">
                          {notifications.map((item) => (
                            <Link
                              key={item.text}
                              href={withRole(item.href, role)}
                              onClick={() => setNotificationsOpen(false)}
                              className="flex items-start gap-3 rounded-2xl bg-slate-50 p-3 transition hover:bg-sky-50"
                            >
                              <span className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl ${getNotificationTypeStyle(item.type)}`}>
                                <NotificationTypeIcon type={item.type} className="h-4 w-4" />
                              </span>

                              <span className="min-w-0 flex-1">
                                <span className="flex items-center justify-between gap-3">
                                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">
                                    {getNotificationTypeLabel(item.type, language)}
                                  </span>
                                  <span className="text-xs text-slate-400">{item.time}</span>
                                </span>
                                <span className="mt-1 block text-sm leading-6 text-slate-600">{item.text}</span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
                    {(["en", "tr"] as const).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setLanguage(option);
                          if (typeof window !== "undefined") {
                            window.localStorage.setItem("token-hub-language", option);
                          }
                        }}
                        className={`rounded-xl px-3 py-2 text-sm font-medium transition ${
                          language === option
                            ? "bg-slate-950 !text-white shadow-sm"
                            : "text-slate-500 hover:!text-slate-950"
                        }`}
                      >
                        {option.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {role === "admin" ? (
                    <ButtonLink href={withRole("/announcements/create", role)}>
                      {t.common.createAnnouncement}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>

              <div className="flex gap-2 overflow-x-auto lg:hidden">
                {navLinks.map((item) => {
                  const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

                  return (
                    <Link
                      key={item.label}
                      href={withRole(item.href, role)}
                      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-2xl border px-4 py-2.5 text-sm font-medium ${
                        active
                          ? "border-slate-950 bg-slate-950 !text-white"
                          : "border-slate-200 bg-white text-slate-600"
                      }`}
                    >
                      <NavItemIcon href={item.href} className="h-4 w-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {renderPage(page, role, language, selectedPostSlug, selectedAnnouncementSlug, selectedAnnouncementRequestSlug, selectedDocumentSlug, selectedWelcomeOnBoardSlug, selectedSocialHubSection, selectedSocialHubItem)}
          </main>
        </div>
      </div>
    </div>
  );
}
