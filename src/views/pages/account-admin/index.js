// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Lock, Search, Unlock, RotateCcw } from 'react-feather'
import _ from 'lodash'
import './index.scss'
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import ReactPaginate from 'react-paginate'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import Role from './role'
import { isUserLoggedIn } from '@utils'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle, InputGroup,
  InputGroupButtonDropdown, Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form, Nav, TabContent, NavItem, NavLink, TabPane
} from 'reactstrap'
import moment from 'moment'
import { injectIntl } from 'react-intl';
import SweetAlert from "../../extensions/sweet-alert"
import addKeyLocalStorage, { APP_USER_DATA_KEY } from '../../../helper/localStorage';
import AdminService from '../../../services/adminService'
import Select from 'react-select'
import { selectThemeColors } from '@utils'
import { readAllArea } from "../../../helper/localStorage";
import { useLocation, useHistory } from 'react-router-dom';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FormattedMessage } from 'react-intl'
import { ACTIVE_STATUS } from '../../../constants/app';
import { stationTypes } from '../../../constants/dateFormats';
import BasicTablePaging from '../../components/BasicTablePaging'
import ResetPasswordUser from './resetPasswordUser';

const statusOptions = [
  { value: '', label: 'stationStatus' },
  { value: 1, label: 'ok' },
  { value: 0, label: 'locked' },
]

const DefaultFilter = {
  filter: {
    active: undefined
  },
  skip: 0,
  limit: 20
}
const List_Search_Filter = [
  "username",
  "email",
  "phoneNumber",
]

const newList = stationTypes.map(el =>{
  return {
    value : String(el.value),
    label : el.label
  }
})

const DataTableServerSide = ({ intl }) => {
  const [active, setActive] = useState('1')
  const [dataUser, setDataUer] = useState({})
  const [area, setArea] = useState([])
  const [valid, setValid] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [center, setCenter] = useState([])
  const [currentUser, setCurrentUser] = useState({})

  const readArea = readAllArea()
  const first = {value : "ALL", label : "Tất cả khu vực"}
  const listArea = readArea.map(item =>{
    return {value : item.value, label : item.value}
  })
  listArea.unshift(first)

  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setDataUer(JSON.parse(localStorage.getItem(APP_USER_DATA_KEY)))
    }
  }, [])
  const toggle = tab => {
    if(tab === '2'){
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('tab','2')
      history.replace({
        pathname : location.pathname,
        search : searchParams.toString()
      })   
    }
    if(tab === '1'){
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('tab','1')
      history.replace({
        pathname : location.pathname,
        search : searchParams.toString()
      })
    }
    if (active !== tab) {
      setActive(tab)
    }
  }
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id:'username' }),
      selector: 'username',
      minWidth : '150px',
      maxWidth : '150px',
      cell: (row) => {
        const { username } = row
        return (
          <div>
            {username}
          </div>
        )
      }
    },
    {
      name: 'Email',
      selector: 'email',
      minWidth : '200px',
      maxWidth : '200px',
      cell: (row) => {
        const { email } = row
        return (
          <div>
            {email}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'fullname' }),
      selector: 'firstName',
      minWidth : '200px',
      maxWidth : '200px',
      cell: (row) => {
        const { firstName, lastName } = row

        return (
          <div>
            {lastName} {firstName}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'Area' }), 
      selector: 'stationArea',
      minWidth : '200px',
      maxWidth : '200px',
      cell: (row) => {
        const { stationArea } = row
        const bolean = Array.isArray(stationArea)
        return (
          <div>
            { bolean === true ? <div>
              {stationArea.map((item, index) =>{
                return <span>
                  <span>{item === "ALL" ? 'Tất cả khu vực' : item}</span>
                  {(index + 1) < stationArea.length ? ',' : ""}
                </span>
              })}
            </div> : stationArea === 'ALL' ? "Tất cả khu vực" :'-'}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'center' }), 
      selector: 'stationType',
      minWidth : '200px',
      maxWidth : '200px',
      cell: (row) => {
        const { stationType } = row
        const bolean = Array.isArray(stationType)
        const newValue = (item) =>{
          const news = stationTypes.filter(el => el.value === Number(item))
          return news[0].label
        }
        return (
          <div>
            { bolean === true ? <div>
              {stationType.map((item, index) =>{
                return <span>
                  <span>{item === "ALL" ? 'Tất cả trung tâm' : newValue(item)}</span>
                  {(index + 1) < stationType.length ? ',' : ""}
                </span>
              })}
            </div> : stationType === 'ALL' ? "Tất cả trung tâm" :'-'}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'status' }),
      selector: 'active',
      minWidth : '150px',
      maxWidth : '150px',
      cell: (row) => {
        const { active } = row
        return (
          <div>
            {active === ACTIVE_STATUS.LOCK ? intl.formatMessage({id:'locked'}) : intl.formatMessage({id:"ok"})}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'lastActive' }),
      selector: 'salary',
      sortable: true,
      minWidth: "220px",
      maxWidth: "220px",
      cell: (row) => {
        const { lastActiveAt } = row
        return (
          <div>
            {lastActiveAt ? moment(lastActiveAt).format('hh:mm DD/MM/YYYY') : "-"}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'role' }), 
      selector: 'roleName',
      minWidth : '150px',
      maxWidth : '150px',
    },
    {
      name: intl.formatMessage({ id:'action' }),
      selector: 'action',
      minWidth : '150px',
      maxWidth : '150px',
      cell: (row) => {
        const {
          lastName,
          firstName,
          phoneNumber,
          active,
          twoFACode,
          telegramId,
          roleId,
          email,
          staffId,
          stationArea,
          stationType
        } = row
        return (
          <div className='d-flex justify-content-center align-items-center'>
          <UncontrolledDropdown>
            <DropdownToggle className='icon-btn hide-arrow' color='transparent' size='sm' caret>
              <MoreVertical size={15} />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem href='/' onClick={e => {
                e.preventDefault(); setModal(true); setUserData({
                  staffId,
                  firstName,
                  lastName,
                  phoneNumber,
                  twoFACode,
                  telegramId,
                  roleId,
                  email,
                  active,
                  stationArea,
                  stationType
                })
                setArea(stationArea)
              }}>
                <Edit className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'edit' })}
                </span>
              </DropdownItem>
              <span onClick={() => {
                const newData = {
                  id: staffId,
                  data: {
                    firstName,
                    lastName,
                    phoneNumber,
                    roleId,
                    email,
                    active: active
                  }
                }
                ModalSwal(newData)
              }}>
                <DropdownItem href='/' onClick={e => {
                  e.preventDefault()

                }}>{
                  active === ACTIVE_STATUS.OPEN ? <div>
                  <Lock className='mr-50' size={15} /> <span className='align-middle'>
                    {intl.formatMessage({ id:'lock' })}
                  </span>
                  </div>
                  : <div>
                  <Unlock className='mr-50' size={15} /> <span className='align-middle'>
                    {intl.formatMessage({ id:'unLock' })}
                  </span>
                  </div>
                }
                </DropdownItem>
              </span>
            </DropdownMenu>

          </UncontrolledDropdown>
          <span
              className="pointer ml-1"
              onClick={(e) => {
                e.preventDefault();
                let newItem = { ...row };
                setCurrentUser(newItem);
                togglePasswordOpen();
              }}
            >
              <RotateCcw size={15} />
            </span>
          </div>
        )
      }
    }
  ]
  
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  // ** States
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [listRoles, setListRoles] = useState([])
  const [roleData, setRoledata] = useState({})
  const [modal, setModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [items, setItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [searchField, setSearchField] = useState('username')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const location = useLocation();
  const history = useHistory();
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})

  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen);
  };

  if(userData?.stationArea === null || userData?.stationArea === ""){
   delete userData.stationArea
  }
  let arr = ['ALL'];
  if(userData?.stationArea === "ALL"){
    userData.stationArea = arr
  }
  const defaultSelectArea = userData?.stationArea?.map(el =>{
   return {value : el, label : el === 'ALL' ? "Tất cả khu vực" : el}
  })

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
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      AdminService.getList(params, newToken).then(res => {
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
    } else {
      window.localStorage.clear()
    }
  }

  const newValues = (item) =>{
    const news = newList.filter(el => el.value === item)
    return news[0]?.label
  }

  if(userData?.stationType === null || userData?.stationType === ""){
    delete userData.stationType
   }
  if(userData?.stationType === "ALL"){
    userData.stationArea = arr
  }
  const defaultSelectType =  userData?.stationType?.map(el =>{
    return {value : el, label : el === 'ALL' ? "Tất cả trung tâm" : newValues(el)}
   })
  
  function getListRole() {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      AdminService.getListRole( {
        filter: {

        },
        skip: 0,
        limit: 20
      },newToken).then(res => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setRoledata(data)
            setListRoles(data.data)
          } else {
            toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "fetchData"})}))
          }
        }

      })
    }

  }

  function handleUpdateData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, "");
      if(item.data.stationArea === 'ALL'){
        item.data.stationArea = arr
      }
      AdminService.handleUpdateData(item,newToken).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id:'actionSuccess' }, {action: intl.formatMessage({id: "update"})}))
            setModal(false)
            getData(paramsFilter)
          } else {
            toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "update"})}))
          }
        }
      })
    }

  }


  function handleAddData(item, messageSuccess) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if(item.username.length < 6){
      toast.error(<FormattedMessage id='error_userName'/>)
      return null
    }
    if (token) {
      const newToken = token.replace(/"/g, "");

      AdminService.handleAddData(item,newToken).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id:'actionSuccess' }, {action: intl.formatMessage({id: "add"})}))
            setModal(false)
            getData(paramsFilter)
          } else {
            toast.warn(intl.formatMessage({ id:'actionFailed' }, {action: intl.formatMessage({id: "add"})}))
          }
        }

      })
    }

  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true)
  }, 2000);

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter)
    setTimeout(() => {
      getListRole()
    }, 1000)
    const searchParams = new URLSearchParams(location.search);
    const tab = searchParams.get('tab')

    if(tab){
      switch (tab) {
        case '1':
          setActive('1')
          break;
        case '2' :
          setActive('2')
          break
      }
    }
  }, [])

  // ** Function to handle filter
  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [searchField]: searchValue || undefined,
      },
      skip: 0
    }
    getData(newParams)
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
    getData(newParams)
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

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen)
  }

  const handleOnchange = (name, value) => {
    // console.log(name, value);
    setUserData(
      {
        ...userData,
        [name]: value
      }
    )
  }

  const MySwal = withReactContent(Swal)
  const ModalSwal = (newData) => {
    if(newData.data.active === ACTIVE_STATUS.LOCK){
      newData.data.active = ACTIVE_STATUS.OPEN
    } else if(newData.data.active === ACTIVE_STATUS.OPEN){
      newData.data.active = ACTIVE_STATUS.LOCK
    }
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
        Swal.fire('Update!', 'Cập nhật thành công', 'success', handleUpdateData(newData))
      }
    })
  }

  const onKeyDown = (e) =>{
    let key = e.keyCode
    if((key >= 48 && key <= 59) || (key >= 96 && key <= 105) || key === 8){
      // setDisabled(false)
      // setValid(false)
    } else {
      // setValid(true)
      // setDisabled(true)
      e.preventDefault()
    }
  }

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if(page === 1){
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

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
      <Card className="accountAdmin">
        <Nav tabs>
          <NavItem>
            <NavLink
              active={active === '1'}
              onClick={() => {
                toggle('1')
              }}
            >
              {intl.formatMessage({ id:'admin' })}
          </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              active={active === '2'}
              onClick={() => {
                toggle('2')
              }}
            >
              {intl.formatMessage({ id:'role' })}
          </NavLink>
          </NavItem>
        </Nav>
        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId='1'>
            <Row className='mx-0 mt-1 mb-50'>
            <Col className='d-flex mt-sm-0 mt-1' sm='2' xs='12'>
                <InputGroup className="input-search-group">
                  <Input
                    className='dataTable-filter'
                    placeholder={intl.formatMessage({ id: "Search" })}
                    type='search'
                    bsSize='sm'
                    id='search-input'
                    value={searchValue}
                    onChange={(e) => { setSearchValue(e.target.value) }}
                  />
                </InputGroup>
          <Button color='primary'
              size="sm"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
              </Col>
              <Col sm='2' xs='6'>
                <Input onChange={(e) => {
                  const { name, value } = e.target
                  handleFilterChange(name, value)
                }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.active || '') : ''} name='active' bsSize='sm' >
                  {
                    statusOptions.map(item => {
                      return <option value={item.value}>{intl.formatMessage({id:item.label})}</option>
                    })
                  }
                </Input>
              </Col>
              <Col sm='2' xs='6'>
                <Input onChange={(e) => {
                  const { name, value } = e.target
                  handleFilterChange(name, value)
                }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.roleId || '') : ''} name='roleId' bsSize='sm' >
                  <option value={''}>
                    {' '}
                    {intl.formatMessage({ id: "role" })}
                    </option>
                  {
                    roleData?.data?.map(item => {
                      return <option value={item.roleId}>{item.roleName}</option>
                    })
                  }
                </Input>
              </Col>
              <Col sm="2" xs='6'>
                <Button.Ripple color='primary'
                  size="sm"
                  onClick={() => {
                    setModal(true)
                    setUserData({})
                  }}>
                  {intl.formatMessage({id: "add"})}
      </Button.Ripple>
              </Col>
            </Row>
            <DataTable
              noHeader
              // pagination
              paginationServer
              className='react-dataTable'
              columns={serverSideColumns}
              sortIcon={<ChevronDown size={10} />}
              // paginationComponent={CustomPagination}
              data={items}
              progressPending={isLoading}
            />
            {CustomPaginations()}
            <Modal
              isOpen={modal}
              toggle={() => setModal(false)}
              className={`modal-dialog-centered `}
            >
              <ModalHeader toggle={() => setModal(false)}>
              {userData.staffId ? 
                  intl.formatMessage({id: "edit"}) :
                  intl.formatMessage({id: "add"})
              } {" "} 
              {
                intl.formatMessage({id: "info"}, {type: intl.formatMessage({id: "User"})})
              }
             </ModalHeader>
              <ModalBody>
                <Form onSubmit={handleSubmit((data) => {
                  if (userData.staffId) {
                    if(area?.length === 0 || area === null){
                      toast.error(<FormattedMessage id='error_area'/>)
                      return
                    }
                    handleUpdateData({
                      id: userData.staffId,
                      data : {
                        ...data,
                        stationArea : area,
                        stationType : center
                      },
                    })
                  } else {
                    handleAddData(data)
                  }
                })}>

                  {
                    !userData.staffId ? (
                      <>
                        <FormGroup>
                          <Label for='username'>
                            {intl.formatMessage({id: "username"})}
                          </Label>
                          <Input
                            id='username'
                            name='username'
                            innerRef={register({ required: true })}
                            invalid={errors.username && true}
                            placeholder='Bruce01'
                            value={userData.username || ''}
                            onChange={(e) => {
                              const { name, value } = e.target
                              handleOnchange(name, value)
                            }}
                            autoComplete="new-password"
                          />
                        </FormGroup>
                        <FormGroup>
                          <Label for='password'>
                            {intl.formatMessage({id: "password"})}
                          </Label>
                          <Input

                            id='password'
                            name='password'
                            innerRef={register({ required: true })}
                            invalid={errors.password && true}
                            placeholder='****'
                            value={userData.password || ''}
                            type="password"
                            onChange={(e) => {
                              const { name, value } = e.target
                              handleOnchange(name, value)
                            }}
                            autoComplete="new-password"
                          />
                        </FormGroup>
                      </>
                    ) : (
                      <>
                    <FormGroup>
                    <Label for='Area'>
                      {intl.formatMessage({id: "Area"})}
                    </Label>
                    <Select
                isClearable={true}
                isMulti
                className='react-select'
                classNamePrefix='select'
                theme={selectThemeColors}
                placeholder="Chọn"
                onChange={(values) => {
                  setArea(values.map(el => el.value))
                }}
                name='stationArea'
                defaultValue={defaultSelectArea}
                options={listArea}
              />
                  </FormGroup>
                  <FormGroup>
                  <Label for='Area'>
                    {intl.formatMessage({id: "center"})}
                  </Label>
                  <Select
              isClearable={true}
              isMulti
              className='react-select'
              classNamePrefix='select'
              theme={selectThemeColors}
              placeholder="Chọn"
              onChange={(values) => {
                setCenter(values.map(el => el.value))
              }}
              name='stationType'
              defaultValue={defaultSelectType}
              options={newList}
            />
                </FormGroup>
                      </>
                  )}
                  <FormGroup>
                    <Label for='firstName'>
                      {intl.formatMessage({id: "name"})}
                    </Label>
                    <Input
                      id='firstName'
                      name='firstName'
                      innerRef={register({ required: true })}
                      invalid={errors.firstName && true}
                      placeholder='Bruce'
                      value={userData.firstName || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='lastName'>
                      {intl.formatMessage({id: "sur_name"})}
                    </Label>
                    <Input

                      id='lastName'
                      name='lastName'
                      innerRef={register({ required: true })}
                      invalid={errors.lastName && true}
                      placeholder='Wayne'
                      value={userData.lastName || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </FormGroup>
                  <FormGroup>
                    <Label for='email'>Email</Label>
                    <Input

                      id='email'
                      name='email'
                      // innerRef={register({ required: true })}
                      invalid={errors.email && true}
                      placeholder='Wayne@gmail.com'
                      value={userData.email || ''}
                      type="email"
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </FormGroup>

                  <FormGroup>
                    <Label for='phoneNumber'>
                      {intl.formatMessage({id: "phoneNumber"})}
                    </Label>
                    <Input
                      // innerRef={register({ required: true })}
                      invalid={errors.phoneNumber && true}
                      name='phoneNumber'
                      placeholder='+84943881692'
                      options={{ phone: true, phoneRegionCode: 'VI' }}
                      // onKeyDown={(e) => onKeyDown(e)}
                      value={userData.phoneNumber || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        const valueNumber = value.replace(/[^0-9]/g, "");
                        if(valueNumber.length !== 10 ){
                          setValid(true)
                          setDisabled(true)
                        } else {
                          setValid(false)
                          setDisabled(false)
                        }
                        handleOnchange(name, valueNumber)
                      }}
                    />
                   {valid ? <p style={{ color : 'red'}}>{intl.formatMessage({id: "valid_number"})}</p> : "" }
                  </FormGroup>

                  <FormGroup>
                    <Label >
                    {intl.formatMessage({id: "role"})}
                    </Label>
                    <Input
                      type='select'
                      name='roleId'
                      innerRef={register({ required: true })}
                      invalid={errors.roleId && true}
                      value={userData.roleId}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    >
                      <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                      {listRoles.map(item => (
                        <option value={item.roleId}>{item.roleName}</option>
                      ))}
                    </Input>
                  </FormGroup>

                  <FormGroup className='d-flex mb-0'>
                    <Button.Ripple className='mr-1' color='primary' type='submit' disabled={disabled}>
                      {intl.formatMessage({id: "submit"})}
                 </Button.Ripple>

                  </FormGroup>
                </Form>
              </ModalBody>

            </Modal>

          </TabPane>
          {
            dataUser.roleId && +dataUser.roleId === 1 ? (
              <TabPane tabId='2'>
                <Role roleData={roleData} />
              </TabPane>
            ) : null
          }
        </TabContent>
      </Card>
      <ResetPasswordUser item={currentUser} open={sidebarPasswordOpen} toggleSidebar={togglePasswordOpen} />
    </Fragment >
  )
}

export default injectIntl(memo(DataTableServerSide))
