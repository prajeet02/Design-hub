import { useEffect, useState } from 'react';
import styles from './ExpandedProductModal.module.scss';

const ExpandedProductModal = ({ product, onClose, onAddToCart }) => {
    const [activeTab, setActiveTab] = useState('posts');
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        // Prevent body scroll when modal is open
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    const { title, price, image, availability, gender, originalPrice, description, features } = product;

    const isOnSale = originalPrice && originalPrice > price;
    const discountPercentage = isOnSale ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSubscribe = () => {
        if (availability !== 'Booked' && onAddToCart && !isSubscribed) {
            onAddToCart(product);
            setIsSubscribed(true);
            // Optional: Auto-close modal after a delay
            setTimeout(() => {
                onClose();
            }, 1500);
        }
    };

    // Mock data for posts and media
    const mockPosts = [
        { id: 1, type: 'image', thumbnail: image, title: 'Professional Shoot' },
        { id: 2, type: 'video', thumbnail: image, title: 'Behind the Scenes', duration: '2:30' },
        { id: 3, type: 'image', thumbnail: image, title: 'Fashion Editorial' },
        { id: 4, type: 'image', thumbnail: image, title: 'Beauty Portrait' },
        { id: 5, type: 'video', thumbnail: image, title: 'Runway Walk', duration: '1:45' },
        { id: 6, type: 'image', thumbnail: image, title: 'Lifestyle Shoot' },
    ];

    const mockMedia = [
        { id: 1, type: 'video', thumbnail: image, duration: '5:20' },
        { id: 2, type: 'video', thumbnail: image, duration: '3:15' },
        { id: 3, type: 'video', thumbnail: image, duration: '4:30' },
        { id: 4, type: 'video', thumbnail: image, duration: '2:45' },
    ];

    return (
        <div className={styles.overlay} onClick={handleOverlayClick}>
            <div className={styles.modal}>
                <button className={styles.closeButton} onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                </button>

                <div className={styles.content}>
                    {/* Header Section with Cover Image */}
                    <div className={styles.headerSection}>
                        <div className={styles.coverImage}>
                            <img src={image} alt={title} />
                            {isOnSale && (
                                <div className={styles.saleTag}>
                                    -{discountPercentage}%
                                </div>
                            )}
                        </div>

                        <div className={styles.profileInfo}>
                            <div className={styles.profileImage}>
                                <img src={image} alt={title} />
                                <div className={styles.onlineIndicator}></div>
                            </div>

                            <div className={styles.modelDetails}>
                                <h1 className={styles.modelName}>{title}</h1>
                                <div className={styles.modelMeta}>
                                    <span className={styles.username}>@{title.toLowerCase().replace(' ', '')}</span>
                                    <span className={`${styles.availability} ${availability === 'Available' ? styles.available : styles.booked}`}>
                                        {availability === 'Available' ? 'Available now' : 'Currently booked'}
                                    </span>
                                </div>

                                <div className={styles.stats}>
                                    <div className={styles.stat}>
                                        <span className={styles.statNumber}>284</span>
                                        <span className={styles.statLabel}>POSTS</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statNumber}>308</span>
                                        <span className={styles.statLabel}>MEDIA</span>
                                    </div>
                                    <div className={styles.stat}>
                                        <span className={styles.statNumber}>113.0K</span>
                                        <span className={styles.statLabel}>LIKES</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className={styles.aboutSection}>
                        <p className={styles.tagline}>Adrenaline junkie, getting your heart racing 😈</p>
                        <div className={styles.subscribeInfo}>
                            <span className={styles.subscribeText}>Subscribe to my VIP ❤️ 👇</span>
                            <div className={styles.priceContainer}>
                                <span className={styles.currentPrice}>${price}/month</span>
                                {isOnSale && (
                                    <span className={styles.originalPrice}>${originalPrice}</span>
                                )}
                            </div>
                        </div>
                        <p className={styles.description}>{description}</p>

                        <div className={styles.location}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            <span>Gold Coast</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className={styles.actions}>
                        <button
                            className={styles.subscribeButton}
                            disabled={availability === 'Booked' || isSubscribed}
                            onClick={handleSubscribe}
                        >
                            {availability === 'Booked'
                                ? 'Currently Booked'
                                : isSubscribed
                                    ? 'SUBSCRIBED ✓'
                                    : 'SUBSCRIBE'
                            }
                        </button>
                    </div>

                    {/* Tabs Section */}
                    <div className={styles.tabsSection}>
                        <div className={styles.tabs}>
                            <button
                                className={`${styles.tab} ${activeTab === 'posts' ? styles.active : ''}`}
                                onClick={() => setActiveTab('posts')}
                            >
                                <span className={styles.tabCount}>284</span> POSTS
                            </button>
                            <button
                                className={`${styles.tab} ${activeTab === 'media' ? styles.active : ''}`}
                                onClick={() => setActiveTab('media')}
                            >
                                <span className={styles.tabCount}>308</span> MEDIA
                            </button>
                        </div>

                        {/* Content Grid */}
                        <div className={styles.contentGrid}>
                            {activeTab === 'posts' && mockPosts.map(post => (
                                <div key={post.id} className={styles.contentItem}>
                                    <img src={post.thumbnail} alt={post.title} />
                                    {post.type === 'video' && (
                                        <div className={styles.videoOverlay}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                            <span className={styles.duration}>{post.duration}</span>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {activeTab === 'media' && mockMedia.map(media => (
                                <div key={media.id} className={styles.contentItem}>
                                    <img src={media.thumbnail} alt="Media content" />
                                    <div className={styles.videoOverlay}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                                            <path d="M8 5v14l11-7z"/>
                                        </svg>
                                        <span className={styles.duration}>{media.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExpandedProductModal;
