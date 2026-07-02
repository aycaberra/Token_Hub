"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
  type BlogCategory,
  type Lang,
  type PortalPage,
  type Role,
} from "@/lib/portal";

type PortalShellProps = {
  role: Role;
  page: PortalPage;
  selectedPostSlug?: string;
  selectedBlogCategory?: BlogCategory;
  isBlogRequestView?: boolean;
  selectedAnnouncementSlug?: string;
  selectedAnnouncementRequestSlug?: string;
  selectedDocumentSlug?: string;
  selectedBenefitSlug?: string;
  selectedCourseSlug?: string;
  selectedMyPageSlug?: string;
  selectedWelcomeOnBoardSlug?: string;
  selectedSocialHubSection?: "benefits" | "clubs";
  selectedSocialHubItem?: string;
  isAnnouncementEdit?: boolean;
};

type CourseItem = {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
  dueDate?: string;
  audience: string;
};

type NotificationItem = {
  type: "like" | "comment" | "publish";
  text: string;
  href: string;
  time: string;
};

function getStoredFollowedBlogs(): BlogCategory[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem("token-hub-followed-blogs");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    const valid = ["main", "sports", "foodie", "art"] as const;
    return Array.isArray(parsed) ? parsed.filter((item): item is BlogCategory => valid.includes(item)) : [];
  } catch {
    return [];
  }
}

function withRole(href: string, role: Role) {
  return `${href}${href.includes("?") ? "&" : "?"}role=${role}`;
}

function withFrom(href: string, from?: string) {
  if (!from) return href;
  return `${href}${href.includes("?") ? "&" : "?"}from=${encodeURIComponent(from)}`;
}

function withRoleAndFrom(href: string, role: Role, from?: string) {
  return withRole(withFrom(href, from), role);
}

function getRoleHref(pathname: string, role: Role) {
  if (role === "employee" && pathname === "/") {
    return withRole("/announcements", role);
  }

  return withRole(pathname, role);
}

type DirectoryEmployee = {
  name: string;
  email: string;
  team: string;
  role: string;
};

function getTeamOptions(language: Lang) {
  return language === "tr"
    ? ["Ürün", "People & Culture", "Pazarlama", "Finans", "Tasarım", "Teknoloji"]
    : ["Product", "People & Culture", "Marketing", "Finance", "Design", "Engineering"];
}

function getRoleOptions(language: Lang) {
  return language === "tr"
    ? ["Ürün Uzmanı", "People Partner", "Pazarlama Uzmanı", "Finans Uzmanı", "Tasarımcı", "Yazılım Mühendisi"]
    : ["Product Specialist", "People Partner", "Marketing Specialist", "Finance Specialist", "Designer", "Software Engineer"];
}

function getEmployeeDirectory(language: Lang): DirectoryEmployee[] {
  return language === "tr"
    ? [
        { name: "Ayça Berra", email: "ayca.berra@token.com.tr", team: "Ürün", role: "Ürün Uzmanı" },
        { name: "Deniz Aksoy", email: "deniz.aksoy@token.com.tr", team: "People & Culture", role: "People Partner" },
        { name: "Selin Kaya", email: "selin.kaya@token.com.tr", team: "Pazarlama", role: "Pazarlama Uzmanı" },
        { name: "Can Arslan", email: "can.arslan@token.com.tr", team: "Finans", role: "Finans Uzmanı" },
        { name: "İrem Demir", email: "irem.demir@token.com.tr", team: "Tasarım", role: "Tasarımcı" },
        { name: "Mert Kılıç", email: "mert.kilic@token.com.tr", team: "Teknoloji", role: "Yazılım Mühendisi" },
      ]
    : [
        { name: "Ayça Berra", email: "ayca.berra@token.com.tr", team: "Product", role: "Product Specialist" },
        { name: "Deniz Aksoy", email: "deniz.aksoy@token.com.tr", team: "People & Culture", role: "People Partner" },
        { name: "Selin Kaya", email: "selin.kaya@token.com.tr", team: "Marketing", role: "Marketing Specialist" },
        { name: "Can Arslan", email: "can.arslan@token.com.tr", team: "Finance", role: "Finance Specialist" },
        { name: "İrem Demir", email: "irem.demir@token.com.tr", team: "Design", role: "Designer" },
        { name: "Mert Kılıç", email: "mert.kilic@token.com.tr", team: "Engineering", role: "Software Engineer" },
      ];
}

function getNotifications(language: Lang, role: Role): NotificationItem[] {
  if (language === "tr") {
    return role === "admin"
      ? [
          { type: "like", text: "İkinci el telefon ilanına 4 yeni beğeni geldi.", href: "/blog/selling-iphone-13", time: "2 dk" },
          { type: "comment", text: "Kiralık ev paylaşımına 2 yeni yorum geldi.", href: "/blog/seeking-rental-near-office", time: "12 dk" },
          { type: "publish", text: "Yeni sprint demosu duyuru talebi değerlendirme için hazır.", href: "/announcements/requests/product-sprint-demo", time: "25 dk" },
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
        { type: "publish", text: "The new sprint demo announcement request is ready for review.", href: "/announcements/requests/product-sprint-demo", time: "25 min" },
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

function FormIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path strokeLinecap="round" d="M8 8h8M8 12h8M8 16h5" />
    </svg>
  );
}

function CourseIcon({ className = "h-4 w-4" }: { className?: string }) {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5 12 4l9 3.5-9 3.5L3 7.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 10.5V15c0 1.7 2.2 3 5 3s5-1.3 5-3v-4.5" />
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

  if (href.startsWith("/benefits")) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={className} aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6.5-4.4-8.4-8A4.8 4.8 0 0 1 8 6.2c1.7 0 3 1 4 2.3 1-1.3 2.3-2.3 4-2.3a4.8 4.8 0 0 1 4.4 6.8C18.5 16.6 12 21 12 21Z" />
      </svg>
    );
  }

  if (href.startsWith("/courses")) return <CourseIcon className={className} />;

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
        benefits: "Çalışan Ayrıcalıkları",
        courses: "Growth O'Clock",
        myPage: "Ana Sayfa",
        welcomeOnBoard: "Aramıza Hoş Geldin",
        formSubmissions: "Form Gönderimleri",
        socialHubSettings: "Social Hub",
        blog: "Blog",
        socialHub: "Social Hub",
      },
      headings: {
        dashboard: { title: "Panel", description: "" },
        announcements: { title: "Duyurular", description: "" },
        announcementRequest: { title: "Duyuru Talebi", description: "" },
        announcementRequests: { title: "Duyuru Talepleri", description: "" },
        announcementCreate: { title: "Duyuru Oluştur", description: "" },
        announcementEdit: { title: "Duyuru Düzenle", description: "" },
        blog: { title: "Blog", description: "" },
        publish: { title: "Yayınla", description: "" },
        documents: { title: "Dokümanlar", description: "" },
        "document-create": { title: "Yeni Doküman Ekle", description: "" },
        "document-assign": { title: "Çalışana Doküman Ata", description: "" },
        "document-request": { title: "Doküman Talebi Oluştur", description: "" },
        benefits: { title: "Çalışan Ayrıcalıkları", description: "" },
        "benefit-create": { title: "Yeni Ayrıcalık Ekle", description: "" },
        courses: { title: "Growth O'Clock", description: "" },
        profiles: { title: "Çalışan Profilleri", description: "" },
        "profile-create": { title: "Yeni Profil Oluştur", description: "" },
        "my-page": { title: "Ana Sayfa", description: "" },
        "welcome-on-board": { title: "Aramıza Hoş Geldin", description: "" },
        forms: { title: "Formlar", description: "Form Gönderimleri ve Şirket İçi Talepler." },
        socialHub: { title: "Social Hub", description: "" },
        socialHubEdit: { title: "Social Hub'ı Güncelle", description: "" },
      },
      dashboard: {
        hero: "Şirket güncellemeleri, İK dokümanları, iç formlar ve sosyal aktiviteler için tek yer.",
        openAnnouncements: "Duyuruları Aç",
        openHrHub: "İK Hub'ını Aç",
        quickSnapshot: "Hızlı Görünüm",
        adminPriorities: "",
        todayAtGlance: "Bugünün Özeti",
        contentSubmissionsActivity: "",
        updatesDocumentsActions: "Güncellemeler, Dokümanlar ve İşlemler",
        blog: "Blog",
        reviewPosts: "Blog Gönderilerini İncele",
        employeePosts: "Çalışan Paylaşımları",
        moderatePosts: "Çalışan paylaşımlarını düzenli şekilde yönet.",
        coworkerSharing: "Çalışanların paylaştığı ilanları ve talepleri gör.",
        forms: "Formlar",
        trackSubmissions: "Gönderimleri Takip Et",
        openForms: "Formları Aç",
        reviewExport: "Yanıtları incele ve dışa aktar.",
        completeRequests: "Şirket içi talepleri ve anketleri doldur.",
        social: "Sosyal",
        socialHubTitle: "Social Hub",
        socialHubDesc: "Kulüpler, aktiviteler ve MultiSport seçeneklerini görüntüle.",
        adminControls: "Yönetici İşlemleri",
        addDocument: "Doküman Ekle",
        addDocumentForEmployee: "Çalışana Doküman Ekle",
        addBenefit: "Yeni Ayrıcalık Ekle",
        employeeProfiles: "Çalışan Profilleri",
        createProfile: "Yeni Profil Oluştur",
        announcementRequests: "Duyuru Talepleri",
        total: "Toplam",
        accepted: "Onaylanan",
        rejected: "Reddedilen",
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
        requestTitle: "Bir Duyuru Talebi Paylaş",
        requestsTitle: "Duyuru Talepleri",
        recentTitle: "Son Duyurular",
        createTitle: "Yeni Duyuru Oluştur",
        addForm: "Form Ekle",
        formTemplate: "Form Oluşturucu",
        formQuestions: "Sorular",
        questionLabel: "Soru",
        addQuestion: "Soru Ekle",
        questionTitle: "Soru Metni",
        questionStyle: "Soru Tipi",
        openEnded: "Açık Uçlu",
        multipleChoice: "Çoktan Seçmeli",
        answerOptions: "Yanıt Seçenekleri",
        addOption: "Seçenek Ekle",
        removeQuestion: "Soruyu Sil",
        removeOption: "Seçeneği Sil",
        questionPlaceholder: "Sorunuzu Yazın",
        optionPlaceholder: "Seçenek Yazın",
        formPreview: "Form Önizlemesi",
        attachment: "Ek Dosya Ekle (Görsel, Video)",
        requestOwner: "Talep Sahibi",
        requestTeam: "Ekip",
        approve: "Onayla",
        reject: "Reddet",
        teamName: "Ekip Adı",
        announcementTitle: "Duyuru Başlığı",
        announcementContent: "Duyuru İçeriği",
        sendToAdmin: "Yöneticiye Gönder",
        edit: "Düzenle",
        editTitle: "Duyuruyu Düzenle",
        save: "Değişiklikleri kaydet",
        delete: "Duyuruyu sil",
        detail: "Kısa Açıklama",
        body: "Detay İçeriği",
      },
      blog: {
        postModeration: "Paylaşım moderasyonu",
        recentPosts: "Son paylaşımlar",
        reviewEmployeePosts: "Çalışan paylaşımlarını yayın öncesi veya sonrası incele.",
        publish: "Yayınla",
        todaysBirthdays: "Bugünün Doğum Günleri",
        spaces: "Blog Alanları",
        mainBlog: "Ana Blog",
        sportsBlog: "Spor Blogu",
        foodieBlog: "Foodie Blog",
        artBlog: "Sanat Blogu",
        mainBlogDesc: "Şirket içi genel paylaşımlar, öneriler ve günlük konular.",
        sportsBlogDesc: "Koşu, maç, takım etkinlikleri ve aktif yaşam paylaşımları.",
        foodieBlogDesc: "Lezzet önerileri, öğle yemeği keşifleri ve mekan tavsiyeleri.",
        artBlogDesc: "Sergi, film, konser ve yaratıcı etkinlik önerileri.",
        requestBlog: "Blog Konusu Talebi",
        requestBlogDesc: "Yeni bir blog konusu öner veya mevcut alan için ihtiyaç paylaş.",
        requestOwner: "Talep Sahibi",
        requestTopic: "Blog Adı",
        requestReason: "Neden Gerekli?",
        sendRequest: "Talebi Gönder",
        reviewRequests: "Blog Talepleri",
        pendingReview: "İnceleniyor",
        requestedBy: "Talep Sahibi",
        publishIn: "Yayınlanacak Blog",
        followBlog: "Bu Blogu Takip Et",
        followingBlog: "Takip Ediliyor",
        postNotFound: "Paylaşım bulunamadı",
        backToPosts: "Geri",
        sharedBy: "Paylaşan",
        unlike: "Beğenmekten vazgeç",
        like: "Beğen",
        edit: "Düzenle",
        save: "Kaydet",
        cancel: "İptal",
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
        preview: "Önizleme",
        download: "İndir",
        edit: "Düzenle",
        save: "Kaydet",
        delete: "Sil",
        cancel: "İptal",
        requestDocument: "Doküman Talebi",
        requestDocumentTitle: "Doküman Talebi Oluştur",
        requestDocumentPlaceholder: "İhtiyaç duyduğunuz dokümanı kısaca yazın...",
        addDocument: "Doküman Ekle",
        addDocumentTitle: "Yeni Doküman Ekle",
        addDocumentDescription: "Doküman açıklaması",
        addDocumentAudience: "Hedef kitle",
        addDocumentLink: "Doküman bağlantısı",
        assignDocument: "Çalışana Doküman Ekle",
        assignDocumentTitle: "Çalışana Doküman Ata",
        employeeName: "Çalışan adı",
        employeeEmail: "Çalışan e-postası",
        assignNote: "Kısa not",
        sendRequest: "Talebi Gönder",
        documentTitle: "Doküman Başlığı",
        documentDescription: "Doküman Açıklaması",
        documentContent: "Doküman İçeriği",
      },
      benefits: {
        title: "Çalışan Ayrıcalıkları",
        openCampaign: "Kampanyayı Aç",
        brandWebsite: "Marka Websitesi",
        expires: "Son Tarih",
        addBenefit: "Yeni Ayrıcalık Ekle",
        addBenefitTitle: "Yeni Ayrıcalık Oluştur",
        partnerName: "Marka / İş Ortağı",
        campaignTitle: "Kampanya Başlığı",
        campaignDescription: "Kampanya Açıklaması",
        campaignLink: "Kampanya Bağlantısı",
      },
      courses: {
        title: "Growth O'Clock",
        mandatory: "Zorunlu",
        optional: "İsteğe Bağlı",
        due: "Son Tarih",
        audience: "Hedef Kitle",
        newHire: "Yeni Çalışanlar",
        firstMonth: "İlk Ay İçinde Tamamlanmalı",
        add: "Ekle",
        edit: "Düzenle",
        delete: "Sil",
        save: "Kaydet",
        cancel: "İptal",
        courseTitle: "Kurs Başlığı",
        courseDescription: "Kurs Açıklaması",
        dueDate: "Bitiş Tarihi",
        notFound: "Kurs Bulunamadı",
        videoPreview: "Video Önizleme",
        play: "Oynat",
      },
      profileCreate: {
        title: "Yeni Profil Oluştur",
        editTitle: "Çalışan Profilini Düzenle",
        update: "Profili Kaydet",
        listTitle: "Çalışan Profilleri",
        noResults: "Gösterilecek çalışan bulunamadı.",
        editProfile: "Düzenle",
        employeeName: "Çalışan Adı",
        employeeEmail: "Çalışan E-Postası",
        employeeRole: "Pozisyon",
        employeeTeam: "Takım",
        selectTeam: "Bir Takım Seçin",
        buddyName: "Buddy Adı",
        selectBuddy: "Bir Buddy Seçin",
        startDate: "Başlangıç Tarihi",
        personalInfo: "Kişisel Bilgiler",
        uploads: "Yüklenen Belgeler",
        uploadType: "Belge Türü",
        uploadName: "Dosya Adı",
        uploadNamePlaceholder: "Örn. ayca_berra_sozlesme.pdf",
        addUpload: "Yüklemeyi Onayla",
        updateUpload: "Yüklemeyi Güncelle",
        uploadedItems: "Eklenen Belgeler",
        noUploads: "Henüz eklenen belge yok.",
        editUpload: "Düzenle",
        deleteUpload: "Sil",
        profilePhoto: "Profil Fotoğrafı",
        contract: "Sözleşme",
        idCopy: "Kimlik Kopyası",
        emergencyForm: "Acil Durum Formu",
        save: "Profili Oluştur",
      },
      myPage: {
        title: "Ana Sayfa",
        hello: "Merhaba",
        personalInfo: "Kişisel Bilgilerim",
        companyEmail: "Şirket E-Postam",
        buddy: "Buddy'm",
        buddyEmail: "Buddy E-Postası",
        buddyPhone: "Buddy Telefonu",
        documents: "Dokümanlarım",
        contract: "Sözleşmem",
        contractStatus: "Aktif",
        contractType: "Belirsiz Süreli İş Sözleşmesi",
        contractUpdated: "Son Güncelleme",
        todos: "Yapılacaklar Listem",
        openContract: "Sözleşmeyi Aç",
        employeeName: "Ayça Berra",
        adminName: "Merve A.",
        employeeEmailAddress: "ayca.berra@token.com.tr",
        adminEmailAddress: "merve.a@token.com.tr",
        employeeRole: "Ürün Uzmanı",
        adminRole: "People & Culture Yöneticisi",
        employeeTeam: "Ürün",
        adminTeam: "People & Culture",
        employeeBuddyName: "Deniz Aksoy",
        adminBuddyName: "Selin Kaya",
        employeeBuddyEmailAddress: "deniz.aksoy@token.com.tr",
        adminBuddyEmailAddress: "selin.kaya@token.com.tr",
        employeeBuddyPhoneNumber: "+90 532 245 18 40",
        adminBuddyPhoneNumber: "+90 533 412 67 28",
        todoItemsEmployee: ["Welcome To Token kursunu tamamla", "Konser Bileti Hediyesi formunu doldur", "Şirket Wi‑Fi bilgilerini gözden geçir"],
        todoItemsAdmin: ["Duyuru taleplerini değerlendir", "Growth O'Clock kurslarını güncelle", "Aramıza Hoş Geldin içeriklerini gözden geçir"],
      },
      welcomeOnBoard: {
        usefulLinks: "Faydalı Bağlantılar",
        basicProcesses: "Ofis Temelleri",
        expenseTitle: "Masraf Ve Satın Alma",
        expenseDesc: "Masraf girişleri, satın alma süreçleri, fiş yükleme ve onay takibi.",
        itTitle: "IT Destek Talepleri",
        itDesc: "Laptop, erişim, ekipman ve teknik destek kayıtları.",
        hrTitle: "İK Öz Servis",
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
        itemLink: "Bağlantı",
        itemContent: "İçerik",
        },
      forms: {
        eyebrow: "Formlar",
        tracking: "Gönderim Takibi",
        interactive: "Etkileşimli Şirket Formları",
        monitor: "Kullanımı izle, kayıtları incele ve dışa aktar.",
        complete: "Geri bildirim, talep ve anketleri portalda doldur.",
        actions: "İşlemler",
        openForms: "Formları aç",
        reviewExport: "İncele ve dışa aktar",
        chooseForm: "Bir form seç",
        keepRecords: "Kayıtları düzenli tut ve rapora hazırla.",
        startRequest: "Birkaç tıkla talep başlat veya geri bildirim ver.",
        adminItems: ["Gönderimleri Dışa Aktar", "İK Formlarını Aç", "Geri Bildirimi İncele", "Bekleyen Talepleri Takip Et"],
        employeeItems: ["İzin Talebi", "Masraf Formu", "Geri Bildirim Formu", "Onboarding Kontrol Listesi"],
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
        foodieTitle: "Lezzet Kulübü",
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
        updateTitle: "Social Hub'ı Güncelle",
        updateSectionBenefits: "Sosyal Haklar",
        updateSectionClubs: "Kulüpler",
      },
      common: {
        search: "Ara",
        notifications: "Bildirimler",
        createAnnouncement: "Duyuru Oluştur",
        adminDashboard: "Yönetici Paneli",
        announcements: "Duyurular",
        archive: "Arşivle",
        archived: "Arşivlendi",
        delete: "Sil",
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
      benefits: "Employee Benefits",
      courses: "Growth O'Clock",
      myPage: "Homepage",
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
      announcementRequests: { title: "Announcement Requests", description: "" },
      announcementCreate: { title: "Create Announcement", description: "" },
      announcementEdit: { title: "Edit Announcement", description: "" },
      blog: { title: "Blog", description: "" },
      publish: { title: "Publish", description: "" },
      documents: { title: "Documents", description: "" },
      "document-create": { title: "Add A New Document", description: "" },
      "document-assign": { title: "Assign Document To Employee", description: "" },
      "document-request": { title: "Create A Document Request", description: "" },
      benefits: { title: "Employee Benefits", description: "" },
      "benefit-create": { title: "Add A New Benefit", description: "" },
      courses: { title: "Growth O'Clock", description: "" },
      profiles: { title: "Employee Profiles", description: "" },
      "profile-create": { title: "Create New Profile", description: "" },
      "my-page": { title: "Homepage", description: "" },
      "welcome-on-board": { title: "Welcome On Board", description: "" },
      forms: { title: "Forms", description: "Submission tracking and internal request forms." },
      socialHub: { title: "Social Hub", description: "" },
      socialHubEdit: { title: "Update Social Hub", description: "" },
    },
    dashboard: {
      hero: "One place for company updates, HR documents, internal forms, and social activities.",
      openAnnouncements: "Open Announcements",
      openHrHub: "Open HR Hub",
      quickSnapshot: "Quick Snapshot",
      adminPriorities: "",
      todayAtGlance: "Today At A Glance",
      contentSubmissionsActivity: "",
      updatesDocumentsActions: "Updates, Documents, And Actions",
      blog: "Blog",
      reviewPosts: "Review Posts",
      employeePosts: "Employee Posts",
      moderatePosts: "Moderate employee posts and keep the board organized.",
      coworkerSharing: "See what coworkers are sharing, selling, or asking about.",
      forms: "Forms",
      trackSubmissions: "Track Submissions",
      openForms: "Open Forms",
      reviewExport: "Review and export responses.",
      completeRequests: "Complete internal requests and surveys.",
      social: "Social",
      socialHubTitle: "Social Hub",
      socialHubDesc: "View clubs, activities, and MultiSport options.",
      adminControls: "Admin Controls",
      addDocument: "Add Document",
      addDocumentForEmployee: "Add Document For An Employee",
      addBenefit: "Add New Benefit",
      employeeProfiles: "Employee Profiles",
      createProfile: "Create New Profile",
      announcementRequests: "Announcement Requests",
      total: "Total",
      accepted: "Accepted",
      rejected: "Rejected",
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
      addForm: "Add Form",
      formTemplate: "Form Builder",
      formQuestions: "Questions",
      questionLabel: "Question",
      addQuestion: "Add Question",
      questionTitle: "Question Text",
      questionStyle: "Question Type",
      openEnded: "Open-Ended",
      multipleChoice: "Multiple Choice",
      answerOptions: "Answer Options",
      addOption: "Add Option",
      removeQuestion: "Delete Question",
      removeOption: "Delete Option",
      questionPlaceholder: "Write Your Question",
      optionPlaceholder: "Write An Option",
      formPreview: "Form Preview",
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
      todaysBirthdays: "Today's Birthdays",
      spaces: "Blog Spaces",
      mainBlog: "Main Blog",
      sportsBlog: "Sports Blog",
      foodieBlog: "Foodie Blog",
      artBlog: "Art Blog",
      mainBlogDesc: "General internal sharing, recommendations, and everyday topics.",
      sportsBlogDesc: "Running, matches, team activities, and active lifestyle sharing.",
      foodieBlogDesc: "Food recommendations, lunch discoveries, and place suggestions.",
      artBlogDesc: "Exhibitions, films, concerts, and creative event recommendations.",
      requestBlog: "Request A Blog Subject",
      requestBlogDesc: "Suggest a new blog subject or share a need for an existing one.",
      requestOwner: "Request Owner",
      requestTopic: "Blog Name",
      requestReason: "Why Is It Needed?",
      sendRequest: "Send Request",
      reviewRequests: "Blog Requests",
      pendingReview: "Pending Review",
      requestedBy: "Requested By",
      publishIn: "Publishing To",
      followBlog: "Follow This Blog",
      followingBlog: "Following",
      postNotFound: "Post not found",
      backToPosts: "Back",
      sharedBy: "Shared by",
      unlike: "Unlike",
      like: "Like",
      edit: "Edit",
      save: "Save",
      cancel: "Cancel",
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
      preview: "Preview",
      download: "Download",
      edit: "Edit",
      save: "Save",
      delete: "Delete",
      cancel: "Cancel",
      requestDocument: "Request A Document",
      requestDocumentTitle: "Create A Document Request",
      requestDocumentPlaceholder: "Briefly describe the document you need...",
      addDocument: "Add Document",
      addDocumentTitle: "Add A New Document",
      addDocumentDescription: "Document Description",
      addDocumentAudience: "Audience",
      addDocumentLink: "Document Link",
      assignDocument: "Add Document For An Employee",
      assignDocumentTitle: "Assign Document To Employee",
      employeeName: "Employee Name",
      employeeEmail: "Employee Email",
      assignNote: "Short Note",
      sendRequest: "Send Request",
      documentTitle: "Document Title",
      documentDescription: "Document Description",
      documentContent: "Document Content",
    },
    benefits: {
      title: "Employee Benefits",
      openCampaign: "Open Campaign",
      brandWebsite: "Brand Website",
      expires: "Expiry Date",
      addBenefit: "Add New Benefit",
      addBenefitTitle: "Create A New Benefit",
      partnerName: "Partner / Brand",
      campaignTitle: "Campaign Title",
      campaignDescription: "Campaign Description",
      campaignLink: "Campaign Link",
    },
    courses: {
      title: "Growth O'Clock",
      mandatory: "Mandatory",
      optional: "Optional",
      due: "Due",
      audience: "Audience",
      newHire: "New Hires",
      firstMonth: "Complete Within First Month",
      add: "Add",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      courseTitle: "Course Title",
      courseDescription: "Course Description",
      dueDate: "Due Date",
      notFound: "Course Not Found",
      videoPreview: "Video Preview",
      play: "Play",
    },
    profileCreate: {
      title: "Create New Profile",
      editTitle: "Edit Employee Profile",
      update: "Save Profile",
      listTitle: "Employee Profiles",
      noResults: "No employee found to display.",
      editProfile: "Edit",
      employeeName: "Employee Name",
      employeeEmail: "Employee Email",
      employeeRole: "Role",
      employeeTeam: "Team",
      selectTeam: "Select A Team",
      buddyName: "Buddy Name",
      selectBuddy: "Select A Buddy",
      startDate: "Start Date",
      personalInfo: "Personal Info",
      uploads: "Uploads",
      uploadType: "Document Type",
      uploadName: "File Name",
      uploadNamePlaceholder: "Example: ayca_berra_contract.pdf",
      addUpload: "Confirm Upload",
      updateUpload: "Update Upload",
      uploadedItems: "Added Documents",
      noUploads: "No document has been added yet.",
      editUpload: "Edit",
      deleteUpload: "Delete",
      profilePhoto: "Profile Photo",
      contract: "Contract",
      idCopy: "ID Copy",
      emergencyForm: "Emergency Form",
      save: "Create Profile",
    },
    myPage: {
      title: "Homepage",
      hello: "Hello",
      personalInfo: "Personal Info",
      companyEmail: "My Company Email",
      buddy: "My Buddy",
      buddyEmail: "Buddy Email",
      buddyPhone: "Buddy Phone",
      documents: "My Documents",
      contract: "My Contract",
      contractStatus: "Active",
      contractType: "Open-Ended Employment Contract",
      contractUpdated: "Last Updated",
      todos: "My To-Do List",
      openContract: "Open Contract",
      employeeName: "Ayça Berra",
      adminName: "Merve A.",
      employeeEmailAddress: "ayca.berra@token.com.tr",
      adminEmailAddress: "merve.a@token.com.tr",
      employeeRole: "Product Specialist",
      adminRole: "People & Culture Manager",
      employeeTeam: "Product",
      adminTeam: "People & Culture",
      employeeBuddyName: "Deniz Aksoy",
      adminBuddyName: "Selin Kaya",
      employeeBuddyEmailAddress: "deniz.aksoy@token.com.tr",
      adminBuddyEmailAddress: "selin.kaya@token.com.tr",
      employeeBuddyPhoneNumber: "+90 532 245 18 40",
      adminBuddyPhoneNumber: "+90 533 412 67 28",
      todoItemsEmployee: ["Complete the Welcome To Token course", "Fill out the Concert Ticket Gift form", "Review the company Wi‑Fi details"],
      todoItemsAdmin: ["Review announcement requests", "Update Growth O'Clock courses", "Review Welcome On Board content"],
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
      archive: "Archive",
      archived: "Archived",
      delete: "Delete",
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

function getActionButtonClass(
  variant: "primary" | "secondary" | "danger" | "warning",
  extraClassName = "",
) {
  const base = "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 focus:outline-none focus:ring-2";
  const styles = {
    primary: "bg-sky-700 !text-white hover:bg-sky-800 focus:ring-sky-200",
    secondary: "border border-slate-300 bg-white text-slate-900 hover:border-sky-200 hover:text-sky-800 focus:ring-slate-200",
    danger: "border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 focus:ring-rose-100",
    warning: "border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 focus:ring-amber-100",
  };

  return `${base} ${styles[variant]} ${extraClassName}`.trim();
}

function ButtonLink({
  href,
  children,
  variant = "dark",
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "dark" | "light" | "outline";
  className?: string;
}) {
  const styles = {
    dark: getActionButtonClass("primary"),
    light: "inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-medium bg-white !text-slate-950 shadow-sm transition hover:-translate-y-0.5 hover:opacity-95",
    outline: getActionButtonClass("secondary"),
  };

  return (
    <Link href={href} className={`${styles[variant]} ${className}`.trim()}>
      {children}
    </Link>
  );
}

function BackButton({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:border-sky-200 hover:text-sky-800"
    >
      <span aria-hidden="true">←</span>
      {label}
    </Link>
  );
}

function MasterBackButton({ role, fallbackHref, label }: { role: Role; fallbackHref: string; label: string }) {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const href = withRole(from ? decodeURIComponent(from) : fallbackHref, role);

  return <BackButton href={href} label={label} />;
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
            const isPortalLogins = stat.label === "Portal Logins" || stat.label === "Portal Girişleri";
            const isAnnouncementRequests = stat.label === "Announcement Requests" || stat.label === "Duyuru Talepleri";

            return (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{stat.value}</p>
                {stat.helper ? <p className="mt-1 text-sm text-slate-500">{stat.helper}</p> : null}
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
                {isAnnouncementRequests ? (
                  <div className="mt-4 grid grid-cols-2 gap-2 text-center">
                    <div className="rounded-xl bg-white px-2 py-2">
                      <p className="text-[11px] text-slate-500">{t.dashboard.accepted}</p>
                      <p className="mt-1 text-sm font-semibold text-emerald-700">11</p>
                    </div>
                    <div className="rounded-xl bg-white px-2 py-2">
                      <p className="text-[11px] text-slate-500">{t.dashboard.rejected}</p>
                      <p className="mt-1 text-sm font-semibold text-rose-700">7</p>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </section>

      {isAdmin ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle title={t.dashboard.adminControls} description="" />
          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            <ButtonLink href={withRoleAndFrom("/profiles", role, "/")} className="min-h-[52px] text-center leading-5">{t.dashboard.employeeProfiles}</ButtonLink>
            <ButtonLink href={withRoleAndFrom("/profiles/create", role, "/")} variant="outline" className="min-h-[52px] text-center leading-5">{t.dashboard.createProfile}</ButtonLink>
            <ButtonLink href={withRoleAndFrom("/announcements/create", role, "/")} variant="outline" className="min-h-[52px] text-center leading-5">{t.common.createAnnouncement}</ButtonLink>
            <ButtonLink href={withRoleAndFrom("/documents/create", role, "/")} variant="outline" className="min-h-[52px] text-center leading-5">{t.dashboard.addDocument}</ButtonLink>
            <ButtonLink href={withRoleAndFrom("/documents/assign", role, "/")} variant="outline" className="min-h-[52px] text-center leading-5">{t.dashboard.addDocumentForEmployee}</ButtonLink>
            <ButtonLink href={withRoleAndFrom("/benefits/create", role, "/")} variant="outline" className="min-h-[52px] text-center leading-5">{t.dashboard.addBenefit}</ButtonLink>
          </div>
        </section>
      ) : null}

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
      <div className="flex flex-wrap items-center justify-end gap-4">
        <div className="flex flex-wrap gap-3">
          {role === "admin" ? (
            <>
              <ButtonLink href={withRoleAndFrom("/announcements/create", role, "/announcements")}>
                {t.common.createAnnouncement}
              </ButtonLink>
              <ButtonLink href={withRoleAndFrom("/announcements/requests", role, "/announcements")} variant="outline">
                {t.announcements.requests}
              </ButtonLink>
            </>
          ) : null}

          {role === "employee" ? (
            <Link
              href={withRoleAndFrom("/announcements/request", role, "/announcements")}
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
            href={withRoleAndFrom(`/announcements/${item.slug}`, role, "/announcements")}
            className="group flex items-center gap-4 rounded-2xl bg-slate-50 p-4 transition hover:bg-sky-50"
          >
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white ring-1 ${item.hasForm ? "text-violet-700 ring-violet-100" : "text-sky-700 ring-sky-100"}`}>
              {item.hasForm ? <FormIcon className="h-4 w-4" /> : <MegaphoneIcon className="h-4 w-4" />}
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
  const [isArchived, setIsArchived] = useState(false);

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
        {role === "admin" ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsArchived(true)}
              className={getActionButtonClass("warning")}
            >
              {isArchived ? t.common.archived : t.common.archive}
            </button>
            <ButtonLink href={withRoleAndFrom(`/announcements/${slug}/edit`, role, `/announcements/${slug}`)} variant="outline">
              {t.announcements.edit}
            </ButtonLink>
          </div>
        ) : null}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <h2 className="text-2xl font-semibold text-sky-800">{announcement.title}</h2>
        {isArchived ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{t.common.archived}</span> : null}
      </div>
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
              className={getActionButtonClass("primary")}
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
      <div className="space-y-4">
        {requests.map((request) => (
          <Link
            key={request.slug}
            href={withRoleAndFrom(`/announcements/requests/${request.slug}`, role, "/announcements/requests")}
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

function AnnouncementRequestDetailPage({ slug, language }: { role: Role; slug: string; language: Lang }) {
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
      <h2 className="text-2xl font-semibold text-sky-800">{request.title}</h2>
      <p className="mt-3 text-sm text-slate-500">{t.announcements.requestOwner}: {request.owner}</p>
      <p className="mt-1 text-sm text-slate-500">{t.announcements.requestTeam}: {request.team}</p>
      <p className="mt-6 text-sm leading-6 text-slate-600">{request.content}</p>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className={getActionButtonClass("primary")}
        >
          {t.announcements.approve}
        </button>
        <button
          type="button"
          className={getActionButtonClass("danger")}
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
  const [formQuestions, setFormQuestions] = useState<Array<{
    id: string;
    title: string;
    type: "open-ended" | "multiple-choice";
    options: string[];
  }>>([]);

  const addQuestion = () => {
    setFormQuestions((current) => [
      ...current,
      {
        id: `${Date.now()}-${current.length}`,
        title: "",
        type: "open-ended",
        options: ["", ""],
      },
    ]);
  };

  const updateQuestion = (
    questionId: string,
    updater: (question: { id: string; title: string; type: "open-ended" | "multiple-choice"; options: string[] }) => {
      id: string;
      title: string;
      type: "open-ended" | "multiple-choice";
      options: string[];
    },
  ) => {
    setFormQuestions((current) => current.map((item) => item.id === questionId ? updater(item) : item));
  };

  const openFormBuilder = () => {
    setFormAdded(true);
    setFormQuestions((current) => current.length ? current : [
      {
        id: "question-1",
        title: "",
        type: "open-ended",
        options: ["", ""],
      },
    ]);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <SectionTitle title={t.announcements.formTemplate} description="" />
              <button
                type="button"
                onClick={addQuestion}
                className={getActionButtonClass("secondary", "px-3 py-2 text-xs")}
              >
                {t.announcements.addQuestion}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {formQuestions.map((question, index) => (
                <div key={question.id} className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="text-sm font-semibold text-slate-900">{t.announcements.questionLabel} {index + 1}</p>
                    <button
                      type="button"
                      onClick={() => setFormQuestions((current) => current.filter((item) => item.id !== question.id))}
                      className={getActionButtonClass("danger", "px-3 py-2 text-xs")}
                    >
                      {t.announcements.removeQuestion}
                    </button>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{t.announcements.questionTitle}</p>
                      <input
                        value={question.title}
                        onChange={(event) => updateQuestion(question.id, (item) => ({ ...item, title: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                        placeholder={t.announcements.questionPlaceholder}
                      />
                    </div>
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{t.announcements.questionStyle}</p>
                      <select
                        value={question.type}
                        onChange={(event) => updateQuestion(question.id, (item) => ({
                          ...item,
                          type: event.target.value as "open-ended" | "multiple-choice",
                          options: event.target.value === "multiple-choice"
                            ? item.options.length >= 2
                              ? item.options
                              : [item.options[0] ?? "", ""]
                            : item.options,
                        }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                      >
                        <option value="open-ended">{t.announcements.openEnded}</option>
                        <option value="multiple-choice">{t.announcements.multipleChoice}</option>
                      </select>
                    </div>
                  </div>

                  {question.type === "multiple-choice" ? (
                    <div className="mt-4 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-slate-900">{t.announcements.answerOptions}</p>
                        <button
                          type="button"
                          onClick={() => updateQuestion(question.id, (item) => ({ ...item, options: [...item.options, ""] }))}
                          className={getActionButtonClass("secondary", "px-3 py-2 text-xs")}
                        >
                          {t.announcements.addOption}
                        </button>
                      </div>
                      <div className="mt-3 space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={`${question.id}-${optionIndex}`} className="grid grid-cols-[72px_minmax(0,1fr)_auto] items-center gap-3">
                            <span className="text-xs font-medium text-slate-400">
                              {language === "tr" ? `Seçenek ${optionIndex + 1}` : `Option ${optionIndex + 1}`}
                            </span>
                            <input
                              value={option}
                              onChange={(event) => updateQuestion(question.id, (item) => ({
                                ...item,
                                options: item.options.map((entry, entryIndex) => entryIndex === optionIndex ? event.target.value : entry),
                              }))}
                              className="min-w-0 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                              placeholder={`${t.announcements.optionPlaceholder} ${optionIndex + 1}`}
                            />
                            {optionIndex > 0 ? (
                              <button
                                type="button"
                                onClick={() => updateQuestion(question.id, (item) => ({
                                  ...item,
                                  options: item.options.filter((_, entryIndex) => entryIndex !== optionIndex),
                                }))}
                                className={getActionButtonClass("danger", "px-3 py-2 text-xs whitespace-nowrap")}
                              >
                                {t.announcements.removeOption}
                              </button>
                            ) : (
                              <div className="w-[92px]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <SectionTitle title={t.announcements.formPreview} description="" />
              <div className="mt-4 space-y-4">
                {formQuestions.map((question) => (
                  <div key={`${question.id}-preview`} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <p className="text-sm font-medium text-slate-900">{question.title || t.announcements.questionPlaceholder}</p>
                    {question.type === "open-ended" ? (
                      <div className="mt-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">
                        {t.announcements.openEnded}
                      </div>
                    ) : (
                      <div className="mt-3 space-y-2">
                        {question.options.filter(Boolean).length ? question.options.filter(Boolean).map((option, optionIndex) => (
                          <div key={`${question.id}-preview-${optionIndex}`} className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
                            <span className="h-4 w-4 rounded-full border border-slate-300 bg-white" />
                            {option}
                          </div>
                        )) : (
                          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400">
                            {t.announcements.addOption}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className={getActionButtonClass("primary")}
                >
                  {t.announcements.submit}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={openFormBuilder}
          className={getActionButtonClass("secondary")}
        >
          {t.announcements.addForm}
        </button>
        <button
          type="button"
          className={getActionButtonClass("primary")}
        >
          {t.announcements.save}
        </button>
      </div>
    </div>
  );
}

function AnnouncementEditPage({ slug, language }: { role: Role; slug: string; language: Lang }) {
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
      <div className="space-y-4">
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
          className={getActionButtonClass("primary")}
        >
          {t.announcements.save}
        </button>
        <button
          type="button"
          className={getActionButtonClass("danger")}
        >
          {t.announcements.delete}
        </button>
      </div>
    </div>
  );
}

function AnnouncementRequestPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const [team, setTeam] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const teamOptions = getTeamOptions(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <>
          <input
            list="announcement-team-options"
            value={team}
            onChange={(event) => setTeam(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder={t.announcements.teamName}
          />
          <datalist id="announcement-team-options">
            {teamOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.announcementTitle}
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          className="h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.announcements.announcementContent}
        />
        <ButtonLink href={withRole("/announcements", role)}>{t.announcements.sendToAdmin}</ButtonLink>
      </div>
    </div>
  );
}

function BlogPage({
  role,
  language,
  category,
  requestView,
  followedCategories,
  onToggleFollow,
}: {
  role: Role;
  language: Lang;
  category?: BlogCategory;
  requestView?: boolean;
  followedCategories: BlogCategory[];
  onToggleFollow: (category: BlogCategory) => void;
}) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const postItems = getPosts(language);
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishTopic, setPublishTopic] = useState("");
  const [publishSummary, setPublishSummary] = useState("");
  const [publishContent, setPublishContent] = useState("");
  const blogSpaces: Array<{ id: BlogCategory; title: string; description: string }> = [
    { id: "main", title: t.blog.mainBlog, description: t.blog.mainBlogDesc },
    { id: "sports", title: t.blog.sportsBlog, description: t.blog.sportsBlogDesc },
    { id: "foodie", title: t.blog.foodieBlog, description: t.blog.foodieBlogDesc },
    { id: "art", title: t.blog.artBlog, description: t.blog.artBlogDesc },
  ];
  const selectedSpace = blogSpaces.find((item) => item.id === category);
  const filteredPosts = category ? postItems.filter((post) => post.category === category) : postItems;
  const isFollowing = category ? followedCategories.includes(category) : false;
  const blogRequests = language === "tr"
    ? [
        { topic: "Aile ve Ebeveynlik Blogu", owner: "Ece T." },
        { topic: "Seyahat Blogu", owner: "Bora N." },
      ]
    : [
        { topic: "Family & Parenting Blog", owner: "Ece T." },
        { topic: "Travel Blog", owner: "Bora N." },
      ];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {requestView || category ? (
            <SectionTitle
              title={requestView ? (isAdmin ? t.blog.reviewRequests : t.blog.requestBlog) : selectedSpace?.title}
              description={requestView ? t.blog.requestBlogDesc : selectedSpace?.description}
            />
          ) : <div />}
          <div className="flex flex-wrap gap-3">
            {category ? (
              <>
                <button
                  type="button"
                  onClick={() => onToggleFollow(category)}
                  className={getActionButtonClass(isFollowing ? "secondary" : "primary")}
                >
                  {isFollowing ? t.blog.followingBlog : t.blog.followBlog}
                </button>
                <button
                  type="button"
                  onClick={() => setPublishOpen(true)}
                  className={getActionButtonClass("primary")}
                >
                  {t.blog.publish}
                </button>
              </>
            ) : null}
            {!requestView && !category ? (
              <ButtonLink href={withRoleAndFrom(`/blog?request=true`, role, "/blog")}>
                {isAdmin ? t.blog.reviewRequests : t.blog.requestBlog}
              </ButtonLink>
            ) : null}
          </div>
        </div>

        {requestView ? (
          isAdmin ? (
            <div className="mt-6 space-y-3">
              {blogRequests.map((request) => (
                <div key={request.topic} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-medium text-slate-950">{request.topic}</h3>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{t.blog.pendingReview}</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{t.blog.requestedBy}: {request.owner}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none" placeholder={t.blog.requestOwner} />
              <input className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none" placeholder={t.blog.requestTopic} />
              <textarea className="h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none" placeholder={t.blog.requestReason} />
              <button type="button" className={getActionButtonClass("primary")}>{t.blog.sendRequest}</button>
            </div>
          )
        ) : category ? (
          <div className="mt-6 space-y-4">
            {filteredPosts.map((post) => (
              <Link
                key={post.slug}
                href={withRoleAndFrom(`/blog/${post.slug}`, role, `/blog?category=${category}`)}
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
                </div>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
                  <ArrowRightIcon className="h-5 w-5" />
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {blogSpaces.map((space) => {
              const count = postItems.filter((post) => post.category === space.id).length;

              return (
                <Link
                  key={space.id}
                  href={withRole(`/blog?category=${space.id}`, role)}
                  className="group relative rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition hover:bg-sky-50 hover:ring-sky-200"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-950 group-hover:text-sky-900">{space.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{space.description}</p>
                    </div>
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">{count}</span>
                  </div>
                  <span className="mt-5 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
                    <ArrowRightIcon className="h-5 w-5" />
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {publishOpen && category && selectedSpace ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/30 p-4 backdrop-blur-sm">
          <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <SectionTitle title={t.blog.publish} description="" />
            <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600 ring-1 ring-slate-200">
              <span className="font-medium text-slate-900">{t.blog.publishIn}:</span> {selectedSpace.title}
            </div>
            <div className="mt-4 space-y-4">
              <input
                value={publishTopic}
                onChange={(event) => setPublishTopic(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.publish.topic}
              />
              <input
                value={publishSummary}
                onChange={(event) => setPublishSummary(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.publish.summary}
              />
              <textarea
                value={publishContent}
                onChange={(event) => setPublishContent(event.target.value)}
                className="h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.publish.content}
              />
            </div>
            <div className="mt-5 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPublishOpen(false)}
                className={getActionButtonClass("secondary")}
              >
                {t.blog.cancel}
              </button>
              <button
                type="button"
                onClick={() => {
                  setPublishOpen(false);
                  setPublishTopic("");
                  setPublishSummary("");
                  setPublishContent("");
                }}
                className={getActionButtonClass("primary")}
              >
                {t.publish.sendForReview}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function BlogPostPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const initialPost = getPostBySlug(slug, language);
  const [post, setPost] = useState(initialPost);
  const [liked, setLiked] = useState(false);
  const [isArchived, setIsArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [likes, setLikes] = useState(initialPost?.likes ?? 0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(initialPost?.comments ?? []);
  const currentUserName = role === "admin" ? getText(language).myPage.adminName : getText(language).myPage.employeeName;
  const isOwner = post?.author === currentUserName;

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
          {role === "admin" || isOwner ? (
            <div className="flex flex-wrap gap-3">
              {role === "admin" ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsArchived(true)}
                    className={getActionButtonClass("warning")}
                  >
                    {isArchived ? t.common.archived : t.common.archive}
                  </button>
                  <button
                    type="button"
                    className={getActionButtonClass("danger")}
                  >
                    {t.blog.delete}
                  </button>
                </>
              ) : null}
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => setIsEditing((current) => !current)}
                  className={getActionButtonClass("secondary")}
                >
                  {t.blog.edit}
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-semibold text-sky-800">{post.title}</h2>
          {isArchived ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{t.common.archived}</span> : null}
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-slate-500">
          <span>{t.blog.sharedBy} {post.author}</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span className="inline-flex items-center gap-1.5">
            <ClockIcon className="h-3.5 w-3.5" />
            {post.publishedAt}
          </span>
        </div>

        {isEditing ? (
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="space-y-3">
              <input
                value={post.title}
                onChange={(event) => setPost((current) => (current ? { ...current, title: event.target.value } : current))}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.publish.topic}
              />
              <textarea
                value={post.body.join("\n\n")}
                onChange={(event) => setPost((current) => (current ? { ...current, body: event.target.value.split("\n\n").filter(Boolean) } : current))}
                className="h-40 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.publish.content}
              />
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={getActionButtonClass("primary")}
                >
                  {t.blog.save}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={getActionButtonClass("secondary")}
                >
                  {t.blog.cancel}
                </button>
              </div>
            </div>
          </div>
        ) : null}

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
            className={getActionButtonClass("primary", "w-full")}
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

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function formatCourseDate(date: Date, language: Lang) {
  return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getCourseItems(language: Lang): CourseItem[] {
  const newHireStartDate = new Date("2026-06-09T09:00:00");
  const firstMonthDueDate = formatCourseDate(addDays(newHireStartDate, 30), language);
  const securityDueDate = formatCourseDate(new Date("2026-07-15T09:00:00"), language);

  return language === "tr"
    ? [
        {
          id: "welcome-to-token",
          title: "Token'a Hoş Geldin",
          description: "Şirket kültürü, temel araçlar ve ilk hafta beklentileri için başlangıç kursu.",
          mandatory: true,
          dueDate: firstMonthDueDate,
          audience: "Yeni Çalışanlar",
        },
        {
          id: "security-basics",
          title: "Bilgi Güvenliği Temelleri",
          description: "Şifre hijyeni, cihaz güvenliği ve şirket verilerinin korunmasına dair temel eğitim.",
          mandatory: true,
          dueDate: securityDueDate,
          audience: "Tüm Çalışanlar",
        },
        {
          id: "expense-purchasing",
          title: "Masraf Ve Satın Alma Akışı",
          description: "Masraf gönderimi, fiş yükleme ve satın alma süreçlerinde izlenecek adımlar.",
          mandatory: true,
          dueDate: firstMonthDueDate,
          audience: "Yeni Çalışanlar",
        },
        {
          id: "wellbeing-social",
          title: "İyi Yaşam ve Social Hub Tanıtımı",
          description: "Yan haklar, kulüpler ve çalışan deneyimini destekleyen sosyal alanların kısa tanıtımı.",
          mandatory: false,
          dueDate: undefined,
          audience: "Tüm Çalışanlar",
        },
      ]
    : [
        {
          id: "welcome-to-token",
          title: "Welcome To Token",
          description: "Starter course for company culture, core tools, and first-week expectations.",
          mandatory: true,
          dueDate: firstMonthDueDate,
          audience: "New Hires",
        },
        {
          id: "security-basics",
          title: "Information Security Basics",
          description: "Core training on password hygiene, device safety, and protecting company data.",
          mandatory: true,
          dueDate: securityDueDate,
          audience: "All Employees",
        },
        {
          id: "expense-purchasing",
          title: "Expense And Purchasing Flow",
          description: "How to submit expenses, upload receipts, and follow purchasing workflows.",
          mandatory: true,
          dueDate: firstMonthDueDate,
          audience: "New Hires",
        },
        {
          id: "wellbeing-social",
          title: "Wellbeing And Social Hub Introduction",
          description: "A short introduction to benefits, clubs, and social spaces that support employee experience.",
          mandatory: false,
          dueDate: undefined,
          audience: "All Employees",
        },
      ];
}

function DocumentsPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const pathname = usePathname();
  const documentItems = getDocuments(language);
  const isAdmin = role === "admin";
  const [documentSearch, setDocumentSearch] = useState("");
  const filteredDocuments = documentItems.filter((document) => `${document.name} ${document.description}`.toLowerCase().includes(documentSearch.trim().toLowerCase()));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {isAdmin ? (
          <>
            <ButtonLink href={withRoleAndFrom("/documents/create", role, pathname)}>{t.documents.addDocument}</ButtonLink>
            <ButtonLink href={withRoleAndFrom("/documents/assign", role, pathname)} variant="outline">{t.documents.assignDocument}</ButtonLink>
          </>
        ) : (
          <ButtonLink href={withRoleAndFrom("/documents/request", role, pathname)} variant="outline">{t.documents.requestDocument}</ButtonLink>
        )}
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <SearchIcon className="h-4 w-4 text-slate-400" />
        <input
          value={documentSearch}
          onChange={(event) => setDocumentSearch(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder={t.documents.search}
        />
      </div>

      <div className="mt-6 space-y-4">
        {filteredDocuments.length ? filteredDocuments.map((document) => (
          <Link
            key={document.slug}
            href={withRoleAndFrom(document.href, role, pathname)}
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
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            {t.documents.notFound}
          </div>
        )}
      </div>
    </div>
  );
}

function DocumentCreatePage({ language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const audienceOptions = [language === "tr" ? "Tüm Çalışanlar" : "All Employees", language === "tr" ? "Yeni Çalışanlar" : "New Hires", ...getTeamOptions(language)];
  const [form, setForm] = useState({ title: "", description: "", audience: "", link: "" });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.documents.documentTitle}
        />
        <input
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.documents.addDocumentDescription}
        />
        <>
          <input
            list="document-page-audience-options"
            value={form.audience}
            onChange={(event) => setForm((current) => ({ ...current, audience: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder={t.documents.addDocumentAudience}
          />
          <datalist id="document-page-audience-options">
            {audienceOptions.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </>
        <input
          value={form.link}
          onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.documents.addDocumentLink}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className={getActionButtonClass("secondary")}>{t.documents.cancel}</button>
        <button type="button" className={getActionButtonClass("primary")}>{t.documents.save}</button>
      </div>
    </div>
  );
}

function DocumentAssignPage({ language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const documentItems = getDocuments(language);
  const employeeDirectory = getEmployeeDirectory(language);
  const [form, setForm] = useState({ employeeName: "", employeeEmail: "", documentTitle: documentItems[0]?.name ?? "", note: "" });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <>
          <input
            list="document-page-employee-options"
            value={form.employeeName}
            onChange={(event) => {
              const employeeName = event.target.value;
              const selectedEmployee = employeeDirectory.find((item) => item.name === employeeName);
              setForm((current) => ({ ...current, employeeName, employeeEmail: selectedEmployee?.email ?? "" }));
            }}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder={t.documents.employeeName}
          />
          <datalist id="document-page-employee-options">
            {employeeDirectory.map((employee) => (
              <option key={employee.email} value={employee.name} />
            ))}
          </datalist>
        </>
        <input
          value={form.employeeEmail}
          onChange={(event) => setForm((current) => ({ ...current, employeeEmail: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.documents.employeeEmail}
        />
        <>
          <input
            list="document-page-document-options"
            value={form.documentTitle}
            onChange={(event) => setForm((current) => ({ ...current, documentTitle: event.target.value }))}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder={t.documents.documentTitle}
          />
          <datalist id="document-page-document-options">
            {documentItems.map((document) => (
              <option key={document.slug} value={document.name} />
            ))}
          </datalist>
        </>
        <textarea
          value={form.note}
          onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
          className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.documents.assignNote}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className={getActionButtonClass("secondary")}>{t.documents.cancel}</button>
        <button type="button" className={getActionButtonClass("primary")}>{t.documents.save}</button>
      </div>
    </div>
  );
}

function DocumentRequestPage({ language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const [requestText, setRequestText] = useState("");

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <textarea
        value={requestText}
        onChange={(event) => setRequestText(event.target.value)}
        className="mt-6 h-40 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
        placeholder={t.documents.requestDocumentPlaceholder}
      />
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className={getActionButtonClass("secondary")}>{t.documents.cancel}</button>
        <button type="button" className={getActionButtonClass("primary")}>{t.documents.sendRequest}</button>
      </div>
    </div>
  );
}

function getBenefitCampaigns(language: Lang) {
  return language === "tr"
    ? [
        {
          slug: "boyner",
          title: "Boyner Çalışan Kampanyası",
          description: "Seçili sezon ürünlerinde çalışanlara özel indirim fırsatları.",
          href: "https://www.boyner.com.tr",
          expiresAt: "30 Temmuz 2026",
        },
        {
          slug: "pegasus",
          title: "Pegasus Seyahat Fırsatları",
          description: "Yurt içi ve yurt dışı seyahat planları için dönemsel kampanyalar.",
          href: "https://www.flypgs.com",
          expiresAt: "12 Ağustos 2026",
        },
        {
          slug: "getiryemek",
          title: "GetirYemek Öğle Yemeği İndirimi",
          description: "Ofis günlerinde kullanılabilecek seçili restoran kampanyaları.",
          href: "https://getiryemek.com",
          expiresAt: "5 Ağustos 2026",
        },
        {
          slug: "dr",
          title: "D&R Kültür ve Hobi Avantajları",
          description: "Kitap, kırtasiye ve hobi ürünlerinde çalışanlara yönelik fırsatlar.",
          href: "https://www.dr.com.tr",
          expiresAt: "18 Ağustos 2026",
        },
      ]
    : [
        {
          slug: "boyner",
          title: "Boyner Employee Campaign",
          description: "Special employee discounts on selected seasonal products.",
          href: "https://www.boyner.com.tr",
          expiresAt: "July 30, 2026",
        },
        {
          slug: "pegasus",
          title: "Pegasus Travel Deals",
          description: "Seasonal travel campaigns for domestic and international trips.",
          href: "https://www.flypgs.com",
          expiresAt: "August 12, 2026",
        },
        {
          slug: "getiryemek",
          title: "GetirYemek Lunch Discount",
          description: "Selected restaurant offers that can be used on office days.",
          href: "https://getiryemek.com",
          expiresAt: "August 5, 2026",
        },
        {
          slug: "dr",
          title: "D&R Culture And Hobby Offers",
          description: "Employee-facing offers for books, stationery, and hobby products.",
          href: "https://www.dr.com.tr",
          expiresAt: "August 18, 2026",
        },
      ];
}

function ProfilesPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const pathname = usePathname();
  const [employeeSearch, setEmployeeSearch] = useState("");
  const employees = getEmployeeDirectory(language).filter((employee) => `${employee.name} ${employee.email} ${employee.team} ${employee.role}`.toLowerCase().includes(employeeSearch.trim().toLowerCase()));

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-end gap-3">
        <ButtonLink href={withRoleAndFrom("/profiles/create", role, pathname)}>{t.dashboard.createProfile}</ButtonLink>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500">
        <SearchIcon className="h-4 w-4 text-slate-400" />
        <input
          value={employeeSearch}
          onChange={(event) => setEmployeeSearch(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400"
          placeholder={t.common.search}
        />
      </div>

      <div className="mt-6 space-y-4">
        {employees.length ? employees.map((employee) => (
          <div key={employee.email} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="font-medium text-slate-950">{employee.name}</p>
                  <ButtonLink href={withRoleAndFrom(`/profiles/create?employee=${encodeURIComponent(employee.email)}`, role, "/profiles")} variant="outline" className="px-3 py-2 text-xs">
                    {t.profileCreate.editProfile}
                  </ButtonLink>
                </div>
                <p className="mt-2 text-sm text-slate-500">{employee.role} · {employee.team}</p>
                <p className="mt-1 text-sm text-slate-500">{employee.email}</p>
              </div>
            </div>
          </div>
        )) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            {t.profileCreate.noResults}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCreatePage({ language }: { role: Role; language: Lang }) {
  const searchParams = useSearchParams();
  const selectedEmployeeEmail = searchParams.get("employee") ?? undefined;
  const selectedEmployee = getEmployeeDirectory(language).find((employee) => employee.email === selectedEmployeeEmail);

  return <ProfileCreateForm key={selectedEmployeeEmail ?? "new"} language={language} selectedEmployee={selectedEmployee} />;
}

function ProfileCreateForm({ language, selectedEmployee }: { language: Lang; selectedEmployee?: DirectoryEmployee }) {
  const t = getText(language);
  const [name, setName] = useState(selectedEmployee?.name ?? "");
  const [email, setEmail] = useState(selectedEmployee?.email ?? "");
  const [employeeRole, setEmployeeRole] = useState(selectedEmployee?.role ?? "");
  const [team, setTeam] = useState(selectedEmployee?.team ?? "");
  const [buddy, setBuddy] = useState("");
  const [startDate, setStartDate] = useState(selectedEmployee ? "2026-06-10" : "");
  const roleOptions = getRoleOptions(language);
  const teamOptions = getTeamOptions(language);
  const buddyOptions = getEmployeeDirectory(language).map((employee) => employee.name);
  const [uploadType, setUploadType] = useState("profile-photo");
  const [uploadName, setUploadName] = useState("");
  const [editingUploadId, setEditingUploadId] = useState<string | null>(null);
  const [uploads, setUploads] = useState<Array<{ id: string; type: string; name: string }>>([]);

  const uploadTypeOptions = [
    { id: "profile-photo", label: t.profileCreate.profilePhoto },
    { id: "contract", label: t.profileCreate.contract },
    { id: "id-copy", label: t.profileCreate.idCopy },
    { id: "emergency-form", label: t.profileCreate.emergencyForm },
  ];

  const resetUploadEditor = () => {
    setUploadType("profile-photo");
    setUploadName("");
    setEditingUploadId(null);
  };

  const saveUpload = () => {
    const trimmedName = uploadName.trim();
    if (!trimmedName) return;

    if (editingUploadId) {
      setUploads((current) => current.map((item) => item.id === editingUploadId ? { ...item, type: uploadType, name: trimmedName } : item));
    } else {
      setUploads((current) => [...current, { id: `${Date.now()}-${current.length}`, type: uploadType, name: trimmedName }]);
    }

    resetUploadEditor();
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
        <div className="space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder={t.profileCreate.employeeName}
          />
          <input
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
            placeholder={t.profileCreate.employeeEmail}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <>
              <input
                list="role-options"
                value={employeeRole}
                onChange={(event) => setEmployeeRole(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.profileCreate.employeeRole}
              />
              <datalist id="role-options">
                {roleOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </>
            <>
              <input
                list="team-options"
                value={team}
                onChange={(event) => setTeam(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.profileCreate.selectTeam}
              />
              <datalist id="team-options">
                {teamOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <>
              <input
                list="buddy-options"
                value={buddy}
                onChange={(event) => setBuddy(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.profileCreate.selectBuddy}
              />
              <datalist id="buddy-options">
                {buddyOptions.map((option) => (
                  <option key={option} value={option} />
                ))}
              </datalist>
            </>
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
              aria-label={t.profileCreate.startDate}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
            <SectionTitle title={t.profileCreate.uploads} description="" />
            <div className="mt-4 grid gap-3 md:grid-cols-[180px_minmax(0,1fr)]">
              <select
                value={uploadType}
                onChange={(event) => setUploadType(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              >
                {uploadTypeOptions.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
              <input
                value={uploadName}
                onChange={(event) => setUploadName(event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
                placeholder={t.profileCreate.uploadNamePlaceholder}
              />
            </div>
            <div className="mt-3 flex flex-wrap gap-3">
              <button type="button" onClick={saveUpload} className={getActionButtonClass("primary")}>
                {editingUploadId ? t.profileCreate.updateUpload : t.profileCreate.addUpload}
              </button>
              {editingUploadId ? (
                <button type="button" onClick={resetUploadEditor} className={getActionButtonClass("secondary")}>
                  {t.documents.cancel}
                </button>
              ) : null}
            </div>

            <div className="mt-5 space-y-3">
              <p className="text-sm font-medium text-slate-900">{t.profileCreate.uploadedItems}</p>
              {uploads.length ? uploads.map((item) => {
                const typeLabel = uploadTypeOptions.find((option) => option.id === item.type)?.label ?? item.type;
                return (
                  <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-4 ring-1 ring-slate-200">
                    <div className="min-w-0">
                      <p className="font-medium text-slate-950">{typeLabel}</p>
                      <p className="mt-1 text-sm text-slate-500">{item.name}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setUploadType(item.type);
                          setUploadName(item.name);
                          setEditingUploadId(item.id);
                        }}
                        className={getActionButtonClass("secondary", "px-3 py-2 text-xs")}
                      >
                        {t.profileCreate.editUpload}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setUploads((current) => current.filter((entry) => entry.id !== item.id));
                          if (editingUploadId === item.id) {
                            resetUploadEditor();
                          }
                        }}
                        className={getActionButtonClass("danger", "px-3 py-2 text-xs")}
                      >
                        {t.profileCreate.deleteUpload}
                      </button>
                    </div>
                  </div>
                );
              }) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-5 text-sm text-slate-500">
                  {t.profileCreate.noUploads}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button type="button" className={getActionButtonClass("primary")}>
          {selectedEmployee ? t.profileCreate.update : t.profileCreate.save}
        </button>
      </div>
    </div>
  );
}

function BenefitsPage({ role, language, slug }: { role: Role; language: Lang; slug?: string }) {
  const t = getText(language);
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const campaigns = getBenefitCampaigns(language);

  if (slug) {
    const campaign = campaigns.find((item) => item.slug === slug);

    if (!campaign) {
      return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle title={t.documents.notFound} description="" />
        </div>
      );
    }

    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-start gap-4">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
            <BrandIcon className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold text-sky-800">{campaign.title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{campaign.description}</p>
            <p className="mt-3 text-sm text-slate-500">{t.benefits.expires}: {campaign.expiresAt}</p>
          </div>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <p className="text-sm font-medium text-slate-900">{t.benefits.brandWebsite}</p>
          <a
            href={campaign.href}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-sky-700 hover:text-sky-800"
          >
            {campaign.href.replace(/^https?:\/\//, "").replace(/\/$/, "")}
            <ArrowRightIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-end gap-3">
        {isAdmin ? (
          <ButtonLink href={withRoleAndFrom("/benefits/create", role, pathname)}>{t.benefits.addBenefit}</ButtonLink>
        ) : null}
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {campaigns.map((campaign) => (
          <Link
            key={campaign.slug}
            href={withRoleAndFrom(`/benefits/${campaign.slug}`, role, pathname)}
            className="group rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition hover:bg-sky-50 hover:ring-sky-200"
          >
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                <BrandIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-semibold text-slate-950 group-hover:text-sky-900">{campaign.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">{campaign.description}</p>
                <p className="mt-3 text-sm text-slate-500">{t.benefits.expires}: {campaign.expiresAt}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-sky-700 group-hover:text-sky-800">
                  {t.benefits.openCampaign}
                  <ArrowRightIcon className="h-4 w-4" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BenefitCreatePage({ language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const [form, setForm] = useState({ partner: "", title: "", description: "", link: "" });

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="space-y-4">
        <input
          value={form.partner}
          onChange={(event) => setForm((current) => ({ ...current, partner: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.benefits.partnerName}
        />
        <input
          value={form.title}
          onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.benefits.campaignTitle}
        />
        <textarea
          value={form.description}
          onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
          className="h-32 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.benefits.campaignDescription}
        />
        <input
          value={form.link}
          onChange={(event) => setForm((current) => ({ ...current, link: event.target.value }))}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none"
          placeholder={t.benefits.campaignLink}
        />
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button type="button" className={getActionButtonClass("secondary")}>{t.documents.cancel}</button>
        <button type="button" className={getActionButtonClass("primary")}>{t.documents.save}</button>
      </div>
    </div>
  );
}

function CoursesPage({ role, language, slug }: { role: Role; language: Lang; slug?: string }) {
  if (slug) {
    return <CourseDetailPage role={role} language={language} slug={slug} />;
  }

  return <CoursesContent key={language} role={role} language={language} />;
}

function CoursesContent({ role, language }: { role: Role; language: Lang }) {
  const router = useRouter();
  const isAdmin = role === "admin";
  const t = getText(language);
  const [courses, setCourses] = useState(getCourseItems(language));
  const [editor, setEditor] = useState<null | {
    id?: string;
    title: string;
    description: string;
    dueDate: string;
    mandatory: boolean;
  }>(null);

  const saveCourse = () => {
    if (!editor) return;

    const nextCourse = {
      id: editor.id ?? `course-${Date.now()}`,
      title: editor.title,
      description: editor.description,
      dueDate: editor.dueDate,
      mandatory: editor.mandatory,
      audience: editor.mandatory ? t.courses.newHire : language === "tr" ? "Tüm Çalışanlar" : "All Employees",
    };

    setCourses((current) =>
      editor.id ? current.map((course) => (course.id === editor.id ? nextCourse : course)) : [nextCourse, ...current],
    );
    setEditor(null);
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-end gap-4">
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setEditor({ title: "", description: "", dueDate: "", mandatory: true })}
            className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 shadow-sm"
          >
            {t.courses.add}
          </button>
        ) : null}
      </div>

      {isAdmin && editor ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="space-y-3">
            <input
              value={editor.title}
              onChange={(event) => setEditor((current) => (current ? { ...current, title: event.target.value } : current))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.courses.courseTitle}
            />
            <textarea
              value={editor.description}
              onChange={(event) => setEditor((current) => (current ? { ...current, description: event.target.value } : current))}
              className="h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.courses.courseDescription}
            />
            <input
              value={editor.dueDate}
              onChange={(event) => setEditor((current) => (current ? { ...current, dueDate: event.target.value } : current))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.courses.dueDate}
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={editor.mandatory}
                onChange={(event) => setEditor((current) => (current ? { ...current, mandatory: event.target.checked } : current))}
              />
              {t.courses.mandatory}
            </label>
            <div className="flex flex-wrap gap-3">
              <button type="button" onClick={saveCourse} className={getActionButtonClass("primary")}>
                {t.courses.save}
              </button>
              <button type="button" onClick={() => setEditor(null)} className={getActionButtonClass("secondary")}>
                {t.courses.cancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course.id}
            onClick={() => router.push(withRole(`/courses/${course.id}`, role))}
            className="group relative cursor-pointer rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200 transition hover:bg-sky-50/70 hover:ring-sky-200"
          >
            <div className="flex items-start justify-between gap-3 pr-14">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white text-sky-700 ring-1 ring-sky-100">
                <CourseIcon className="h-4 w-4" />
              </span>
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${course.mandatory ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-700"}`}>
                  {course.mandatory ? t.courses.mandatory : t.courses.optional}
                </span>
              </div>
            </div>
            <h3 className="mt-3 pr-14 font-medium text-slate-950">{course.title}</h3>
            <p className="mt-2 pr-14 text-sm leading-6 text-slate-500">{course.description}</p>
            <div className="mt-4 space-y-1 pr-14 text-xs text-slate-500">
              {course.dueDate ? <p><span className="font-medium text-slate-700">{t.courses.due}:</span> {course.dueDate}</p> : null}
              <p><span className="font-medium text-slate-700">{t.courses.audience}:</span> {course.audience}</p>
            </div>
            <span className="absolute bottom-4 right-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
              <ArrowRightIcon className="h-5 w-5" />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CourseDetailPage({ role, language, slug }: { role: Role; language: Lang; slug: string }) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const initialCourse = getCourseItems(language).find((item) => item.id === slug);
  const [course, setCourse] = useState(initialCourse);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const [isArchived, setIsArchived] = useState(false);

  if (!course || isDeleted) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.courses.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">

        {isAdmin ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsArchived(true)}
              className={getActionButtonClass("warning")}
            >
              {isArchived ? t.common.archived : t.common.archive}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className={getActionButtonClass("secondary")}
            >
              {t.courses.edit}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <CourseIcon className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-sky-800">{course.title}</h2>
            <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${course.mandatory ? "bg-rose-100 text-rose-700" : "bg-slate-200 text-slate-700"}`}>
              {course.mandatory ? t.courses.mandatory : t.courses.optional}
            </span>
            {isArchived ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{t.common.archived}</span> : null}
          </div>
          {course.dueDate ? (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
              <ClockIcon className="h-3.5 w-3.5" />
              {t.courses.due}: {course.dueDate}
            </div>
          ) : null}
        </div>
      </div>

      {isEditing ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="space-y-3">
            <input
              value={course.title}
              onChange={(event) => setCourse((current) => (current ? { ...current, title: event.target.value } : current))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.courses.courseTitle}
            />
            <textarea
              value={course.description}
              onChange={(event) => setCourse((current) => (current ? { ...current, description: event.target.value } : current))}
              className="h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.courses.courseDescription}
            />
            <input
              value={course.dueDate ?? ""}
              onChange={(event) => setCourse((current) => (current ? { ...current, dueDate: event.target.value || undefined } : current))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.courses.dueDate}
            />
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={course.mandatory}
                onChange={(event) => setCourse((current) => (current ? { ...current, mandatory: event.target.checked, dueDate: event.target.checked ? current.dueDate : undefined } : current))}
              />
              {t.courses.mandatory}
            </label>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={getActionButtonClass("primary")}
              >
                {t.courses.save}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleted(true)}
                className={getActionButtonClass("danger")}
              >
                {t.courses.delete}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={getActionButtonClass("secondary")}
              >
                {t.courses.cancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-sm leading-6 text-slate-600">{course.description}</p>
      <div className="mt-3 text-sm text-slate-500">
        <span className="font-medium text-slate-700">{t.courses.audience}:</span> {course.audience}
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
        <SectionTitle title={t.courses.videoPreview} description="" />
        <div className="mt-4 flex h-64 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-medium !text-white shadow-sm"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10">▶</span>
            {t.courses.play}
          </button>
        </div>
      </div>
    </div>
  );
}

function DocumentDetailPage({ role, slug, language }: { role: Role; slug: string; language: Lang }) {
  const t = getText(language);
  const initialDocument = getDocumentBySlug(slug, language);
  const [document, setDocument] = useState(initialDocument);
  const [isArchived, setIsArchived] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);
  const downloadHref = document
    ? `data:text/plain;charset=utf-8,${encodeURIComponent([
        document.name,
        document.updatedAt,
        "",
        document.description,
        "",
        ...document.body,
      ].join("\n\n"))}`
    : "#";

  if (!document || isDeleted) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.documents.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">

        {role === "admin" ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsArchived(true)}
              className={getActionButtonClass("warning")}
            >
              {isArchived ? t.common.archived : t.common.archive}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className={getActionButtonClass("secondary")}
            >
              {t.documents.edit}
            </button>
          </div>
        ) : null}
      </div>

      <div className="mt-6 flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
          <FileIcon className="h-5 w-5" />
        </span>
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-sky-800">{document.name}</h2>
            {isArchived ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{t.common.archived}</span> : null}
          </div>
          <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
            <ClockIcon className="h-3.5 w-3.5" />
            {document.updatedAt}
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="space-y-3">
            <input
              value={document.name}
              onChange={(event) => setDocument((current) => (current ? { ...current, name: event.target.value } : current))}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.documents.documentTitle}
            />
            <textarea
              value={document.description}
              onChange={(event) => setDocument((current) => (current ? { ...current, description: event.target.value } : current))}
              className="h-24 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.documents.documentDescription}
            />
            <textarea
              value={document.body.join("\n\n")}
              onChange={(event) => setDocument((current) => (current ? { ...current, body: event.target.value.split(/\n\n+/).filter(Boolean) } : current))}
              className="h-48 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none"
              placeholder={t.documents.documentContent}
            />
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={getActionButtonClass("primary")}
              >
                {t.documents.save}
              </button>
              <button
                type="button"
                onClick={() => setIsDeleted(true)}
                className={getActionButtonClass("danger")}
              >
                {t.documents.delete}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={getActionButtonClass("secondary")}
              >
                {t.documents.cancel}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <p className="mt-6 text-sm leading-6 text-slate-600">{document.description}</p>

      <div className="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
        <div className="flex justify-end">
          <a
            href={downloadHref}
            download={`${document.slug}.txt`}
            className={getActionButtonClass("primary")}
          >
            {t.documents.download}
          </a>
        </div>

        <div className="mt-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-lg font-semibold text-slate-950">{document.name}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">{document.description}</p>
          </div>
          <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700">
            {document.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MyPage({ role, language, slug }: { role: Role; language: Lang; slug?: string }) {
  if (slug) {
    return <MyPageDetailPage role={role} language={language} slug={slug} />;
  }

  const t = getText(language);
  const isAdmin = role === "admin";
  const name = isAdmin ? t.myPage.adminName : t.myPage.employeeName;
  const email = isAdmin ? t.myPage.adminEmailAddress : t.myPage.employeeEmailAddress;
  const jobTitle = isAdmin ? t.myPage.adminRole : t.myPage.employeeRole;
  const team = isAdmin ? t.myPage.adminTeam : t.myPage.employeeTeam;
  const buddyName = isAdmin ? t.myPage.adminBuddyName : t.myPage.employeeBuddyName;
  const buddyEmail = isAdmin ? t.myPage.adminBuddyEmailAddress : t.myPage.employeeBuddyEmailAddress;
  const buddyPhone = isAdmin ? t.myPage.adminBuddyPhoneNumber : t.myPage.employeeBuddyPhoneNumber;
  const todoItems = isAdmin ? t.myPage.todoItemsAdmin : t.myPage.todoItemsEmployee;
  const birthdays = language === "tr"
    ? [
        { name: "Selin K.", team: "Pazarlama" },
        { name: "Can A.", team: "Ürün" },
        { name: "İrem D.", team: "Finans" },
      ]
    : [
        { name: "Selin K.", team: "Marketing" },
        { name: "Can A.", team: "Product" },
        { name: "İrem D.", team: "Finance" },
      ];

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
          <SectionTitle title={t.myPage.personalInfo} description="" />
          <p className="mt-4 text-lg font-semibold text-slate-950">{name}</p>
          <p className="mt-3 text-sm font-medium text-slate-900">{jobTitle}</p>
          <p className="mt-1 text-sm text-slate-500">{team}</p>
          <p className="mt-3 text-sm text-slate-500">{email}</p>
          <div className="mt-5 border-t border-slate-200 pt-4">
            <p className="text-sm font-medium text-slate-900">{t.myPage.buddy}: {buddyName}</p>
            <p className="mt-1 text-sm text-slate-500">{t.myPage.buddyEmail}: {buddyEmail}</p>
            <p className="mt-1 text-sm text-slate-500">{t.myPage.buddyPhone}: {buddyPhone}</p>
          </div>
        </div>

        <Link
          href={withRoleAndFrom("/my-page/contract", role, "/my-page")}
          className="group relative mt-6 block rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200 transition hover:bg-sky-50/70 hover:ring-sky-200"
        >
          <SectionTitle title={t.myPage.documents} description="" />
          <span className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition group-hover:border-sky-200 group-hover:text-sky-700">
            <ArrowRightIcon className="h-5 w-5" />
          </span>
        </Link>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.myPage.todos} description="" />
        <div className="mt-6 space-y-3">
          {todoItems.map((item: string) => (
            <div key={item} className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              <span className="mt-1 flex h-5 w-5 shrink-0 rounded-full border-2 border-slate-300 bg-white" />
              <p className="text-sm leading-6 text-slate-700">{item}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
        <SectionTitle title={t.blog.todaysBirthdays} description="" />
        <div className="mt-4 flex flex-wrap gap-3">
          {birthdays.map((person) => (
            <div key={person.name} className="flex min-w-[220px] flex-1 items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
                <UsersIcon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="font-medium text-slate-950">{person.name}</p>
                <p className="text-sm text-slate-500">{person.team}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function MyPageDetailPage({ role, language, slug }: { role: Role; language: Lang; slug: string }) {
  const t = getText(language);
  const isAdmin = role === "admin";
  const name = isAdmin ? t.myPage.adminName : t.myPage.employeeName;
  const jobTitle = isAdmin ? t.myPage.adminRole : t.myPage.employeeRole;
  const team = isAdmin ? t.myPage.adminTeam : t.myPage.employeeTeam;

  if (slug !== "contract") {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle title={t.documents.notFound} description="" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mt-6 rounded-3xl bg-slate-50 p-5 ring-1 ring-slate-200">
        <div className="flex items-center gap-4 rounded-2xl bg-white p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-sky-700 ring-1 ring-sky-100">
            <FileIcon className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-slate-950">{t.myPage.contract}</h3>
            <p className="mt-1 text-sm text-slate-500">{name} · {jobTitle} · {team}</p>
          </div>
        </div>
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
            "Bağlantı sorunu yaşarsanız IT ekibi ile iletişime geçebilir veya Aramıza Hoş Geldin sayfasındaki ilgili bağlantılardan destek isteyebilirsiniz.",
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
                  className={getActionButtonClass("primary")}
                >
                  {t.welcomeOnBoard.save}
                </button>
                <button
                  type="button"
                  onClick={closeEditor}
                  className={getActionButtonClass("secondary")}
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
            "Bağlantı sorunu yaşarsanız IT ekibi ile iletişime geçebilir veya Aramıza Hoş Geldin sayfasındaki ilgili bağlantılardan destek isteyebilirsiniz.",
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
  const [isArchived, setIsArchived] = useState(false);

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

        {isAdmin ? (
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsArchived(true)}
              className={getActionButtonClass("warning")}
            >
              {isArchived ? t.common.archived : t.common.archive}
            </button>
            <button
              type="button"
              onClick={() => setIsEditing((current) => !current)}
              className={getActionButtonClass("secondary")}
            >
              {t.welcomeOnBoard.edit}
            </button>
            <button
              type="button"
              onClick={() => setIsDeleted(true)}
              className={getActionButtonClass("danger")}
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
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold text-sky-800">{item.title}</h2>
            {isArchived ? <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">{t.common.archived}</span> : null}
          </div>
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
                className={getActionButtonClass("primary")}
              >
                {t.welcomeOnBoard.save}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={getActionButtonClass("secondary")}
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
  deleteLabel,
  archiveLabel,
  archivedLabel,
  archived,
  onDelete,
  onArchive,
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
  deleteLabel: string;
  archiveLabel: string;
  archivedLabel: string;
  archived: boolean;
  onDelete: () => void;
  onArchive: () => void;
  open: boolean;
  onToggle: (id: string) => void;
  kind: "benefit" | "club";
}) {
  const iconTone = kind === "benefit"
    ? "bg-sky-50 text-sky-700 ring-sky-100"
    : "bg-emerald-50 text-emerald-700 ring-emerald-100";
  const inlineEdit = isAdmin && kind === "benefit";

  return (
    <div className={isAdmin && !inlineEdit ? "grid grid-cols-[minmax(0,1fr)_72px] items-start gap-3" : "block"}>
      <div className="min-h-[84px] rounded-2xl bg-white p-4 ring-1 ring-slate-200 transition hover:ring-slate-300">
        <div className="flex items-start justify-between gap-3">
          <button
            type="button"
            onClick={() => onToggle(id)}
            className="flex min-w-0 flex-1 items-center gap-4 text-left"
          >
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${iconTone}`}>
            {kind === "benefit" ? <BrandIcon className="h-4 w-4" /> : <UsersIcon className="h-4 w-4" />}
          </span>

          <span className="min-w-0 flex-1 font-medium text-slate-950">{title}</span>

            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition ${open ? "rotate-90 border-sky-200 text-sky-700" : ""}`}>
              <ArrowRightIcon className="h-5 w-5" />
            </span>
          </button>

          {inlineEdit ? (
            <Link
              href={editHref}
              className={getActionButtonClass("secondary", "h-10 px-3 text-xs")}
            >
              {editLabel}
            </Link>
          ) : null}
        </div>
        {open ? (
          <div className="mt-4 pl-[3.75rem]">
            <p className="text-sm leading-6 text-slate-600">{content}</p>
            {isAdmin ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                {!inlineEdit ? (
                  <Link
                    href={editHref}
                    className={getActionButtonClass("secondary", "h-10 px-4")}
                  >
                    {editLabel}
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={onDelete}
                  className={getActionButtonClass("danger", "h-10 px-4")}
                >
                  {deleteLabel}
                </button>
                <button
                  type="button"
                  onClick={onArchive}
                  className={getActionButtonClass(archived ? "warning" : "secondary", "h-10 px-4")}
                >
                  {archived ? archivedLabel : archiveLabel}
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {isAdmin && !inlineEdit ? (
        <Link
          href={editHref}
          className={getActionButtonClass("secondary", "h-10 w-full self-start px-2 text-xs")}
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
  const [archivedItems, setArchivedItems] = useState<string[]>([]);
  const [deletedItems, setDeletedItems] = useState<string[]>([]);

  const toggleOpenItem = (id: string) => setOpenItem((current) => (current === id ? null : id));
  const handleArchiveItem = (id: string) => {
    setArchivedItems((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };
  const handleDeleteItem = (id: string) => {
    setDeletedItems((current) => (current.includes(id) ? current : [...current, id]));
    setOpenItem((current) => (current === id ? null : current));
  };
  const isArchivedItem = (id: string) => archivedItems.includes(id);
  const isDeletedItem = (id: string) => deletedItems.includes(id);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-3xl bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-950">{t.socialHub.benefits}</h3>
            {isAdmin ? (
              <ButtonLink href={withRoleAndFrom("/social-hub/edit?section=benefits", role, "/social-hub")} variant="outline">
                {t.socialHub.updateBenefits}
              </ButtonLink>
            ) : null}
          </div>
          <div className="mt-4 space-y-3">
            {!isDeletedItem("multisport") ? (
              <ExpandableSocialItem
                id="multisport"
                title={t.socialHub.multiSportTitle}
                content={t.socialHub.multiSport}
                editHref={withRoleAndFrom("/social-hub/edit?section=benefits&item=multisport", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("multisport")}
                onDelete={() => handleDeleteItem("multisport")}
                onArchive={() => handleArchiveItem("multisport")}
                open={openItem === "multisport"}
                onToggle={toggleOpenItem}
                kind="benefit"
              />
            ) : null}

            {!isDeletedItem("dietician") ? (
              <ExpandableSocialItem
                id="dietician"
                title={t.socialHub.dieticianTitle}
                content={t.socialHub.dietician}
                editHref={withRoleAndFrom("/social-hub/edit?section=benefits&item=dietician", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("dietician")}
                onDelete={() => handleDeleteItem("dietician")}
                onArchive={() => handleArchiveItem("dietician")}
                open={openItem === "dietician"}
                onToggle={toggleOpenItem}
                kind="benefit"
              />
            ) : null}

            {!isDeletedItem("cambly") ? (
              <ExpandableSocialItem
                id="cambly"
                title={t.socialHub.camblyTitle}
                content={t.socialHub.cambly}
                editHref={withRoleAndFrom("/social-hub/edit?section=benefits&item=cambly", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("cambly")}
                onDelete={() => handleDeleteItem("cambly")}
                onArchive={() => handleArchiveItem("cambly")}
                open={openItem === "cambly"}
                onToggle={toggleOpenItem}
                kind="benefit"
              />
            ) : null}
          </div>
        </section>

        <section className="rounded-3xl bg-slate-50 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-950">{t.socialHub.clubs}</h3>
            {isAdmin ? (
              <ButtonLink href={withRoleAndFrom("/social-hub/edit?section=clubs", role, "/social-hub")} variant="outline">
                {t.socialHub.update}
              </ButtonLink>
            ) : null}
          </div>
          <div className="mt-4 space-y-3">
            {!isDeletedItem("rowing") ? (
              <ExpandableSocialItem
                id="rowing"
                title={t.socialHub.rowingTitle}
                content={t.socialHub.rowing}
                editHref={withRoleAndFrom("/social-hub/edit?section=clubs&item=rowing", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("rowing")}
                onDelete={() => handleDeleteItem("rowing")}
                onArchive={() => handleArchiveItem("rowing")}
                open={openItem === "rowing"}
                onToggle={toggleOpenItem}
                kind="club"
              />
            ) : null}

            {!isDeletedItem("football") ? (
              <ExpandableSocialItem
                id="football"
                title={t.socialHub.footballTitle}
                content={t.socialHub.football}
                editHref={withRoleAndFrom("/social-hub/edit?section=clubs&item=football", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("football")}
                onDelete={() => handleDeleteItem("football")}
                onArchive={() => handleArchiveItem("football")}
                open={openItem === "football"}
                onToggle={toggleOpenItem}
                kind="club"
              />
            ) : null}

            {!isDeletedItem("reading") ? (
              <ExpandableSocialItem
                id="reading"
                title={t.socialHub.readingTitle}
                content={t.socialHub.reading}
                editHref={withRoleAndFrom("/social-hub/edit?section=clubs&item=reading", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("reading")}
                onDelete={() => handleDeleteItem("reading")}
                onArchive={() => handleArchiveItem("reading")}
                open={openItem === "reading"}
                onToggle={toggleOpenItem}
                kind="club"
              />
            ) : null}

            {!isDeletedItem("foodie") ? (
              <ExpandableSocialItem
                id="foodie"
                title={t.socialHub.foodieTitle}
                content={t.socialHub.foodie}
                editHref={withRoleAndFrom("/social-hub/edit?section=clubs&item=foodie", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("foodie")}
                onDelete={() => handleDeleteItem("foodie")}
                onArchive={() => handleArchiveItem("foodie")}
                open={openItem === "foodie"}
                onToggle={toggleOpenItem}
                kind="club"
              />
            ) : null}

            {!isDeletedItem("hali-saha") ? (
              <ExpandableSocialItem
                id="hali-saha"
                title={t.socialHub.haliSahaTitle}
                content={t.socialHub.haliSaha}
                editHref={withRoleAndFrom("/social-hub/edit?section=clubs&item=hali-saha", role, "/social-hub")}
                isAdmin={isAdmin}
                editLabel={t.socialHub.edit}
                deleteLabel={t.common.delete}
                archiveLabel={t.common.archive}
                archivedLabel={t.common.archived}
                archived={isArchivedItem("hali-saha")}
                onDelete={() => handleDeleteItem("hali-saha")}
                onArchive={() => handleArchiveItem("hali-saha")}
                open={openItem === "hali-saha"}
                onToggle={toggleOpenItem}
                kind="club"
              />
            ) : null}
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
      <div className="rounded-2xl bg-slate-50 p-4 text-sm font-medium text-slate-700">
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
          className={getActionButtonClass("primary")}
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
  followedBlogCategories: BlogCategory[],
  onToggleFollowedBlog: (category: BlogCategory) => void,
  selectedPostSlug?: string,
  selectedBlogCategory?: BlogCategory,
  isBlogRequestView?: boolean,
  selectedAnnouncementSlug?: string,
  selectedAnnouncementRequestSlug?: string,
  selectedDocumentSlug?: string,
  selectedBenefitSlug?: string,
  selectedCourseSlug?: string,
  selectedMyPageSlug?: string,
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
        : <BlogPage role={role} language={language} category={selectedBlogCategory} requestView={isBlogRequestView} followedCategories={followedBlogCategories} onToggleFollow={onToggleFollowedBlog} />;
    case "publish":
      return <PublishPage role={role} language={language} />;
    case "documents":
      return selectedDocumentSlug
        ? <DocumentDetailPage role={role} slug={selectedDocumentSlug} language={language} />
        : <DocumentsPage role={role} language={language} />;
    case "document-create":
      return <DocumentCreatePage role={role} language={language} />;
    case "document-assign":
      return <DocumentAssignPage role={role} language={language} />;
    case "document-request":
      return <DocumentRequestPage role={role} language={language} />;
    case "benefits":
      return <BenefitsPage role={role} language={language} slug={selectedBenefitSlug} />;
    case "benefit-create":
      return <BenefitCreatePage role={role} language={language} />;
    case "profiles":
      return <ProfilesPage role={role} language={language} />;
    case "profile-create":
      return <ProfileCreatePage role={role} language={language} />;
    case "my-page":
      return <MyPage role={role} language={language} slug={selectedMyPageSlug} />;
    case "courses":
      return <CoursesPage role={role} language={language} slug={selectedCourseSlug} />;
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
  selectedBlogCategory,
  isBlogRequestView,
  selectedAnnouncementSlug,
  selectedAnnouncementRequestSlug,
  selectedDocumentSlug,
  selectedBenefitSlug,
  selectedCourseSlug,
  selectedMyPageSlug,
  selectedWelcomeOnBoardSlug,
  selectedSocialHubSection,
  selectedSocialHubItem,
}: PortalShellProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [language, setLanguage] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return getLang(window.localStorage.getItem("token-hub-language") ?? undefined);
  });
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [quickAccessSearch, setQuickAccessSearch] = useState("");
  const [followedBlogCategories, setFollowedBlogCategories] = useState<BlogCategory[]>(() => getStoredFollowedBlogs());

  const t = getText(language);
  const followedBlogNotifications = followedBlogCategories.map((category, index) => ({
    type: "publish" as const,
    text: language === "tr"
      ? `${category === "main" ? t.blog.mainBlog : category === "sports" ? t.blog.sportsBlog : category === "foodie" ? t.blog.foodieBlog : t.blog.artBlog} için yeni bir paylaşım yayınlandı.`
      : `A new post was published in ${category === "main" ? t.blog.mainBlog : category === "sports" ? t.blog.sportsBlog : category === "foodie" ? t.blog.foodieBlog : t.blog.artBlog}.`,
    href: `/blog?category=${category}`,
    time: `${8 + index * 6} ${language === "tr" ? "dk" : "min"}`,
  }));
  const notifications = [...followedBlogNotifications, ...getNotifications(language, role)];
  const myPageTodoCount = (role === "admin" ? t.myPage.todoItemsAdmin : t.myPage.todoItemsEmployee).length;
  const toggleFollowedBlog = (category: BlogCategory) => {
    setFollowedBlogCategories((current) => {
      const next = current.includes(category) ? current.filter((item) => item !== category) : [...current, category];
      if (typeof window !== "undefined") {
        window.localStorage.setItem("token-hub-followed-blogs", JSON.stringify(next));
      }
      return next;
    });
  };
  const navLinks = role === "admin"
    ? [
        { label: t.nav.adminDashboard, href: "/" },
        { label: t.nav.myPage, href: "/my-page", badge: myPageTodoCount },
        { label: t.nav.announcements, href: "/announcements" },
        { label: t.nav.blogManagement, href: "/blog" },
        { label: t.nav.documents, href: "/documents" },
        { label: t.nav.benefits, href: "/benefits" },
        { label: t.nav.courses, href: "/courses" },
        { label: t.nav.socialHubSettings, href: "/social-hub" },
        { label: t.nav.welcomeOnBoard, href: "/welcome-on-board" },
      ]
    : [
        { label: t.nav.myPage, href: "/my-page", badge: myPageTodoCount },
        { label: t.nav.announcements, href: "/announcements" },
        { label: t.nav.blog, href: "/blog" },
        { label: t.nav.documents, href: "/documents" },
        { label: t.nav.benefits, href: "/benefits" },
        { label: t.nav.courses, href: "/courses" },
        { label: t.nav.socialHub, href: "/social-hub" },
        { label: t.nav.welcomeOnBoard, href: "/welcome-on-board" },
      ];
  const quickAccessLinks = [
    ...navLinks,
    ...(role === "admin"
      ? [
          { label: t.dashboard.employeeProfiles, href: "/profiles" },
          { label: t.dashboard.createProfile, href: "/profiles/create" },
          { label: t.common.createAnnouncement, href: "/announcements/create" },
          { label: t.documents.addDocument, href: "/documents/create" },
          { label: t.documents.assignDocument, href: "/documents/assign" },
          { label: t.benefits.addBenefit, href: "/benefits/create" },
        ]
      : [
          { label: t.documents.requestDocument, href: "/documents/request" },
          { label: t.blog.requestBlog, href: "/blog?request=true" },
        ]),
  ];
  const navigateFromQuickAccess = () => {
    const normalizedSearch = quickAccessSearch.trim().toLowerCase();
    if (!normalizedSearch) return;
    const match = quickAccessLinks.find((item) => item.label.toLowerCase() === normalizedSearch)
      ?? quickAccessLinks.find((item) => item.label.toLowerCase().includes(normalizedSearch));
    if (!match) return;
    const currentParams = new URLSearchParams(searchParams.toString());
    currentParams.delete("role");
    currentParams.delete("from");
    const currentPath = `${pathname}${currentParams.toString() ? `?${currentParams.toString()}` : ""}`;
    router.push(withRoleAndFrom(match.href, role, currentPath));
    setQuickAccessSearch("");
  };
  const activeSource = searchParams.get("from");
  const activePath = activeSource ? decodeURIComponent(activeSource).split("?")[0] : pathname;
  const pageName = role === "admin" ? t.myPage.adminName : t.myPage.employeeName;
  const firstName = pageName.split(" ")[0];
  const backConfig =
    page === "announcement-request"
      ? { fallbackHref: "/announcements", label: t.announcements.back }
      : page === "announcement-requests"
        ? { fallbackHref: "/announcements", label: t.announcements.back }
        : page === "announcement-create"
          ? { fallbackHref: "/announcements", label: t.announcements.back }
          : page === "announcement-edit" || (page === "announcements" && selectedAnnouncementSlug)
            ? { fallbackHref: "/announcements", label: t.announcements.back }
            : page === "blog" && (selectedPostSlug || selectedBlogCategory || isBlogRequestView)
              ? { fallbackHref: "/blog", label: t.blog.backToPosts }
              : page === "documents" && selectedDocumentSlug
                ? { fallbackHref: "/documents", label: t.announcements.back }
                : page === "document-create"
                  ? { fallbackHref: "/documents", label: t.announcements.back }
                  : page === "document-assign"
                    ? { fallbackHref: "/documents", label: t.announcements.back }
                    : page === "document-request"
                      ? { fallbackHref: "/documents", label: t.announcements.back }
                      : page === "benefits" && selectedBenefitSlug
                        ? { fallbackHref: "/benefits", label: t.announcements.back }
                        : page === "benefit-create"
                          ? { fallbackHref: "/benefits", label: t.announcements.back }
                          : page === "profiles"
                            ? { fallbackHref: "/", label: t.announcements.back }
                            : page === "profile-create"
                              ? { fallbackHref: searchParams.get("from") === "/profiles" ? "/profiles" : "/", label: t.announcements.back }
                            : page === "courses" && selectedCourseSlug
                              ? { fallbackHref: "/courses", label: t.announcements.back }
                              : page === "my-page" && selectedMyPageSlug
                                ? { fallbackHref: "/my-page", label: t.announcements.back }
                                : page === "welcome-on-board" && selectedWelcomeOnBoardSlug
                                  ? { fallbackHref: "/welcome-on-board", label: t.announcements.back }
                                  : page === "social-hub-edit"
                                    ? { fallbackHref: "/social-hub", label: t.announcements.back }
                                    : null;
  const heading =
    page === "dashboard"
      ? {
          title: role === "admin" ? t.common.adminDashboard : t.common.announcements,
          description: "",
        }
      : page === "my-page"
        ? {
            title: selectedMyPageSlug === "contract" ? t.myPage.documents : `${t.myPage.hello} ${firstName},`,
            description: "",
          }
      : page === "profile-create" && searchParams.get("employee")
        ? {
            title: t.profileCreate.editTitle,
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
        <aside className="sticky top-0 hidden h-screen w-72 overflow-y-auto border-r border-slate-200/80 bg-white/88 px-6 py-8 text-slate-900 backdrop-blur-xl lg:flex lg:flex-col">
          <TokenHubLogo />

          <nav className="mt-8 space-y-2">
            {navLinks.map((item) => {
              const active = item.href === "/"
                ? activePath === "/"
                : activePath === item.href || activePath.startsWith(`${item.href}/`);

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
                  <span className="flex-1">{item.label}</span>
                  {item.badge ? (
                    <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${active ? "bg-white/15 text-white" : "bg-sky-100 text-sky-700"}`}>
                      {item.badge}
                    </span>
                  ) : null}
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
                  <form
                    onSubmit={(event) => {
                      event.preventDefault();
                      navigateFromQuickAccess();
                    }}
                    className="flex min-w-[220px] flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-500 shadow-sm lg:max-w-xs"
                  >
                    <SearchIcon className="h-4 w-4 text-slate-400" />
                    <input
                      list="portal-quick-access-options"
                      value={quickAccessSearch}
                      onChange={(event) => setQuickAccessSearch(event.target.value)}
                      className="min-w-0 flex-1 bg-transparent py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                      placeholder={t.common.search}
                    />
                    <datalist id="portal-quick-access-options">
                      {quickAccessLinks.map((item) => (
                        <option key={`${item.href}-${item.label}`} value={item.label} />
                      ))}
                    </datalist>
                  </form>

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

                </div>
              </div>

              <div className="space-y-3 lg:hidden">
                <div className="flex gap-2 overflow-x-auto">
                  {navLinks.map((item) => {
                    const active = item.href === "/"
                      ? activePath === "/"
                      : activePath === item.href || activePath.startsWith(`${item.href}/`);

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
                        {item.badge ? (
                          <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1 text-[11px] font-semibold ${active ? "bg-white/15 text-white" : "bg-sky-100 text-sky-700"}`}>
                            {item.badge}
                          </span>
                        ) : null}
                      </Link>
                    );
                  })}
                </div>
                <RoleToggle pathname={pathname} role={role} language={language} />
              </div>
            </div>
          </header>

          {backConfig ? (
            <div className="px-4 pt-4 sm:px-6 lg:px-8 lg:pt-6">
              <MasterBackButton role={role} fallbackHref={backConfig.fallbackHref} label={backConfig.label} />
            </div>
          ) : null}

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {renderPage(page, role, language, followedBlogCategories, toggleFollowedBlog, selectedPostSlug, selectedBlogCategory, isBlogRequestView, selectedAnnouncementSlug, selectedAnnouncementRequestSlug, selectedDocumentSlug, selectedBenefitSlug, selectedCourseSlug, selectedMyPageSlug, selectedWelcomeOnBoardSlug, selectedSocialHubSection, selectedSocialHubItem)}
          </main>
        </div>
      </div>
    </div>
  );
}
