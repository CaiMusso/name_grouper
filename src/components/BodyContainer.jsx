import React, { useState, useEffect } from "react";
import styles from "../styles/BodyContainer.module.scss";
import { NameGroupCard } from "./NameGroupCard";
import { InfoCard } from "./InfoCard";

export function BodyContainer(props) {
  const {
    groups,
    displayedIndex,
    variationsInfo,
    setGroupsToParent,
    updateIndexToParent,
  } = props;

  const [groupsToDownload, setGroupsToDownload] = useState(groups);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedNameVariationInfo, setSelectedNameVariationInfo] =
    useState(null);
  const variationsToResultCount = setPerVariationNumberOfResults(variationsInfo);
  const [displayInfo, setDisplayInfo] = useState(false);

  function setGroups(groups) {
    setGroupsToDownload(groups);
    setGroupsToParent(groups);
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      updateIndexToParent(currentIndex - 1);
      setDisplayInfo(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < groupsToDownload.length - 1) {
      updateIndexToParent(currentIndex + 1);
      setDisplayInfo(false);
    }
  };

  useEffect(() => {
    if (displayedIndex !== currentIndex) {
      setCurrentIndex(displayedIndex);
      setDisplayInfo(false);
    }
  }, [displayedIndex, currentIndex]);

  function setDoneToGroup(done) {
    let groupsToDownloadCopy = [...groupsToDownload];
    groupsToDownloadCopy[currentIndex].resolved = done;
    setGroups(groupsToDownloadCopy);
    return;
  }

  function setInfoForNameVariation(nameVariation) {
    const variationIdx = variationsInfo.findIndex(
      (elem) => elem.std_name === nameVariation
    );

    if (variationIdx !== -1) {
      setSelectedNameVariationInfo(variationsInfo[variationIdx]);
    }
    setDisplayInfo(true);
  }

  function setPerVariationNumberOfResults(info) {
    if (info) {
      const variations = {};
      info.forEach((variation) => {
        variations[variation.std_name] = variation.info.length;
      });
      return variations;
    }
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
        linkID: groupsToDownloadCopy.length,
        resolved: false,
        std_name: groupName,
        name_variations: variations,
        links_to_verify: [] 
      }

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
            selectVariationForInfo={(nameVariation) =>
              setInfoForNameVariation(nameVariation)
            }
            variationsToResultCount={variationsToResultCount}
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

              const toLinkIdx = groupsToDownloadCopy.findIndex(
                (group) => group.linkID === idLinkTo
              );
              if (toLinkIdx !== -1) {
                groupsToDownloadCopy[currentIndex].links_to_verify.push({
                  linkID: groupsToDownloadCopy[toLinkIdx].linkID,
                  std_name: groupsToDownloadCopy[toLinkIdx].std_name,
                });
                groupsToDownloadCopy[toLinkIdx].links_to_verify.push({
                  linkID: groupsToDownloadCopy[currentIndex].linkID,
                  std_name: groupsToDownloadCopy[currentIndex].std_name,
                });

                setGroups(groupsToDownloadCopy);
              }
            }}
            saveDone={(done) => setDoneToGroup(done)}
          />
        )}
      </div>

      {displayInfo && (
        <div className={styles.variationInfoContainer}>
          <InfoCard
            additionalInfo={selectedNameVariationInfo}
            currentIndex={currentIndex}
          />
        </div>
      )}

      <div className={styles.arrowContainer} onClick={handleNext}>
        <span className={styles.arrowRight}>&rarr;</span>
      </div>
    </div>
  );
}

BodyContainer.defaultProps = {
  groups: [],
  displayedIndex: 0,
  variationsInfo: [],
};
