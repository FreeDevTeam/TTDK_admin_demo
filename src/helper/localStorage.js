import Service from "../services/request";

if(!process.env.REACT_APP_PROJECT_NAME){
  console.log("No variable REACT_APP_PROJECT_NAME! file .env")
}

const PROJECT_NAME = process.env.REACT_APP_PROJECT_NAME || "";

const addKeyLocalStorage = (key) => {
  return PROJECT_NAME + "_" + key
}

export const storeAllStationsDataToLocal = () =>{
    Service.send({
      method: 'POST', path: 'Stations/getList', data: {
        filter: {},
        skip: 0,
        limit: 500,
      },
       query: null
    }).then(res => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          localStorage.setItem("StorageDev_AllStations" , JSON.stringify(data.data))
        }
      } 
    })
}

export const readAllStationsDataFromLocal = JSON.parse(localStorage.getItem("StorageDev_AllStations"))

export const storeAllArea = () =>{
  Service.send({
    method: 'POST', path: 'Stations/getAllStationArea', data: {
      filter: {},
      skip: 0,
      limit: 100,
      order: {
        key: 'createdAt',
        value: 'desc'
      }
    },
     query: null
  }).then(res => {
    if (res) {
      const { statusCode, data } = res
      if (statusCode === 200) {
        localStorage.setItem("StorageDev_AllArea" , JSON.stringify(data))
      }
    } 
  })
}

export const readAllArea = JSON.parse(localStorage.getItem("StorageDev_AllArea"))

export default addKeyLocalStorage;