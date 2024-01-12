import React, { useState } from "react";
import styles from "../styles/GroupListPopUp.module.scss";
import { IoMdClose } from "react-icons/io";

export function GroupListPopUp(props) {
  const { groups, onSelectGroup, onCreateNewGroup, onCloseButtonPressed } =
    props;
  const groupsSortedUpper = groups
    .map((group) => ({ ...group, std_name: group.std_name.toUpperCase() }))
    .sort((a, b) => a.std_name.localeCompare(b.std_name));

  const [newStdName, setNewStdName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibilityNewGroupName, setVisibilityNewGroupName] = useState(false);

  const filteredGroups = searchTerm
    ? groupsSortedUpper.filter((group) =>
        group.std_name.toLowerCase().startsWith(searchTerm.toLowerCase())
      )
    : groupsSortedUpper;

  return (
    <div className={styles.groupListPopUp}>
      <div className={styles.closeButton}>
        <IoMdClose size={25} onClick={() => onCloseButtonPressed()} />
      </div>

      <input
        type="text"
        className={styles.searchBar}
        placeholder="Search groups..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <div className={styles.groupList}>
        {filteredGroups.map((group, index) => (
          <div
            key={index}
            className={styles.groupItem}
            onClick={() => {
                onSelectGroup(group.std_name)
                onCloseButtonPressed();
            }}
          >
            {group.std_name}
          </div>
        ))}
      </div>

      {visibilityNewGroupName && (
        <input
          type="text"
          className={styles.newGroupName}
          placeholder="Enter standard name for new group"
          value={newStdName}
          onChange={(e) => setNewStdName(e.target.value)}
        />
      )}

      {!visibilityNewGroupName && (
        <button
          className={styles.newGroupButton}
          onClick={() => {
            setVisibilityNewGroupName(true);
          }}
        >
          CREATE NEW GROUP
        </button>
      )}

      {visibilityNewGroupName && (
        <button
          className={styles.newGroupButton}
          onClick={() => {
            if (newStdName === "") {
              alert("Please enter a name for the group");
              return;
            }

            onCreateNewGroup(newStdName);
            setVisibilityNewGroupName(false);
            onCloseButtonPressed();
          }}
        >
          CONFIRM
        </button>
      )}
    </div>
  );
}

GroupListPopUp.defaultProps = {
  groups: [],
};
