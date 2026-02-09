import React, { useEffect, useState } from "react";
import { apiFetch } from "../../auth/api.js";
import { useAuth } from "../../auth/AuthContext.jsx";

const AdminDashboard = () => {
  const { token, user } = useAuth();
  const [tab, setTab] = useState("users");

  const [users, setUsers] = useState([]);
  const [models, setModels] = useState([]);
  const [bookings, setBookings] = useState([]);

  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editingBookingPatch, setEditingBookingPatch] = useState({});

  const [modelForm, setModelForm] = useState({
    title: "",
    price: "",
    gender: "Female",
    availability: "Available",
    imageUrl: "",
    description: "",
  });
  const [editingModelId, setEditingModelId] = useState(null);
  const [editingModelPatch, setEditingModelPatch] = useState({});

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const toDateTimeLocalValue = (d) => {
    if (!d) return "";
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = date.getFullYear();
    const mm = pad(date.getMonth() + 1);
    const dd = pad(date.getDate());
    const hh = pad(date.getHours());
    const mi = pad(date.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const loadUsers = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/v1/admin/users", { method: "GET", token });
      if (!data?.success) throw new Error(data?.message || "failed to load users");
      setUsers(data.users || []);
    } catch (e) {
      setError(e.message || "failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  const loadModels = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/v1/admin/models", {
        method: "GET",
        token,
      });
      if (!data?.success) throw new Error(data?.message || "failed to load models");
      setModels(data.models || []);
    } catch (e) {
      setError(e.message || "failed to load models");
    } finally {
      setIsLoading(false);
    }
  };

  const createModel = async () => {
    setError("");
    try {
      const body = {
        title: modelForm.title,
        price: Number(modelForm.price),
        gender: modelForm.gender,
        availability: modelForm.availability,
        imageUrl: modelForm.imageUrl,
        description: modelForm.description,
      };
      const data = await apiFetch("/api/v1/admin/models", {
        method: "POST",
        token,
        body,
      });
      if (!data?.success) throw new Error(data?.message || "failed to create model");
      setModels((prev) => [data.model, ...prev]);
      setModelForm({
        title: "",
        price: "",
        gender: "Female",
        availability: "Available",
        imageUrl: "",
        description: "",
      });
    } catch (e) {
      setError(e.message || "failed to create model");
    }
  };

  const startEditModel = (m) => {
    setEditingModelId(m._id);
    setEditingModelPatch({
      title: m.title,
      price: m.price,
      availability: m.availability,
      gender: m.gender,
      imageUrl: m.imageUrl || "",
      description: m.description || "",
      isActive: m.isActive,
    });
  };

  const saveEditModel = async (id) => {
    setError("");
    try {
      const data = await apiFetch(`/api/v1/admin/models/${id}`, {
        method: "PATCH",
        token,
        body: editingModelPatch,
      });
      if (!data?.success) throw new Error(data?.message || "failed to update model");
      setModels((prev) => prev.map((m) => (m._id === id ? data.model : m)));
      setEditingModelId(null);
      setEditingModelPatch({});
    } catch (e) {
      setError(e.message || "failed to update model");
    }
  };

  const deleteModel = async (id) => {
    setError("");
    try {
      const data = await apiFetch(`/api/v1/admin/models/${id}`, {
        method: "DELETE",
        token,
      });
      if (!data?.success) throw new Error(data?.message || "failed to delete model");
      setModels((prev) => prev.map((m) => (m._id === id ? data.model : m)));
    } catch (e) {
      setError(e.message || "failed to delete model");
    }
  };

  const loadBookings = async () => {
    setIsLoading(true);
    setError("");
    try {
      const data = await apiFetch("/api/v1/admin/bookings", {
        method: "GET",
        token,
      });
      if (!data?.success) throw new Error(data?.message || "failed to load bookings");
      setBookings(data.bookings || []);
    } catch (e) {
      setError(e.message || "failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    setError("");
    try {
      const data = await apiFetch(`/api/v1/admin/bookings/${id}`, {
        method: "PATCH",
        token,
        body: { status },
      });
      if (!data?.success) throw new Error(data?.message || "failed to update booking");
      setBookings((prev) => prev.map((b) => (b._id === id ? data.booking : b)));
    } catch (e) {
      setError(e.message || "failed to update booking");
    }
  };

  const startEditBooking = (b) => {
    setEditingBookingId(b._id);
    setEditingBookingPatch({
      status: b.status,
      details: b.details || "",
      scheduledAt: toDateTimeLocalValue(b.scheduledAt),
    });
  };

  const saveEditBooking = async (id) => {
    setError("");
    try {
      const body = {
        status: editingBookingPatch.status,
        details: editingBookingPatch.details,
        scheduledAt: editingBookingPatch.scheduledAt,
      };

      const data = await apiFetch(`/api/v1/admin/bookings/${id}`, {
        method: "PATCH",
        token,
        body,
      });
      if (!data?.success) throw new Error(data?.message || "failed to update booking");
      setBookings((prev) => prev.map((b) => (b._id === id ? data.booking : b)));
      setEditingBookingId(null);
      setEditingBookingPatch({});
    } catch (e) {
      setError(e.message || "failed to update booking");
    }
  };

  const deleteBooking = async (id) => {
    setError("");
    try {
      const data = await apiFetch(`/api/v1/admin/bookings/${id}`, {
        method: "DELETE",
        token,
      });
      if (!data?.success) throw new Error(data?.message || "failed to delete booking");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (e) {
      setError(e.message || "failed to delete booking");
    }
  };

  const setRole = async (id, role) => {
    setError("");
    try {
      const data = await apiFetch(`/api/v1/admin/users/${id}/role`, {
        method: "PATCH",
        token,
        body: { role },
      });
      if (!data?.success) throw new Error(data?.message || "failed to update role");
      setUsers((prev) => prev.map((u) => (u._id === id ? data.user : u)));
    } catch (e) {
      setError(e.message || "failed to update role");
    }
  };

  useEffect(() => {
    // load initial tab
    if (tab === "users") loadUsers();
    if (tab === "models") loadModels();
    if (tab === "bookings") loadBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ color: "white", fontWeight: 700, fontSize: 24 }}>Admin</h2>
      <p style={{ color: "#bbb" }}>Signed in as: {user?.email}</p>

      <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
        <button onClick={() => setTab("users")} disabled={tab === "users"}>
          Users
        </button>
        <button onClick={() => setTab("models")} disabled={tab === "models"}>
          Models
        </button>
        <button onClick={() => setTab("bookings")} disabled={tab === "bookings"}>
          Bookings
        </button>

        <div style={{ flex: 1 }} />
        {tab === "users" ? (
          <button onClick={loadUsers} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        ) : null}
        {tab === "models" ? (
          <button onClick={loadModels} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        ) : null}
        {tab === "bookings" ? (
          <button onClick={loadBookings} disabled={isLoading}>
            {isLoading ? "Loading..." : "Refresh"}
          </button>
        ) : null}
      </div>

      {error ? <p style={{ color: "salmon" }}>{error}</p> : null}

      {tab === "users" ? (
        <div style={{ marginTop: 16 }}>
          {users.map((u) => (
            <div
              key={u._id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                padding: 12,
                background: "rgba(255,255,255,0.06)",
                borderRadius: 8,
                marginBottom: 8,
                color: "white",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{u.email}</div>
                <div style={{ fontSize: 12, color: "#bbb" }}>
                  role: {u.role} • verified: {String(u.isVerified)}
                </div>
              </div>

              <button
                onClick={() => setRole(u._id, "user")}
                disabled={u._id === user?.id || u.role === "user"}
              >
                Make user
              </button>
              <button onClick={() => setRole(u._id, "admin")} disabled={u.role === "admin"}>
                Make admin
              </button>
            </div>
          ))}
        </div>
      ) : null}

      {tab === "models" ? (
        <div style={{ marginTop: 16, color: "white" }}>
          <h3 style={{ marginBottom: 8 }}>Create model</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 140px 140px 160px",
              gap: 8,
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <input
              placeholder="Title"
              value={modelForm.title}
              onChange={(e) => setModelForm((p) => ({ ...p, title: e.target.value }))}
            />
            <input
              placeholder="Price"
              value={modelForm.price}
              onChange={(e) => setModelForm((p) => ({ ...p, price: e.target.value }))}
            />
            <select
              value={modelForm.gender}
              onChange={(e) => setModelForm((p) => ({ ...p, gender: e.target.value }))}
            >
              <option>Female</option>
              <option>Male</option>
              <option>Other</option>
            </select>
            <select
              value={modelForm.availability}
              onChange={(e) =>
                setModelForm((p) => ({ ...p, availability: e.target.value }))
              }
            >
              <option>Available</option>
              <option>Booked</option>
            </select>
          </div>

          <input
            placeholder="Image URL (optional)"
            value={modelForm.imageUrl}
            onChange={(e) => setModelForm((p) => ({ ...p, imageUrl: e.target.value }))}
            style={{ width: "100%", marginBottom: 8 }}
          />
          <textarea
            placeholder="Description (optional)"
            value={modelForm.description}
            onChange={(e) =>
              setModelForm((p) => ({ ...p, description: e.target.value }))
            }
            style={{ width: "100%", marginBottom: 8 }}
            rows={3}
          />
          <button onClick={createModel}>Create</button>

          <h3 style={{ marginTop: 20 }}>All models</h3>
          <div style={{ marginTop: 8 }}>
            {models.map((m) => {
              const isEditing = editingModelId === m._id;
              return (
                <div
                  key={m._id}
                  style={{
                    padding: 12,
                    background: "rgba(255,255,255,0.06)",
                    borderRadius: 8,
                    marginBottom: 8,
                  }}
                >
                  {!isEditing ? (
                    <>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                          <div style={{ fontWeight: 700 }}>
                            {m.title} {m.isActive === false ? "(inactive)" : ""}
                          </div>
                          <div style={{ fontSize: 12, color: "#bbb" }}>
                            ${m.price} • {m.gender} • {m.availability}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => startEditModel(m)}>Edit</button>
                          <button onClick={() => deleteModel(m._id)} disabled={m.isActive === false}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 140px 140px", gap: 8 }}>
                        <input
                          value={editingModelPatch.title ?? ""}
                          onChange={(e) =>
                            setEditingModelPatch((p) => ({ ...p, title: e.target.value }))
                          }
                        />
                        <input
                          value={editingModelPatch.price ?? ""}
                          onChange={(e) =>
                            setEditingModelPatch((p) => ({ ...p, price: Number(e.target.value) }))
                          }
                        />
                        <select
                          value={editingModelPatch.gender ?? "Female"}
                          onChange={(e) =>
                            setEditingModelPatch((p) => ({ ...p, gender: e.target.value }))
                          }
                        >
                          <option>Female</option>
                          <option>Male</option>
                          <option>Other</option>
                        </select>
                        <select
                          value={editingModelPatch.availability ?? "Available"}
                          onChange={(e) =>
                            setEditingModelPatch((p) => ({ ...p, availability: e.target.value }))
                          }
                        >
                          <option>Available</option>
                          <option>Booked</option>
                        </select>
                      </div>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <button onClick={() => saveEditModel(m._id)}>Save</button>
                        <button
                          onClick={() => {
                            setEditingModelId(null);
                            setEditingModelPatch({});
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : null}

      {tab === "bookings" ? (
        <div style={{ marginTop: 16, color: "white" }}>
          <h3>All bookings</h3>
          <div style={{ marginTop: 8 }}>
            {bookings.map((b) => (
              <div
                key={b._id}
                style={{
                  padding: 12,
                  background: "rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  marginBottom: 8,
                }}
              >
                {(() => {
                  const isEditing = editingBookingId === b._id;
                  const total = (b.items || []).reduce(
                    (sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0),
                    0
                  );

                  return (
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {b.userId?.email || "(no user)"} • {b.status}
                    </div>
                    <div style={{ fontSize: 12, color: "#bbb" }}>
                      id: {b._id}
                    </div>

                    <div style={{ marginTop: 6, fontSize: 13, color: "#ddd" }}>
                      <div>
                        created: {b.createdAt ? new Date(b.createdAt).toLocaleString() : "-"}
                      </div>
                      <div>
                        scheduled: {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : "-"}
                      </div>
                      <div>notes: {b.details ? b.details : "-"}</div>
                      <div style={{ marginTop: 4, fontWeight: 700 }}>total: ${total}</div>
                    </div>

                    <div style={{ marginTop: 6, fontSize: 13 }}>
                      {(b.items || []).map((it, idx) => (
                        <div key={idx}>
                          {it.title} × {it.quantity} (${it.price})
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    {!isEditing ? (
                      <>
                        <select
                          value={b.status}
                          onChange={(e) => updateBookingStatus(b._id, e.target.value)}
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>
                        <button onClick={() => startEditBooking(b)}>Edit details</button>
                        <button onClick={() => deleteBooking(b._id)}>Delete</button>
                      </>
                    ) : (
                      <div style={{ display: "grid", gap: 8, minWidth: 260 }}>
                        <select
                          value={editingBookingPatch.status ?? "pending"}
                          onChange={(e) =>
                            setEditingBookingPatch((p) => ({ ...p, status: e.target.value }))
                          }
                        >
                          <option value="pending">pending</option>
                          <option value="confirmed">confirmed</option>
                          <option value="completed">completed</option>
                          <option value="cancelled">cancelled</option>
                        </select>

                        <input
                          type="datetime-local"
                          value={editingBookingPatch.scheduledAt ?? ""}
                          onChange={(e) =>
                            setEditingBookingPatch((p) => ({ ...p, scheduledAt: e.target.value }))
                          }
                        />

                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                          <span style={{ fontSize: 12, color: "#bbb" }}>
                            Leave empty to clear scheduled time.
                          </span>
                          <button
                            onClick={() =>
                              setEditingBookingPatch((p) => ({ ...p, scheduledAt: "" }))
                            }
                            disabled={!editingBookingPatch.scheduledAt}
                          >
                            Clear
                          </button>
                        </div>

                        <textarea
                          rows={3}
                          placeholder="Booking notes"
                          value={editingBookingPatch.details ?? ""}
                          onChange={(e) =>
                            setEditingBookingPatch((p) => ({ ...p, details: e.target.value }))
                          }
                        />

                        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                          <button onClick={() => saveEditBooking(b._id)}>Save</button>
                          <button
                            onClick={() => {
                              setEditingBookingId(null);
                              setEditingBookingPatch({});
                            }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                  );
                })()}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default AdminDashboard;

