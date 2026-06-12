"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  getAdminStats,
  getAnnouncementBySlug,
  getAnnouncements,
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

function getText(language: Lang) {
  if (language === "tr") {
    return {
      nav: {
        adminDashboard: "Yönetici paneli",
        announcements: "Duyurular",
        blogManagement: "Blog yönetimi",
        documents: "Dokümanlar",
        formSubmissions: "Form gönderimleri",
        socialHubSettings: "Social Hub ayarları",
        blog: "Blog",
        socialHub: "Social Hub",
      },
      headings: {
        dashboard: { title: "Panel", description: "Güncellemeler, dokümanlar, formlar ve sosyal aktiviteler özeti." },
        announcements: { title: "Duyurular", description: "" },
        announcementRequest: { title: "Duyuru Talebi", description: "" },
        blog: { title: "Blog", description: "" },
        publish: { title: "Yayınla", description: "" },
        documents: { title: "Dokümanlar", description: "" },
        forms: { title: "Formlar", description: "Form gönderimleri ve şirket içi talepler." },
        socialHub: { title: "Social Hub", description: "" },
      },
      dashboard: {
        hero: "Şirket güncellemeleri, HR dokümanları, iç formlar ve sosyal aktiviteler için tek yer.",
        openAnnouncements: "Duyuruları aç",
        openHrHub: "HR Hub'ı aç",
        quickSnapshot: "Hızlı görünüm",
        adminPriorities: "Yönetici öncelikleri",
        todayAtGlance: "Bugünün özeti",
        contentSubmissionsActivity: "İçerik, gönderimler ve hareketlilik",
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
      },
      announcements: {
        teamAnnouncement: "Ekibimizin bir duyurusu var",
        back: "Duyurulara dön",
        notFound: "Duyuru bulunamadı",
        tshirtForm: "Tişört formu",
        employeeEmail: "Çalışan e-postası",
        name: "Ad",
        size: "Beden",
        submit: "Gönder",
        requestTitle: "Bir duyuru talebi paylaş",
        teamName: "Ekip adı",
        announcementTitle: "Duyuru başlığı",
        announcementContent: "Duyuru içeriği",
        sendToAdmin: "Yöneticiye gönder",
      },
      blog: {
        postModeration: "Paylaşım moderasyonu",
        recentPosts: "Son paylaşımlar",
        reviewEmployeePosts: "Çalışan paylaşımlarını yayın öncesi veya sonrası incele.",
        publish: "Yayınla",
        todaysBirthdays: "Bugünün doğum günleri",
        postNotFound: "Paylaşım bulunamadı",
        backToPosts: "Blog'a dön",
        sharedBy: "Paylaşan",
        unlike: "Beğenmekten vazgeç",
        like: "Beğen",
        comments: "Yorumlar",
        writeComment: "Yorum yaz...",
        postComment: "Yorumu gönder",
        you: "Sen",
      },
      publish: {
        eyebrow: "Yayınla",
        title: "Çalışma arkadaşlarınla bir şey paylaş",
        topic: "Konu veya başlık",
        summary: "Kısa özet",
        content: "Paylaşım içeriği",
        sendForReview: "İncelemeye gönder",
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
        openInfo: "Sosyal bilgileri aç",
        manage: "Sosyal aktiviteleri yönet",
        benefits: "Sosyal haklar",
        clubs: "Kulüpler",
        multiSportTitle: "MultiSport",
        dieticianTitle: "Diyetisyen",
        rowingTitle: "Kürek Kulübü",
        footballTitle: "Futbol Takımı",
        readingTitle: "Kitap Kulübü",
        foodieTitle: "Foodie Club",
        haliSahaTitle: "Halı Saha Grubu",
        multiSport: "Çalışanlar şirket destekli erişim ile anlaşmalı spor salonları ve wellness noktalarında MultiSport kullanabilir.",
        dietician: "Çalışanlar şirket diyetisyen desteği ile beslenme, sağlıklı rutinler ve kişisel iyi yaşam planlaması konusunda yönlendirme alabilir.",
        rowing: "Kürek takımımız Golden Horn Water Sports Club'da antrenman yapıyor ve kurumsal yarışmalara hazırlanıyor. Daha fazla bilgi için Murat Yalçın ile iletişime geçebilirsiniz.",
        football: "Takıma katılmak isteyen çalışanlar için haftalık antrenmanlar ve şirket maçları düzenlenir.",
        reading: "Farklı departmanlardan ekip arkadaşlarıyla aylık kitap seçimleri ve küçük buluşmalar yapılır.",
        foodie: "Ekip öğle yemeği keşifleri, çevre önerileri ve zaman zaman iş çıkışı tadımlar düzenlenir.",
        haliSaha: "Eğlenceli haftalık futbol seansı isteyen herkes için halı saha maçları organize edilir.",
        update: "Kulüp bilgilerini güncelle",
      },
      common: {
        search: "Ara",
        createAnnouncement: "Duyuru oluştur",
        adminDashboard: "Yönetici paneli",
        announcements: "Duyurular",
        commentTimeNow: "Şimdi",
      },
    };
  }

  return {
    nav: {
      adminDashboard: "Admin dashboard",
      announcements: "Announcements",
      blogManagement: "Blog management",
      documents: "Documents",
      formSubmissions: "Form submissions",
      socialHubSettings: "Social Hub settings",
      blog: "Blog",
      socialHub: "Social Hub",
    },
    headings: {
      dashboard: { title: "Dashboard", description: "Overview of updates, documents, forms, and social activities." },
      announcements: { title: "Announcements", description: "" },
      announcementRequest: { title: "Announcement Request", description: "" },
      blog: { title: "Blog", description: "" },
      publish: { title: "Publish", description: "" },
      documents: { title: "Documents", description: "" },
      forms: { title: "Forms", description: "Submission tracking and internal request forms." },
      socialHub: { title: "Social Hub", description: "" },
    },
    dashboard: {
      hero: "One place for company updates, HR documents, internal forms, and social activities.",
      openAnnouncements: "Open announcements",
      openHrHub: "Open HR Hub",
      quickSnapshot: "Quick snapshot",
      adminPriorities: "Admin priorities",
      todayAtGlance: "Today at a glance",
      contentSubmissionsActivity: "Content, submissions, and activity",
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
    },
    announcements: {
      teamAnnouncement: "Our team has an announcement",
      back: "Back to announcements",
      notFound: "Announcement not found",
      tshirtForm: "Tshirt form",
      employeeEmail: "Employee email",
      name: "Name",
      size: "Size",
      submit: "Submit",
      requestTitle: "Share an announcement request",
      teamName: "Team name",
      announcementTitle: "Announcement title",
      announcementContent: "Announcement content",
      sendToAdmin: "Send to admin",
    },
    blog: {
      postModeration: "Post moderation",
      recentPosts: "Recent posts",
      reviewEmployeePosts: "Review employee posts before or after publishing.",
      publish: "Publish",
      todaysBirthdays: "Today's birthdays",
      postNotFound: "Post not found",
      backToPosts: "Back to posts",
      sharedBy: "Shared by",
      unlike: "Unlike",
      like: "Like",
      comments: "Comments",
      writeComment: "Write a comment...",
      postComment: "Post comment",
      you: "You",
    },
    publish: {
      eyebrow: "Publish",
      title: "Share something with coworkers",
      topic: "Topic or title",
      summary: "Short summary",
      content: "Draft content",
      sendForReview: "Send for review",
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
      openInfo: "Open social information",
      manage: "Manage social activities",
      benefits: "Social benefits",
      clubs: "Clubs",
      multiSportTitle: "MultiSport",
      dieticianTitle: "Dietician",
      rowingTitle: "Rowing Club",
      footballTitle: "Football Team",
      readingTitle: "Reading Club",
      foodieTitle: "Foodie Club",
      haliSahaTitle: "Halı Saha Group",
      multiSport: "Employees can use MultiSport for partner gyms and wellness locations with company-supported access.",
      dietician: "Employees can get guidance on nutrition, healthy routines, and personal wellness planning through the company dietician support option.",
      rowing: "Our rowing team trains at the Golden Horn Water Sports Club and prepares for corporate competitions. For more information, you can contact Murat Yalçın.",
      football: "Weekly training sessions and company matches for employees who want to join the squad.",
      reading: "Monthly book selections and small discussion meetups with teammates from different departments.",
      foodie: "Team lunch discoveries, neighborhood recommendations, and occasional after-work tastings.",
      haliSaha: "Casual five-a-side games organized for anyone who wants a fun weekly football session.",
      update: "Update club information",
    },
    common: {
      search: "Search",
      createAnnouncement: "Create announcement",
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
    dark: "bg-slate-950 !text-white shadow-sm",
    light: "bg-white !text-slate-950 shadow-sm",
    outline: "border border-slate-300 bg-white !text-slate-950 shadow-sm",
  };

  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition hover:opacity-90 ${styles[variant]}`}
    >
      {children}
    </Link>
  );
}

function DashboardPage({ role, language }: { role: Role; language: Lang }) {
  const isAdmin = role === "admin";
  const t = getText(language);
  const stats = isAdmin ? getAdminStats(language) : getEmployeeStats(language);

  return (
    <div className="space-y-6">
      <section className={`grid gap-6 ${isAdmin ? "xl:grid-cols-[1.3fr_0.7fr]" : "xl:grid-cols-1"}`}>
        {isAdmin ? (
          <div className="overflow-hidden rounded-3xl bg-slate-950 p-6 text-white shadow-xl sm:p-8">
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-200">
              {roleLabel(role, language)}
            </span>
            <h2 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
              {t.dashboard.hero}
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={withRole("/announcements", role)} variant="light">
                {t.dashboard.openAnnouncements}
              </ButtonLink>
              <ButtonLink href={withRole("/documents", role)} variant="outline">
                {t.dashboard.openHrHub}
              </ButtonLink>
            </div>
          </div>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionTitle
            eyebrow={t.dashboard.quickSnapshot}
            title={isAdmin ? t.dashboard.adminPriorities : t.dashboard.todayAtGlance}
            description={isAdmin ? t.dashboard.contentSubmissionsActivity : t.dashboard.updatesDocumentsActions}
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl bg-slate-50 p-4">
                <p className="text-sm text-slate-500">{stat.label}</p>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{stat.value}</p>
                <p className="mt-1 text-sm text-slate-500">{stat.helper}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <Link
          href={withRole("/blog", role)}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
        >
          <SectionTitle
            eyebrow={t.dashboard.blog}
            title={isAdmin ? t.dashboard.reviewPosts : t.dashboard.employeePosts}
            description={isAdmin ? t.dashboard.moderatePosts : t.dashboard.coworkerSharing}
          />
        </Link>
        <Link
          href={withRole("/forms", role)}
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:border-sky-200"
        >
          <SectionTitle
            eyebrow={t.dashboard.forms}
            title={isAdmin ? t.dashboard.trackSubmissions : t.dashboard.openForms}
            description={isAdmin ? t.dashboard.reviewExport : t.dashboard.completeRequests}
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
    </div>
  );
}

function AnnouncementsPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const announcementItems = getAnnouncements(language);

  return (
    <div className="space-y-4">
      {role === "employee" ? (
        <div className="flex justify-end">
          <ButtonLink href={withRole("/announcements/request", role)}>
            {t.announcements.teamAnnouncement}
          </ButtonLink>
        </div>
      ) : null}

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          {announcementItems.map((item) => (
            <Link
              key={item.slug}
              href={withRole(`/announcements/${item.slug}`, role)}
              className="block rounded-2xl border border-slate-200 p-4 transition hover:bg-sky-50"
            >
              <h3 className="font-medium text-slate-900">{item.title}</h3>
            </Link>
          ))}
        </div>
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

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <Link
        href={withRole("/announcements", role)}
        className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
      >
        {t.announcements.back}
      </Link>
      <h2 className="mt-6 text-2xl font-semibold text-sky-800">{announcement.title}</h2>
      <p className="mt-3 text-sm leading-6 text-slate-600">{announcement.detail}</p>
      <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700">
        {announcement.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      {announcement.hasForm ? (
        <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
          <SectionTitle title={t.announcements.tshirtForm} description="" />
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
  const birthdays = language === "tr"
    ? [
        { name: "Maria Lopez", team: "IK" },
        { name: "Daniel Kim", team: "Operasyon" },
        { name: "Nina Patel", team: "Pazarlama" },
      ]
    : [
        { name: "Maria Lopez", team: "HR" },
        { name: "Daniel Kim", team: "Operations" },
        { name: "Nina Patel", team: "Marketing" },
      ];

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
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
              className="block rounded-2xl bg-slate-50 p-4 transition hover:bg-sky-50"
            >
              <h3 className="font-medium text-slate-950">{post.title}</h3>
              {post.summary ? <p className="mt-2 text-sm text-slate-500">{post.summary}</p> : null}
            </Link>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-28 lg:self-start">
        <SectionTitle
          title={t.blog.todaysBirthdays}
          description=""
        />
        <div className="mt-6 space-y-3">
          {birthdays.map((person) => (
            <div key={person.name} className="rounded-2xl bg-slate-50 p-4">
              <h3 className="font-medium text-slate-950">{person.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{person.team}</p>
            </div>
          ))}
        </div>
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
        <Link
          href={withRole("/blog", role)}
          className="inline-flex rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900"
        >
          {t.blog.backToPosts}
        </Link>
        <h2 className="mt-6 text-2xl font-semibold text-sky-800">{post.title}</h2>
        <p className="mt-2 text-sm text-slate-500">{t.blog.sharedBy} {post.author}</p>

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
              liked ? "border border-slate-300 bg-white text-slate-900" : "bg-slate-950 text-white"
            }`}
          >
            {liked ? t.blog.unlike : t.blog.like} · {likes}
          </button>
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
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
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
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500 h-40">
            {t.publish.content}
          </div>
          <ButtonLink href={withRole("/blog", role)}>{t.publish.sendForReview}</ButtonLink>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <SectionTitle
          eyebrow={t.publish.examples}
          title={t.publish.popularTypes}
          description={t.publish.examplesDesc}
        />
        <div className="mt-6 grid gap-3">
          {t.publish.exampleItems.map((item) => (
            <div key={item} className="rounded-2xl border border-slate-200 p-4 text-sm text-slate-700">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DocumentsPage({ role, language }: { role: Role; language: Lang }) {
  const t = getText(language);
  const documentItems = getDocuments(language);

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle
        title={t.headings.documents.description}
        description=""
      />
      <div className="mt-6">
        <div className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-400">
          {t.documents.search}
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {documentItems.map((document) => (
          <div
            key={document.name}
            className="flex flex-col gap-3 rounded-2xl border border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <h3 className="font-medium text-slate-950">{document.name}</h3>
            </div>
            <ButtonLink
              href={withRole(document.href, role)}
            >
              {document.action}
            </ButtonLink>
          </div>
        ))}
      </div>
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

function SocialHubPage({ role, language }: { role: Role; language: Lang }) {
  const isAdmin = role === "admin";
  const t = getText(language);

  const summaryClassName =
    "flex cursor-pointer list-none items-center justify-between gap-3 font-medium text-slate-950";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <SectionTitle
        eyebrow={isAdmin ? t.socialHub.admin : undefined}
        title={isAdmin ? t.socialHub.manage : t.socialHub.openInfo}
        description=""
      />

      <div className="mt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold text-sky-800">{t.socialHub.benefits}</h3>
          <div className="mt-3 space-y-3">
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
              <summary className={summaryClassName}>
                <span>{t.socialHub.multiSportTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.multiSport}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className={summaryClassName}>
                <span>{t.socialHub.dieticianTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.dietician}
              </p>
            </details>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-sky-800">{t.socialHub.clubs}</h3>
          <div className="mt-3 space-y-3">
            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4" open>
              <summary className={summaryClassName}>
                <span>{t.socialHub.rowingTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.rowing}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className={summaryClassName}>
                <span>{t.socialHub.footballTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.football}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className={summaryClassName}>
                <span>{t.socialHub.readingTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.reading}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className={summaryClassName}>
                <span>{t.socialHub.foodieTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.foodie}
              </p>
            </details>

            <details className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <summary className={summaryClassName}>
                <span>{t.socialHub.haliSahaTitle}</span>
                <span className="text-slate-500">▾</span>
              </summary>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {t.socialHub.haliSaha}
              </p>
            </details>
          </div>
        </div>

        {isAdmin ? (
          <ButtonLink href={withRole("/social-hub", role)} variant="outline">
            {t.socialHub.update}
          </ButtonLink>
        ) : null}
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
) {
  switch (page) {
    case "announcements":
      return selectedAnnouncementSlug
        ? <AnnouncementDetailPage role={role} slug={selectedAnnouncementSlug} language={language} />
        : <AnnouncementsPage role={role} language={language} />;
    case "announcement-request":
      return <AnnouncementRequestPage role={role} language={language} />;
    case "blog":
      return selectedPostSlug
        ? <BlogPostPage role={role} slug={selectedPostSlug} language={language} />
        : <BlogPage role={role} language={language} />;
    case "publish":
      return <PublishPage role={role} language={language} />;
    case "documents":
      return <DocumentsPage role={role} language={language} />;
    case "forms":
      return <FormsPage role={role} language={language} />;
    case "social-hub":
      return <SocialHubPage role={role} language={language} />;
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
}: PortalShellProps) {
  const pathname = usePathname();
  const [language, setLanguage] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    return getLang(window.localStorage.getItem("token-hub-language") ?? undefined);
  });

  const t = getText(language);
  const navLinks = role === "admin"
    ? [
        { label: t.nav.adminDashboard, href: "/" },
        { label: t.nav.announcements, href: "/announcements" },
        { label: t.nav.blogManagement, href: "/blog" },
        { label: t.nav.documents, href: "/documents" },
        { label: t.nav.formSubmissions, href: "/forms" },
        { label: t.nav.socialHubSettings, href: "/social-hub" },
      ]
    : [
        { label: t.nav.announcements, href: "/announcements" },
        { label: t.nav.blog, href: "/blog" },
        { label: t.nav.documents, href: "/documents" },
        { label: t.nav.socialHub, href: "/social-hub" },
      ];
  const heading =
    page === "dashboard"
      ? {
          title: role === "admin" ? t.common.adminDashboard : t.common.announcements,
          description: role === "admin" ? t.headings.dashboard.description : "",
        }
      : page === "announcement-request"
        ? t.headings.announcementRequest
        : page === "social-hub"
          ? t.headings.socialHub
          : t.headings[page];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#eff6ff,_#f8fafc_40%,_#eef2ff_100%)] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-72 flex-col border-r border-white/60 bg-slate-950 px-6 py-8 text-slate-100 shadow-2xl lg:flex">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
              Token Hub
            </p>
          </div>

          <nav className="mt-8 space-y-2">
            {navLinks.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(`${item.href}/`));

              return (
                <Link
                  key={item.label}
                  href={withRole(item.href, role)}
                  className={`block rounded-xl px-4 py-3 text-sm transition ${
                    active
                      ? "bg-sky-500 text-white"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <div className="flex-1">
          <header className="sticky top-0 z-20 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl">
            <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-sky-800 sm:text-3xl">
                    {heading.title}
                  </h1>
                  {heading.description ? (
                    <p className="mt-1 text-sm text-slate-500">{heading.description}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="min-w-[220px] flex-1 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 lg:max-w-xs">
                    {t.common.search}
                  </div>

                  <div className="rounded-full border border-slate-200 bg-slate-50 p-1">
                    {(["employee", "admin"] as Role[]).map((option) => (
                      <Link
                        key={option}
                        href={getRoleHref(pathname, option)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                          role === option
                            ? "bg-slate-950 !text-white shadow-sm"
                            : "!text-slate-700 hover:!text-slate-950"
                        }`}
                      >
                        {roleLabel(option, language)}
                      </Link>
                    ))}
                  </div>

                  <div className="rounded-full border border-slate-200 bg-slate-50 p-1">
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
                        className={`rounded-full px-3 py-2 text-sm font-medium transition ${
                          language === option
                            ? "bg-slate-950 text-white shadow-sm"
                            : "text-slate-700 hover:text-slate-950"
                        }`}
                      >
                        {option.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {role === "admin" ? (
                    <ButtonLink href={withRole("/announcements", role)}>
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
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm ${
                        active
                          ? "border-sky-600 bg-sky-600 text-white"
                          : "border-slate-200 bg-white text-slate-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {renderPage(page, role, language, selectedPostSlug, selectedAnnouncementSlug)}
          </main>
        </div>
      </div>
    </div>
  );
}
