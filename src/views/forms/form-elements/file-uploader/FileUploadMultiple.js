import React, { useRef } from 'react';
import useFileUpload from 'react-use-file-upload';
import { XSquare } from "react-feather";
import {Button} from "reactstrap";

const UploadFiles = () => {
  const {
    files,
    fileNames,
    handleDragDropEvent,
    createFormData,
    setFiles,
    removeFile,
  } = useFileUpload();
  const inputRef = useRef();

  const handleSubmitFile = (e) => {
    e.preventDefault();
    const formData = createFormData();
  };

  return (
    <div css={CSS}>
         <div className="form-container">
                      <div>
                       <p>
                          {fileNames.map((name) => (
                          <p key={name}>
                          <span>{name}</span>
                          <span onClick={() => removeFile(name)}>
                            <XSquare />
                          </span>
                      </p>
                     ))}
                     </p>
                    </div>

                    <div
                     onDragEnter={handleDragDropEvent}
                     onDragOver={handleDragDropEvent}
                     onDrop={(e) => {
                     handleDragDropEvent(e);
                     setFiles(e, 'a');
                     }}
                     >
                      <Button onClick={() => inputRef.current.click()}>File</Button>

                <input
                 ref={inputRef}
                 type="file"
                 multiple
                 style={{ display: 'none' }}
                 onChange={(e) => {
                  handleSubmitFile(e)
                 setFiles(e, 'a');
                 inputRef.current.value = null;
                }}
                />
               </div>
              </div>

      {/* <div className="submit">
        <button onClick={handleSubmitFile}>Submit</button>
      </div> */}
    </div>
  );
};

export default UploadFiles