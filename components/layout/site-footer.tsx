import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="app-footer shipments-footer">
      <strong>Copyright © 2025 Peterdraw</strong>
      <nav aria-label="Legal">
        <Link href="/placeholder/privacy-policy">Privacy Policy</Link>
        <Link href="/placeholder/terms">Term and conditions</Link>
        <Link href="/placeholder/contact">Contact</Link>
      </nav>
      <div className="footer-socials" aria-label="Social media">
        <a href="https://facebook.com" aria-label="Facebook">◉</a>
        <a href="https://x.com" aria-label="X">𝕏</a>
        <a href="https://instagram.com" aria-label="Instagram">◎</a>
        <a href="https://youtube.com" aria-label="YouTube">▻</a>
        <a href="https://linkedin.com" aria-label="LinkedIn">in</a>
      </div>
    </footer>
  );
}
