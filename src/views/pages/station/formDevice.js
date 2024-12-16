import React, { Fragment, useState, memo, useMemo, useEffect } from 'react'
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
import { useForm, Controller } from 'react-hook-form'
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
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { readAllArea } from '../../../helper/localStorage'
import FormInput from '../../components/FormHook/FormInput'
import FormSelect from '../../components/FormHook/FormSelect'
import { FormattedMessage } from 'react-intl'

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990; // Năm bắt đầu
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};

const deviceOptions = [
  {value : 'NEW', label : 'new'},
  {value : 'ACTIVE', label : 'active'},
  {value : 'MAINTENANCE', label : 'maintenance'},
  {value : 'INACTIVE', label : 'inactive'},
  {value : 'MAINTENANCE_SERVICE', label : 'maintenance_service'},
  {value : 'REPAIR', label : 'repair'},
]

const FormDevice = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { stationDevicesId } = location.state
  const readArea = readAllArea()

  const schema = useMemo(() => {
    return yup.object().shape({
      deviceName: yup.string().required(intl.formatMessage({ id: 'isRequired' }))
    });
  }, [intl]);

  const { register, control, setValue, handleSubmit, errors } = useForm({
    mode: 'onSubmit',
    // resolver: yupResolver(schema),
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [paramsFilter, setParamsFilter] = useState()
  const [total, setTotal] = useState(20)
  const [isLoading, setIsLoading] = useState(false)
  const [idTrans, setIdTrans] = useState(null)
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [active, setActive] = useState('1')
  const [date, setDate] = useState('')
  const [expireDay, setExpireDay] = useState('')
  const [liqui, setLiqui] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const optionStation = readLocal.map((item) => ({
    value: item.stationsId,
    label: item.stationCode
  }))

  const getDetailUserById = (stationDevicesId) => {
    StationDevice.getDetailUserById({
      id: stationDevicesId
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res
        if (statusCode === 200) {
          setUserData(data)
        }
      }
    })
  }

  function handleUpdateData(data) {
    if (/^\s*$/.test(data.data.deviceName)) {
      toast.warn(intl.formatMessage({ id: 'illegal_name' }))
      return null
    }
    if (/^\s*$/.test(data.data.deviceType)) {
      toast.warn(intl.formatMessage({ id: 'illegal_type' }))
      return null
    }
    if (/^\s*$/.test(data.data.deviceSeri)) {
      toast.warn(intl.formatMessage({ id: 'illegal_seri' }))
      return null
    }
    if (/^\s*$/.test(data.data.deviceBrand)) {
      toast.warn(intl.formatMessage({ id: 'illegal_brand' }))
      return null
    }
    StationDevice.updateById(data).then((res) => {
      if (res) {
        console.log(res);
        const { statusCode, message, error } = res
        if (statusCode === 200) {
          //   getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          if(error === 'DUPLICATE_SERI' && statusCode === 500){
            toast.error(<FormattedMessage id='error_seri'/>)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      }
    })
  }

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value
    })
  }

  useEffect(() => {
    getDetailUserById(stationDevicesId)
  }, [])

  const onSubmit = (data) => {
    console.log("data", data);
  }

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
                    id : userData.stationDevicesId,
                    data : {
                      deviceName : userData.deviceName,
                      stationsId: userData.stationsId,
                      deviceBrand: userData.deviceBrand,
                      deviceManufactureYear: userData.deviceManufactureYear,
                      deviceType: userData.deviceType,
                      deviceSeri: userData.deviceSeri,
                      deviceStatus : userData.deviceStatus,
                      deviceTestedDate : date,
                      deviceExpiredTestedDate : expireDay
                    }
                  })
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="stationCode" className='text-small'>{intl.formatMessage({ id: 'stationCode' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        type="select"
                        id="stationsId"
                        name="stationsId"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.stationsId && true}
                        value={userData.stationsId || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {listStation?.map((item) => {
                          return <option value={item.stationsId}>{item.stationCode}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="chain_type" className='text-small'>{intl.formatMessage({ id: 'device_name' })}</Label>
                      <Input
                        id="deviceName"
                        name="deviceName"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceName && true}
                        value={userData.deviceName || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="chain_type" className='text-small'>{intl.formatMessage({ id: 'status' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        type="select"
                        id="deviceStatus"
                        name="deviceStatus"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceStatus && true}
                        value={userData.deviceStatus || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {deviceOptions.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="firm" className='text-small'>{intl.formatMessage({ id: 'chain_type' })}</Label>
                      <Input
                        id="deviceType"
                        name="deviceType"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceType && true}
                        value={userData.deviceType || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                  </Col>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="supply_company" className='text-small'>{intl.formatMessage({ id: 'serial_number' })}</Label>
                      <Input
                        id="deviceSeri"
                        name="deviceSeri"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceSeri && true}
                        value={userData.deviceSeri || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="original_price" className='text-small'>{intl.formatMessage({ id: 'brand' })}</Label>
                      <Input
                        id="deviceBrand"
                        name="deviceBrand"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceBrand && true}
                        value={userData.deviceBrand || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label for="year_purchase" className='text-small'>{intl.formatMessage({ id: 'year_manufacture' })} <span style={{color:"red"}}>*</span></Label>
                      <Input
                        type="select"
                        id="deviceManufactureYear"
                        name="deviceManufactureYear"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceManufactureYear && true}
                        value={userData.deviceManufactureYear || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {getYearOptions()?.map((item) => {
                          return <option value={item}>{item}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                    <Label className='text-small'>
                    {intl.formatMessage({ id: "deviceTestedDate" })}
                  </Label>
                  <Flatpickr
                   id='deviceTestedDate'
                   name="deviceTestedDate"
                   value={userData.deviceTestedDate || ""}
                   options={{ mode : 'single', dateFormat: 'd/m/Y',
                   showMonths : true }}
                   placeholder={intl.formatMessage({ id: "deviceTestedDate" })}
                   className='form-control col-sm-12 mb-3 col-xs-12'
                   onChange={(date) => {
                       const newDateObjs = date.toString()
                       const newDates = moment(newDateObjs).format("DD/MM/YYYY")
                       setDate(newDates);
                    }}
              />
                    </FormGroup>
                    <FormGroup>
                    <Label className='text-small'>
                    {intl.formatMessage({ id: "deviceExpiredTestedDate" })}
                  </Label>
                  <Flatpickr
                   id='deviceExpiredTestedDate'
                   name="deviceExpiredTestedDate"
                   value={userData.deviceExpiredTestedDate || ""}
                   options={{ mode : 'single', dateFormat: 'd/m/Y',
                   showMonths : true }}
                   placeholder={intl.formatMessage({ id: "deviceExpiredTestedDate" })}
                   className='form-control col-sm-12 mb-3 col-xs-12'
                   onChange={(date) => {
                       const newDateObjs = date.toString()
                       const newDates = moment(newDateObjs).format("DD/MM/YYYY")
                       setExpireDay(newDates);
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
    </Fragment >
  )
}

export default injectIntl(memo(FormDevice))
