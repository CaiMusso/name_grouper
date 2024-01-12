import React, { useEffect, useState } from "react";
import styles from "../styles/NameGroupCard.module.scss";
import { GroupListPopUp } from "./GroupListPopUp";

export function NameGroupCard(props) {
  const {
    groups,
    idx,
    group,
    numberOfVariations,
    moveNamesToOtherGroup,
    ungroup,
    saveDone
  } = props;

  const [done, setDone] = useState(group.resolved);
  const [selectedAll, setSelectedAll] = useState(false);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [visilibityGroupListPopUp, setVisilibityGroupListPopUp] =
    useState(false);
const groupsFilteredPopUp = groups.slice(0, idx).concat(groups.slice(idx + 1))

  useEffect(() => {
    setSelectedVariations([]);
    setDone(group.resolved)
  }, [group]);

  const handleSelectionChange = (variation) => {
    setSelectedVariations((prevSelected) => {
      if (prevSelected.includes(variation)) {
        return prevSelected.filter((item) => item !== variation);
      }
      return [...prevSelected, variation];
    });
  };

  return (
    <div className={styles.NameGroupCard}>
      <div className={styles.indexContainer}> 
        {idx} 
        <div> {idx+1} of {groups.length} </div>
      </div>
      <div className={styles.standardName}>{group.std_name.toUpperCase()}</div>
      <div style={{ marginLeft: "10px" }}>
        {" "}
        There are <b>{numberOfVariations}</b> different variations.
      </div>
      <div className={styles.variations}>
        {group.name_variations.map((variation, index) => (
          <div key={index} className={styles.variation}>
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              checked={selectedVariations.includes(variation)}
              onChange={() => handleSelectionChange(variation)}
            />
            <label htmlFor={`checkbox-${index}`}>{variation}</label>
          </div>
        ))}
      </div>

      {!done && (
        <>
          <div className={styles.actionButtons}>
            <button
              className={styles.button}
              style={{ backgroundColor: "#4c96af" }}
              onClick={() => {
                if (selectedVariations.length === 0) {
                  alert("Please select at least one variation");
                } else {
                  setVisilibityGroupListPopUp(true);
                }
              }}
            >
              MOVE TO OTHER GROUP
            </button>

            <button
              className={styles.button}
              style={{ backgroundColor: "#af694c" }}
              onClick={() => {
                if (selectedVariations.length === 0) {
                  alert("Please select at least one variation");
                } else {
                  if (
                    selectedVariations.length === numberOfVariations
                  ) {
                    ungroup("ungroup_all", selectedVariations);
                    return;
                  }

                  ungroup("ungroup", selectedVariations);
                }
              }}
            >
              UNGROUP
            </button>
          </div>

          {visilibityGroupListPopUp && (
            <GroupListPopUp
              groups={groupsFilteredPopUp}
              onSelectGroup={(group) => {
                let operation =
                  selectedAll || selectedVariations.length === numberOfVariations
                    ? "move_all"
                    : "move_selected";
                moveNamesToOtherGroup(operation, group, selectedVariations);
              }}
              onCreateNewGroup={(newGroup) => {
                let operation =
                  selectedAll || selectedVariations.length === numberOfVariations
                    ? "move_new_all"
                    : "move_new_selected";

                moveNamesToOtherGroup(operation, newGroup, selectedVariations);
              }}
              onCloseButtonPressed={() => {
                setSelectedAll(false);
                setSelectedVariations([]);
                setVisilibityGroupListPopUp(false);
              }}
            />
          )}

          <div className={styles.mergeButton}>
            <button
              className={styles.button}
              style={{ backgroundColor: "#4c96af" }}
              onClick={() => {
                setSelectedAll(true);
                setSelectedVariations(group.name_variations);
                setVisilibityGroupListPopUp(true);
              }}
            >
              MOVE ALL TO OTHER GROUP
            </button>

            <button
              className={styles.button}
              style={{ backgroundColor: "#af694c" }}
              onClick={() => {
                ungroup("ungroup_all", group.name_variations);
              }}
            >
              UNGROUP ALL
            </button>
          </div>

          <div className={styles.doneButton}>
            <button
              className={styles.button}
              onClick={() => {
                setDone(true)
                saveDone(true)
            }}
            >
              MARK AS DONE
            </button>
          </div>
        </>
      )}

      {done && (
        <div className={styles.doneButton}>
          <button
            className={styles.button}
            style={{ backgroundColor: "#2f9633" }}
            onClick={() => {
                setDone(false)
                saveDone(false)
            }}
          >
            NOT DONE?
          </button>
        </div>
      )}
    </div>
  );
}

NameGroupCard.defaultProps = {
  groups: [],
  idx: 0,
  group: {
    std_name: "empty",
    name_variations: [],
  },
  numberOfVariations: 0,
};
