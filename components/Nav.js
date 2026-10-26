"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const base = [
  { href: "/", label: "Story" },
  { href: "/members", label: "Members" },
  { href: "/territory", label: "Territory" },
  { href: "/street", label: "Word on the Street" },
];

export default function Nav() {
  const path = usePathname();
  const [admin, setAdmin] = useState(false);

  useEffect(() => {
    const check = () =>
      fetch("/api/me")
        .then((r) => r.json())
        .then((j) => setAdmin(!!j.admin))
        .catch(() => {});
    check();
    window.addEventListener("pf-auth", check);
    return () => window.removeEventListener("pf-auth", check);
  }, [path]);

  const links = admin ? [...base, { href: "/guides", label: "Guides" }, { href: "/admin", label: "Admin" }] : base;
  const active = (href) => (href === "/" ? path === "/" : path === href || path.startsWith(href + "/"));

  return (
    <header className="bar">
      <div className="wrap barin">
        <Link href="/" className="brand">
          <b>PF</b>
          <span>PRIMERA FLATS 13</span>
        </Link>
        <nav aria-label="Main">
          {links.map((l) => (
            <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
