import "./globals.css";
import Link from "next/link";
import Nav from "../components/Nav";
import Cursor from "../components/Cursor";

export const metadata = {
  title: "Primera Flats 13",
  description: "Primera Flats 13: story, members, territory and word on the street.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Special+Elite&display=swap"
        />
      </head>
      <body>
        <Cursor />
        <Nav />
        <main className="wrap">{children}</main>
        <footer className="wrap foot">
          <span>Primera Flats 13</span>
          <Link href="/admin">Admin</Link>
        </footer>
      </body>
    </html>
  );
}
