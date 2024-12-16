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
import SationService from '../../../services/station';
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify';

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
      
      SationService.getList(params, newToken).then((res) => {
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
      <Card style={{paddingLeft : '15px'}}>
        <Row>
          <Col sm="6" md="4" lg="2" xs="6" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: 'stationCode' })}
              name="stationsId"
              options={listNewStation}
              onChange={({ value }) => handleFilterChange("stationsId", value)}
            />
          </Col>
          <Col className="mb-1" sm="2" xs="6">
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
                       <th>{item.Thu100SoLuot}</th>
                       <th>{item.Thu100GiaKD}</th>
                       <th>{item.Thu50SoLuot}</th>
                       <th>{item.Thu50GiaKD}</th>
                       <th>{item.Thu0SoLuot}</th>
                       <th>{item.KiemDinhLan1Dat}</th>
                       <th>{item.KiemDinhLan1KoDat}</th>
                       <th>{item.KiemDinhLan2Dat}</th>
                       <th>{item.KiemDinhLan2KoDat}</th>
                       <th>{item.TemKiemDinhKDVT}</th>
                       <th>{item.TemKiemDinhKoKDVT}</th>
                       <th>{item.KiemDinhXeCuLan1}</th>
                       <th>{item.KiemDinhXeCuLan2}</th>
                    </tr>
                    )
                })}
              
              <tr>
                <th colspan="2">{intl.formatMessage({ id: 'total_add' })}</th>
                <th>{item.Tong100SoLuot}</th>
                <th>{item.Tong100KD}</th>
                <th>{item.Tong50SoLuot}</th>
                <th>{item.Tong50KD}</th>
                <th>{item.TongThu0}</th>
                <th>{item.TongLan1Dat}</th>
                <th>{item.TongLan1KDat}</th>
                <th>{item.Tonglan2Dat}</th>
                <th>{item.TongLan2KDat}</th>
                <th>{item.TongTemD}</th>
                <th>{item.TongTemKhongK}</th>
                <th>{item.TongKiemDinhCuLan1}</th>
                <th>{item.TongKiemDinhCuLan2}</th>
              </tr>
            </table>
          </div>
        </Row>
        <Row className="tables-text mb-3">
          <Col sm="6" md="6" lg="3" xs="9" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Total_passes_standards' })}</div>
            <div>{intl.formatMessage({ id: 'Total_not_passes_standards' })}</div>
            <div>{intl.formatMessage({ id: 'Total_number_tested' })}</div>
          </Col>
          <Col xs="3" sm="6" md="6" lg="1" className='mobie_style'>
            <div>{item.totalStandards}</div>
            <div>{item.totalNotStandards}</div>
            <div>{item.totalAccreditation}</div>
          </Col>
          <Col sm="6" md="6" lg="2" xs="6" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Total_inspection_price' })}</div>
            <div>{intl.formatMessage({ id: 'Total_fee_issuance' })}</div>
            <div>{intl.formatMessage({ id: 'Total_proceeds' })}</div>
          </Col>
          <Col xs="6" sm="6" md="6" lg="2" className='mobie_style'>
            <div>{item.totalInspectionPrice} ( đồng )</div>
            <div>{item.totalGrant} ( đồng )</div>
            <div>{item.totalAmount} ( đồng )</div>
          </Col>
          <Col sm="6" md="6" lg="3" xs="12" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Number_granted' })} : {item.grantedTemporary}</div>
            <div>{intl.formatMessage({ id: 'Number_of_used' })} : {item.carsFailed}</div>
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="text-center text-uppercase h4">{intl.formatMessage({ id: 'statistical_vehicle' })}</div>
          </Col>
        </Row>
        <Row className="tables-text mb-3">
          <Col sm="6" md="6" lg="3" xs="9" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Number_of_tested' })}</div>
            <div>{intl.formatMessage({ id: 'Number_not_meet_standards' })}</div>
            <div>{intl.formatMessage({ id: 'Overall_failure_rate' })}</div>
          </Col>
          <Col xs="3" sm="6" md="6" lg="1" className='mobie_style'>
            <div>1,850</div>
            <div>451</div>
            <div>24.38%</div>
          </Col>
          <Col sm="6" md="6" lg="4" xs="9" className='mobie_style'>
            <div>{intl.formatMessage({ id: 'Number_of_used_first_time' })}</div>
            <div>{intl.formatMessage({ id: 'Number_of_used_cars_not_standards' })}</div>
            <div>{intl.formatMessage({ id: 'Failure_rate_of_used_cars' })}</div>
          </Col>
          <Col xs="3" sm="6" md="6" lg="2" className='mobie_style'>
            <div>0</div>
            <div>0</div>
            <div>0.00%</div>
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
                      <th>{item.NhanDang}</th>
                      <th>{item.KhungGhe}</th>
                      <th>{item.DcoHeThong}</th>
                      <th>{item.TruyenLuc}</th>
                      <th>{item.Phanh}</th>
                      <th>{item.Lai}</th>
                      <th>{item.Treo}</th>
                      <th>{item.Lop}</th>
                      <th>{item.Den}</th>
                      <th>{item.KhiXa}</th>
                      <th>{item.TiengOn}</th>
                      <th>{item.htKhac}</th>
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