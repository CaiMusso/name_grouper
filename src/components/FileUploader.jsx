import React, { useState } from "react";
import styles from "../styles/FileUploader.module.scss";

export function FileUploader(props) {
  const { setGroupsFromFile } = props;

  const handleFileChange = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = (upload) => {
      try {
        const content = JSON.parse(upload.target.result);
        const isValid = validateContent(content);
        if (!isValid) {
          alert(
            "Error reading file: the format of your JSON file is incorrect, please check the home page of this application to see the exact format the file should have."
          );
          window.location.reload();
        }

        console.log("File content:", content);
        setGroupsFromFile(content)

      } catch (error) {
        console.error("Error reading JSON:", error);
        alert(
          "Error reading file: this is not a valid JSON. Please check the console for more details."
        );
      }
    };

    reader.readAsText(file);
  };

  const validateContent = (content) => {
    if (!Array.isArray(content)) {
      alert("The file should contain a list of objects.");
      return false;
    }

    for (const item of content) {
      if (
        typeof item.resolved !== "boolean" ||
        typeof item.std_name !== "string" ||
        !Array.isArray(item.name_variations)
      ) {
        alert(
          "Each item must have a boolean 'resolved', a string 'std_name', and an array of 'name_variations'."
        );
        return false;
      }
    }
    return true;
  };

  return (
    <div className={styles.fileUploader}>
      <div
        className={styles.title}
      >
        Welcome to the NameGrouper WebApp !
      </div>
      <div className={styles.specification}>
        <div className={styles.subtitle}>
        Upload your json file here. Here below is how your file formatting should look like:
        </div>
        <pre className={styles.codeBlock}>
          {`[
  {
    "resolved": false,
    "std_name": "morosini",
    "name_variations": ["morosini", "morrosini", "morosin"]
  },
  {
    "resolved": false,
    "std_name": "giustiniani",
    "name_variations": ["giustiniani", "giustinian"]
  },

  ...

  // have an ungrouped group at the end of the list with std_name = "*ungrouped*"
  {
    "resolved": false,
    "std_name": "*ungrouped*",
    "name_variations": ["turchetta", "cittolin"]
  }
]`}
        </pre>
      </div>
      <div className={styles.uploadButton}>
        <button
          className={styles.button}
          onClick={() => document.getElementById("fileInput").click()}
        >
          UPLOAD FILE (.json)
        </button>
        <input
          type="file"
          id="fileInput"
          style={{ display: "none" }}
          accept=".json"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}

FileUploader.defaultProps = {
  groups: [],
};
