import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">
          <h2>
             Build <span>&</span> Bloom
          </h2>

          <p>
            Plant Management Decision Support System
            for growers in Pangasinan.
          </p>
        </div>

        <div className="footer-links">
          <h3>Explore</h3>

          <Link href="/crops">
            Crop Catalogue
          </Link>

          <Link href="/assessment">
            Crop Assessment
          </Link>

          <Link href="/weather">
            Weather
          </Link>

          <Link href="/calendar">
            Planting Calendar
          </Link>

          <Link href="/plants">
    My Plants
</Link>
        </div>

        

        <div className="footer-links">
          <h3>Account</h3>

          <Link href="/login">
            Login
          </Link>

          <Link href="/register">
            Register
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Build & Bloom. Plant smarter, grow better.
        </p>
      </div>

    </footer>
  );
}