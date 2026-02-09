import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { apiFetch } from "../../auth/api.js";
import styles from "./AdminAnalyticsDashboard.module.scss";

const hashString = (s) => {
  const str = String(s || "");
  let h = 0;
  for (let i = 0; i < str.length; i += 1) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return h;
};

const rand01 = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const rand = (seed, min, max) => min + (max - min) * rand01(seed);

const formatMoney = (n) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(Number(n || 0));

const Stars = ({ value }) => {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5;
  return (
    <div className={styles.stars} title={`${v.toFixed(1)} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        const state = idx <= full ? "full" : idx === full + 1 && half ? "half" : "empty";
        return <span key={idx} className={styles[`star_${state}`]} />;
      })}
      <span className={styles.starsValue}>{v.toFixed(1)}</span>
    </div>
  );
};

const Sparkline = ({ points = [] }) => {
  const w = 240;
  const h = 64;
  const pad = 6;
  const safe = points.length ? points : [10, 14, 12, 18, 22, 20, 25, 30, 28, 35, 38, 42];
  const min = Math.min(...safe);
  const max = Math.max(...safe);
  const norm = (v) => (max === min ? 0.5 : (v - min) / (max - min));
  const d = safe
    .map((v, i) => {
      const x = pad + (i * (w - pad * 2)) / (safe.length - 1);
      const y = pad + (1 - norm(v)) * (h - pad * 2);
      return `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg className={styles.spark} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <path className={styles.sparkFill} d={`${d} L ${w - pad},${h - pad} L ${pad},${h - pad} Z`} />
      <path className={styles.sparkLine} d={d} />
    </svg>
  );
};

const AdminAnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await apiFetch("/api/v1/models", { method: "GET" });
        const list = Array.isArray(data?.models) ? data.models : [];
        if (mounted) setModels(list);
      } catch (e) {
        if (mounted) setError(e?.message || "Failed to load performers");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const performers = useMemo(() => {
    return (models || []).map((m, idx) => {
      const seed = hashString(m?._id || m?.title || idx);
      const customers = Math.round(rand(seed + 1, 18, 980));
      const rating = Math.round(rand(seed + 2, 36, 50)) / 10;
      const views = Math.round(customers * rand(seed + 3, 2.2, 6.1));
      const conv = rand(seed + 4, 0.9, 6.6); // %
      const price = Number(m?.price || 0);
      const revenue = Math.round(customers * price * rand(seed + 5, 0.55, 1.85));
      const delta = Math.round(rand(seed + 6, -18, 26) * 10) / 10;
      return {
        id: m?._id || String(idx),
        title: m?.title || "Performer",
        location: m?.location || "—",
        availability: m?.availability || "Available",
        imageUrl: m?.imageUrl || "",
        price,
        customers,
        revenue,
        rating,
        views,
        conversion: conv,
        delta,
      };
    });
  }, [models]);

  const totals = useMemo(() => {
    const totalPerformers = performers.length;
    const totalRevenue = performers.reduce((s, p) => s + (p.revenue || 0), 0);
    const totalCustomers = performers.reduce((s, p) => s + (p.customers || 0), 0);
    const avgRating = totalPerformers
      ? performers.reduce((s, p) => s + (p.rating || 0), 0) / totalPerformers
      : 0;
    const avgBooking = totalCustomers ? totalRevenue / totalCustomers : 0;
    return { totalPerformers, totalRevenue, totalCustomers, avgRating, avgBooking };
  }, [performers]);

  const revenueSeries = useMemo(() => {
    const base = totals.totalRevenue > 0 ? totals.totalRevenue / 12 : 42000;
    return Array.from({ length: 12 }).map((_, i) =>
      Math.round(base * rand(i + 11, 0.72, 1.35))
    );
  }, [totals.totalRevenue]);

  const traffic = useMemo(
    () => [
      { label: "Instagram", value: 42, color: "#ff3e81" },
      { label: "Search", value: 26, color: "#ffcc00" },
      { label: "Direct", value: 18, color: "#a855f7" },
      { label: "Referrals", value: 14, color: "#22c55e" },
    ],
    []
  );

  const top = useMemo(() => {
    return [...performers].sort((a, b) => (b.revenue || 0) - (a.revenue || 0)).slice(0, 6);
  }, [performers]);

  const activities = useMemo(() => {
    const now = Date.now();
    const base = top.length ? top : performers.slice(0, 3);
    const items = base.map((p, i) => {
      const mins = Math.round(rand(hashString(p.id) + 70, 6, 620));
      const kind = i % 3;
      const text =
        kind === 0
          ? `New booking completed with ${p.title}`
          : kind === 1
            ? `${p.title} gained ${Math.round(rand(hashString(p.id) + 71, 12, 120))} new followers`
            : `New 5★ review added to ${p.title}`;
      return { id: `${p.id}-${i}`, text, at: new Date(now - mins * 60 * 1000) };
    });
    return items;
  }, [performers, top]);

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <aside className={styles.sidebar}>
          <div className={styles.brand}>
            <div className={styles.brandMark} />
            <div>
              <div className={styles.brandTitle}>DesireHub</div>
              <div className={styles.brandSub}>Admin Command Center</div>
            </div>
          </div>

          <nav className={styles.nav}>
            <button className={styles.navItem} type="button" onClick={() => navigate("/performers")}>
              Performers
            </button>
            <button className={styles.navItem} type="button" onClick={() => navigate("/be-performer")}>
              Be a Performer
            </button>
            <div className={styles.navHint}>Demo analytics are generated per performer (until bookings/reviews are wired).</div>
          </nav>

          <div className={styles.sidebarFooter}>
            <div className={styles.miniStat}>
              <div className={styles.miniLabel}>Avg booking value</div>
              <div className={styles.miniValue}>{formatMoney(totals.avgBooking)}</div>
            </div>
            <div className={styles.miniStat}>
              <div className={styles.miniLabel}>System status</div>
              <div className={styles.miniValueOk}>Operational</div>
            </div>
          </div>
        </aside>

        <main className={styles.main}>
          <header className={styles.topbar}>
            <div>
              <div className={styles.hTitle}>Dashboard</div>
              <div className={styles.hSub}>Performer performance • Revenue • Customers • Ratings</div>
            </div>
            <div className={styles.actions}>
              <button className={styles.primary} type="button" onClick={() => navigate("/be-performer")}>
                + Add Performer
              </button>
              <button className={styles.ghost} type="button" onClick={() => navigate("/performers")}>
                View Performers
              </button>
            </div>
          </header>

          {error ? <div className={styles.error}>{error}</div> : null}

          <section className={styles.kpis}>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Total performers</div>
              <div className={styles.kpiValue}>{loading ? "—" : totals.totalPerformers}</div>
              <div className={styles.kpiHint}>Active profiles visible on Performers page</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Estimated revenue</div>
              <div className={styles.kpiValue}>{loading ? "—" : formatMoney(totals.totalRevenue)}</div>
              <div className={styles.kpiHint}>Based on demand × price (demo)</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Customers served</div>
              <div className={styles.kpiValue}>{loading ? "—" : totals.totalCustomers.toLocaleString()}</div>
              <div className={styles.kpiHint}>Unique customers per performer (demo)</div>
            </div>
            <div className={styles.kpiCard}>
              <div className={styles.kpiLabel}>Average rating</div>
              <div className={styles.kpiValueRow}>
                <div className={styles.kpiValue}>{loading ? "—" : totals.avgRating.toFixed(1)}</div>
                <Stars value={totals.avgRating} />
              </div>
              <div className={styles.kpiHint}>Ratings out of 5</div>
            </div>
          </section>

          <section className={styles.grid2}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Monthly revenue trend</div>
                  <div className={styles.panelSub}>Last 12 months (demo)</div>
                </div>
                <div className={styles.badge}>+{Math.round(rand(999, 6, 22))}%</div>
              </div>
              <Sparkline points={revenueSeries} />
              <div className={styles.panelFooter}>
                <div className={styles.footItem}>
                  <div className={styles.footLabel}>Best month</div>
                  <div className={styles.footValue}>{formatMoney(Math.max(...revenueSeries))}</div>
                </div>
                <div className={styles.footItem}>
                  <div className={styles.footLabel}>Avg / month</div>
                  <div className={styles.footValue}>{formatMoney(revenueSeries.reduce((s, v) => s + v, 0) / revenueSeries.length)}</div>
                </div>
              </div>
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Traffic sources</div>
                  <div className={styles.panelSub}>Where customers come from</div>
                </div>
              </div>
              <div className={styles.traffic}>
                <div className={styles.donut}>
                  <svg viewBox="0 0 120 120" className={styles.donutSvg}>
                    <circle className={styles.donutTrack} cx="60" cy="60" r="44" />
                    {(() => {
                      const r = 44;
                      const c = 2 * Math.PI * r;
                      let offset = 0;
                      return traffic.map((t) => {
                        const dash = (t.value / 100) * c;
                        const node = (
                          <circle
                            key={t.label}
                            cx="60"
                            cy="60"
                            r={r}
                            className={styles.donutSeg}
                            style={{
                              stroke: t.color,
                              strokeDasharray: `${dash} ${c - dash}`,
                              strokeDashoffset: -offset,
                            }}
                          />
                        );
                        offset += dash;
                        return node;
                      });
                    })()}
                    <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" className={styles.donutText}>
                      100%
                    </text>
                    <text x="60" y="76" textAnchor="middle" dominantBaseline="middle" className={styles.donutSubText}>
                      traffic
                    </text>
                  </svg>
                </div>
                <div className={styles.legend}>
                  {traffic.map((t) => (
                    <div key={t.label} className={styles.legendRow}>
                      <span className={styles.legendDot} style={{ background: t.color }} />
                      <span className={styles.legendLabel}>{t.label}</span>
                      <span className={styles.legendValue}>{t.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={styles.grid2b}>
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Performer performance</div>
                  <div className={styles.panelSub}>Revenue, customers, ratings, conversion</div>
                </div>
                <div className={styles.badgeAlt}>{loading ? "Loading…" : `${performers.length} performers`}</div>
              </div>

              {performers.length === 0 && !loading ? (
                <div className={styles.empty}>
                  No performers yet. Click <b>Add Performer</b> to create one.
                </div>
              ) : (
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Performer</th>
                        <th>Revenue</th>
                        <th>Customers</th>
                        <th>Rating</th>
                        <th>Conv.</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {top.concat(performers.filter((p) => !top.some((t) => t.id === p.id))).slice(0, 10).map((p) => (
                        <tr key={p.id}>
                          <td>
                            <div className={styles.pCell}>
                              <div className={styles.avatar}>
                                {p.imageUrl ? <img src={p.imageUrl} alt={p.title} /> : <span>{p.title?.[0] || "P"}</span>}
                              </div>
                              <div>
                                <div className={styles.pName}>{p.title}</div>
                                <div className={styles.pMeta}>{p.location} • {formatMoney(p.price)}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className={styles.money}>{formatMoney(p.revenue)}</div>
                            <div className={p.delta >= 0 ? styles.deltaUp : styles.deltaDown}>
                              {p.delta >= 0 ? "+" : ""}{p.delta}%
                            </div>
                          </td>
                          <td>
                            <div className={styles.num}>{p.customers.toLocaleString()}</div>
                            <div className={styles.muted}>{p.views.toLocaleString()} views</div>
                          </td>
                          <td><Stars value={p.rating} /></td>
                          <td>
                            <div className={styles.num}>{p.conversion.toFixed(1)}%</div>
                            <div className={styles.muted}>CTR→Book</div>
                          </td>
                          <td>
                            <span className={p.availability === "Available" ? styles.pillOk : styles.pillBusy}>
                              {p.availability}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <div className={styles.panelTitle}>Recent activity</div>
                  <div className={styles.panelSub}>Bookings, followers, reviews (demo)</div>
                </div>
              </div>

              <div className={styles.activityList}>
                {activities.map((a) => (
                  <div key={a.id} className={styles.activityRow}>
                    <div className={styles.activityDot} />
                    <div className={styles.activityText}>{a.text}</div>
                    <div className={styles.activityTime}>
                      {a.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminAnalyticsDashboard;
