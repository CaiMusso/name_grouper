
import React, {useState} from 'react';
import styles from './styles/NameGrouper.module.scss';
import { NavigationBar } from './components/NavigationBar';
import { BodyContainer } from './components/BodyContainer';

import family_groups from './family_groups.json'

const NameGrouper = () => {
  const [displayedIndex, setDisplayedIndex] = useState(0);

  return (
    <div style={{ height: "100%" }}> 

      <header className={styles.header}>
        <h1 style={{fontSize: "26px"}}>FAMILY NAME GROUPER</h1>
        <button className={styles.button} onClick={() => console.log('save file')}>SAVE FILE</button>
      </header>

      <div className={styles.body}>
          <BodyContainer groups = { family_groups } displayedIndex={displayedIndex}/>
      </div>

      <footer className={styles.footer}>
        <div className={styles.navigation_bar}>
          <NavigationBar groups = { family_groups } setDisplayedIndex={idx => setDisplayedIndex(idx)}/>
        </div>
      </footer>

    </div>
  );
}

export default NameGrouper;
