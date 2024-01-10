
import React, { useState, useEffect } from 'react';
import styles from '../styles/BodyContainer.module.scss';
import { NameGroupCard } from './NameGroupCard';

export function BodyContainer(props) {
    const { groups, displayedIndex } = props;
    const [currentIndex, setCurrentIndex] = useState(0);

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < groups.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    useEffect(() => {
        if (displayedIndex !== currentIndex) {
            setCurrentIndex(displayedIndex);
        }
    }, [displayedIndex]);

    return (
        <div className={styles.bodyContainer}>
            <div className={styles.arrowContainer} onClick={handlePrevious}>
                <span className={styles.arrowLeft}>&larr;</span>
            </div>

            <div className={styles.cardContainer}>
                {groups[currentIndex] && <NameGroupCard group={groups[currentIndex]} numberOfVariations={groups[currentIndex]['name_variations'].length} />}
            </div>
            <div className={styles.arrowContainer} onClick={handleNext}>
                <span className={styles.arrowRight}>&rarr;</span>
            </div>
        </div>
    );
}

BodyContainer.defaultProps = {
    groups: [],
    displayedIndex: 0
};
