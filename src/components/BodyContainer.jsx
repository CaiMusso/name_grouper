import React, { useState, useEffect } from "react";
import styles from "../styles/BodyContainer.module.scss";
import { NameGroupCard } from "./NameGroupCard";

export function BodyContainer(props) {
  const { groups, displayedIndex, setGroupsToParent, updateIndexToParent } = props;

  const [groupsToDownload, setGroupsToDownload] = useState(groups);
  const [currentIndex, setCurrentIndex] = useState(0);

  function setGroups(groups) {
    setGroupsToDownload(groups);
    setGroupsToParent(groups);
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      updateIndexToParent(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < groupsToDownload.length - 1) {
      updateIndexToParent(currentIndex + 1);
    }
  };

  useEffect(() => {
    if (displayedIndex !== currentIndex) {
      setCurrentIndex(displayedIndex);
    }
  }, [displayedIndex, currentIndex]);

  function setDoneToGroup(done) {
    let groupsToDownloadCopy = [...groupsToDownload];
    groupsToDownloadCopy[currentIndex].resolved = done
    setGroups(groupsToDownloadCopy);
    return;
  }

  function ungroup(operation, variations) {
    let groupsToDownloadCopy = [...groupsToDownload];
    const groupIndex = groupsToDownloadCopy.findIndex(
      (group) => group.std_name === "*ungrouped*"
    );

    groupsToDownloadCopy[groupIndex].name_variations = [
      ...groupsToDownloadCopy[groupIndex].name_variations,
      ...variations,
    ];

    groupsToDownloadCopy[currentIndex].name_variations = groupsToDownloadCopy[
      currentIndex
    ].name_variations.filter((name) => !variations.includes(name));

    if (operation === "ungroup_all") {
      groupsToDownloadCopy = [
        ...groupsToDownloadCopy.slice(0, currentIndex),
        ...groupsToDownloadCopy.slice(currentIndex + 1),
      ];
    }

    setGroups(groupsToDownloadCopy);
  }

  function moveNamesToOtherGroup(operation, groupName, variations) {
    let groupsToDownloadCopy = [...groupsToDownload];
    const groupIndex = groupsToDownloadCopy.findIndex(
      (group) => group.std_name === groupName
    );

    if (operation.includes("new_")) {
      const newGroup = {
        resolved: false,
        std_name: groupName,
        name_variations: variations,
      };

      groupsToDownloadCopy = [
        ...groupsToDownloadCopy.slice(0, currentIndex + 1),
        newGroup,
        ...groupsToDownloadCopy.slice(currentIndex + 1),
      ];

      groupsToDownloadCopy[currentIndex].name_variations = groupsToDownloadCopy[
        currentIndex
      ].name_variations.filter((name) => !variations.includes(name));

      if (operation === "new_move_all") {
        groupsToDownloadCopy = [
          ...groupsToDownloadCopy.slice(0, currentIndex),
          ...groupsToDownloadCopy.slice(currentIndex + 1),
        ];

        groupsToDownloadCopy.filter((group) => group.std_name === groupName);
      }

      setGroups(groupsToDownloadCopy);
      return;
    }

    groupsToDownloadCopy[groupIndex].name_variations = [
      ...groupsToDownloadCopy[groupIndex].name_variations,
      ...variations,
    ];

    groupsToDownloadCopy[currentIndex].name_variations = groupsToDownloadCopy[
      currentIndex
    ].name_variations.filter((name) => !variations.includes(name));

    if (operation === "move_all") {
      groupsToDownloadCopy = [
        ...groupsToDownloadCopy.slice(0, currentIndex),
        ...groupsToDownloadCopy.slice(currentIndex + 1),
      ];
    }

    setGroups(groupsToDownloadCopy);
  }

  return (
    <div className={styles.bodyContainer}>
      <div className={styles.arrowContainer} onClick={handlePrevious}>
        <span className={styles.arrowLeft}>&larr;</span>
      </div>

      <div className={styles.cardContainer}>
        {groupsToDownload[currentIndex] && (
          <NameGroupCard
            groups={groupsToDownload}
            idx={currentIndex}
            group={groupsToDownload[currentIndex]}
            numberOfVariations={
              groupsToDownload[currentIndex].name_variations.length
            }
            
            changeGroupName={(newName) => {
              let groupsToDownloadCopy = [...groupsToDownload];
              groupsToDownloadCopy[currentIndex].std_name = newName;
              setGroups(groupsToDownloadCopy);
            }}

            moveNamesToOtherGroup={(operation, groupName, variations) =>
              moveNamesToOtherGroup(
                operation,
                groupName.toLowerCase(),
                variations
              )
            }
            ungroup={(operation, variations) => ungroup(operation, variations)}
            linkWithOtherGroup={(idLinkTo) => {
              let groupsToDownloadCopy = [...groupsToDownload];
              
              const toLinkIdx = groupsToDownloadCopy.findIndex(group => group.id === idLinkTo)
              if (toLinkIdx !== -1) {
                groupsToDownloadCopy[currentIndex].links_to_verify.push({
                  "id": groupsToDownloadCopy[toLinkIdx].id,
                  "std_name": groupsToDownloadCopy[toLinkIdx].std_name,
                })
                groupsToDownloadCopy[toLinkIdx].links_to_verify.push({
                  "id": groupsToDownloadCopy[currentIndex].id,
                  "std_name": groupsToDownloadCopy[currentIndex].std_name,
                })

                setGroups(groupsToDownloadCopy);
              }
            }}
            saveDone={(done) => setDoneToGroup(done)}
          />
        )}
      </div>
      <div className={styles.arrowContainer} onClick={handleNext}>
        <span className={styles.arrowRight}>&rarr;</span>
      </div>
    </div>
  );
}

BodyContainer.defaultProps = {
  groups: [],
  displayedIndex: 0,
};
