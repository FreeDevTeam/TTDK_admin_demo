import '@styles/react/libs/tables/react-dataTable-component.scss'
import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { Briefcase, ChevronDown, Edit, Mail, MessageSquare, MoreVertical, Search } from 'react-feather'
import { injectIntl } from "react-intl"
import ReactPaginate from 'react-paginate'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Badge, Button, Card, Col, DropdownItem, DropdownMenu, DropdownToggle, Input, InputGroup, Row, UncontrolledDropdown } from 'reactstrap'
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../../helper/localStorage'
import IntegratedService from '../../../services/Integrated'
import StationFunctions from '../../../services/StationFunctions'
import MySwitch from '../../components/switch'
import { STATUS_OPTIONS } from './../../../constants/app'
import { stationTypes } from "../../../constants/dateFormats";
import BasicTablePaging from '../../components/BasicTablePaging'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}
const IntegratedPage = ({intl}) =>{

    const stations_location = [
      { value: '', label: 'all_location'},
      { value: [1,2,3,4,5,6,7,8,9,10], label:  'has_position'}, 
      { value: [0], label:  'not_position'},
    ]

    const [searchValue, setSearchValue] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [total, setTotal] = useState(20)
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
    const [isLoading, setIsLoading] = useState(false)
    const [items, setItems] = useState([])
    const [listStationArea, setListStationArea] = useState()
    const [number, setNumber] = useState()
    const dataUser = JSON.parse(localStorage.getItem(APP_USER_DATA_KEY));
    console.log(items);
    const history = useHistory()
    const onUpdateStationEnableUse = (id,data) => {
     const dataUpdate = {
      id: id,
      data : data
     }
     const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
     IntegratedService.handleUpdateData(dataUpdate,newToken).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          const newParams = {
            ...paramsFilter,
            skip: (currentPage - 1) * paramsFilter.limit
          }
          getData(newParams)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })}
    }
    const onUpdateEnableUsePayMent = (id,data) => {
      const dataUpdate = {
       id: id,
       data : data
      }
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
       if (token) {
         const newToken = token.replace(/"/g, '')
      IntegratedService.handleUpdateDataPayment(dataUpdate,newToken).then(res => {
       if (res) {
         const { statusCode } = res
         if (statusCode === 200) {
           const newParams = {
             ...paramsFilter,
             skip: (currentPage - 1) * paramsFilter.limit
           }
           getData(newParams)
           toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
         } else {
           toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
         }
       }
     })}
     }
     function getListStationArea() {
      StationFunctions.getListStationArea().then((res) => {
        if (res) {
          const { statusCode, data } = res
          if (statusCode === 200) {
            let newData=data
            newData.unshift({
              value:intl.formatMessage({ id: "Area" }),
            });
            setListStationArea(newData)
          }
        }
      })
    }

     const handleFilterChange = (name, value) => {
      if(name === 'enablePriorityMode'){
        var arr = value.split(',');
        const newParams = {
          ...paramsFilter,
          filter: {
            ...paramsFilter.filter,
            enablePriorityMode : arr ? arr : undefined
          },
          skip: 0,
        }
        if(value.length === 0){
          delete newParams.filter.enablePriorityMode
        }
        setParamsFilter(newParams)
        getData(newParams)
        return null
      }
      const newParams = {
        ...paramsFilter,
        filter: {
          ...paramsFilter.filter,
          [name]: value ? value : undefined
        },
        skip: 0,
      }
      setParamsFilter(newParams)
      getData(newParams)
    }

    const handleSearch = () => {
      const newParams = {
        ...paramsFilter,
        searchText: searchValue
      }
      if (newParams.searchText) {
        setParamsFilter(newParams)
        getData(newParams)
      } else {
        setParamsFilter(newParams)
        getData(paramsFilter)
      }
    }

    const handleInputChange = (e, row) => {
        onUpdateStationEnableUse(row.stationsId,{
          enablePriorityMode: Number(e.target.value)
        })
    }

  const renderSystemServices = (station) => {
    // Đếm số chức năng hệ thống được bật
    const totalEnabledSystemFunctions = station.enableOperateMenu +
      station.enableCustomerMenu +
      station.enableScheduleMenu +
      station.enableMarketingMessages +
      station.enableDocumentMenu +
      station.enableDeviceMenu +
      station.enableManagerMenu +
      station.enableVehicleRegistrationMenu +
      station.enableContactMenu +
      station.enableChatMenu +
      station.enableNewsMenu;
    // Đếm tổng số chức năng hệ thống
    const totalSystemFunctions = 11; // Số chức năng hiện tại

    return <Badge color="info">
      {`${totalEnabledSystemFunctions} / ${totalSystemFunctions}`}
    </Badge>;
  };

  const renderServices = (station) => {
    // Đếm số dịch vụ được bật
    const totalEnabledServices = station.stationEnableUseEmail +
      station.stationEnableUseMomo +
      station.stationEnableUseVNPAY +
      station.stationEnableUseZNS +
      station.stationEnableUseSMS;

    // Đếm tổng số dịch vụ
    const totalServices = 5; // Số dịch vụ hiện tại

    return  <Badge color="info"> {`${totalEnabledServices} / ${totalServices}`} </Badge>;
  };


    const columns = [
       {
            name: intl.formatMessage({ id: 'code' }),
            minWidth: '90px',
            maxWidth: '90px',
            center: true,
            selector: row => row.stationCode,
            cell: (row) => {
             return <a 
             className='text-primary'
             onClick={()=> history.push(`/pages/detail-integrated/${row.stationsId}`)}>
                {row.stationCode}
             </a>
            }
        },
            {
            name: intl.formatMessage({ id: 'stationsName' }),
            minWidth: '500px',
            maxWidth: '500px',
            selector: row => row.stationsName
        },
        {
            name: intl.formatMessage({ id: 'display_location' }),
            selector: row => row.stationsId,
            sortable: true,
            minWidth: '170px',
            maxWidth: '170px',
            cell: (row) => {
              const { enablePriorityMode } = row
              const prioritize = 10 - enablePriorityMode
             return <span>
              {enablePriorityMode === null ? <span>-</span> :
               <Input  
               type='number'
               defaultValue={enablePriorityMode}
               value={ number }
               onBlur={e => handleInputChange(e, row)}
               />
            }
             </span>
            }
        },
        {
          name: "Hệ thống",
          minWidth: '200px',
          center: true,
          maxWidth: '200px',
          cell:(row) => renderSystemServices(row)
      },
      //Tạm thời đóng, làm sau
        {
            name: "Dịch vụ",
            minWidth: '200px',
            center: true,
            maxWidth: '200px',
            cell:(row) => renderServices(row)
        },
     
        {
          name: intl.formatMessage({ id: 'action' }),
          selector: 'action',
          center:true,
          minWidth: "150px",
          maxWidth: '150px',
          cell: (row) => (
            <a className="pr-1 w-25" onClick={(e) => {
              e.preventDefault();
              history.push(`/pages/edit-integrated/${row.stationsId}`)
            }
              }>
              {<Edit size={16}/>}
            </a>
          )
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

    const handlePaginations = (page) => {
      const newParams = {
        ...paramsFilter,
        skip: (page - 1) * paramsFilter.limit
      }
      if(page === 1){
        getData(paramsFilter)
        return null
      }
      getData(newParams)
      setCurrentPage(page + 1)
    }

    const CustomPagination = () => {
        const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))  
        return (
          <ReactPaginate
            previousLabel={''}
            nextLabel={''}
            breakLabel='...'
            pageCount={count || 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            activeClassName='active'
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            onPageChange={page => handlePagination(page)}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName={
              'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
            }
          />
        )
      }

    function getData(params){
      const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
      if (token) {
        const newToken = token.replace(/"/g, '')
        IntegratedService.getList(params, newToken).then((res) => {
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
      getListStationArea()
    }, [])

    const CustomPaginations = () =>{
      const lengthItem = items.length
      return (
        <BasicTablePaging 
          items={lengthItem}
          handlePaginations={handlePaginations}
        />
      )
    }

  return (
    <Fragment>
      {/* <NumberInput /> */}
        <Card>
        <Row className='mx-0 mt-1 mb-50'>
        <Col   md = '2' sm='4' xs='12' className='d-flex mt-sm-0 mt-1'>
          <InputGroup className="input-search-group">
            <Input
              placeholder={intl.formatMessage({ id: 'Search' })}
              className='dataTable-filter'
              type="search"
              bsSize='md'
              id='search-input' 
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value) }}
            />
            </InputGroup>
            <Button color='primary'
              size="md"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "stationStatus" })}
              name='stationStatus'
              options={Object.values(STATUS_OPTIONS)}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({value}) => {
                handleFilterChange('stationStatus', value);
              }}
            />
          </Col>
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "all_location" })}
              name='enablePriorityMode'
              options={Object.values(stations_location)}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({value}) => {
                handleFilterChange('enablePriorityMode', String(value));
              }}
            />
          </Col>
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "Area" })}
              name='stationArea'
              options={listStationArea}
              getOptionLabel={(option) => option.value}
              getOptionValue={(option) => option.value}
              onChange={({value}) => {
                handleFilterChange('stationArea', value == intl.formatMessage({ id: "Area" }) ? '': value);
              }}
            />
          </Col>
          {dataUser?.roleId === 1 ?  
          <Col sm='2' md = '2' lg='2' xs='6' className='mb-1'>
            <BasicAutoCompleteDropdown
              placeholder={intl.formatMessage({ id: "stations-all" })}
              name='stationType'
              options={stationTypes}
              getOptionLabel={(option) => intl.formatMessage({ id: option.label })}
              onChange={({value}) => {
                handleFilterChange('stationType', value);
              }}
            />
          </Col> : null
          }
        </Row>

        <div className='mx-0 mb-50 [dir]'>
            <DataTable
            noHeader
            // pagination
            paginationServer
            className='react-dataTable'
            columns= {columns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
        </Card>

    </Fragment>
  )
}

export default injectIntl(memo(IntegratedPage)) 
