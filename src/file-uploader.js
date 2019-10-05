import React from "react";
import DragAndDrop from "./drag-and-drop";

const config = {
  allowedFileFormats: ["image/jpeg", "image/jpg", "image/png"],
  fileSizeLimit: 20,
  filesLimit: 1
};

const FileUploader = () => {
  const processDrop = files => {};
  return (
    <DragAndDrop processDrop={processDrop} config={config}>
      <div>State machine based on file upload</div>
    </DragAndDrop>
  );
};

export default FileUploader;
