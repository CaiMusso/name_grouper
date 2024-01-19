import React, { useState } from "react";
import styles from "../styles/FileUploader.module.scss";

export function FileUploader(props) {
  const { setGroupsFromFile, setAdditionalInfoFromFile, start } = props;

  const [showInstructions, setShowInstructions] = useState(false);
  const [canStart, setCanStart] = useState(false);
  const [uploadedInfo, setUploadedInfo] = useState(false);

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

        const hasUngrouped = content.some(
          (item) => item.std_name === "*ungrouped*"
        );

        if (!hasUngrouped) {
          content.push({
            resolved: false,
            std_name: "*ungrouped*",
            name_variations: [],
          });
        }

        content.push({
          resolved: false,
          std_name: "*unrelevant*",
          name_variations: [],
        });

        const groupsDataset = content.map((group, index) => {
          return { linkID: index, ...group, links_to_verify: [] };
        });

        setGroupsFromFile(groupsDataset);
        setCanStart(true);
      } catch (error) {
        console.error("Error reading JSON:", error);
        alert(
          "Error reading file: this is not a valid JSON. Please check the console for more details."
        );
        window.location.reload();
      }
    };

    reader.readAsText(file);
  };

  const handleAdditionalInfoFileChange = (event) => {
    const reader = new FileReader();
    const file = event.target.files[0];

    reader.onload = (upload) => {
      try {
        const content = JSON.parse(upload.target.result);
        const infoDataset = content.map((info, index) => {
          return { variationID: index, ...info };
        });

        setAdditionalInfoFromFile(infoDataset);
        setUploadedInfo(true);
      } catch (error) {
        console.error("Error reading JSON:", error);
        alert(
          "Error reading file: this is not a valid JSON. Please check the console for more details."
        );
        window.location.reload();
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
      <div className={styles.title}>Welcome to the NameGrouper WebApp !</div>
      <div className={styles.specification}>
        {!showInstructions && (
          <div
            className={styles.openCodeBlockButton}
            onClick={() => setShowInstructions(true)}
          >
            {" "}
            SEE INSTRUCTIONS
          </div>
        )}
        {showInstructions && (
          <div
            className={styles.openCodeBlockButton}
            onClick={() => setShowInstructions(false)}
          >
            {" "}
            HIDE INSTRUCTIONS
          </div>
        )}
        {showInstructions && (
          <>
            <div className={styles.subtitle}>
              To start with simple name grouping provide a file with your
              clusters. <br></br>
              Please upload a JSON file with a list of objects of the following
              format:
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
]`}
            </pre>

            <div className={styles.subtitle}>
              Use the "upload group" button at the end of the page and you are
              good to go! For advanced customisable grouping see the optional
              section here under.
              <br></br>
              <br></br>
              <br></br>
              &darr; Optional &darr;
              <br></br>
              <br></br>
              For <b>insightful</b> grouping: please upload a second file
              containing additional information on each name variation of every
              group. This information will be displayed when clicking on the
              mention during the grouping process.
              <br></br>
              <br></br>
              Prepare a JSON file with a list of objects (one per name
              variation) having the keys{" "}
              <span className={styles.code}>std_name</span> and{" "}
              <span className={styles.code}>info</span>.{" "}
              <span className={styles.code}>info</span> is a list of JSON
              objects each containing key-value pairs. You can decide which keys
              and how many k-v pairs. Moreover, make sure each and every name
              variation is present inside the file and that the object is
              correctly defined. For name variations that don't have additional
              info use a default empty list (example below). <br></br>
              <b>
                The app will assume all the name variations are present and that
                the full data structure is non-null.
              </b>{" "}
              It will also assume that values of k-v pairs in{" "}
              <span className={styles.code}>info</span> are the same for every
              object and {" "}
              <b>can only be of type string or number</b>. <br></br>
            </div>

            <div className={styles.subtitle}>
              <b>Example:</b> Grouping family names from the 1741 Venetian
              catastici <br></br>
              Add information on all entries where the name variation is
              mentioned. For each entry we want to see displayed:{" "}
              <span className={styles.code}>uid</span> and
              <span className={styles.code}>original_mention</span> during the
              grouping process. <br></br>
              <br></br>
              Upload a JSON file with the following format:
            </div>

            <pre className={styles.codeBlock}>
              {`[
    {
      "std_name": "giustinian",
      "info": [
        { 
          "uid" : "MSE-0406",
          "original_mention" : "Carlo Giustinian"
          // add as many key-value pairs as you like
        },
        { 
          "uid" : "MSE-0407",
          "original_mention" : "Paolo Giustinian q. Pietro"
        },
        ...
        // add as many objects as you like
      ]
    },

    {
      "std_name": "zustinian",
      "info": [
        { 
          "uid" : "GER-1163",
          "original_mention" : "Nobil homo Zuanne Zustinian"
        },
        { 
          "uid" : "GER-1164",
          "original_mention" : "Pietro Zustinian"
        },
        ...
      ]
    },

    {
      "std_name": "example of variation without additional info",
      "info": []
    },

    ...
]`}
            </pre>
          </>
        )}
      </div>

      <div className={styles.subtitle}>Upload your groups json file here.</div>
      <div className={styles.uploadButton}>
        {!canStart && (
          <>
            <button
              className={styles.buttonUpload}
              onClick={() =>
                document.getElementById("fileInput_groups").click()
              }
            >
              UPLOAD GROUPS (.json)
            </button>
            <input
              type="file"
              id="fileInput_groups"
              style={{ display: "none" }}
              accept=".json"
              onChange={handleFileChange}
            />
          </>
        )}

        {canStart && <div className={styles.buttonUpload}>DONE</div>}
      </div>

      <div className={styles.subtitle}>
        (Optional)
        <br></br>
        Upload your additional information json file here.
      </div>

      <div className={styles.uploadButton}>
        {!uploadedInfo && (
          <>
            <button
              className={styles.buttonUpload}
              onClick={() => document.getElementById("fileInput_info").click()}
            >
              UPLOAD ADDITIONAL INFO (.json)
            </button>
            <input
              type="file"
              id="fileInput_info"
              style={{ display: "none" }}
              accept=".json"
              onChange={handleAdditionalInfoFileChange}
            />
          </>
        )}

        {uploadedInfo && <div className={styles.buttonUpload}>DONE</div>}
      </div>

      <button
        className={styles.button}
        style={{
          marginTop: "30px",
          marginBottom: "60px",
          maxWidth: "calc(100% - 20px)",
        }}
        onClick={() => {
          if (canStart) {
            start();
          } else {
            alert("Please upload a groups file first.");
          }
        }}
      >
        START
      </button>
    </div>
  );
}

FileUploader.defaultProps = {
  groups: [],
};
