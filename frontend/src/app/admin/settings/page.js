"use client";

import { useEffect, useState } from "react";

export default function AdminSettingsPage() {
  const [totalCrops, setTotalCrops] = useState(0);
  const [totalLocations, setTotalLocations] = useState(0);
  const [totalCalendarRecords, setTotalCalendarRecords] = useState(0);

  const [loadingCrops, setLoadingCrops] = useState(true);
  const [loadingLocations, setLoadingLocations] = useState(true);
  const [loadingCalendar, setLoadingCalendar] = useState(true);

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/crops"
        );

        const result = await response.json();

        if (result.success) {
          setTotalCrops(result.data.length);
        }
      } catch (error) {
        console.error(
          "Failed to fetch crop count:",
          error
        );
      } finally {
        setLoadingCrops(false);
      }
    };

    fetchCrops();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/locations"
        );

        const result = await response.json();

        if (result.success) {
          setTotalLocations(result.data.length);
        }
      } catch (error) {
        console.error(
          "Failed to fetch location count:",
          error
        );
      } finally {
        setLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCalendar = async () => {
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
          "Failed to fetch calendar count:",
          error
        );
      } finally {
        setLoadingCalendar(false);
      }
    };

    fetchCalendar();
  }, []);

  return (
    <main style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          Settings
        </h1>

        <p style={styles.subtitle}>
          Manage and monitor basic Build & Bloom system information.
        </p>
      </div>

      {/* System Information */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          System Information
        </h2>

        <div style={styles.infoRow}>
          <span>System Name</span>
          <strong>Build & Bloom</strong>
        </div>

        <div style={styles.infoRow}>
          <span>System Type</span>
          <strong>
            Plant Management Decision Support System
          </strong>
        </div>

        <div style={styles.infoRow}>
          <span>Coverage</span>
          <strong>Pangasinan</strong>
        </div>

        <div style={styles.infoRow}>
          <span>Crop Dataset</span>
          <strong>
            {loadingCrops ? "Loading..." : `${totalCrops} Crops`}
          </strong>
        </div>

        <div style={styles.infoRow}>
          <span>Location Dataset</span>
          <strong>
            {loadingLocations
              ? "Loading..."
              : `${totalLocations} Locations`}
          </strong>
        </div>

        <div style={styles.infoRow}>
          <span>Planting Calendar Records</span>
          <strong>
            {loadingCalendar
              ? "Loading..."
              : `${totalCalendarRecords} Records`}
          </strong>
        </div>
      </section>

      {/* Recommendation Engine */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Recommendation Engine
        </h2>

        <p style={styles.description}>
          The recommendation engine evaluates soil, water,
          sunlight, environment, weather, planting season,
          and location suitability.
        </p>

        <div style={styles.status}>
          <span style={styles.statusDot}></span>
          Recommendation Engine Active
        </div>
      </section>

      {/* Weather Integration */}
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>
          Weather Integration
        </h2>

        <p style={styles.description}>
          Build & Bloom uses weather information to improve
          crop compatibility and provide weather-based
          planting and care advisories.
        </p>

        <div style={styles.status}>
          <span style={styles.statusDot}></span>
          Weather Integration Active
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f7f5",
    padding: "40px",
    color: "#1f2937",
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

  card: {
    backgroundColor: "white",
    borderRadius: "12px",
    padding: "25px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  },

  sectionTitle: {
    marginTop: 0,
    marginBottom: "20px",
    color: "#1f5134",
  },

  infoRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 0",
    borderBottom: "1px solid #e5e7eb",
    gap: "20px",
  },

  description: {
    color: "#6b7280",
    lineHeight: "1.6",
    fontSize: "14px",
  },

  status: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#e8f5e9",
    color: "#1f5134",
    padding: "8px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "600",
  },

  statusDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    backgroundColor: "#2e7d32",
  },
};