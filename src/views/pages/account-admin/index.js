// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import { MoreVertical, Edit, Lock } from 'react-feather'
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
import addKeyLocalStorage from '../../../helper/localStorage';
const statusOptions = [
  { value: '', label: 'all' },
  { value: 1, label: 'ok' },
  { value: 0, label: 'locked' },
]


const DefaultFilter = {
  filter: {
    active: undefined
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc"
  }
}
const List_Search_Filter = [
  "username",
  "email",
  "phoneNumber",
]
const DataTableServerSide = ({ intl }) => {
  const [active, setActive] = useState('1')
  const [dataUser, setDataUer] = useState({})


  //** ComponentDidMount
  useEffect(() => {
    if (isUserLoggedIn() !== null) {
      setDataUer(JSON.parse(localStorage.getItem(addKeyLocalStorage('userData'))))
    }
  }, [])
  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  }
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id:'username' }),
      selector: 'username',
      sortable: true,
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
      sortable: true,

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
      sortable: true,
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
      name: intl.formatMessage({ id:'status' }),
      selector: 'active',
      sortable: true,
      cell: (row) => {
        const { active } = row

        return (
          <div>
            {!active ? intl.formatMessage({id:'locked'}) : intl.formatMessage({id:"ok"})}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'lastActive' }),
      selector: 'salary',
      sortable: true,
      minWidth: "200px",
      cell: (row) => {
        const { lastActiveAt } = row
        return (
          <div>
            {lastActiveAt ? moment(lastActiveAt).format('hh:mm DD/MM/YYYY') : "N/A"}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id:'role' }), 
      selector: 'roleName',
      sortable: true,
    },
    {
      name: intl.formatMessage({ id:'action' }),
      selector: 'action',
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
          staffId
        } = row
        return (
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
                  active
                })
              }}>
                <Edit className='mr-50' size={15} /> <span className='align-middle'>
                  {intl.formatMessage({ id:'edit' })}
                </span>
              </DropdownItem>
              <SweetAlert onClick={() => {
                const newData = {
                  id: staffId,
                  data: {
                    firstName,
                    lastName,
                    phoneNumber,
                    roleId,
                    email,
                    active: 0
                  }
                }
                handleUpdateData(newData, 'Action Lock Successful!')
              }}>
                <DropdownItem href='/' onClick={e => {
                  e.preventDefault()

                }}>
                  <Lock className='mr-50' size={15} /> <span className='align-middle'>
                    {intl.formatMessage({ id:'lock' })}
                  </span>
                </DropdownItem>
              </SweetAlert>
            </DropdownMenu>

          </UncontrolledDropdown>
        )
      }
    }
  ]
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  // ** States
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
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'Staff/getListStaff', data: newParams, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
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
    } else {
      window.localStorage.clear()
    }
  }

  function getListRole() {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'Role/getList', data: {
          filter: {

          },
          skip: 0,
          limit: 20,
          order: {
            key: "createdAt",
            value: "desc"
          }
        }, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
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

      Service.send({
        method: 'POST', path: 'Staff/updateStaffById', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id:'actionSuccess' }, {action: intl.formatMessage({id: "update"})}))
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

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: 'POST', path: 'Staff/registerStaff', data: item, query: null, headers: {
          Authorization: `Bearer ` + newToken
        }
      }).then(res => {
        if (res) {
          const { statusCode, message } = res
          if (statusCode === 200) {
            toast.success(intl.formatMessage({ id:'actionSuccess' }, {action: intl.formatMessage({id: "add"})}))
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
  }, [])

  // ** Function to handle filter
  const handleFilter = e => {
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
    setUserData(
      {
        ...userData,
        [name]: value
      }
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
        </Nav>
        <TabContent className='py-50' activeTab={active}>
          <TabPane tabId='1'>
            <Row className='mx-0 mt-1 mb-50'>
            <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1 mb-1' sm='2' xs='12'>
                <InputGroup className="input-search-group">

                  <Input
                    className='dataTable-filter'
                    placeholder={intl.formatMessage({ id: "Search" })}
                    type='text'
                    bsSize='sm'
                    id='search-input'
                    value={searchValue}
                    onChange={(e) => { handleFilter(e) }}
                  />
                </InputGroup>

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
              pagination
              paginationServer
              className='react-dataTable'
              columns={serverSideColumns}
              sortIcon={<ChevronDown size={10} />}
              paginationComponent={CustomPagination}
              data={items}
              progressPending={isLoading}
            />
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
                    handleUpdateData({
                      id: userData.staffId,
                      data
                    })
                  } else {
                    handleAddData(data)
                  }

                  setModal(false)
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
                          />
                        </FormGroup>
                      </>
                    ) : null
                  }
                  <FormGroup>
                    <Label for='firstName'>
                      {intl.formatMessage({id: "firstName"})}
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
                      {intl.formatMessage({id: "lastName"})}
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
                      innerRef={register({ required: true })}
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
                      innerRef={register({ required: true })}
                      invalid={errors.lastNameBasic && true}
                      name='phoneNumber'
                      placeholder='+84943881692'
                      options={{ phone: true, phoneRegionCode: 'VI' }}
                      value={userData.phoneNumber || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
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
                      {listRoles.map(item => (
                        <option value={item.roleId}>{item.roleName}</option>
                      ))}
                    </Input>
                  </FormGroup>

                  <FormGroup className='d-flex mb-0'>
                    <Button.Ripple className='mr-1' color='primary' type='submit'>
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
    </Fragment >
  )
}

export default injectIntl(memo(DataTableServerSide))
