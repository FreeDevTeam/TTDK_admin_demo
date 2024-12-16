import React, { Fragment, useState, memo, useEffect } from 'react'
import { ChevronLeft } from 'react-feather'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  Button,
  FormGroup,
  Form,
  Nav,
  NavLink,
  NavItem,
  TabContent,
  TabPane,
  CardHeader,
  CardBody,
  CardImg,
  CardText
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import StationDevice from '../../../services/statiosDevice'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { readAllArea } from '../../../helper/localStorage'

const FormDevice = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { stationDevicesId } = location.state
  const area = readAllArea()
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [paramsFilter, setParamsFilter] = useState()
  const [total, setTotal] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [idTrans, setIdTrans] = useState(null)
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [active, setActive] = useState('1')
  const [date, setDate] = useState('')
  const [liqui, setLiqui] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)

  const getDetailUserById = (stationDevicesId) => {
    StationDevice.getDetailUserById({
      id: stationDevicesId
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res
        if (statusCode === 200) {
          setUserData(data)
          setDate(String(data.purchaseYear))
          setLiqui(String(data.liquidationYear))
        }
      }
    })
  }

  function handleUpdateData(data) {
    StationDevice.updateById(data).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          //   getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
    setUserDataTouched({
      ...userDataTouched,
      [name]: value
    })
  }

  useEffect(() => {
    getDetailUserById(stationDevicesId)
  }, [])

  return (
    <Fragment>
      <Row>
        <Col sm="8" xs="12">
          <Card>
            <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
              <ChevronLeft />
              {intl.formatMessage({ id: 'goBack' })}
            </div>
            <CardHeader className="justify-content-center flex-column">
              <CardText className="h3">{intl.formatMessage({ id: 'edit_device' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    id: stationDevicesId,
                    data: {
                      stationsId: userDataTouched.stationsId,
                      deviceBrand: userDataTouched.deviceBrand,
                      deviceNumber: userDataTouched.deviceNumber,
                      deviceType: userDataTouched.deviceType,
                      supplyCompany: userDataTouched.supplyCompany,
                      originalPrice: userDataTouched.originalPrice,
                      purchaseOrigin : userDataTouched.purchaseOrigin,
                      purchaseYear: userDataTouched.purchaseYear,
                      liquidationYear: userDataTouched.liquidationYear,
                    }
                  })
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="stationCode">{intl.formatMessage({ id: 'stationCode' })}</Label>
                      <Input
                        type="select"
                        name="stationsId"
                        bsSize="md"
                        innerRef={register()}
                        value={userData.stationsId || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        {listStation?.map((item) => {
                          return <option value={item.stationsId}>{item.stationCode}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="chain_type">{intl.formatMessage({ id: 'chain_type' })}</Label>
                      <Input
                        id="deviceType"
                        name="deviceType"
                        innerRef={register()}
                        value={userData.deviceType || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="necklace_no">{intl.formatMessage({ id: 'necklace_no' })}</Label>
                      <Input
                        id="deviceNumber"
                        name="deviceNumber"
                        innerRef={register()}
                        value={userData.deviceNumber || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="firm">{intl.formatMessage({ id: 'firm' })}</Label>
                      <Input
                        id="deviceBrand"
                        name="deviceBrand"
                        innerRef={register()}
                        value={userData.deviceBrand || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="supply_company">{intl.formatMessage({ id: 'supply_company' })}</Label>
                      <Input
                        id="supplyCompany"
                        name="supplyCompany"
                        innerRef={register()}
                        value={userData.supplyCompany || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="original_price">{intl.formatMessage({ id: 'original_price' })}</Label>
                      <Input
                        id="originalPrice"
                        name="originalPrice"
                        innerRef={register()}
                        value={userData.originalPrice || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="year_purchase">{intl.formatMessage({ id: 'year_purchase' })}</Label>
                      <Flatpickr
                        id="purchaseYear"
                        name="purchaseYear"
                        value={date || ''}
                        options={{ mode: 'single', dateFormat: 'Y'}}
                        placeholder={intl.formatMessage({ id: 'chose' })}
                        className="form-control col-sm-12 col-xs-12"
                        onChange={(date) => {
                          console.log(date);
                          const newDateObjs = date.toString()
                          const newDate = moment(newDateObjs).format('YYYY')
                          handleOnchange("purchaseYear", newDate)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="year_lipuidation">{intl.formatMessage({ id: 'year_lipuidation' })}</Label>
                      <Flatpickr
                        id="liquidationYear"
                        name="liquidationYear"
                        value={ liqui || ''}
                        options={{ mode: 'single', dateFormat: 'Y' }}
                        placeholder={intl.formatMessage({ id: 'chose' })}
                        className="form-control col-sm-12 col-xs-12"
                        onChange={(date) => {
                          const newDateObjs = date.toString()
                          const newDates = moment(newDateObjs).format('YYYY')
                          handleOnchange("liquidationYear", newDates)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="shopping_facility">{intl.formatMessage({ id: 'shopping_facility' })}</Label>
                      <Input
                        id="purchaseOrigin"
                        name="purchaseOrigin"
                        innerRef={register()}
                        value={userData.purchaseOrigin || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1" color="primary" type="submit">
                    {intl.formatMessage({ id: 'submit' })}
                  </Button.Ripple>
                </FormGroup>
              </Form>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(FormDevice))
