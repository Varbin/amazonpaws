import type { Metadata } from "next";
import "./globals.css";
import amazonpaws from "@/resources/images/amazonpaws.svg"
import Image from "next/image";
import Link from "next/link";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import {SITE_DESCRIPTION, SITE_TITLE} from "@/lib/constants";
config.autoAddCss = false

export const metadata: Metadata = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    locale: "en_US",
    url: "https://amazonpaws.com",
    siteName: SITE_TITLE,
  },

  alternates: {
    types: {
      "application/atom+xml": "/feeds/atom",
      "application/rss+xml": "/feeds/rss",
      "application/feed+json": "/feeds/json"
    }
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <a href="#main" className="skip">Skip to main content</a>
        <header>
          <Link className="logo" href="/" aria-describedby={"title"}>
            <Image src={amazonpaws} alt="Amazon Logo, but with paws." height="100"/>
            <div>
              <h1 id={"title"}>Amazon Paws</h1>
              <p style={{margin: 0}}>The paw prints Amazon leaves on the world.</p>
            </div>
          </Link>
        </header>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/contribute">Contribute</Link>
          <Link href="/about">About</Link>
          <Link href="/legal"><small>Legal</small></Link>
        </nav>
        <aside>
          This is <strong>not</strong> an official Amazon site! <Link href="/about">Read more...</Link>
        </aside>
        <main id="main">
          {children}
        </main>
        <footer>
        </footer>
      </body>
    </html>
  );
}
