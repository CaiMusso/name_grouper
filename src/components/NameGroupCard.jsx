import React, { useEffect, useState } from "react";
import styles from "../styles/NameGroupCard.module.scss";
import { GroupListPopUp } from "./GroupListPopUp";
import { CiEdit } from "react-icons/ci";
import { FaCheck } from "react-icons/fa";

export function NameGroupCard(props) {
  const {
    groups,
    idx,
    group,
    numberOfVariations,
    changeGroupName,
    moveNamesToOtherGroup,
    ungroup,
    linkWithOtherGroup,
    saveDone,
  } = props;

  const [done, setDone] = useState(group.resolved);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [visilibityGroupListPopUp, setVisilibityGroupListPopUp] = useState(false);
  const [operation, setOperation] = useState(null);

  const groupsFilteredPopUp = groups
    .slice(0, idx)
    .concat(groups.slice(idx + 1));

  const [groupName, setGroupName] = useState(group.std_name);
  const [editPressed, setEditPressed] = useState(false);

  /* RESET when group changes */
  useEffect(() => {
    setSelectedVariations([]);
    setOperation(null);
    setDone(group.resolved);
    setGroupName(group.std_name);
    setVisilibityGroupListPopUp(false)
    setEditPressed(false)
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
        <div>
          {" "}
          {idx + 1} of {groups.length}{" "}
        </div>
      </div>

      <div className={styles.groupNameContainer}>

        {!editPressed &&
          <div className={styles.standardName}>
            {groupName.toUpperCase()}
            <CiEdit
              style={{ marginLeft: "8px" }}
              size={20}
              onClick={() => setEditPressed(true)} />
          </div>
        }

        {editPressed && (
          <>
            <input
              type="text"
              value={groupName}
              className={styles.newGroupName}
              placeholder="Enter the group name"
              onChange={(e) => setGroupName(e.target.value.toLowerCase())}
              autoFocus
            />
            <FaCheck
              size={20}
              style={{ marginLeft: "8px" }}
              onClick={() => {
                setEditPressed(false);
                changeGroupName(groupName);
              }}
            />
          </>
        )}
      </div>

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
                  setOperation(selectedVariations.length === numberOfVariations ? "move_all" : "move_selected");
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
                  if (selectedVariations.length === numberOfVariations) {
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
              showCreateNew = { operation !== "link_groups" }
              onSelectGroup={(g) => {
                if (operation === "link_groups") {
                  linkWithOtherGroup(g.id);
                } else {
                  moveNamesToOtherGroup(operation, g.std_name, selectedVariations);
                }
                setOperation(null)
              }}
              onCreateNewGroup={(newGroup) => {
                moveNamesToOtherGroup(`new_${operation}`, newGroup, selectedVariations);
                setOperation(null)
              }}
              onCloseButtonPressed={() => {
                setOperation(null);
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
                setSelectedVariations(group.name_variations);
                setOperation("move_all");
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

          <div className={styles.buttonContainer}>
            <button
              className={styles.buttonSecondary}
              onClick={() => {
                setOperation("link_groups");
                setVisilibityGroupListPopUp(true);
              }}
            >
              LINK WITH OTHER GROUP
            </button>
          </div>

          <div className={styles.buttonContainer}>
            <button
              className={styles.button}
              onClick={() => {
                setDone(true);
                saveDone(true);
              }}
            >
              MARK AS DONE
            </button>
          </div>
        </>
      )}

      {done && (
        <div className={styles.buttonContainer}>
          <button
            className={styles.button}
            style={{ backgroundColor: "#2f9633" }}
            onClick={() => {
              setDone(false);
              saveDone(false);
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
    id: -1,
    resolved: false,
    std_name: "empty",
    name_variations: [],
  },
  numberOfVariations: 0,
};
