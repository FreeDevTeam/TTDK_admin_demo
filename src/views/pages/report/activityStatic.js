import React, { Fragment, memo, useState, useEffect } from 'react'
import Flatpickr from 'react-flatpickr'
import { injectIntl } from 'react-intl'
import {
    Card,
    Col,
    Row
} from 'reactstrap'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import './style.scss'
import moment from 'moment'
import SpinnerTextAlignment from '../../components/spinners/SpinnerTextAlignment'
import { dataTest } from '../../../constants/user'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats'
import StationFunctions from '../../../services/StationFunctions';
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify';
import { number_to_price } from '../../../helper/common'

const ActivityStatic = ({ intl }) => {
  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 20,
    startDate: moment().subtract(1, 'days').format(DATE_DISPLAY_FORMAT),
    endDate: moment().subtract(1, 'days').format(DATE_DISPLAY_FORMAT)
  }

  const [date, setDate] = useState([moment().subtract(7, 'days').format(DATE_DISPLAY_FORMAT),moment().format(DATE_DISPLAY_FORMAT)])
  const [isLoading, setIsLoading] = useState(false)
  const [item , setItems] = useState([])
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const list = JSON.parse(localStorage.getItem('StorageDev_AllStations'))
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })
  listNewStation?.unshift({ value: '', label: intl.formatMessage({ id: 'all_stationCode' }) })

  const handleFilterDay = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(date)
    const newParams = {
      ...paramsFilter,
      limit: 20,
      startDate: newDate,
      endDate: newDate,
      order: {
        key: 'createdAt',
        value: 'desc'
      }
    }
    // getDataSearch(newParams)
  }

  const handleFilterChange = (name, value) => {
    // const newParams = {
    //   ...paramsFilter,
    //   filter: {
    //     ...paramsFilter.filter,
    //     [name]: value
    //   },
    //   skip: 0,
    // }
    // setParamsFilter(newParams)
    // getData(newParams)
  }

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));
    if (token) {
      const newToken = token.replace(/"/g, "");
      
      StationFunctions.getList(params, newToken).then((res) => {
          if (res) {
              const { statusCode, data, message } = res;
              setParamsFilter(newParams);
              if (statusCode === 200) {
                // setItems(data.data);
                setItems(dataTest)
              } else {
                  toast.warn(intl.formatMessage({ id: "actionFailed" }));
              }
          } else {
              setItems([]);
          }
          if (!isNoLoading) {
              setIsLoading(false);
          }
      });
  } else {
      window.localStorage.clear();
  }
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  return (
    <>
    {
        isLoading === true ? <Card  className='col-widget d-flex justify-content-center align-items-center'>
        <SpinnerTextAlignment size={60} />
      </Card> :
    <Fragment>
      <Card style={{paddingLeft : '15px', paddingRight : '15px'}}>
        <Row className='mt-2'>
          <Col sm="6" md="4" lg="2" xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: 'stationCode' })}
              name="stationsId"
              options={listNewStation}
              onChange={({ value }) => handleFilterChange("stationsId", value)}
            />
          </Col>
          <Col className="mb-1" sm="3" xs="12">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'range', dateFormat: 'd/m/Y', disableMobile: 'true'}}
              placeholder={intl.formatMessage({ id: 'day' })}
              className="form-control form-control-input"
              onChange={(date) => {
                handleFilterDay(date)
              }}
            />
          </Col>
        </Row>
        <Row className="mt-1 mb-3">
          <Col>
            <div className="text-center text-uppercase h1">{intl.formatMessage({ id: 'report' })}</div>
            <div className="text-center text-uppercase h1">{intl.formatMessage({ id: 'report_inspection' })}</div>
          </Col>
        </Row>
        <Row className="mb-3">
          <div className="tables">
            <table border="1" width="1500px;" height="500px" align="center">
              <tr>
                <th rowspan="2" className="">
                  STT
                </th>
                <th rowspan="2">{intl.formatMessage({ id: 'vehicle_grouping' })}</th>
                <th colspan="2">{intl.formatMessage({ id: 'registration_fee100' })}</th>
                <th colspan="2">{intl.formatMessage({ id: 'registration_fee25' })}</th>
                <th>{intl.formatMessage({ id: 'collect0' })}</th>
                <th colspan="2">{intl.formatMessage({ id: '1st_inspection' })}</th>
                <th colspan="2">{intl.formatMessage({ id: '2nd_inspection' })}</th>
                <th colspan="2">{intl.formatMessage({ id: 'inspection_stamps' })}</th>
                <th colspan="2">{intl.formatMessage({ id: 'car_inspection' })}</th>
              </tr>
              <tr>
                <th>{intl.formatMessage({ id: 'car_inspection' })}</th>
                <th>{intl.formatMessage({ id: 'priceKD' })}</th>
                <th>{intl.formatMessage({ id: 'car_inspection' })}</th>
                <th>{intl.formatMessage({ id: 'priceKD' })}</th>
                <th>{intl.formatMessage({ id: 'car_inspection' })}</th>
                <th>{intl.formatMessage({ id: 'obtain' })}</th>
                <th>{intl.formatMessage({ id: 'not_obtain' })}</th>
                <th>{intl.formatMessage({ id: 'obtain' })}</th>
                <th>{intl.formatMessage({ id: 'not_obtain' })}</th>
                <th>{intl.formatMessage({ id: 'not_obtain' })}</th>
                <th>{intl.formatMessage({ id: 'not_KDVT' })}</th>
                <th>{intl.formatMessage({ id: 'first_time' })}</th>
                <th>{intl.formatMessage({ id: 'second_time' })}</th>
              </tr>
                {item?.resultReport?.map((item, i) =>{
                  return (
                    <tr key={i}>
                       <th>{item.STT}</th>
                       <th>{item.PhanNhomPhuongTien}</th>
                       <th>{number_to_price(item.Thu100SoLuot)}</th>
                       <th>{number_to_price(item.Thu100GiaKD)}</th>
                       <th>{number_to_price(item.Thu50SoLuot)}</th>
                       <th>{number_to_price(item.Thu50GiaKD)}</th>
                       <th>{number_to_price(item.Thu0SoLuot)}</th>
                       <th>{number_to_price(item.KiemDinhLan1Dat)}</th>
                       <th>{number_to_price(item.KiemDinhLan1KoDat)}</th>
                       <th>{number_to_price(item.KiemDinhLan2Dat)}</th>
                       <th>{number_to_price(item.KiemDinhLan2KoDat)}</th>
                       <th>{number_to_price(item.TemKiemDinhKDVT)}</th>
                       <th>{number_to_price(item.TemKiemDinhKoKDVT)}</th>
                       <th>{number_to_price(item.KiemDinhXeCuLan1)}</th>
                       <th>{number_to_price(item.KiemDinhXeCuLan2)}</th>
                    </tr>
                    )
                })}
              
              <tr>
                <th className='theads' colspan="2">{intl.formatMessage({ id: 'total_add' })}</th>
                <th className='theads'>{number_to_price(item.Tong100SoLuot)}</th>
                <th className='theads'>{number_to_price(item.Tong100KD)}</th>
                <th className='theads'>{number_to_price(item.Tong50SoLuot)}</th>
                <th className='theads'>{number_to_price(item.Tong50KD)}</th>
                <th className='theads'>{number_to_price(item.TongThu0)}</th>
                <th className='theads'>{number_to_price(item.TongLan1Dat)}</th>
                <th className='theads'>{number_to_price(item.TongLan1KDat)}</th>
                <th className='theads'>{number_to_price(item.Tonglan2Dat)}</th>
                <th className='theads'>{number_to_price(item.TongLan2KDat)}</th>
                <th className='theads'>{number_to_price(item.TongTemD)}</th>
                <th className='theads'>{number_to_price(item.TongTemKhongK)}</th>
                <th className='theads'>{number_to_price(item.TongKiemDinhCuLan1)}</th>
                <th className='theads'>{number_to_price(item.TongKiemDinhCuLan2)}</th>
              </tr>
            </table>
          </div>
        </Row>
        <Row className="tables-text mb-3">
          <Col sm="12" md="6" lg="4" xs="12" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Total_passes_standards' })} {number_to_price(item.totalStandards)}</div>
            <div>{intl.formatMessage({ id: 'Total_not_passes_standards' })} {number_to_price(item.totalNotStandards)}</div>
            <div>{intl.formatMessage({ id: 'Total_number_tested' })} {number_to_price(item.totalAccreditation)}</div>
          </Col>
          <Col sm="12" md="6" lg="4" xs="12" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Total_inspection_price' })} {number_to_price(item.totalInspectionPrice)} (đồng)</div>
            <div>{intl.formatMessage({ id: 'Total_fee_issuance' })} {number_to_price(item.totalGrant)} (đồng)</div>
            <div>{intl.formatMessage({ id: 'Total_proceeds' })} {number_to_price(item.totalAmount)} (đồng)</div>
          </Col>
          <Col sm="12" md="8" lg="4" xs="12" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Number_granted' })}: {number_to_price(item.grantedTemporary)}</div>
            <div>{intl.formatMessage({ id: 'Number_of_used' })}: {number_to_price(item.carsFailed)}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center text-uppercase h4">{intl.formatMessage({ id: 'statistical_vehicle' })}</div>
          </Col>
        </Row>
        <Row className="tables-text mb-3">
          <Col sm="12" md="6" lg="4" xs="12" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Number_of_tested' })} 1.850</div>
            <div>{intl.formatMessage({ id: 'Number_not_meet_standards' })}: 451</div>
            <div>{intl.formatMessage({ id: 'Overall_failure_rate' })} 24.38%</div>
          </Col>
          <Col sm="12" md="6" lg="4" xs="12" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Number_of_used_first_time' })} 0</div>
            <div>{intl.formatMessage({ id: 'Number_of_used_cars_not_standards' })} 0</div>
            <div>{intl.formatMessage({ id: 'Failure_rate_of_used_cars' })} 0.00%</div>
          </Col>
        </Row>
        <Row>
          <div className="tables">
            <table border="1" width="1500px;" height="100px" align="center">
              <tr>
                <th>{intl.formatMessage({ id: 'Cluster_system' })}</th>
                <th>{intl.formatMessage({ id: 'Identification' })}</th>
                <th>{intl.formatMessage({ id: 'seat_body_shell' })}</th>
                <th>{intl.formatMessage({ id: 'DCo_related' })}</th>
                <th>{intl.formatMessage({ id: 'Power_transmission_system' })}</th>
                <th>{intl.formatMessage({ id: 'Brake_system' })}</th>
                <th>{intl.formatMessage({ id: 'Drive_system' })}</th>
                <th>{intl.formatMessage({ id: 'Suspension_system' })}</th>
                <th>{intl.formatMessage({ id: 'Tires' })}</th>
                <th>{intl.formatMessage({ id: 'Electrical_and_lighting_systems' })}</th>
                <th>{intl.formatMessage({ id: 'Exhaust' })}</th>
                <th>{intl.formatMessage({ id: 'Noise' })}</th>
                <th>{intl.formatMessage({ id: 'Other_clusters_and_systems' })}</th>
              </tr>
                {item?.precentVehicle?.map((item, i) =>{
                  return (
                    <tr key={i}>
                      <th>{item.Cum}</th>
                      <th>{number_to_price(item.NhanDang)}</th>
                      <th>{number_to_price(item.KhungGhe)}</th>
                      <th>{number_to_price(item.DcoHeThong)}</th>
                      <th>{number_to_price(item.TruyenLuc)}</th>
                      <th>{number_to_price(item.Phanh)}</th>
                      <th>{number_to_price(item.Lai)}</th>
                      <th>{number_to_price(item.Treo)}</th>
                      <th>{number_to_price(item.Lop)}</th>
                      <th>{number_to_price(item.Den)}</th>
                      <th>{number_to_price(item.KhiXa)}</th>
                      <th>{number_to_price(item.TiengOn)}</th>
                      <th>{number_to_price(item.htKhac)}</th>
                    </tr>
                  )
                })}
            </table>
          </div>
        </Row>
      </Card>
    </Fragment>
  }
    </>
  )
}

export default injectIntl(memo(ActivityStatic))
