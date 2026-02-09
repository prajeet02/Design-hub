import { useMemo, useState } from "react";
import { useNavigate } from "react-router";
import styles from "./BecomePerformer.module.scss";
import { apiFetch } from "../../auth/api";

const parseList = (value) => {
  if (!value) return [];
  return value
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 30);
};

const BecomePerformer = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    price: "",
    originalPrice: "",
    gender: "Female",
    availability: "Available",
    location: "",
    tagline: "",
    description: "",
    imageUrl: "",
    sizesText: "",
    featuresText: "",
  });

  const preview = useMemo(() => {
    const priceNum = Number(form.price);
    const originalNum = Number(form.originalPrice);
    return {
      title: form.title || "Your Stage Name",
      price: Number.isFinite(priceNum) ? priceNum : 0,
      originalPrice: Number.isFinite(originalNum) ? originalNum : undefined,
      gender: form.gender,
      availability: form.availability,
      location: form.location || "Your location",
      tagline: form.tagline || "Your spicy one-liner goes here…",
      description: form.description || "Tell fans what they get when they subscribe.",
      imageUrl: form.imageUrl,
      sizes: parseList(form.sizesText),
      features: parseList(form.featuresText),
    };
  }, [form]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (error) setError("");
  };

  const onPickFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image too large. Please use a file under 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((p) => ({ ...p, imageUrl: String(reader.result || "") }));
    };
    reader.readAsDataURL(file);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) return setError("Stage name is required.");
    if (!form.price || Number.isNaN(Number(form.price))) {
      return setError("Monthly price is required.");
    }

    const payload = {
      title: form.title.trim(),
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      gender: form.gender,
      availability: form.availability,
      location: form.location?.trim() || "",
      tagline: form.tagline?.trim() || "",
      description: form.description?.trim() || "",
      imageUrl: form.imageUrl || "",
      sizes: parseList(form.sizesText),
      features: parseList(form.featuresText),
    };

    try {
      setSubmitting(true);
      const res = await apiFetch("/api/v1/models", { method: "POST", body: payload });
      if (!res?.success) throw new Error(res?.message || "Failed to create performer");
      navigate("/performers");
    } catch (err) {
      setError(err?.message || "Failed to submit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Creator Studio</h1>
        <p>Create your profile. When you hit submit, you’ll show up in Performers.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.preview}>
          <div className={styles.previewCard}>
            <div className={styles.previewImage}>
              <img
                src={preview.imageUrl || "https://picsum.photos/800/800"}
                alt="preview"
              />
            </div>
            <div className={styles.previewBody}>
              <div className={styles.badges}>
                <span>Rising</span>
                <span>Shining</span>
                <span>Responsive</span>
              </div>
              <h2>{preview.title}</h2>
              <div className={styles.meta}>
                <span>{preview.gender}</span>
                <span>{preview.availability}</span>
              </div>
              <div className={styles.price}>${preview.price}/month</div>
              <div className={styles.location}>{preview.location}</div>
              <div className={styles.tagline}>{preview.tagline}</div>
              <p className={styles.desc}>{preview.description}</p>
            </div>
          </div>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          {error ? <div className={styles.error}>{error}</div> : null}

          <div className={styles.row}>
            <label>
              Stage name
              <input name="title" value={form.title} onChange={onChange} />
            </label>
            <label>
              Monthly price
              <input name="price" type="number" min="0" value={form.price} onChange={onChange} />
            </label>
          </div>

          <div className={styles.row}>
            <label>
              Gender
              <select name="gender" value={form.gender} onChange={onChange}>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </label>
            <label>
              Availability
              <select name="availability" value={form.availability} onChange={onChange}>
                <option value="Available">Available</option>
                <option value="Booked">Booked</option>
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label>
              Location
              <input name="location" value={form.location} onChange={onChange} />
            </label>
            <label>
              Tagline
              <input name="tagline" value={form.tagline} onChange={onChange} />
            </label>
          </div>

          <label>
            Bio / description
            <textarea name="description" value={form.description} onChange={onChange} rows={4} />
          </label>

          <label>
            Image URL (optional)
            <input name="imageUrl" value={form.imageUrl} onChange={onChange} placeholder="https://... or leave empty" />
          </label>

          <label>
            Or upload image (under 5MB)
            <input type="file" accept="image/*" onChange={onPickFile} />
          </label>

          <label>
            Packages (comma or new line separated)
            <textarea name="sizesText" value={form.sizesText} onChange={onChange} rows={3} />
          </label>

          <label>
            Features (comma or new line separated)
            <textarea name="featuresText" value={form.featuresText} onChange={onChange} rows={3} />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.secondary} onClick={() => navigate("/performers")}>
              Cancel
            </button>
            <button type="submit" disabled={submitting} className={styles.primary}>
              {submitting ? "Submitting…" : "Submit & Go Live"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BecomePerformer;

