// @ts-nocheck
// ** React Imports
import { Fragment, memo, useEffect, useState } from 'react'
// ** Store & Actions
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import _, { stubString } from 'lodash'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import { Bell, ChevronDown, Edit, Search, Trash, Framer, Calendar, Eye, X, Circle, Check } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, CardText, Button, Card, Col, Form, FormGroup, Input, InputGroup, Modal, ModalBody, ModalHeader, Row, Label } from 'reactstrap'
import { SCHEDULE_TYPE } from '../../../constants/app'
import addKeyLocalStorage, { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import StationFunctions from '../../../services/StationFunctions'
import Type from '../../components/vehicletype'
import { SCHEDULE_STATUS } from '../../../constants/app'
import './index.scss'
import BasicWrapElideText from '../../components/Contract/BasicWrapElideText'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'
import PickerDateTime from '../../forms/form-elements/datepicker/PickerDateTime'
import { DATE_DISPLAY_FORMAT } from '../../../constants/dateFormats'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { LICENSEPLATES_COLOR } from './../../../constants/app'
import { useParams } from 'react-router-dom/cjs/react-router-dom.min'
import { PROCESSING_STATUS } from '../../../constants/app'
import Select, { StylesConfig } from 'react-select';
import chroma from 'chroma-js'

const vehicleTypes = [
  { value: '', label: 'Tất cả trạng thái' },
  { value: 20, label: 'Thất bại' },
  { value: 10, label: 'Thành công' }
]

const processingStatusOptions = [
  { value: '', label: 'Tất cả trạng thái xử lý' },
  { value: PROCESSING_STATUS.UNPROCESSED, label: 'Chưa xử lý', color: '#808080' },
  { value: PROCESSING_STATUS.FIRST_FOLLOWUP, label: 'Theo dõi lần 1', color: '#FFA500' },
  { value: PROCESSING_STATUS.SECOND_FOLLOWUP, label: 'Theo dõi lần 2', color: '#FFA500' },
  { value: PROCESSING_STATUS.CUSTOMER_THINKING, label: 'KH đang suy nghĩ', color: '#FFA500' },
  { value: PROCESSING_STATUS.CUSTOMER_NO_NEED, label: 'KH không có nhu cầu', color: '#FF0000' },
  { value: PROCESSING_STATUS.CERTIFICATE_ISSUED, label: 'Đã cấp chứng nhận', color: '#008000' },
  { value: PROCESSING_STATUS.WAITING_PAYMENT, label: 'Chờ KH thanh toán', color: '#0000FF' },
  { value: PROCESSING_STATUS.CANCEL_CERTIFICATION, label: 'Hủy chứng nhận', color: '#FF0000' },
  { value: PROCESSING_STATUS.PAID, label: 'Đã thanh toán', color: '#800080' }
]

const ListConsultetion = ({ intl }) => {
  let {id}=useParams()
  const DefaultFilter = {
    filter: {
      scheduleType:id
    },
    skip: 0,
    limit: 20,
    order: {
      key: 'createdAt',
      value: 'desc'
    }
  }
  const MySwal = withReactContent(Swal)
  const ModalSwal = (newData) => {
    return MySwal.fire({
      title: intl.formatMessage({ id: 'do_you_update' }),
      showCancelButton: true,
      confirmButtonText: intl.formatMessage({ id: 'agree' }),
      cancelButtonText: intl.formatMessage({ id: 'shut' }),
      customClass: {
        confirmButton: 'btn btn-danger',
        cancelButton: 'btn btn-primary ml-1'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        handleUpdateData(newData)
      }
    })
  }

  function handleUpdateData(item) {
    StationFunctions.changeConsultingStatus(item).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          getData(paramsFilter)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const conditionalRowStyles = [
    {
      when: (row) => row.dealStatus === 10,
      style: {
        backgroundColor: '#81d156',
        color: 'white'
      }
    },
    {
      when: (row) => row.dealStatus === 20,
      style: {
        backgroundColor: '#de6e66',
        color: 'white'
      }
    }
    // Các điều kiện khác...
  ]

  const handleClicker = (row) => {
    setClickedRows({
      ...clickedRows,
      [row.scheduleCode]: !clickedRows[row.scheduleCode]
    })
  }

  const handleClickerBSX = (row) => {
    setClickedRowsBSX({
      ...clickedRowsBSX,
      [row.customerScheduleId]: !clickedRowsBSX[row.customerScheduleId]
    })
  }

  const colourStyles = {
    option: (styles, { data, isDisabled, isFocused, isSelected }) => {
      const color = data.color ? chroma(data.color) : chroma('#ccc'); // Default to gray if no color
      return {
        ...styles,
        backgroundColor: isDisabled
          ? null
          : isSelected
          ? color.css()
          : isFocused
          ? color.alpha(0.1).css()
          : null,
        color: isDisabled
          ? '#ccc'
          : isSelected
          ? chroma.contrast(color, 'white') > 2
            ? 'white'
            : 'black'
          : color.darken().css(),
        cursor: isDisabled ? 'not-allowed' : 'default',
        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled && (isSelected ? color.css() : color.alpha(0.3).css()),
        },
      };
    },
  };

  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'ID' }),
      selector: 'customerScheduleId',
      minWidth: '100px',
      maxWidth: '100px'
    },
    {
      name: '',
      selector: 'scheduleCode',
      minWidth: '50px',
      maxWidth: '50px',
      center: true,
      cell: (row) => {
        return (
          <span
            href="/"
            className="pointer"
            onClick={(e) => {
              e.preventDefault()
              handleClicker(row)
            }}>
            <Eye className="pointer ml-2" size={15} />
          </span>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'contact' }),
      maxWidth: '200px',
      minWidth: '200px',
      cell: (row) => {
        const { phone, fullnameSchedule, scheduleCode } = row
        const newPhone = phone?.substring(0, 3)
        const cuoiPhone = phone?.slice(-3)
        const cuoiTen = fullnameSchedule?.slice(-5) || ''
        return (
          <div>
            <div>{clickedRows[scheduleCode] ? phone : `${newPhone}****${cuoiPhone}`}</div>
            {cuoiTen && <div className="text-table">{clickedRows[scheduleCode] ? fullnameSchedule : `*****${cuoiTen}`}</div>}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'services' }),
      maxWidth: '220px',
      minWidth: '220px',
      cell: (row) => {
        const { scheduleType } = row
        return (
          <div>
            {scheduleType === SCHEDULE_TYPE.VEHICLE_INSPECTION ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'old_car_registration' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.NEW_VEHICLE_INSPECTION ? (
              <Badge color="light-primary" className="size_text">
                {intl.formatMessage({ id: 'new_car_registration' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.REGISTER_NEW_VEHICLE ? (
              <Badge color="light-info" className="size_text">
                {intl.formatMessage({ id: 'new_car_profile' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.CONSULTANT_MAINTENANCE ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'CONSULTANT_MAINTENANCE' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.CONSULTANT_INSURANCE ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'CONSULTANT_INSURANCE' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.CONSULTANT_RENOVATION ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'CONSULTANT_RENOVATION' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.LOST_REGISTRATION_PAPER ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'LOST_REGISTRATION_PAPER' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.CHANGE_REGISTATION ? (
              <Badge color="light-primary" className="size_text">
                {intl.formatMessage({ id: 'CHANGE_REGISTATION' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.TRAFFIC_FINE_CONSULTATION ? (
              <Badge color="light-info" className="size_text">
                {intl.formatMessage({ id: 'TRAFFIC_FINE_CONSULTATION' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.CONSULTANT_INSURANCE_TNDS ? (
              <Badge color="light-danger" className="size_text">
                {intl.formatMessage({ id: 'CONSULTANT_INSURANCE_TNDS' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.REISSUE_INSPECTION_STICKER ? (
              <Badge color="light-warning" className="size_text">
                {intl.formatMessage({ id: 'REISSUE_INSPECTION_STICKER' })}
              </Badge>
            ) : scheduleType === SCHEDULE_TYPE.VEHICLE_INSPECTION_CONSULTATION ? (
              <Badge color="light-success" className="size_text">
                {intl.formatMessage({ id: 'VEHICLE_INSPECTION_CONSULTATION' })}
              </Badge>
            ) : (
              '-'
            )}
          </div>
        )
      }
    },
    {
      name: '',
      selector: 'scheduleCode',
      minWidth: '50px',
      maxWidth: '50px',
      center: true,
      cell: (row) => {
        return (
          <span
            href="/"
            className="pointer"
            onClick={(e) => {
              e.preventDefault()
              handleClickerBSX(row)
            }}>
            <Eye className="pointer ml-2" size={15} />
          </span>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'information' }) + ' Xe',
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { licensePlates, licensePlateColor, customerScheduleId } = row
        const cuoiBSX = licensePlates.slice(4)
        return (
          <p
            className={`color_licensePlates 
            ${licensePlateColor === LICENSEPLATES_COLOR.white ? 'color_white' : ' '}
            ${licensePlateColor === LICENSEPLATES_COLOR.blue ? 'color_blue' : ' '}
            ${licensePlateColor === LICENSEPLATES_COLOR.yellow ? 'color_yellow' : ' '}
            ${licensePlateColor === LICENSEPLATES_COLOR.red ? 'color_red' : ' '}
          `}>
            {clickedRowsBSX[customerScheduleId] ? licensePlates : `****${cuoiBSX}`}
          </p>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'Area' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { stationArea } = row
        return (
          <div>
            <div>{stationArea}</div>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'registration_day' }),
      minWidth: '150px',
      maxWidth: '150px',
      cell: (row) => {
        const { dateSchedule } = row
        return (
          <div>
            <div>{dateSchedule}</div>
          </div>
        )
      }
    },
    {
      name: 'Hạn BH TNDS',
      minWidth: '150px',
      maxWidth: '150px',
      center: true,
      cell: (row) => {
        const { vehicleExpiryDateBHTNDS } = row
        return (
          <div className="bhtdn">
            {vehicleExpiryDateBHTNDS === null ? (
              <div className="d-flex justify-content-end align-items-center">
                <span
                  href="/"
                  className="pointer"
                  onClick={(e) => {
                    setModalOpen(true)
                    setIdTrans(true)
                    setUpdate(row)
                  }}>
                  <Calendar className="pointer ml-2" size={15} />
                </span>
                <span></span>
              </div>
            ) : (
              <div className="d-flex justify-content-end align-items-center">
                {moment(vehicleExpiryDateBHTNDS, 'YYYYMMDD').format(DATE_DISPLAY_FORMAT)}{' '}
                <span
                  href="/"
                  className="pointer"
                  onClick={(e) => {
                    setModalOpen(true)
                    setIdTrans(true)
                    setUpdate(row)
                  }}>
                  <Calendar className="pointer ml-2" size={15} />
                </span>
              </div>
            )}
          </div>
        )
      }
    },
    {
      name: 'Trạng thái xử lý',
      minWidth: '200px',
      cell: (row) => {
        return (
          <Select
            options={processingStatusOptions}
            value={processingStatusOptions.find(option => option.value === row.processingStatus)}
            onChange={({ value }) => {
              const newData = {
                id: row.customerScheduleId,
                data: {
                  processingStatus: value,
                }
              }
              handleUpdateData(newData)
            }}
            className="w-100"
            styles={colourStyles}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'note' }),
      minWidth: '200px',
      cell: (row) => {
        return (
          <div>
            {BasicWrapElideText(row?.dealNote || '')}
            <Edit 
              className="cursor-pointer" 
              size={15} 
              onClick={() => {
                setSelectedDeal(row)
                setDealNote(row.dealNote || '')
                setDealStatus(row.dealStatus)
                setDealModalOpen(true)
              }} 
            />
          </div>
        )
      }
    },
    // {
    //   name: intl.formatMessage({ id: 'action' }),
    //   selector: 'action',
    //   minWidth: '250px',
    //   maxWidth: '250px',
    //   center: true,
    //   cell: (row) => {
    //     const { customerScheduleId, dealStatus } = row
    //     return (
    //       <>
    //         {dealStatus !== 10 ? (
    //           <span className="mr-1">
    //             <span
    //               href="/"
    //               className="pointer"
    //               onClick={(e) => {
    //                 const newData = {
    //                   id: customerScheduleId,
    //                   data: {
    //                     dealStatus: 20
    //                   }
    //                 }
    //                 ModalSwal(newData)
    //               }}>
    //               <X className="pointer ml-2" size={15} color="red" />
    //             </span>
    //             <span
    //               href="/"
    //               className="pointer"
    //               onClick={(e) => {
    //                 const newData = {
    //                   id: customerScheduleId,
    //                   data: {
    //                     dealStatus: 10
    //                   }
    //                 }
    //                 ModalSwal(newData)
    //               }}>
    //               <Circle className="pointer ml-2" size={15} color="green" />
    //             </span>
    //           </span>
    //         ) : (
    //           ''
    //         )}
    //         <Check
    //           className="cursor-pointer mr-1"
    //           size={15}
    //           color="green"
    //           onClick={() => {
    //             setSelectedDeal(row)
    //             setDealNote(row.dealNote || '')
    //             setDealStatus(10)
    //             setDealModalOpen(true)
    //           }}
    //         />
    //         <X
    //           className="cursor-pointer"
    //           size={15}
    //           color="red"
    //           onClick={() => {
    //             setSelectedDeal(row)
    //             setDealNote(row.dealNote || '')
    //             setDealStatus(20)
    //             setDealModalOpen(true)
    //           }}
    //         />
    //       </>
    //     )
    //   }
    // }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [modalOpen, setModalOpen] = useState(false)
  const [rowcolor, setRowcolor] = useState(false)
  // ** States
  const [dates, setDates] = useState(true)
  const [dateOne, setDateOne] = useState('')
  const [dateTwo, setDateTwo] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [listStationArea, setListStationArea] = useState()
  const listArea = listStationArea?.map((item) => {
    return { ...item, label: item.value }
  })
  const [itemRow, setItemRow] = useState([])
  const [clickedRows, setClickedRows] = useState({})
  const [clickedRowsBSX, setClickedRowsBSX] = useState({})
  listArea?.unshift({ value: '', label: 'Tất cả khu vực' })
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [isResetPassword, setIsResetPassword] = useState({})
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [idTrans, setIdTrans] = useState(false)
  const [date, setDate] = useState('')
  const [openOne, setOpenOne] = useState(false)
  const [openTwo, setOpenTwo] = useState(false)
  const [customerScheduleId, setCustomerScheduleId] = useState('')
  const [listTime, setListTime] = useState([])
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation?.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })
  listNewStation?.unshift({ value: '', label: 'Tất cả mã trạm' })
  const history = useHistory()

  const vehicleType = [
    { value: '', label: 'all' },
    { value: 1, label: 'car' },
    { value: 20, label: 'ro_mooc' },
    { value: 10, label: 'other' }
  ]

  const [update, setUpdate] = useState({})
  const newItemDate = listNewStation.filter((el) => el.stationsId === update?.stationsId)
  const [newItemTime, setNewItemTime] = useState([])
  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen)
  }
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  const [dealModalOpen, setDealModalOpen] = useState(false)
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [dealNote, setDealNote] = useState('')
  const [dealStatus, setDealStatus] = useState(10)

  const handleDealUpdate = () => {
    const newData = {
      id: selectedDeal.customerScheduleId,
      data: {
        dealStatus,
        dealNote
      }
    }
    handleUpdateData(newData)
    setDealModalOpen(false)
  }

  function getData(params, isNoLoading) {
    const newParams = {
      ...params
    }
    if (!isNoLoading) {
      setIsLoading(true)
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, '')

      StationFunctions.getListConsult(newParams, newToken).then((res) => {
        // StationFunctions.getList(newParams, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
            let intitLoadingLove = {}
            for (let index = 0; index < data?.data.length; index++) {
              const element = data.data[index]
              intitLoadingLove[element.scheduleCode] = false
            }
            let intitLoadingLoveBSX = {}
            for (let index = 0; index < data?.data.length; index++) {
              const element = data.data[index]
              intitLoadingLoveBSX[element.customerScheduleId] = false
            }
            setClickedRows(intitLoadingLove)
            setClickedRowsBSX(intitLoadingLoveBSX)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
    } else {
      window.localStorage.clear()
    }
  }
  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 1000)

  const handleFilterDay = (date) => {
    const newDateObj = date.toString()
    const newDates = moment(newDateObj).format('DD/MM/YYYY')
    const newDate = moment(newDateObj).format('YYYYMMDD') * 1
    setDateOne(newDates)
    const newParams = {
      filter: {
        ...paramsFilter.filter,
        daySchedule: newDate,
        scheduleType:id
      },
      skip: 0,
      limit: 20
    }
    if (newParams.filter.dateSchedule === 'Invalid date') {
      delete newParams.filter.dateSchedule
    }
    setParamsFilter(newParams)
    getDataSearch(newParams)
  }

  const handleFilterDayBHTNDS = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('YYYYMMDD') * 1
    const newDates = moment(newDateObj).format('DD/MM/YYYY')
    setDateTwo(newDates)
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        vehicleExpiryDateBHTNDS: newDate
      }
    }
    if (newParams.filter.vehicleExpiryDateBHTNDS === 'Invalid date') {
      delete newParams.filter.vehicleExpiryDateBHTNDS
    }
    setParamsFilter(newParams)
    getDataSearch(newParams)
  }

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
    getListStationArea()
  }, [])
  useEffect(() => {
    let newdata={
      ...paramsFilter,
      filter:{
        scheduleType:id
      }
    }
    getData(newdata)
  }, [id])
  // ** Function to handle filter
  const handleSearch = (e) => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue || undefined,
      skip: 0
    }
    getData(newParams)
  }

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  // ** Custom Pagination
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

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} skip={paramsFilter.skip} />
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  const handleDelete = (data) => {
    StationFunctions.handleDelete(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'delete' }) }))
        }
      }
    })
  }

  const handleNotification = (data) => {
    StationFunctions.handleNotification(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleUpdateCenter = (data) => {
    if (update.stationStatus === 0) {
      return toast.error(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
    }
    StationFunctions.updateSchedule(data).then((res) => {
      if (res) {
        const { statusCode, error } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.error(intl.formatMessage({ id: error }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const getListTime = (id, day) => {
    StationFunctions.userUpdateSettingVehicle({
      id: id,
      data: {
        vehicleExpiryDateBHTNDS: day
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          getData(paramsFilter)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      } else {
        toast.error(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
      }
    })
    setModalOpen(false)
  }

  function getListStationArea() {
    StationFunctions.getListStationArea().then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setListStationArea(data)
        }
      }
    })
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col className="mb-1" sm="3" xs="6">
            <BasicAutoCompleteDropdown
              placeholder="Khu vực"
              name="stationArea"
              options={listArea}
              onChange={({ value }) => handleFilterChange('stationArea', value)}
            />
          </Col>
          <Col className="mb-1" sm="3" xs="6">
            <BasicAutoCompleteDropdown
              placeholder="Trạng thái đơn hàng"
              name="dealStatus"
              options={vehicleTypes}
              onChange={({ value }) => handleFilterChange('dealStatus', value)}
            />
          </Col>
          {/* <Col sm="2" xs='6' className='mb-1'>
            <BasicAutoCompleteDropdown  
              placeholder='Mã trạm'
              name='stationsId'
              options={listNewStation}
              onChange={({ value }) => handleFilterChange("stationsId", value)}
            />
          </Col> */}
          {/* <Col className="mb-1" sm="2" xs="6">
            <Flatpickr
              id="single"
              value={date}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
              placeholder={intl.formatMessage({ id: 'day_schedule' })}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col> */}
          <Col className="mb-1" sm="3" xs="6">
            <Flatpickr
              id="single"
              value={dateOne}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'registration_day' })}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterDay(date)
              }}
            />
          </Col>
          <Col className="mb-1" sm="3" xs="6">
            <Flatpickr
              id="single"
              value={dateTwo}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={'Ngày hết hạn BH TNDS'}
              className="form-control form-control-input"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterDayBHTNDS(date)
              }}
            />
          </Col>
          <Col className="mb-1" sm="3" xs="6">
            <BasicAutoCompleteDropdown
              placeholder="Trạng thái xử lý"
              name="processingStatus"
              options={processingStatusOptions}
              onChange={({ value }) => handleFilterChange('processingStatus', value)}
            />
          </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
            // conditionalRowStyles={conditionalRowStyles}
          />
          {CustomPaginations()}
        </div>
      </Card>
      <Modal isOpen={openOne} toggle={() => setOpenOne(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setOpenOne(false)}>{intl.formatMessage({ id: 'cancel_appointment' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleDelete({
                ...data,
                customerScheduleId: customerScheduleId
              })
              setOpenOne(false)
            })}>
            <FormGroup>
              <Input
                name="reason"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="info" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={openTwo} toggle={() => setOpenTwo(false)} size="md" className={`modal-dialog-centered `}>
        <ModalHeader toggle={() => setOpenTwo(false)}>{intl.formatMessage({ id: 'notification_information' })}</ModalHeader>
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleNotification({
                ...data,
                customerScheduleId: customerScheduleId
              })
              setOpenTwo(false)
            })}>
            <FormGroup>
              <Input
                name="message"
                type="textarea"
                rows={5}
                className="mb-2"
                innerRef={register({ required: true })}
                invalid={errors.username && true}
              />
            </FormGroup>
            <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="success" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={modalOpen} toggle={() => setModalOpen(false)} size="md" className={`modal-dialog-centered `}>
        {idTrans === true ? (
          <ModalHeader toggle={() => setModalOpen(false)}>{intl.formatMessage({ id: 'fileExpireDay' })} BH TNDS</ModalHeader>
        ) : (
          <ModalHeader toggle={() => setModalOpen(false)}>{intl.formatMessage({ id: 'time_change' })}</ModalHeader>
        )}
        <ModalBody>
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateCenter({
                id: update.customerScheduleId,
                data: {
                  stationsId: update.stationsId,
                  dateSchedule: update.dateSchedule,
                  time: update.time
                }
              })
              setModalOpen(false)
            })}>
            {/* <FormGroup>
              <Label>{intl.formatMessage({ id: 'center' })}</Label>
              <BasicAutoCompleteDropdown
                placeholder="Mã trạm"
                name="stationsId"
                options={listNewStation}
                onChange={({ value }) => {
                  setUpdate({ ...update, stationsId: value, dateSchedule: '', time: '' })
                  setDates(false)
                  // getListDate(value)
                }}
                defaultValue={newItemDate[0]}
              />
            </FormGroup> */}
            <FormGroup>
              <Label>{intl.formatMessage({ id: 'Choose_date' })}</Label>
              <Flatpickr
                id="single"
                value={update.vehicleExpiryDateBHTNDS}
                options={{ minDate: 'today', mode: 'single', dateFormat: 'd-m-Y', disableMobile: 'true' }}
                placeholder="Ngày hết hạn BH TNDS"
                className="form-control form-control-input"
                onChange={(date) => {
                  const newDateObj = date.toString()
                  setUpdate({ ...update, vehicleExpiryDateBHTNDS: moment(newDateObj).format('DD/MM/YYYY') })
                  getListTime(update.appUserVehicleId, moment(newDateObj).format('YYYYMMDD') * 1)
                }}
              />
            </FormGroup>
            {/* <FormGroup>
              <Label>{intl.formatMessage({ id: 'choose_time' })}</Label>
               <BasicAutoCompleteDropdown  
                placeholder='Chọn giờ'
                name='time'
                options={listTime}
                getOptionLabel={(option) => option.scheduleTime}
                getOptionValue={(option) => option.scheduleTime}
                onChange={({ scheduleTime }) => setUpdate({...update, time : scheduleTime})}
                value = {
                  listTime.filter(option => 
                    option?.scheduleTime === update?.time)
                }
              />
            </FormGroup> */}
            {/* <FormGroup className="d-flex justify-content-center">
              <Button.Ripple className="mr-1" color="success" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup> */}
          </Form>
        </ModalBody>
      </Modal>
      <Modal isOpen={dealModalOpen} toggle={() => setDealModalOpen(false)} className="modal-dialog-centered">
        <ModalHeader toggle={() => setDealModalOpen(false)}>
          Ghi chú
        </ModalHeader>
        <ModalBody>
          <Form onSubmit={(e) => {
            e.preventDefault()
            handleDealUpdate()
          }}>
            <FormGroup>
              <Label for="dealNote">Nội dung</Label>
              <Input
                type="textarea"
                name="dealNote"
                id="dealNote"
                rows="3"
                value={dealNote}
                onChange={(e) => setDealNote(e.target.value)}
              />
            </FormGroup>
            {/* <FormGroup>
              <Label for="dealStatus">Trạng thái</Label>
              <Input
                type="select"
                name="dealStatus"
                id="dealStatus"
                value={dealStatus}
                onChange={(e) => setDealStatus(parseInt(e.target.value))}
              >
                <option value={10}>Thành công</option>
                <option value={20}>Thất bại</option>
              </Input>
            </FormGroup> */}
            <Button color="primary" type="submit">
              Xác nhận
            </Button>
          </Form>
        </ModalBody>
      </Modal>
    </Fragment>
  )
}

export default injectIntl(memo(ListConsultetion))