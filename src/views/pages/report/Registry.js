import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { Card, Col, Row, Table, InputGroup, Button, Input, Badge } from 'reactstrap'
import MySwitch from '../../components/switch'
import { useHistory } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { injectIntl } from 'react-intl'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import IntegratedService from '../../../services/Integrated'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import LoadingDialog from "../../components/buttons/ButtonLoading";
import XLSX from 'xlsx'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import './index.scss'
import { SIZE_INPUT } from '../../../constants/app'
import SationService from '../../../services/station';
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown';

const Registry = ({ intl }) => {
  const DefaultFilter = {
    filter: {},
    skip : 0,
    limit : 20,
    startDate : moment().subtract(1, 'days').format('DD/MM/YYYY'),
    endDate : moment().subtract(1, 'days').format('DD/MM/YYYY')
  }

  const metaData = JSON.parse(localStorage.getItem("metaDatas"))
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const [date, setDate] = useState('')
  const [meta, setMeta] = useState([])
  const history = useHistory()

  function fetchMetaData() {
    SationService.MetaData().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setMeta(data)
        } else {
          setMeta(metaData)
        }
      }
    })
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      stationCode: searchValue
    }
    setParamsFilter(newParams)
    if (newParams.stationCode) {
      getData(newParams)
    } else {
      getData(paramsFilter)
    }
  }
  const columns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      minWidth: '90px',
      maxWidth: '90px',
      center: true,
      selector: (row) => row.stationCode,
      cell: (row) => {
        return (
          <div>
            {row.stationCode}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      minWidth: '150px',
      maxWidth: '500px',
      selector: (row) => row.stationsName
    },
    {
      name: intl.formatMessage({ id: 'day' }),
      minWidth: '150px',
      maxWidth: '150px',
      selector: (row) => row.reportDay
    },
    {
        name: intl.formatMessage({ id: "total_registereds" }),
        sortable: true,
        minWidth: "400px",
        maxWidth: "400px",
        cell: (row) => {
          const {totalCustomerCheckingCanceled, totalCustomerCheckingCompleted, totalCustomerCheckingFailed} = row
          return (
            <div>
              {/* {totalCustomerCheckingCanceled} / {totalCustomerCheckingCompleted} / {totalCustomerCheckingFailed} */}
              <div>
                <Badge color='light-success' className='font_style'>Thành công : {totalCustomerCheckingCompleted} xe</Badge>
              </div>
              <div>
                <Badge color='light-danger' className='font_style'>Thất bại : {totalCustomerCheckingFailed} xe</Badge>
              </div>
              <div>
                <Badge color='light-primary' className='font_style'>Đã hủy : {totalCustomerCheckingCanceled} xe</Badge>
              </div>
            </div>
          );
        },
      },
      {
        name: intl.formatMessage({ id: "total_scheduleds" }),
        sortable: true,
        minWidth: "400px",
        maxWidth: "400px",
        cell: (row) => {
          const {totalCustomerScheduleClosed, totalCustomerScheduleCanceled, totalCustomerScheduleNew, totalCustomerScheduleConfirm} = row
          return (
            <div>
              {/* {totalCustomerScheduleClosed} / {totalCustomerScheduleCanceled} */}
              <div>
                <Badge color='light-success' className='font_style'>Đóng : {totalCustomerScheduleClosed} xe</Badge>
              </div>
              <div>
                <Badge color='light-primary' className='font_style'>Đã xác nhận : {totalCustomerScheduleConfirm} xe</Badge>
              </div>
              <div>
                <Badge color='light-warning' className='font_style'>Chưa xác nhận : {totalCustomerScheduleNew} xe</Badge>
              </div>
              <div>
                <Badge color='light-danger' className='font_style'>Đã hủy : {totalCustomerScheduleCanceled} xe</Badge>
              </div>
            </div>
          );
        },
      },
  ]

  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  function getData(params) {
    const newParams = {
      ...params
    }
    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.getListReport(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setItems(data.data)
            setTotal(data.total)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  useEffect(() => {
    getData(paramsFilter)
    fetchMetaData()
  }, [])

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(param) {
      paramsFilter.skip = param * 20
      const response = await IntegratedService.getListReport(paramsFilter)
      const data = await response.data.data;
      return data;
    } 
      for (const param of params) {
        const result = await fetchData(param);
         results = [...results , ...result]
      }
      const convertedData = results.map(appUser => {
        const totalRes = appUser.totalCustomerCheckingCanceled.toString() + '/' + appUser.totalCustomerCheckingCompleted.toString() + '/' + appUser.totalCustomerCheckingFailed.toString()
        const totalSche = appUser.totalCustomerScheduleClosed.toString() + '/' + appUser.totalCustomerScheduleCanceled.toString()
        return {
          'Mã trạm': appUser.stationCode,
          'Tên trạm': appUser.stationsName,
          'Ngày': appUser.reportDay,
          'tổng số xe đăng kiểm (hủy / thành công / thất bại)': totalRes,
          'tổng số lịch hẹn (thành công / hủy)': totalSche
        }
      })
        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "BaoCaoDangKiem.xlsx");
  }

  const handleFilterDay = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setDate(newDate)
    const newParams = {
      filter: {
        // reportDay: newDate
      },
      skip: 0,
      limit: 20,
      startDate : newDate,
      endDate : newDate
  };
  getData(newParams)
  }

  const stationTypes = [
    { value : '', label: intl.formatMessage({ id: 'all_stations' })},
    { value: meta.STATION_TYPE?.EXTERNAL, label: intl.formatMessage({ id: 'external' })},
    { value: meta.STATION_TYPE?.INTERNAL, label: intl.formatMessage({ id:'internal' })},
    { value: meta.STATION_TYPE?.GARAGE, label: intl.formatMessage({ id:'garage' })},
    { value: meta.STATION_TYPE?.HELPSERVICE, label: intl.formatMessage({ id:'help_service' })},
    { value: meta.STATION_TYPE?.INSURANCE, label: intl.formatMessage({ id:'INSURANCE' })},
    { value: meta.STATION_TYPE?.CONSULTING, label: intl.formatMessage({ id:'consulting_unit' })},
    { value: meta.STATION_TYPE?.AFFILIATE, label: intl.formatMessage({ id:'AFFILIATE' })},
    { value: meta.STATION_TYPE?.ADVERTISING, label: intl.formatMessage({ id:'ADVERTISING' })},
    { value: meta.STATION_TYPE?.COOPERATIVE, label: intl.formatMessage({ id:'COOPERATIVE' })},
    { value: meta.STATION_TYPE?.USED_VEHICLES_DEALERSHIP, label: intl.formatMessage({ id:'USED_VEHICLES_DEALERSHIP' })},
    { value: meta.STATION_TYPE?.SPARE_PARTS_DEALERSHIP, label: intl.formatMessage({ id:'SPARE_PARTS_DEALERSHIP' })},
    { value: meta.STATION_TYPE?.PARKING_LOT, label: intl.formatMessage({ id:'PARKING_LOT' })},
    { value: meta.STATION_TYPE?.VEHICLE_MODIFICATION, label: intl.formatMessage({ id:'VEHICLE_MODIFICATION' })},
    { value: meta.STATION_TYPE?.DRIVING_SCHOOL, label: intl.formatMessage({ id:'DRIVING_SCHOOL' })},
    { value: meta.STATION_TYPE?.CHAUFFEUR_SERVICE, label: intl.formatMessage({ id:'CHAUFFEUR_SERVICE' })},
    { value: meta.STATION_TYPE?.PARTS_MANUFACTURING_CONSULTANCY, label: intl.formatMessage({ id:'PARTS_MANUFACTURING_CONSULTANCY' })},
    { value: meta.STATION_TYPE?.DRIVER_HEALTH, label: intl.formatMessage({ id:'DRIVER_HEALTH' })},
  ]

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col className="mb-1" sm="4" xs="12" lg='2'>
             <BasicAutoCompleteDropdown  
                placeholder='Trung tâm'
                name='stationType'
                options={stationTypes}
                onChange={({ value }) => handleFilterChange("stationType", value)}
              />
          </Col>
          <Col className="mb-1" sm="4" xs="6" lg='2'>
            <Flatpickr
              id="single"
              value={date.length > 0 ? date : moment().subtract(1, 'days').format('DD/MM/YYYY')}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: 'operation_day' })}
              className="form-control form-control-input"
              onChange={(date) => {
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col sm='3' md='3' lg='2' xs='6'>
            <LoadingDialog 
            onExportListCustomers={onExportExcel}
            title={intl.formatMessage({ id: "export" })}
            />
          </Col>
        </Row>

        <div className="mx-0 mb-50 style_activity">
          <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Registry))