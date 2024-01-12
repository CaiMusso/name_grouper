import React, { useState } from "react";
import styles from "./styles/NameGrouper.module.scss";
import { NavigationBar } from "./components/NavigationBar";
import { BodyContainer } from "./components/BodyContainer";
import { FileUploader } from "./components/FileUploader";

const NameGrouper = () => {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [groupsToDownload, setGroupsToDownload] = useState([]);
  const [showUploadFile, setShowUploadFile] = useState(true);

  const handleDownloadJson = () => {
    const jsonStr = JSON.stringify(groupsToDownload, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    const date = new Date();
    const timestamp = date.toISOString().replace(/[:.]/g, "-");
    const filename = `family_groups_idx${displayedIndex}_${timestamp}.json`;

    a.download = filename;
    a.href = url;
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // SAFE STOP in case browser window is reloaded or closed
  window.addEventListener("beforeunload", (event) => {
    if (groupsToDownload.length === 0) return;

    event.preventDefault();
    event.returnValue = "";
  });

  return (
    <div style={{ height: "100%" }}>
      <header className={styles.header}>
        <h1 style={{ fontSize: "26px" }}>FAMILY NAME GROUPER</h1>
        <button className={styles.button} onClick={handleDownloadJson}>
          DOWNLOAD FILE
        </button>
      </header>

      {showUploadFile && (
        <FileUploader
          setGroupsFromFile={(groups) => {
            setGroupsToDownload(groups);
            setShowUploadFile(false);
          }}
        />
      )}

      {!showUploadFile && (
        <div className={styles.body}>
          <BodyContainer
            groups={groupsToDownload}
            displayedIndex={displayedIndex}
            setGroupsToParent={(groups) => {
              setGroupsToDownload(groups);
            }}
            updateIndexToParent={(idx) => setDisplayedIndex(idx)}
          />
        </div>
      )}

      <footer className={styles.footer}>
        {!showUploadFile && (
          <div className={styles.navigation_bar}>
            <NavigationBar
              groups={groupsToDownload}
              setDisplayedIndex={(idx) => setDisplayedIndex(idx)}
            />
          </div>
        )}

        <div className={styles.copyright}>
          © NameGrouper WebApp, 2024, Digital Humanities Laboratory - EPFL, All
          Rights Reserved.
        </div>
      </footer>
    </div>
  );
};

export default NameGrouper;
