import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Geist } from "next/font/google";

import { cn } from "@/utils/utils";
import { Toaster } from "@/components/ui/sonner";
import { BottomTabBar, SidebarNav } from "@/components/nav/TabNav";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const SITE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;

const SITE_TITLE = "放学帮 | 邻里接送互助平台";
const SITE_DESCRIPTION =
  "专为双职工家庭设计的小学生接送互助协调工具。一键发布接送需求，AI 自动生成求助文案，智能顺路匹配邻居，接娃成功一键打卡。";

export const metadata: Metadata = {
  ...(SITE_URL ? { metadataBase: new URL(SITE_URL) } : {}),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    siteName: "放学管家",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    locale: "zh_CN",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={cn("h-full antialiased", "font-sans", geist.variable)}>
      <body className="min-h-full flex flex-col">
        <div className="flex min-h-svh">
            <SidebarNav />
            <main className="flex-1 md:ml-60 pb-16 md:pb-0">
              {children}
            </main>
            <BottomTabBar />
          </div>
          <Toaster />
      </body>
    </html>
  );
}
