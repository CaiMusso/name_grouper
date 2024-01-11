
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
                    <div className={styles.card_text}> 
                        <div style={{width: '100px', fontSize: '12px'}}> 
                            { index }
                        </div>
                        
                        <div className={styles.card_std_name}> 
                            { group['std_name'].toUpperCase() }
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

NavigationBar.defaultProps = {
    groups: [],
    setDisplayedIndex: () => console.log("Missing props in NavigationBar")
};
