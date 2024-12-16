import React, { useRef, memo, useState } from 'react'
import Service from '../../../../services/request'
import { toast } from 'react-toastify'
import { injectIntl } from 'react-intl'

const UploadFiles = ({ onData }) => {
  const handleData = (link) => {
    onData(link)
  }

  // const handleFileSelect = (evt) => {
  //       const file = evt.target.files[0];
  //       if (!file) return;
  //           const extension = file.name.split('.').pop();
  //           const reader = new FileReader();
  //           reader.onload = (function(theFile) {
  //             return function(e) {
  //               let binaryData = e.target.result;
  //               //Converting Binary Data to base 64
  //               let base64String = window.btoa(binaryData)}})(file);
  //               reader.readAsBinaryString(file);
  //               console.log(base64String);
  //           // fileReader.readAsDataURL(file);
  //           // fileReader.onload = (evt) => {
  //               // const base64 = evt.target.result

  //             // Service.send({
  //             //   method: "POST",
  //             //   path: "Upload/uploadMediaFile",
  //             //   data: {
  //             //       'imageData' : base64,
  //             //       'imageFormat' : extension
  //             //   },
  //             //   query: null,
  //             // }).then((res) => {
  //             //   if (res) {
  //             //     const { statusCode, message } = res;
  //             //     if (statusCode === 200) {
  //             //       handleData(res.data)
  //             //     }
  //             //   }
  //             // });
  //           // };
  //         };
  function handleFileSelect(evt) {
    let f = evt.target.files[0] // FileList object
    let reader = new FileReader()
    // Closure to capture the file information.
    reader.onload = (function (theFile) {
      return function (e) {
        let binaryData = e.target.result
        //Converting Binary Data to base 64
        let base64String = window.btoa(binaryData)
      }
    })(f)
    // Read in the image file as a data URL.
    reader.readAsBinaryString(f)
  }

  return (
    <div css={CSS}>
      <div className="form-container">
        <input type="file" id="files" name="files" onChange={handleFileSelect} />
      </div>
    </div>
  )
}

export default injectIntl(memo(UploadFiles))
