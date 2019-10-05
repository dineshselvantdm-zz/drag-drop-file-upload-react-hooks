import React, { useState, useRef } from "react";
import get from "lodash/get";

const DragAndDrop = ({ processDrop, children, config }) => {
  let [dragOverlay, setDragOverlay] = useState(false);
  const [data, setData] = useState(false);
  const [error, setError] = useState(false);
  let dragCounter = useRef(0);
  const preventBrowserDefaults = e => {
    e.preventDefault();
    e.stopPropagation();
  };
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
  const fileValidator = files => {
    const { allowedFileFormats, fileSizeLimit, filesLimit } = config;
    const { length } = files;
    if (length === 0) {
      return false;
    }
    if (length > filesLimit) {
      const err =
        filesLimit > 1
          ? `Only ${filesLimit} files are allowed to upload`
          : `Only one file is allowed to upload`;
      setError(err);
      return false;
    }
    const { size, type } = files[0];
    setData(false);
    if (!allowedFileFormats.includes(type)) {
      setError("File format must be either png or jpg");
      return false;
    }
    if (size / 1024 / 1024 > fileSizeLimit) {
      setError(`File size exceeded the limit of ${fileSizeLimit}MB`);
      return false;
    }
    setError(false);
    return true;
  };
  const fileReader = files => {
    const reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = loadEvt => {
      setData(loadEvt.target.result);
    };
  };
  const handleDrop = e => {
    const files = get(e, "dataTransfer.files");
    preventBrowserDefaults(e);
    setDragOverlay(false);
    if (!fileValidator(files)) {
      return false;
    }
    fileReader(files);
    processDrop(files);
    dragCounter.current = 0;
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
