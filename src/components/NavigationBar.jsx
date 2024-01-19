import React, { useState, useEffect } from "react";
import styles from "../styles/NavigationBar.module.scss";

export function NavigationBar(props) {
  const [groups, setGroups] = useState(props.groups);
  const [resolvedMap, setResolvedMap] = useState([]);

  useEffect(() => {
    setGroups(props.groups);
    const resolvedMap = props.groups.map((group) => group.resolved)
    setResolvedMap(resolvedMap)
  }, [props.groups]);

  return (
    <div className={styles.navigationBar}>
      {groups.map((group, index) => (
        <div
          key={index}
          className={resolvedMap[index] ? styles.card_resolved : styles.card}
          onClick={() => props.setNameToDisplay(group.std_name)}
        >
          <div className={styles.card_text}>
            <div style={{ width: "100px", fontSize: "12px" }}>{index}</div>

            <div className={styles.card_std_name}>
              {group["std_name"].toUpperCase()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

NavigationBar.defaultProps = {
  groups: [],
  setNameToDisplay: () => console.log("Missing props in NavigationBar"),
};
