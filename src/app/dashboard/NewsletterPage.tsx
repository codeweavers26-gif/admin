"use client";

import { useEffect, useState } from "react";
import { getApi } from "../../utls/http";
import { API_BASE_URL } from "../../utls/urlUtls";

interface Subscriber {
  id: number;
  email: string;
  subscribedAt: string;
  active: boolean;
}

export default function NewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const res = await getApi(`${API_BASE_URL}api/newsletter/subscribers`);
      setSubscribers(res.data || res || []);
    } catch (err) {
      console.error("Failed to fetch subscribers", err);
    } finally {
      setLoading(false);
    }
  };

  const exportCSV = () => {
    const rows = [
      ["ID", "Email", "Subscribed At", "Active"],
      ...filtered.map((s) => [
        s.id,
        s.email,
        new Date(s.subscribedAt).toLocaleString("en-IN"),
        s.active ? "Yes" : "No",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `newsletter_subscribers_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = subscribers.filter((s) =>
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount   = subscribers.filter((s) => s.active).length;
  const inactiveCount = subscribers.length - activeCount;

  return (
    <div style={{ padding: 24, fontFamily: "sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700 }}>📧 Newsletter Subscribers</h2>
          <p style={{ margin: "4px 0 0", color: "#666", fontSize: 13 }}>Inner Circle — all subscribed emails</p>
        </div>
        <button
          onClick={exportCSV}
          style={{
            padding: "8px 18px", background: "#16a34a", color: "#fff",
            border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13,
          }}
        >
          ⬇️ Export CSV
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
        {[
          { label: "Total", value: subscribers.length, color: "#2563eb", bg: "#eff6ff" },
          { label: "Active", value: activeCount, color: "#16a34a", bg: "#f0fdf4" },
          { label: "Inactive", value: inactiveCount, color: "#dc2626", bg: "#fef2f2" },
        ].map((stat) => (
          <div key={stat.label} style={{
            flex: 1, padding: "16px 20px", borderRadius: 10,
            background: stat.bg, border: `1px solid ${stat.color}22`,
          }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%", maxWidth: 400, padding: "8px 12px",
          border: "1px solid #e5e7eb", borderRadius: 6,
          fontSize: 13, marginBottom: 16, boxSizing: "border-box",
        }}
      />

      {/* Table */}
      {loading ? (
        <div style={{ padding: 40, textAlign: "center", color: "#999" }}>Loading...</div>
      ) : filtered.length === 0 ? (
        <div style={{ padding: 40, textAlign: "center", color: "#999" }}>No subscribers found</div>
      ) : (
        <div style={{ background: "#fff", borderRadius: 10, border: "1px solid #e5e7eb", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
                {["#", "Email", "Subscribed On", "Status"].map((h) => (
                  <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: "1px solid #f3f4f6" }}>
                  <td style={{ padding: "12px 16px", color: "#9ca3af" }}>{i + 1}</td>
                  <td style={{ padding: "12px 16px", fontWeight: 500 }}>{s.email}</td>
                  <td style={{ padding: "12px 16px", color: "#6b7280" }}>
                    {new Date(s.subscribedAt).toLocaleString("en-IN", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </td>
                  <td style={{ padding: "12px 16px" }}>
                    <span style={{
                      padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700,
                      background: s.active ? "#dcfce7" : "#fee2e2",
                      color: s.active ? "#15803d" : "#b91c1c",
                    }}>
                      {s.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p style={{ marginTop: 12, color: "#9ca3af", fontSize: 12 }}>
        Showing {filtered.length} of {subscribers.length} subscribers
      </p>
    </div>
  );
}
