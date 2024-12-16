import { useEffect, useState } from 'react'
import axios from 'axios'
import { ChevronDown, Home, Loader } from 'react-feather'
import StatsWithAreaChart from '@components/widgets/stats/StatsWithAreaChart'
import { injectIntl } from 'react-intl'
import './index.scss'
import { Badge, Card, Modal, ModalBody, ModalHeader } from 'reactstrap'
import { formatDisplayNumber } from '../../../../utility/Utils'
import SpinnerTextAlignment from '../../../components/spinners/SpinnerTextAlignment'
import DataTable from 'react-data-table-component'
import moment from 'moment'
import { MAX_SCHEDULE_PER_INSPECTION_LINE } from '../../../../constants/app'
import { stationTypes } from '../../../../constants/dateFormats'
import MySwitch from '../../../components/switch'
import MyOverLoad from '../../../components/overload'
import Status from '../../../components/status'
import BasicTablePaging from '../../../components/BasicTablePaging'
import addKeyLocalStorage from '../../../../helper/localStorage'
import StationFunctions from '../../../../services/StationFunctions'
import { toast } from 'react-toastify'

const TotalActiveStation = ({ kFormatter, intl, data }) => {
  const DefaultFilter = {
    filter: {
      stationStatus : 1
    },
    skip: 0,
    limit: 20
  }

  const [open, setOpen] = useState(false)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)

  const newArr = data.filter((el) => el.stationStatus === 1)

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      selector: 'stationCode',
      sortable: true,
      minWidth: '100px',
      maxWidth: '100px',
      cell: (row) => {
        return <a className="text-primary">{row.stationCode}</a>
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      selector: 'stationsName',
      minWidth: '300px',
      maxWidth: '300px',
      cell: (row) => {
        const { stationsName } = row
        return <div>{stationsName}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'directorName' }),
      selector: 'stationsManager',
      minWidth: '150px',
      maxWidth: '150px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'phoneNumber' }),
      selector: 'stationsHotline',
      minWidth: '130px',
      maxWidth: '130px',
      center: true
    },
    {
      name: intl.formatMessage({ id: 'chain_number' }),
      selector: 'totalInspectionLine',
      center: true,
      minWidth: '140px',
      maxWidth: '140px'
    },
    {
      name: intl.formatMessage({ id: 'productivity_day' }),
      center: true,
      minWidth: '130px',
      maxWidth: '130px',
      cell: (row) => {
        const { totalInspectionLine } = row
        return <div>{totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'schedule_day' }),
      center: true,
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { stationBookingConfig } = row
        let total = 0
        for (let i = 0; i < stationBookingConfig?.length; i++) {
          if (stationBookingConfig[i].enableBooking === 1) {
            total += stationBookingConfig[i].limitSmallCar + stationBookingConfig[i].limitOtherVehicle
          }
        }
        return <div>{total}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'ratio' }),
      center: true,
      minWidth: '80px',
      maxWidth: '80px',
      cell: (row) => {
        const { stationBookingConfig, totalInspectionLine } = row
        let totalSchedule = 0
        for (let i = 0; i < stationBookingConfig?.length; i++) {
          if (stationBookingConfig[i].enableBooking === 1) {
            totalSchedule += stationBookingConfig[i].limitSmallCar + stationBookingConfig[i].limitOtherVehicle
          }
        }
        const active = totalInspectionLine * MAX_SCHEDULE_PER_INSPECTION_LINE
        const total = ((totalSchedule / active) * 100).toFixed(0)
        return <div>{total + '%'} </div>
      }
    },
    {
      name: intl.formatMessage({ id: 'station_type' }),
      center: true,
      maxWidth: '200px',
      minWidth: '200px',
      cell: (row) => {
        const { stationType } = row
        const newValue = stationTypes.filter((el) => el.value === stationType)
        return (
          <div>
            <Badge color="light-info" className="size_text">
              {newValue[0].label}
            </Badge>
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'show' }),
      minWidth: '100px',
      maxWidth: '100px',
      center: true,
      cell: (row) => {
        const { isHidden } = row
        return <MySwitch checked={isHidden === 0 ? true : false} />
      }
    },
    {
      name: intl.formatMessage({ id: 'actives' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { stationStatus } = row
        return <MySwitch checked={stationStatus === 1 ? true : false} />
      }
    },
    {
      name: intl.formatMessage({ id: 'Activation' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { stationBookingConfig } = row
        const res = stationBookingConfig.map((item) => {
          if (item.enableBooking === 1) {
            return true
          } else {
            return false
          }
        })
        return <MySwitch checked={res.some((item) => item === true) === true ? true : false} />
      }
    },
    {
      name: intl.formatMessage({ id: 'overload' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { availableStatus } = row
        return <MyOverLoad checked={availableStatus !== 2 ? true : false} />
      }
    },
    {
      name: intl.formatMessage({ id: 'prioritize' }),
      minWidth: '110px',
      maxWidth: '110px',
      center: true,
      cell: (row) => {
        const { enablePriorityMode } = row
        return <MySwitch checked={enablePriorityMode === 1 ? true : false} />
      }
    },
    {
      name: intl.formatMessage({ id: 'Online' }),
      minWidth: '200px',
      maxWidth: '200px',
      cell: (row) => {
        const { stationLastActiveAt } = row
        let today = moment()
        let dayCount = today.diff(stationLastActiveAt, 'days')
        return <Status params={dayCount} />
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsNote' }),
      selector: 'stationsNote',
      center: true,
      minWidth: '150px',
      maxWidth: '150px'
    },
    {
      name: intl.formatMessage({ id: 'createdAt' }),
      selector: 'createdAt',
      minWidth: '120px',
      maxWidth: '120px',
      center: true,
      cell: (row) => {
        const { createdAt } = row
        return <div>{moment(createdAt).format('DD/MM/YYYY')}</div>
      }
    }
  ]

  useEffect(() => {
    getData(DefaultFilter)
  }, [open])

  function getData(DefaultFilter, isNoLoading) {
    const newParams = {
      ...DefaultFilter
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

      StationFunctions.getListStation(DefaultFilter, newToken).then((res) => {
        if (res) {
          const { statusCode, data } = res
          if (statusCode === 200) {
            setItems(data.data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
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

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(newParams)
      return null
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} skip={paramsFilter.skip} />
  }

  return data !== null ? (
    <>
      <StatsWithAreaChart
        icon={<Home size={21} />}
        stats={formatDisplayNumber(newArr.length)}
        color="primary"
        statTitle={intl.formatMessage({ id: 'totalActiveStation' })}
        className="col-widget"
        symboy={true}
        open={open}
        setOpen={setOpen}
      />
      <Modal isOpen={open} toggle={() => setOpen(false)} className={`modal-dialog-centered `} style={{ maxWidth: '80%' }}>
        <ModalHeader toggle={() => setOpen(false)}>{intl.formatMessage({ id: 'totalActiveStation' })}</ModalHeader>
        <ModalBody>
          <div className="station-active">
            <DataTable
              noHeader
              // pagination
              paginationServer
              className="react-dataTable"
              columns={serverSideColumns}
              sortIcon={<ChevronDown size={10} />}
              data={items}
              progressPending={isLoading}
            />
            {CustomPaginations()}
          </div>
        </ModalBody>
      </Modal>
    </>
  ) : (
    <Card className="col-widget d-flex justify-content-center align-items-center">
      <SpinnerTextAlignment size={60} />
    </Card>
  )
}

export default injectIntl(TotalActiveStation)
