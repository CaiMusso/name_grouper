
import React from 'react';
import styles from '../styles/NavigationBar.module.scss';

export function NavigationBar(props) {
    const { groups } = props;

    return (
        <div className={styles.navigationBar}>
            {groups.map((group, index) => (
                <div 
                    key={index} 
                    className={styles.card}
                    onClick={() => props.setDisplayedIndex(index)}
                >
                    { group['std_name'] }
                </div>
            ))}
        </div>
    );
}

NavigationBar.defaultProps = {
    groups: [],
    setDisplayedIndex: () => console.log("Missing props in NavigationBar")
};
