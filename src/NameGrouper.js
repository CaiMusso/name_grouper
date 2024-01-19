import React, { useEffect, useState } from "react";
import styles from "./styles/NameGrouper.module.scss";
import { NavigationBar } from "./components/NavigationBar";
import { BodyContainer } from "./components/BodyContainer";
import { FileUploader } from "./components/FileUploader";
import { LuDownload } from "react-icons/lu";
import { FaObjectUngroup } from "react-icons/fa6";
import { FaChrome } from "react-icons/fa";

const NameGrouper = () => {
  const [displayedIndex, setDisplayedIndex] = useState(0);
  const [groupsToDownload, setGroupsToDownload] = useState([]);
  const [groupsToDownloadFiltered, setGroupsToDownloadFiltered] = useState([]);
  const [variationsInfo, setVariationsInfo] = useState([]);
  const [showUploadFile, setShowUploadFile] = useState(true);
  const [filteredQuery, setFilteredQuery] = useState("");

  const handleDownloadJson = () => {
    groupsToDownload.map((group) => {
      if (
        group.links_to_verify.length > 0 &&
        !group.links_to_verify.includes(
          "!! note: use 'linkID' to link, std_name could have been changed during the process"
        )
      ) {
        group.links_to_verify = [
          "!! note: use 'linkID' to link, std_name could have been changed during the process",
          ...group.links_to_verify,
        ];
      }
    });

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

  useEffect(() => {
    setGroupsToDownloadFiltered(filterGroups());
  }, [filteredQuery]);

  function filterGroups() {
    const filteredGroups = groupsToDownload.filter((group) => {
      const nameVariations = group.name_variations.map((variation) =>
        variation.toLowerCase()
      );
      const lowercaseQuery = filteredQuery.toLowerCase();
      const mentionsContain = nameVariations.some((variation) => variation.includes(lowercaseQuery))
      return group.std_name.includes(lowercaseQuery) || mentionsContain
    });

    return filteredGroups;
  }

  function setNameToDisplay(name) {
    const groupIndex = groupsToDownload.findIndex(
      (group) => group.std_name === name
    );
    if (groupIndex === -1) return;
    setDisplayedIndex(groupIndex);
  }

  return (
    <div style={{ height: "100%" }}>
      <header className={styles.header}>
        <div
          className={styles.homeButton}
          onClick={() => window.location.reload()}
        >
          <div className={styles.homeIcon}>
            <FaObjectUngroup
              size={30}
              style={{ margin: "3px", marginLeft: "8px", marginRight: "8px" }}
            />
          </div>
          <div className={styles.homeTitle}>
            <div style={{ fontSize: "26px", fontWeight: "600" }}>
              NAME GROUPER
            </div>
            <div className={styles.hint}>
              best use on Google Chrome
              <FaChrome size={14} style={{ marginLeft: "5px" }} />
            </div>
          </div>
        </div>
        <button className={styles.button} onClick={handleDownloadJson}>
          DOWNLOAD FILE
          <LuDownload style={{ margin: "1px", marginLeft: "10px" }} />
        </button>
      </header>

      {showUploadFile && (
        <FileUploader
          setGroupsFromFile={(groups) => setGroupsToDownload(groups)}
          setAdditionalInfoFromFile={(info) => setVariationsInfo(info)}
          start={() => setShowUploadFile(false)}
        />
      )}

      {!showUploadFile && (
        <div className={styles.body}>
          <BodyContainer
            groups={groupsToDownload}
            displayedIndex={displayedIndex}
            variationsInfo={variationsInfo}
            setGroupsToParent={(groups) => setGroupsToDownload(groups)}
            updateIndexToParent={(idx) => setDisplayedIndex(idx)}
          />
        </div>
      )}

      <footer className={styles.footer}>
        {!showUploadFile && (
          <>
            <input
              style={{
                width: "calc(100% - 25px)",
                height: "18px",
                padding: "6px",
                marginLeft: "10px",
                backgroundColor: "#ffffffa3",
                borderRadius: "5px",
              }}
              type="text"
              value={filteredQuery}
              placeholder="Search for a name"
              onChange={(event) => setFilteredQuery(event.target.value)}
            />
            <div className={styles.navigation_bar}>
              <NavigationBar
                groups={
                  filteredQuery.length > 0
                    ? groupsToDownloadFiltered
                    : groupsToDownload
                }
                setNameToDisplay={(name) => setNameToDisplay(name)}
              />
            </div>
          </>
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
