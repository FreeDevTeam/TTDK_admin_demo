import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import React, { Fragment, memo, useEffect, useState } from 'react'
import { ChevronLeft } from 'react-feather'
import Flatpickr from 'react-flatpickr'
import { useForm } from 'react-hook-form'
import { injectIntl } from 'react-intl'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Button, Card, CardBody, CardHeader, CardText, Col, Form, FormGroup, Input, Label, Row } from 'reactstrap'
import { convertFileToBase64 } from '../../../helper/common'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import NotificationService from '../../../services/notificationService'
import VehicleService from '../../../services/vehicle'

const vehiclePlateColorOptions = [
  { value: 'WHITE', label: 'white' },
  { value: 'BLUE', label: 'blue' },
  { value: 'YELLOW', label: 'yellow' },
  { value: 'RED', label: 'red' }
]

const vehicleTypes = [
  { value: 1, label: 'car' },
  { value: 20, label: 'ro_mooc' },
  { value: 10, label: 'other' }
]

const accuraceOptions = [
  { value: 1, label: 'accuracy' },
  { value: 0, label: 'non_accuracy' },
  { value: -1, label: 'no_data' },
  { value: -2, label: 'wrong_expiredate' }
]

const FormVehicle = ({ intl }) => {
  const history = useHistory()
  const location = useLocation()
  const { appUserVehicleId } = location.state
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  //   const [data, setData] = useState({})
  //   const [userDataTouched, setUserDataTouched] = useState({})
  const [role, setRole] = useState([])
  const [from, setFrom] = useState('')
  const [end, setEnd] = useState('')
  const [decision, setDecision] = useState('')
  const [stationId, setStationId] = useState(0)
  const [step, setStep] = useState('')
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const [file, setFile] = useState('')
  const [date, setDate] = useState('')

  const userById = (appUserVehicleId) => {
    VehicleService.getDetailById({
      id: appUserVehicleId
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setUserData(data)
          setDate(data.vehicleExpiryDate)
        }
      }
    })
  }

  const handleUpload = async (file, files) => {
    if (!file) {
      setTimeout(() => {
        handleUpdateData({
          id: appUserVehicleId,
          data: {
            ...files,
            vehicleRegistrationImageUrl: undefined,
            vehicleExpiryDate: date
          }
        })
      }, 2000)
    } else {
      const dataUrl = convertFileToBase64(file).then((res) => {
        const ima = res.split(',').pop()
        const newItem = {
          imageData: ima,
          imageFormat: 'png'
        }
        NotificationService.uploadImage(newItem).then((res) => {
          if (res) {
            const { statusCode, data } = res
            if (statusCode === 200) {
              handleUpdateData({
                id: appUserVehicleId,
                data: {
                  ...files,
                  vehicleRegistrationImageUrl: data,
                  vehicleExpiryDate: date
                }
              })
            }
          }
        })
      })
    }
  }

  const handleUpdateData = (data) => {
    return VehicleService.handleUpdate(data).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          userById(appUserVehicleId)
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
    // setUserDataTouched({
    //   ...userDataTouched,
    //   [name]: value
    // })
    // setData({
    //   ...data,
    //   [name]: value
    // })
  }

  useEffect(() => {
    userById(appUserVehicleId)
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
              <CardText className="mt-2 h3">{intl.formatMessage({ id: 'edit_vehicle' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpload(file, data)
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'license-plate-color' })}</Label>
                      <Input
                        type="select"
                        name="vehiclePlateColor"
                        bsSize="md"
                        value={userData.vehiclePlateColor || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        {vehiclePlateColorOptions.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'transportation' })}</Label>
                      <Input
                        type="select"
                        name="vehicleType"
                        bsSize="md"
                        value={userData.vehicleType || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        {vehicleTypes.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'management-number' })}</Label>
                      <Input
                        id="vehicleRegistrationCode"
                        name="vehicleRegistrationCode"
                        value={userData.vehicleRegistrationCode || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'types' })}</Label>
                      <Input
                        id="vehicleBrandName"
                        name="vehicleBrandName"
                        value={userData.vehicleBrandName || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Input
                        type="file"
                        className="mt-3"
                        name="notificationImageUrl"
                        id="notificationImageUrl"
                        onChange={(evt) => {
                          setFile(evt.target.files[0])
                        }}
                      />
                    </FormGroup>
                  </Col>

                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'code_brand' })}</Label>
                      <Input
                        id="vehicleBrandModel"
                        name="vehicleBrandModel"
                        value={userData.vehicleBrandModel || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'vehicleExpiryDate' })}</Label>
                      <Flatpickr
                        id="vehicleExpiryDate"
                        name="vehicleExpiryDate"
                        value={userData.vehicleExpiryDate || ''}
                        options={{ mode: 'single', dateFormat: 'd/m/Y' }}
                        placeholder={intl.formatMessage({ id: 'chose' })}
                        className="form-control col-sm-12 col-xs-12"
                        onChange={(date) => {
                          const newDateObjs = date.toString()
                          const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                          setDate(newDates)
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'stamp_gcn' })}</Label>
                      <Input
                        id="certificateSeries"
                        name="certificateSeries"
                        value={userData.certificateSeries || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>

                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'accuracy' })}</Label>
                      <Input
                        type="select"
                        name="vehicleVerifiedInfo"
                        bsSize="md"
                        value={userData.vehicleVerifiedInfo || ''}
                        innerRef={register()}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        {accuraceOptions.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>
                  </Col>
                </Row>
                <FormGroup className="d-flex mb-0 justify-content-center">
                  <Button.Ripple className="mr-1 mt-2" color="primary" type="submit">
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

export default injectIntl(memo(FormVehicle))
