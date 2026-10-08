"use client";

import { useEffect, useState } from "react";


export default function AdminPage() {
const [totalCrops, setTotalCrops] = useState(0);
const [loadingCrops, setLoadingCrops] = useState(true);

const [totalUsers, setTotalUsers] = useState(0);
const [loadingUsers, setLoadingUsers] = useState(true);
const [totalCalendarRecords, setTotalCalendarRecords] = useState(0);
const [loadingCalendar, setLoadingCalendar] = useState(true);

useEffect(() => {
  const fetchCalendarCount = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/planting-calendar"
      );

      const result = await response.json();

      if (result.success) {
        setTotalCalendarRecords(result.data.length);
      }
    } catch (error) {
      console.error(
        "Failed to fetch planting calendar count:",
        error
      );
    } finally {
      setLoadingCalendar(false);
    }
  };

  fetchCalendarCount();
}, []);

  useEffect(() => {
    const fetchCropCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/crops");
        const result = await response.json();

        if (result.success) {
          setTotalCrops(result.count);
        }
      } catch (error) {
        console.error("Failed to fetch crop count:", error);
      } finally {
        setLoadingCrops(false);
      }
    };

    fetchCropCount();
  }, []);

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/users");
        const result = await response.json();

        if (result.success) {
          setTotalUsers(result.count);
        }
      } catch (error) {
        console.error("Failed to fetch user count:", error);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchUserCount();
  }, []);

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.logoSection}>
          <h2>Build & Bloom</h2>
          <p>Admin Panel</p>
        </div>

        <nav style={styles.nav}>
          <a href="/admin" style={styles.activeLink}>
            Dashboard
          </a>

          <a href="/admin/crops" style={styles.link}>
            Crop Management
            </a>

          <a href="/admin/locations" style={styles.link}>
            Location Management
            </a>

          <a href="/admin/calendar" style={styles.link}>
            Planting Calendar
          </a>

        <a href="/admin/users" style={styles.link}>
  User Management
</a>

          <a href="/admin/recommendations" style={styles.link}>
  Recommendations
</a>

          <a href="/admin/settings" style={styles.link}>
  Settings
</a>
        </nav>

        <div style={styles.logoutSection}>
          <a href="/login" style={styles.logout}>
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>Admin Dashboard</h1>
            <p style={styles.subtitle}>
              Manage the data and features of Build & Bloom.
            </p>
          </div>
        </div>

        {/* Dashboard Cards */}
        <div style={styles.cards}>
          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Crops</p>
            <h2 style={styles.cardNumber}>
              {loadingCrops ? "..." : totalCrops}
            </h2>
            <p style={styles.cardDescription}>
              Crops currently in the system
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Total Locations</p>
            <h2 style={styles.cardNumber}>48</h2>
            <p style={styles.cardDescription}>
              Pangasinan locations
            </p>
          </div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Registered Users</p>
            <h2 style={styles.cardNumber}>
              {loadingUsers ? "..." : totalUsers}
            </h2>
            <p style={styles.cardDescription}>
              Users currently registered
            </p>
          </div>


          <div style={styles.card}>
  <p style={styles.cardLabel}>Planting Calendar</p>
  <h2 style={styles.cardNumber}>
    {loadingCalendar ? "..." : totalCalendarRecords}
  </h2>
  <p style={styles.cardDescription}>
    Calendar records in the system
  </p>
</div>

          <div style={styles.card}>
            <p style={styles.cardLabel}>Weather API</p>
            <h2 style={styles.cardNumber}>Active</h2>
            <p style={styles.cardDescription}>
              OpenWeather integration
            </p>
          </div>
        </div>

        {/* System Overview */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>System Overview</h2>

          <div style={styles.overview}>
            <div>
              <h3>Crop Recommendation Engine</h3>
              <p>
                The recommendation engine uses crop requirements,
                location information, weather conditions, planting
                season, and other compatibility factors to generate
                crop recommendations.
              </p>
            </div>

            <div>
              <h3>Dataset Management</h3>
              <p>
                Administrators can manage the agricultural data used
                by the system, including crops, requirements,
                locations, and planting calendar information.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    backgroundColor: "#f5f7f5",
    color: "#1f2937",
  },

  sidebar: {
    width: "250px",
    minHeight: "100vh",
    backgroundColor: "#1f5134",
    color: "white",
    padding: "25px 18px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },

  logoSection: {
    marginBottom: "35px",
    padding: "0 10px",
  },

  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  link: {
    color: "#e8f5e9",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "14px",
  },

  activeLink: {
    color: "#1f5134",
    backgroundColor: "#ffffff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "600",
  },

  logoutSection: {
    marginTop: "auto",
    paddingTop: "20px",
  },

  logout: {
    display: "block",
    color: "#ffffff",
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "8px",
    backgroundColor: "#17432b",
    textAlign: "center",
  },

  main: {
    flex: 1,
    padding: "40px",
    boxSizing: "border-box",
  },

  header: {
    marginBottom: "30px",
  },

  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: "700",
  },

  subtitle: {
    marginTop: "8px",
    color: "#6b7280",
  },

  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  },

  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "22px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  cardLabel: {
    margin: 0,
    color: "#6b7280",
    fontSize: "14px",
  },

  cardNumber: {
    margin: "10px 0",
    fontSize: "28px",
    color: "#1f5134",
  },

  cardDescription: {
    margin: 0,
    color: "#9ca3af",
    fontSize: "13px",
  },

  section: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
  },

  overview: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "30px",
  },
};