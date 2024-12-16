// @ts-nocheck
import axios from 'axios'
import { HOST } from './../constants/url'
import { toast } from 'react-toastify';
import {
  getQueryString,
} from '../helper/common'
import addKeyLocalStorage from '../helper/localStorage';
import { decryptAes256CBC, encryptAes256CBC } from '../constants/EncryptionFunctions';

function send({
  method = 'get', path, data = null, query = null, headers = {}, newUrl
}) {
  return new Promise((resolve) => {
    let url = HOST + `${path}${getQueryString(query)}`
    if (newUrl) {
      url = `${newUrl}${getQueryString(query)}`
    }
    let token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    
    if (token) {
      const newToken = token.replace(/"/g, "");
      headers.Authorization =`Bearer ${newToken}`
    }
    
    let encryption = data
    if(process.env.NODE_ENV !== 'development'){
      const newStringData = JSON.stringify(data)
      encryption = encryptAes256CBC(newStringData) // mã hoá gửi đi
    }

    axios({
      method, url, data: encryption, headers,
    })
      .then((result) => {
        const data = result.data
        let decryption = data
        if (data.idEn) {
          decryption = decryptAes256CBC(data) // mã hoá lấy về
        }
        return resolve(decryption)
      })
      .catch((error) => {
        const {response ={}} = error
        let result = response.data ? response.data :null
        if (result.idEn) {
          result = decryptAes256CBC(result) // mã hoá lấy về
        }
        if (result) {
          const { statusCode, message: data } = result
          if(statusCode === 505){
            window.localStorage.clear()
            window.location.href = '/login'
          }
          else if (
            (statusCode === 413 && data === 'Payload content length greater than maximum allowed: 10485760')) {
            toast.warn("File vượt quá giới hạn")
          }
         else if (statusCode === 401 && data === 'Expired token received for JSON Web Token validation') {
            window.localStorage.clear()
            window.location.href = '/'
           
          }
          else if (
            (statusCode === 401 && data === 'Unauthorized') || (statusCode === 403 && data === 'InvalidToken')) {
              window.localStorage.clear()
              window.location.href = '/'
            
          } else {
            return resolve(result)
          }
        }
      })
  })
}

export default {
  send,
}
