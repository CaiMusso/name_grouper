
import React, { useState } from 'react';
import styles from '../styles/NameGroupCard.module.scss';

export function NameGroupCard(props) {
    const { group, numberOfVariations } = props;
    const [selectedVariations, setSelectedVariations] = useState([]);
    console.log("selectedVariations: ", selectedVariations);

    const handleSelectionChange = (variation) => {
        setSelectedVariations(prevSelected => {
            if (prevSelected.includes(variation)) {
                return prevSelected.filter(item => item !== variation);
            }
            return [...prevSelected, variation];
        });
    };

    return (
        <div className={styles.NameGroupCard}>
            <div className={styles.standardName}>{group.std_name}</div>
            <div style={{marginLeft: '10px'}}> There are <b>{numberOfVariations}</b> different variations.</div>
            <div className={styles.variations}>
                {group.name_variations.map((variation, index) => (
                    <div key={index} className={styles.variation}>
                        <input
                            type='checkbox'
                            id={`checkbox-${index}`}
                            checked={selectedVariations.includes(variation)}
                            onChange={() => handleSelectionChange(variation)}
                        />
                        <label htmlFor={`checkbox-${index}`}>{variation}</label>
                    </div>
                ))}
            </div>
            <div className={styles.actionButtons}>
                <button className={styles.button} onClick={() => console.log('MOVE TO OTHER GROUP')}>MOVE TO OTHER GROUP</button>
                <button className={styles.button} onClick={() => console.log('UNGROUP')}>UNGROUP</button>
            </div>
            <div className={styles.mergeButton}>
                <button className={styles.button} onClick={() => console.log('MERGE TO OTHER GROUP')}>MERGE ALL TO OTHER GROUP</button>
                <button className={styles.button} onClick={() => console.log('MERGE TO OTHER GROUP')}>UNGROUP ALL</button>
            </div>
            <div className={styles.doneButton}>
                <button className={styles.button} onClick={() => console.log('MARK AS DONE')}>MARK AS DONE</button>
            </div>
        </div>
    );
}

NameGroupCard.defaultProps = {
    group: {
        std_name: 'empty',
        name_variations: []
    },
    numberOfVariations: 0
};
