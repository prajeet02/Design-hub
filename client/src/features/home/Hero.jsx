import { useEffect, useMemo, useState } from "react";
import styles from "../../pages/home/Home.module.scss";
import PrimaryButton from "../../components/button/primarybutton/PrimaryButton";
import RotatingCard from "../../components/card/rotatingcard/RotatingCard";
import HoverCard from "../../components/card/hovercard/HoverCard";
import PricingCard from "../../components/card/pricingcard/PricingCard";
import ProductCard from "../../components/productcard/ProductCard";
import { apiFetch } from "../../auth/api";
import ExpandedProductModal from "../PerformersPage/ExpandedProductModal/ExpandedProductModal";

import model1 from "../../assets/images/models/1.jpg";
import model2 from "../../assets/images/models/2.jpg";
import model3 from "../../assets/images/models/3.jpg";
import model4 from "../../assets/images/models/4.jpg";
import model5 from "../../assets/images/models/5.jpg";
import model6 from "../../assets/images/models/6.jpg";

const FALLBACK_IMAGES = [model1, model2, model3, model4, model5, model6];

const mergeUniquePerformers = (primary, secondary) => {
	const out = [];
	const seen = new Set();
	for (const item of [...(primary || []), ...(secondary || [])]) {
		const key = item?.id || item?._id || item?.title;
		if (!key || seen.has(key)) continue;
		seen.add(key);
		out.push(item);
	}
	return out;
};

const demoPerformers = [
	{
		id: "demo-1",
		title: "Sophia Elite",
		price: 299,
		originalPrice: 399,
		image: model1,
		availability: "Available",
		gender: "Female",
		description:
			"Premium creator with exclusive content, 1:1 experiences, and VIP-only drops.",
	},
	{
		id: "demo-2",
		title: "Isabella Luxe",
		price: 249,
		originalPrice: 349,
		image: model2,
		availability: "Available",
		gender: "Female",
		description:
			"Luxury vibes, daily posts, private chat perks, and surprise premium bundles.",
	},
	{
		id: "demo-3",
		title: "Aria VIP",
		price: 199,
		originalPrice: 299,
		image: model3,
		availability: "Booked",
		gender: "Female",
		description:
			"High-demand performer — limited availability, elite content, and VIP access.",
	},
	{
		id: "demo-4",
		title: "Mia Premium",
		price: 179,
		originalPrice: 249,
		image: model4,
		availability: "Available",
		gender: "Female",
		description:
			"Premium content library with weekly exclusives and priority responses.",
	},
	{
		id: "demo-5",
		title: "Emma Private",
		price: 159,
		originalPrice: 219,
		image: model5,
		availability: "Available",
		gender: "Female",
		description:
			"Private-style experience, curated premium sets, and VIP-only live moments.",
	},
	{
		id: "demo-6",
		title: "Olivia Signature",
		price: 209,
		originalPrice: 289,
		image: model6,
		availability: "Booked",
		gender: "Female",
		description:
			"Signature creator — cinematic content, premium drops, and elite fan perks.",
	},
];

const Hero = () => {
	const [performers, setPerformers] = useState(demoPerformers);
	const [selectedPerformer, setSelectedPerformer] = useState(null);

	const normalizeForModal = (p) => {
		const title = p?.title || p?.name || p?.stageName || "Performer";
		const availability = p?.availability || "Available";
		const price = typeof p?.price === "number" && !Number.isNaN(p.price) ? p.price : 199;
		const image =
			p?.image ||
			p?.imageUrl ||
			(Array.isArray(p?.images) && p.images.length > 0 ? p.images[0] : null) ||
			FALLBACK_IMAGES[0];
		const description =
			p?.description ||
			"Exclusive premium performer on DesireHub. Subscribe for VIP content and experiences.";

		return {
			...p,
			title,
			availability,
			price,
			image,
			description,
		};
	};

	const openPerformer = (p) => setSelectedPerformer(normalizeForModal(p));
	const closePerformer = () => setSelectedPerformer(null);

	useEffect(() => {
		let mounted = true;
		(async () => {
			try {
				const data = await apiFetch("/api/v1/models", { method: "GET" });
				const list = Array.isArray(data?.models) ? data.models : [];
				if (!mounted || list.length === 0) return;

					const mapped = list.map((m, idx) => ({
						id: m?._id || m?.id || `model-${idx}`,
						title: m?.title || m?.name || m?.stageName || "Performer",
						price: m?.price,
						originalPrice: m?.originalPrice,
						description: m?.description,
						tagline: m?.tagline,
						location: m?.location,
						image:
							(m?.imageUrl && String(m.imageUrl).trim().length > 0
								? m.imageUrl
								: m?.image) ||
							FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length],
						availability: m?.availability,
						gender: m?.gender,
					}));

					if (mounted) setPerformers((prev) => mergeUniquePerformers(mapped, prev));
			} catch {
				// keep demo performers when API isn't available
			}
		})();
		return () => {
			mounted = false;
		};
	}, []);

	const orbitPerformers = useMemo(() => {
		const source = performers.length > 0 ? performers : demoPerformers;
		const target = 10;
		const out = [];
		for (let i = 0; i < target; i++) out.push(source[i % source.length]);
		return out;
	}, [performers]);

	const featuredPerformers = useMemo(() => {
		const source = performers.length > 0 ? performers : demoPerformers;
		return source.slice(0, 5);
	}, [performers]);

  return (
    <>
      {/* Hero Header Section */}
      <div className={styles["hero-header"]}>
        <h1 className={styles["hero-title"]}>Welcome to DesireHub</h1>
        <p className={styles["hero-subtitle"]}>
          Your premier destination for exclusive content and premium experiences
        </p>
      </div>

      {/* Hero Buttons Section */}
      <div className={styles["hero-buttons"]}>
        <PrimaryButton text="Get Started" hasGlow={true} />
        <PrimaryButton text="Learn More" hasGlow={true} />
      </div>

      {/* Cards Section */}
      <div className={styles["cards-section"]}>
	        {/* Rotating Cards Section */}
	        <div className={styles["rotating-section"]}>
		        <div className={styles["rotating-card-wrapper"]}>
			        <RotatingCard items={orbitPerformers} onItemClick={openPerformer} />
		        </div>
	        </div>

        {/* Hover Cards Section */}
        <div className={styles["hover-cards-container"]}>
          <HoverCard
            firstContent="Premium"
            secondContent="Exclusive Access"
            color1="43, 26, 71"
            color2="160, 132, 232"
          />
          <HoverCard
            firstContent="VIP"
            secondContent="Special Features"
            color1="68, 71, 75"
            color2="212, 175, 55"
          />
        </div>
      </div>

      {/* Section Divider */}
      <div className={styles["section-divider"]}></div>

      {/* Pricing Section */}
      <div className={styles["pricing-section"]}>
        <h2 className={styles["pricing-title"]}>Choose Your Plan</h2>
        <div className={styles["pricing-cards-container"]}>
          <PricingCard />
          <PricingCard />
          <PricingCard />
        </div>
      </div>

      {/* Section Divider */}
      <div className={styles["section-divider"]}></div>

      {/* Performers Section */}
	      <div className={styles["performers-section"]}>
	        <h2 className={styles["performers-title"]}>Featured Performers</h2>
	        <div className={styles["performers-container"]}>
		        {featuredPerformers.map((p) => (
			          <ProductCard
			            key={p.id || p.title}
			            product={p}
			            onClick={() => openPerformer(p)}
			          />
		        ))}
	        </div>
	      </div>

			{selectedPerformer ? (
				<ExpandedProductModal
					product={selectedPerformer}
					onClose={closePerformer}
					onAddToCart={() => {}}
				/>
			) : null}
    </>
  );
};

export default Hero;
