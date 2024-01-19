import React, { useEffect, useState } from "react";
import styles from "../styles/InfoCard.module.scss";
import { BiExpand } from "react-icons/bi";
import { TbArrowsMinimize } from "react-icons/tb";

export function InfoCard(props) {
  const previewFactor = 2;
  const info = props.additionalInfo.info
  const [onHoverIdx, setOnHoverIdx] = useState(-1);
  const [selectedMiniCardIdx, setSelectedMiniCardIdx] = useState(-1);
  const [filteredInfo, setFilteredInfo] = useState(null);
  const [filterKey, setFilterKey] = useState(Object.keys(info[0])[0]);
  const [filterValue, setFilterValue] = useState("");

  useEffect(() => {
    setFilteredInfo(props.additionalInfo.info);
  }, [props.additionalInfo]);

  useEffect(() => {
    if (info !== null) {
      setOnHoverIdx(-1);
      setSelectedMiniCardIdx(-1);
      setFilteredInfo(null);
    }
  }, [props.currentIndex, info]);

  useEffect(() => {
    if (filterValue === "") {
      setFilteredInfo(info);
    }

    if (filterKey !== "" && filterValue !== "") {
      filterInfo();
    }
  }, [filterValue, filterKey, info]);

  const handleKeySelect = (event) => {
    setFilterValue("");
    setFilterKey(event.target.value);
  };


  function compareWithFilterValue(s) {
    // Assuming type is string or number
    const str = String(s).toLowerCase();
    return str.includes(filterValue.toLowerCase())
}


  function filterInfo() {
    const filteredInfo = [];
    info.forEach((i) => {
      if (compareWithFilterValue(i[filterKey])) {
        filteredInfo.push(i);
      }
    });

    setFilteredInfo(filteredInfo);
  }

  function formatKey(k) {
    return k.replaceAll("_", " ").toUpperCase();
  }

  function getPreviewOnly(obj) {
    const preview = {};
    const keys = Object.keys(obj).slice(0, previewFactor);
    for (var k of keys) {
      preview[k] = obj[k];
    }

    return preview;
  }

  return (
    <>
      {info && filteredInfo && (
        <div className={styles.infoCard}>
          <div className={styles.title}> {props.additionalInfo.std_name.toUpperCase()} </div>
          <div className={styles.container}>
            <div className={styles.dropdownDiv}>
              <select onChange={handleKeySelect} style={{ width: "100%" }}>
                {Object.keys(info[0]).map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>
            </div>
            <div className={styles.inputDiv}>
              <input
                style={{ width: "100%", height: "16px" }}
                type="text"
                value={filterValue}
                placeholder="Filter values on key"
                onChange={(e) => setFilterValue(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.results_info}>
            {" "}
            There are {filteredInfo.length} results{" "}
          </div>

          <div style={{ overflowY: "scroll" }}>
            {filteredInfo.map((i, idx) => (
              <div key={`miniCard-${idx}`}>
                {idx !== selectedMiniCardIdx && (
                  <div
                    className={styles.miniCard}
                    onClick={() => setSelectedMiniCardIdx(idx)}
                    onMouseOver={() => setOnHoverIdx(idx)}
                    onMouseLeave={() => setOnHoverIdx(-1)}
                  >
                    {Object.keys(getPreviewOnly(i)).map((key) => (
                      <div key={`key-val-${key}`}>
                        <div className={styles.key}>{formatKey(key)}</div>
                        <div className={styles.value}>{i[key]}</div>
                      </div>
                    ))}

                    {idx === onHoverIdx && (
                      <div className={styles.buttonContainer}>
                        <BiExpand
                          size={20}
                          style={{ margin: "5px", marginTop: "0" }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {idx === selectedMiniCardIdx && (
                  <div
                    key={`miniCard-selected-${idx}`}
                    className={styles.miniCard}
                    onClick={() => setSelectedMiniCardIdx(-1)}
                    onMouseOver={() => setOnHoverIdx(idx)}
                    onMouseLeave={() => setOnHoverIdx(-1)}
                  >
                    {Object.keys(i).map((key) => (
                      <div key={`key-val-sel-${key}`}>
                        <div className={styles.key}>{formatKey(key)}</div>
                        <div className={styles.value}>{i[key]}</div>
                      </div>
                    ))}

                    {idx === onHoverIdx && (
                      <div className={styles.buttonContainer}>
                        <TbArrowsMinimize
                          size={20}
                          style={{ margin: "5px", marginTop: "0" }}
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

InfoCard.defaultProps = {
  additionalInfo: null,
  currentIndex: -1,
};
