// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { MoreVertical, Edit, MessageSquare, Mail, Unlock, Lock, Trash } from 'react-feather'
import _ from 'lodash'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import { useHistory } from 'react-router-dom'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle,
   Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form, InputGroup, InputGroupButtonDropdown 
} from 'reactstrap'
import moment from 'moment'
import FileUploaderBasic from '../../forms/form-elements/file-uploader/FileUploaderBasic'
import { injectIntl } from 'react-intl';
import MySwitch from '../../components/switch';
const DefaultFilter = {
  filter: {
   
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc"
  }
}

const statusOptions = [
  { value: '', label: 'all' },
  { value: 1, label: 'ok' },
  { value: 0, label: 'locked' },
]

const List_Search_Filter = [
  "stationsName",
  "stationUrl",
  "stationsEmail",
]
const StationPage = ({ intl }) => {
  // ** Store Vars
  const history = useHistory()
  const serverSideColumns = [
    {
      name: 'ID',
      selector: 'stationsId',
      sortable: true,
      maxWidth: '60px'
    },
    {
      name: intl.formatMessage({ id:'stationsName' }),
      selector: 'stationsName',
      sortable: true,
      minWidth: '100px'
    },
    {
      name: intl.formatMessage({ id:'url' }),
      selector: 'stationUrl',
      sortable: true,
      minWidth: '300px',
      cell: (row) => {
        const { stationUrl } = row
        const href = `https://${stationUrl}`
        return (
          <a className="text-table" href={href} target="_blank">
           {stationUrl}
          </a>
        )
      }
    },
    {
      name: 'SMS',
      maxWidth: '100px',
      cell: (row) => {
        return (
          <MySwitch
            checked={row.stationEnableUseSMS === 1 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('Stations/updateById',{
                id: row.stationsId,
                data: {
                  stationEnableUseSMS: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: 'ZNS',
      maxWidth: '100px',
      cell: (row) => {
        return (
          <MySwitch
            checked={row.stationEnableUseZNS === 1 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('Stations/updateById',{
                id: row.stationsId,
                data: {
                  stationEnableUseZNS: e.target.checked ? 1 : 0
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id:'advertising' }),
      maxWidth: '200px',
      cell: (row) => {
        return (
          <MySwitch
            checked={row.stationsEnableAd === 1 ? true : false}
            onChange={(e) => onUpdateStationEnableUse("Stations/enableAdsForStation", {
              stationsId: row.stationsId,
              stationsEnableAd: e.target.checked ? 1 : 0
            })}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id:'createdAt' }),
      selector: 'salary',
      sortable: true,
      maxWidth: '200px',
      cell: (row) => {
        const { createdAt } = row

        return (
          <div>
            {moment(createdAt).format('hh:mm DD/MM/YYYY')}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'action' }),
      selector: 'action',
      cell: (row) => {
        const {stationsId} = row
        return (
          <>
          {
            row.stationStatus === 0 ? (
              <Unlock size={20} onClick={() => changeStationStatus(row)} className="mr-1 pointer" />
            ) : (
              <Lock size={20} onClick={() => changeStationStatus(row)} className="mr-1 pointer" />
            )
          }
          <UncontrolledDropdown>
            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault();
                history.push("/pages/form-station", row)
               
               
              }}>
                <Edit className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'edit' })}
                </span>
              </DropdownItem>

              <DropdownItem href='/' onClick={e => {
                e.preventDefault();
                history.push("/pages/form-SMS", row)
              }}>
                <MessageSquare className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'setting' })}{" "}SMS
                </span>
              </DropdownItem>

              <DropdownItem href='/' onClick={e => {
                e.preventDefault();
                history.push("/pages/form-ZNS", row)
              }}>
                <MessageSquare className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'setting' })}{" "}ZNS
                </span>
              </DropdownItem>

              <DropdownItem href='/' onClick={e => {
                e.preventDefault();
                history.push("/pages/form-email", row)
              }}>
                <Mail className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'setting' })}{" "}Email
                </span>
              </DropdownItem>

              <DropdownItem href='/' onClick={e => {
                e.preventDefault();
                handleUpdateData({
                  id: stationsId, 
                  data: {
                    isDeleted: 0 ? 1 : 1
                  }
                })
              }}>
                <Trash className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'delete' })}
                </span>
              </DropdownItem>
             
            </DropdownMenu>
          </UncontrolledDropdown>
          </>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [previewArr, setPreviewArr] = useState([])
  // ** States
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('stationsName')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

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
   
      Service.send({
        method: 'POST', path: 'Stations/getList', data: newParams, query: null
      }).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          setParamsFilter(newParams)
          if (statusCode === 200) {
            setTotal(data.total)
            setItems(data.data)
          } else {
            toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "fetchData"})}))
          }
        } else {
          setTotal(1)
          setItems([])
        }
        if (!isNoLoading) {
          setIsLoading(false)
        }
      })
  
  }

  function handleUpdateData(item, messageSuccess) {
   
      Service.send({
        method: 'POST', path: 'Stations/updateById', data: item, query: null
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(messageSuccess || 'Action update successful!')
            getData(paramsFilter)
          } else {
            toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "update"})}))
          }
        }
      })
    
  }

  function handleAddStation(item) {
   
    Service.send({
      method: 'POST', path: 'Stations/insert', data: item, query: null
    }).then(res => {
      if (res) {
        const { statusCode, message } = res
        console.log(res)
        if (statusCode === 200) {
          toast.success( 'Action successful!')
          getData(paramsFilter)
        } else {
          toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "add"})}))
        }
      }
    })
  
}

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 2000);

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
  }, [])

  // ** Function to handle filter
  const handleFilter = e => {
    if(e.keyCode === 13) {
      const { value } = e.target
      setSearchValue()
      const newParams = {
        ...paramsFilter,
        filter: {
          ...paramsFilter.filter,
          [searchField]: value,
        },
        skip: 0
      }
      getDataSearch(newParams)
    }
  }

  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)

  }

  // ** Function to handle per page
  const handlePerPage = e => {

    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    getData(newParams, true)
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
  }

  const handleChangeSearchField = (filed) => {
    const newParams = {
      ...paramsFilter,
      skip: 0,
    }
    List_Search_Filter.forEach(text => {
      delete newParams.filter[text]
    })
    newParams.filter[filed] = ''
    setSearchValue('')
    setSearchField(filed)
    getData(newParams)
  }


  // ** Custom Pagination
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

 
  const handleOnchange = (name, value) => {
    setUserData(
      {
        ...userData,
        [name]: value
      }
    )
  }

  
  const onUpdateStationEnableUse = (path, data) => {
    Service.send({
      method: 'POST', path: path, data: data, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  function changeStationStatus(row) {
    Service.send({
      method: 'POST', path: "Stations/updateById", data: {
        id: row.stationsId,
        data: {
          stationStatus: row.stationStatus === 1 ? 0 : 1
        }
      }, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
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
    getData(newParams)
  }

  return (
    <Fragment>
      <Card>
        <Row className='mx-0 mt-1 mb-50'>
          <Col sm='5'>
            <div className='d-flex align-items-center'>
              <Label for='sort-select'>
                {intl.formatMessage({id: "show"})}
              </Label>
              <Input
                className='dataTable-select'
                type='select'
                bsSize='sm'
                id='sort-select'
                value={rowsPerPage}
                onChange={e => handlePerPage(e)}
              >

                <option value={20}>20</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </Input>
            </div>
          </Col>
          <Col sm='2'>
            <Input onChange={(e) => {
              const { name, value } = e.target
              handleFilterChange(name, value)
            }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.stationStatus || '') : ''} name='stationStatus' bsSize='sm' >
              {
                statusOptions.map(item => {
                  return <option value={item.value}>{intl.formatMessage({id:item.label})}</option>
                })
              }
            </Input>
          </Col>
          <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1' sm='4'>
            <Label className='mr-1' for='search-input'>
              {intl.formatMessage({id: "Search"})}
            </Label>
            <InputGroup className="input-search-group">
              <InputGroupButtonDropdown addonType='prepend' isOpen={dropdownOpen} toggle={toggleDropDown}>
                <DropdownToggle size="sm" color='primary' caret outline>
                  {intl.formatMessage({id: searchField})}
                </DropdownToggle>
                <DropdownMenu>
                  {
                    List_Search_Filter.map(text => (
                      <DropdownItem 
                        className="dropdownItem-search"
                        value={text}
                        onClick={() => { handleChangeSearchField(text) }} key={intl.formatMessage({id: text})}
                      >
                        {intl.formatMessage({id: text})}
                      </DropdownItem>
                    ))
                  }
                </DropdownMenu>
              </InputGroupButtonDropdown>

              <Input
                className='dataTable-filter'
                type='text'
                bsSize='sm'
                id='search-input'
                value={searchValue}
                onChange={(e) => { setSearchValue(e.target.value) }}
                onKeyDown={handleFilter}
              />
            </InputGroup>

          </Col>
          <Col className='d-flex align-items-center' sm="1">
            <Button.Ripple color='primary'
              size="sm"
              onClick={() => {
                history.push("/pages/form-station", {})
              }}>
              {intl.formatMessage({id: "add"})}
            </Button.Ripple>
          </Col>
          
        
        </Row>
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={items}
          progressPending={isLoading}
        />
      </Card>

      <Modal
        isOpen={modal}
        toggle={() => setModal(false)}
        className={`modal-dialog-centered `}

      >
        <ModalHeader toggle={() => setModal(false)}>
          {userData.stationsId ? 
            intl.formatMessage({id: "edit"}) :
            intl.formatMessage({id: "add"})
          } {" "} {intl.formatMessage({id: "info"}, {type: intl.formatMessage({id: "stations"})})}
          </ModalHeader>
        <ModalBody>
          <Form onSubmit={handleSubmit((data) => {
            const newData ={
              ...data,
              stationsLogo: previewArr && previewArr[0]? previewArr[0].imageUrl : ""
            }
            if(userData.stationsId){
              handleUpdateData({
                id: userData.stationsId,
                data: newData
              })
            }else{
              handleAddStation(newData)
            }
            
            setModal(false)
          })}>
          
            <FormGroup>
              <Label for='stationsName'>
                {intl.formatMessage({id: "name"})}
              </Label>
              <Input
                id='stationsName'
                name='stationsName'
                innerRef={register({ required: true })}
                invalid={errors.stationsName && true}
                placeholder='Name'
                value={userData.stationsName || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
          
            <FormGroup>
              <Label for='stationsLogo'>Logo</Label>
              <FileUploaderBasic setPreviewArr={setPreviewArr} previewArr={previewArr} />

            </FormGroup>
            <FormGroup>
              <Label for='stationsHotline'>Hotline</Label>
              <Input
                id='stationsHotline'
                name='stationsHotline'
                innerRef={register({ required: true })}
                invalid={errors.stationsHotline && true}
                placeholder='Hotline'
                value={userData.stationsHotline || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>
            <FormGroup>
              <Label for='stationsAddress'>
                {intl.formatMessage({id: "address"})}
              </Label>
              <Input
                name='stationsAddress'
                id='stationsAddress'
                innerRef={register({ required: true })}
                invalid={errors.stationsAddress && true}
                value={userData.stationsAddress || ""}
                placeholder={intl.formatMessage({id: "address"})}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup className='d-flex mb-0'>
              <Button.Ripple className='mr-1' color='primary' type='submit'>
                {intl.formatMessage({id: "submit"})}
            </Button.Ripple>

            </FormGroup>
          </Form>
        </ModalBody>

      </Modal>

    </Fragment >
  )
}

export default injectIntl(memo(StationPage))
