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

const getYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const startYear = 1990; // Năm bắt đầu
  const years = [];
  for (let year = currentYear; year >= startYear; year--) {
    years.push(year.toString());
  }
  return years;
};

const AddDevice = ({ intl }) => {
  const history = useHistory()

  const { register,errors, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({})
  const [date, setDate] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const readArea = readAllArea()
  const listStation = readLocal.sort((a, b) => a - b)

  function handleInsert(data) {
    StationDevice.handleInsert(data).then((res) => {
      if (res) {
        const { statusCode, message } = res
        if (statusCode === 200) {
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'add_new' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'add_new' }) }))
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
                      deviceArea : userDataTouched.deviceArea,
                      stationsId: userDataTouched.stationsId,
                      deviceBrand: userDataTouched.deviceBrand,
                      deviceNumber: userDataTouched.deviceNumber,
                      deviceType: userDataTouched.deviceType,
                      supplyCompany: userDataTouched.supplyCompany,
                      originalPrice: userDataTouched.originalPrice,
                      purchaseOrigin : userDataTouched.purchaseOrigin,
                      purchaseYear: userDataTouched.purchaseYear,
                  })
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="stationCode" className='text-small'>{intl.formatMessage({ id: 'stationCode' })}</Label>
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
                      <Label for="locality" className='text-small'>{intl.formatMessage({ id: 'locality' })}</Label>
                      <Input
                        type="select"
                        id="deviceArea"
                        name="deviceArea"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.deviceArea && true}
                        value={userData.deviceArea || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {readArea?.map((item) => {
                          return <option value={item.value}>{item.value}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label for="chain_type" className='text-small'>{intl.formatMessage({ id: 'chain_type' })}</Label>
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
                      <Label for="necklace_no" className='text-small'>{intl.formatMessage({ id: 'necklace_no' })}</Label>
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
                      <Label for="firm" className='text-small'>{intl.formatMessage({ id: 'firm' })}</Label>
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
                  </Col>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label for="supply_company" className='text-small'>{intl.formatMessage({ id: 'supply_company' })}</Label>
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
                    <FormGroup>
                      <Label for="original_price" className='text-small'>{intl.formatMessage({ id: 'original_price' })}</Label>
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
                      <Label for="year_purchase" className='text-small'>{intl.formatMessage({ id: 'year_purchase' })}</Label>
                      <Input
                        type="select"
                        id="purchaseYear"
                        name="purchaseYear"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.purchaseYear && true}
                        value={userData.purchaseYear || ''}
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
                      <Label for="shopping_facility" className='text-small'>{intl.formatMessage({ id: 'shopping_facility' })}</Label>
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

export default injectIntl(memo(AddDevice))
