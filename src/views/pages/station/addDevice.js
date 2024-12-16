import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import React, { Fragment, memo, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    CardText,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Row
} from 'reactstrap'
import './index.scss'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import { readAllArea } from '../../../helper/localStorage'
import StationDevice from '../../../services/statiosDevice'
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

const AddDevice = ({ intl }) => {
  const history = useHistory()

  const { register,errors, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [date, setDate] = useState('')
  const [expireDay, setExpireDay] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const readArea = readAllArea()
  const listStation = readLocal.sort((a, b) => a - b)
  const [puplish, setPuplish] = useState()
  const [expire, setExpire] = useState()

  function handleInsert(data) {
    let checkPuplish = moment().diff(puplish?.[0], 'days')
    let checkExpire = moment().diff(expire?.[0], 'days')
    if (checkPuplish < 0) {
      toast.warn(intl.formatMessage({ id: 'please_chose_deviceTestedDate' }))
      return null
    }
    if (checkExpire >= checkPuplish) {
      toast.warn(intl.formatMessage({ id: 'please_chose_deviceExpiredTestedDate' }))
      return null
    }
    if (/^\s*$/.test(data.deviceName)) {
      toast.warn(intl.formatMessage({ id: 'illegal_name' }))
      return null
    }
    if (/^\s*$/.test(data.deviceType)) {
      toast.warn(intl.formatMessage({ id: 'illegal_type' }))
      return null
    }
    if (/^\s*$/.test(data.deviceSeri)) {
      toast.warn(intl.formatMessage({ id: 'illegal_seri' }))
      return null
    }
    if (/^\s*$/.test(data.deviceBrand)) {
      toast.warn(intl.formatMessage({ id: 'illegal_brand' }))
      return null
    }
    if(data.deviceTestedDate === "Invalid date" || data.deviceTestedDate === ""){
      toast.warn(intl.formatMessage({ id: 'please_deviceTestedDate' }))
      return null
    }
    if (data.deviceExpiredTestedDate === "Invalid date" || data.deviceExpiredTestedDate === "") {
      toast.warn(intl.formatMessage({ id: 'please_deviceExpiredTestedDate' }))
      return null
    }
    StationDevice.handleInsert(data).then((res) => {
      if (res) {
        const { statusCode, message, error } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          if(error === 'DUPLICATE_SERI' && statusCode === 500){
            toast.error(<FormattedMessage id='error_seri'/>)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
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
    setUserDataTouched({
      ...userDataTouched,
      [name]: value
    })
  }

  const onKeyDown = (e) =>{
    let key = e.keyCode
    if((key >= 48 && key <= 59) || (key >= 96 && key <= 105) || key === 8){
    } else {
      e.preventDefault()
    }
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
              <CardText className="h3">{intl.formatMessage({ id: 'add_device' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                    handleInsert({
                      deviceName : userDataTouched.deviceName,
                      stationsId: userDataTouched.stationsId,
                      deviceBrand: userDataTouched.deviceBrand,
                      deviceManufactureYear: userDataTouched.deviceManufactureYear,
                      deviceType: userDataTouched.deviceType,
                      deviceSeri: userDataTouched.deviceSeri,
                      deviceStatus : userDataTouched.deviceStatus,
                      deviceTestedDate : date,
                      deviceExpiredTestedDate : expireDay
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
                        onKeyDown={(e) => onKeyDown(e)}
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
                   className='form-control col-sm-12 col-xs-12'
                   onChange={(date) => {
                       setPuplish(date)
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
                       setExpire(date)
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
    </Fragment>
  )
}

export default injectIntl(memo(AddDevice))
