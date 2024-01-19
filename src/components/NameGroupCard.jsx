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
    selectVariationForInfo,
    variationsToResultCount,
    moveNamesToOtherGroup,
    ungroup,
    linkWithOtherGroup,
    saveDone,
  } = props;

  const [done, setDone] = useState(group.resolved);
  const [selectedVariations, setSelectedVariations] = useState([]);
  const [visilibityGroupListPopUp, setVisilibityGroupListPopUp] =
    useState(false);
  const [operation, setOperation] = useState(null);

  const groupsFilteredPopUp = groups
    .slice(0, idx)
    .concat(groups.slice(idx + 1));

  const [groupName, setGroupName] = useState(group.std_name);
  const [editPressed, setEditPressed] = useState(false);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState(-1);
  const totalInfoResults = computeTotalInfoResults();

  function resetCard() {
    setSelectedVariations([]);
    setOperation(null);
    setDone(group.resolved);
    setGroupName(group.std_name);
    setVisilibityGroupListPopUp(false);
    setEditPressed(false);
    setSelectedStyleIndex(-1);
  }
  /* RESET when group changes */
  useEffect(() => {
    resetCard()
  }, [group]);

  function computeTotalInfoResults() {
    if (!(group && group.name_variations)) {
      return 0;
    }

    let total = 0;
    Object.keys(variationsToResultCount).forEach((variation) => {
      if (group.name_variations.includes(variation)) {
        total += variationsToResultCount[variation];
      }
    });

    return total;
  }

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
        {!editPressed && (
          <div className={styles.standardName}>
            {groupName.toUpperCase()}
            <div className={styles.editButton}>
              <CiEdit size={20} onClick={() => setEditPressed(true)} />
            </div>
          </div>
        )}

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

      {group.links_to_verify.length > 0 && (
        <div style={{ marginLeft: "10px", marginBottom: "3px" }}>
          Linked with <b>{group.links_to_verify.length}</b> other groups.
        </div>
      )}

      <div style={{ marginLeft: "10px" }}>
        There are <b>{numberOfVariations}</b> name variations and{" "}
        <b>{totalInfoResults}</b> mentions.
      </div>

      <div className={styles.variations}>
        {group.name_variations.map((variation, index) => (
          <div key={index} className={styles.variation}>
            <input
              type="checkbox"
              id={`checkbox-${index}`}
              className={styles.checkbox}
              checked={selectedVariations.includes(variation)}
              onChange={() => handleSelectionChange(variation)}
            />

            {index === selectedStyleIndex && (
              <div
                className={styles.nameVariationSelected}
                onClick={() => {
                  if (
                    Object.keys(variationsToResultCount).length > 0 &&
                    variationsToResultCount[variation] > 0
                  ) {
                    setSelectedStyleIndex(index);
                    selectVariationForInfo(variation);
                  } else {
                    alert(`No results for variation: ${variation}`);
                  }
                }}
              >
                <label style={{ width: "100%" }} htmlFor={`checkbox-${index}`}>
                  {Object.keys(variationsToResultCount).length > 0 && (
                    <>
                      {variation}
                      {Object.keys(variationsToResultCount).length > 0 && (
                        <>
                          {" "}
                          {"("} {variationsToResultCount[variation]} {")"}
                        </>
                      )}
                    </>
                  )}
                </label>
              </div>
            )}

            {index !== selectedStyleIndex && (
              <div
                className={styles.nameVariation}
                onClick={() => {
                  if (
                    Object.keys(variationsToResultCount).length > 0 &&
                    variationsToResultCount[variation] > 0
                  ) {
                    setSelectedStyleIndex(index);
                    selectVariationForInfo(variation);
                  } else {
                    alert(`No results for variation: ${variation}`);
                  }
                }}
              >
                <label style={{ width: "100%" }} htmlFor={`checkbox-${index}`}>
                  {variation}
                  {Object.keys(variationsToResultCount).length > 0 && (
                    <>
                      {" "}
                      {"("} {variationsToResultCount[variation]} {")"}
                    </>
                  )}
                </label>
              </div>
            )}
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
                  setOperation(
                    selectedVariations.length === numberOfVariations
                      ? "move_all"
                      : "move_selected"
                  );
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
                    resetCard()
                    return;
                  }

                  ungroup("ungroup", selectedVariations);
                  resetCard()
                }
              }}
            >
              UNGROUP
            </button>
          </div>

          {visilibityGroupListPopUp && (
            <GroupListPopUp
              groups={groupsFilteredPopUp}
              showCreateNew={operation !== "link_groups"}
              onSelectGroup={(g) => {
                if (operation === "link_groups") {
                  linkWithOtherGroup(g.linkID);
                  resetCard()
                } else {
                  moveNamesToOtherGroup(
                    operation,
                    g.std_name,
                    selectedVariations
                  );
                  resetCard()
                }
                setOperation(null);
              }}
              onCreateNewGroup={(newGroup) => {
                moveNamesToOtherGroup(
                  `new_${operation}`,
                  newGroup,
                  selectedVariations
                );
                resetCard()
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
                resetCard()
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
                resetCard()
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
              resetCard()
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
    linkID: -1,
    resolved: false,
    std_name: "empty",
    name_variations: [],
    links_to_verify: [],
  },
  numberOfVariations: 0,
};
