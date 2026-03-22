import { useState } from 'react';
import styles from './FilterBar.module.scss';

const FilterBar = ({ filters, onFilterChange, onClearFilters, isOpen, onClose }) => {
    const [priceRange, setPriceRange] = useState(filters.priceRange || [0, 1000]);

    const handleGenderChange = (gender) => {
        const updatedGenders = filters.gender.includes(gender)
            ? filters.gender.filter(g => g !== gender)
            : [...filters.gender, gender];
        onFilterChange('gender', updatedGenders);
    };

    const handleAvailabilityChange = (availability) => {
        onFilterChange('availability', availability);
    };

    const handlePriceRangeChange = (index, value) => {
        const newRange = [...priceRange];
        newRange[index] = parseInt(value);
        setPriceRange(newRange);
        onFilterChange('priceRange', newRange);
    };

    return (
        <div className={`${styles.filterBar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.filterHeader}>
                <h3>Filters</h3>
                <div className={styles.headerButtons}>
                    <button
                        className={styles.clearButton}
                        onClick={onClearFilters}
                    >
                        Clear All
                    </button>
                    <button
                        className={styles.closeButton}
                        onClick={onClose}
                        aria-label="Close filters"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    </button>
                </div>
            </div>

			{/* Search */}
			<div className={styles.filterSection}>
				<h4>Search</h4>
				<input
					type="text"
					value={filters.searchQuery || ''}
					onChange={(e) => onFilterChange('searchQuery', e.target.value)}
					placeholder="Search creators by name"
					className={styles.searchInput}
					aria-label="Search creators by name"
				/>
			</div>

            {/* Gender Filter */}
            <div className={styles.filterSection}>
                <h4>Gender</h4>
				<div className={styles.checkboxGroup}>
					{["Female", "Male", "Other"].map((gender) => (
                        <label key={gender} className={styles.checkboxLabel}>
                            <input
                                type="checkbox"
                                checked={filters.gender.includes(gender)}
                                onChange={() => handleGenderChange(gender)}
                            />
                            <span className={styles.checkmark}></span>
                            {gender}
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className={styles.filterSection}>
                <h4>Budget</h4>
                <div className={styles.priceRange}>
                    <div className={styles.priceInputs}>
                        <input
                            type="number"
                            placeholder="Min"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                            className={styles.priceInput}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                            className={styles.priceInput}
                        />
                    </div>
                    <div className={styles.rangeSlider}>
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[0]}
                            onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                            className={styles.slider}
                        />
                        <input
                            type="range"
                            min="0"
                            max="1000"
                            value={priceRange[1]}
                            onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                            className={styles.slider}
                        />
                    </div>
                </div>
            </div>

            {/* Availability Filter */}
            <div className={styles.filterSection}>
                <h4>Availability</h4>
                <div className={styles.radioGroup}>
                    {['All', 'In Stock', 'Out of Stock'].map(availability => (
                        <label key={availability} className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="availability"
                                checked={filters.availability === availability}
                                onChange={() => handleAvailabilityChange(availability)}
                            />
                            <span className={styles.radiomark}></span>
                            {availability}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
