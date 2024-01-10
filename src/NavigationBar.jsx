
import React from 'react';
import styles from './styles/NavigationBar.module.scss';

export function NavigationBar(props) {
    const { groups } = props;

    return (
        <div className={styles.navigationBar}>
            {groups.map((group, index) => (
                <div key={index} className={styles.card}>
                    { group }
                </div>
            ))}
        </div>
    );
}

NavigationBar.defaultProps = {
    groups: []
};
