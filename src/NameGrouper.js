
import React, {useState} from 'react';
import styles from './styles/NameGrouper.module.scss';
import { NavigationBar } from './components/NavigationBar';
import { BodyContainer } from './components/BodyContainer';

import family_groups from './family_groups.json'

const NameGrouper = () => {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [groupsToDownload, setGroupsToDownload] = useState(family_groups);

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(groupsToDownload, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, '-');
    const filename = `family_groups_${timestamp}.json`;

    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ height: "100%" }}> 

      <header className={styles.header}>
        <h1 style={{fontSize: "26px"}}>FAMILY NAME GROUPER</h1>
        <button className={styles.button} onClick={handleDownloadJson}>DOWNLOAD FILE</button>
      </header>

      <div className={styles.body}>
          <BodyContainer 
            groups = { family_groups } 
            displayedIndex={displayedIndex}
            setGroupsToParent={groups => {
              setGroupsToDownload(groups)
            }}
          />
      </div>

      <footer className={styles.footer}>
        <div className={styles.navigation_bar}>
          <NavigationBar 
            groups = { groupsToDownload } 
            setDisplayedIndex={idx => setDisplayedIndex(idx)}
          />
        </div>

        <div className={styles.copyright}>
          © NameGrouper WebApp, 2024, Digital Humanities Laboratory - EPFL, All Rights Reserved.
        </div>
      </footer>

    </div>
  );
}

export default NameGrouper;
