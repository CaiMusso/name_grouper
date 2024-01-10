
import React from 'react';
import styles from './styles/FamilyNameGrouper.module.scss';
import { NavigationBar } from './NavigationBar';

const FamilyNameGrouper = () => {
  return (
    <div style={{ height: "100%" }}> 
      <header className={styles.header}>
        <h1 style={{fontSize: "26px"}}>FAMILY NAME GROUPER</h1>
        <button onClick={() => console.log('save file')}>SAVE FILE</button>
      </header>
      <div className={styles.body}></div>
      <footer className={styles.footer}>
        <div className={styles.navigation_bar}>
          <NavigationBar groups = {["ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao", "ciao"]}/>
        </div>
      </footer>
    </div>
  );
}

export default FamilyNameGrouper;
