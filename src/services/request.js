// @ts-nocheck
import axios from 'axios'
import { HOST } from './../constants/url'
import { toast } from 'react-toastify';
import {
  getQueryString,
} from '../helper/common'

import addKeyLocalStorage from '../helper/localStorage';

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
    axios({
      method, url, data, headers,
    })
      .then((result) => {
        const data = result.data
        return resolve(data)
      })
      .catch((error) => {
        const {response ={}} = error
        
        const result = response.data ? response.data :null
         
        if (!result) {
          toast.warn("Error from server")
        }
        else {
          const { statusCode, message: data } = result
          if(statusCode === 505){
            toast.warn("Unauthorized")
          }
          else if (
            (statusCode === 413 && data === 'Payload content length greater than maximum allowed: 10485760')) {
            toast.warn("Image too large")
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
            return resolve(result.data)
          }
        }
      })
  })
}

export default {
  send,
}
