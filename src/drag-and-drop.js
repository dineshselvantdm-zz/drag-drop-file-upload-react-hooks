import React, { useState, useRef } from "react";
import get from "lodash/get";
import { fileValidator, preventBrowserDefaults } from "../utils/drag-drop";

const DragAndDrop = ({ processDrop, children, config }) => {
  let [dragOverlay, setDragOverlay] = useState(false);
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  let dragCounter = useRef(0);

  const handleDrag = e => {
    preventBrowserDefaults(e);
  };
  const handleDragIn = e => {
    preventBrowserDefaults(e);
    dragCounter.current++;
    if (get(e, "dataTransfer.items.length") > 0) {
      setDragOverlay(true);
    }
  };
  const handleDragOut = e => {
    preventBrowserDefaults(e);
    dragCounter.current--;
    if (dragCounter.current === 0) {
      setDragOverlay(false);
    }
  };
  const handleDrop = e => {
    const files = get(e, "dataTransfer.files");
    preventBrowserDefaults(e);
    setDragOverlay(false);
    setError(false);
    dragCounter.current = 0;
    const { isValidFile, errVal } = fileValidator(files, config);
    if (!isValidFile) {
      if (errVal) {
        setError(errVal);
      }
      return false;
    }
    fileReader(files);
    processDrop(files);
    dragCounter.current = 0;
  };

  const fileReader = files => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = loadEvt => {
      setData(loadEvt.target.result);
    };
  };

  const dragOverlayClass = dragOverlay ? "overlay" : "";
  return (
    <div>
      {error && <p className="error">{error}</p>}
      <div
        className={`drag-container ${dragOverlayClass}`}
        onDragEnter={handleDragIn}
        onDragLeave={handleDragOut}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        {data && <img alt="" src={data} />}
        {children}
        <div className="button-wrapper">
          {data && <button onClick={() => setData(false)}>Remove</button>}
        </div>
      </div>
    </div>
  );
};

export default DragAndDrop;
