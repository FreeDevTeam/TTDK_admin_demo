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
import './index.scss'
import VehicleProfile from '../../../services/vehicleProfile'

const vehiclePlateColorOptions = [
    { value: 'WHITE', label: 'white' },
    { value: 'BLUE', label: 'blue' },
    { value: 'YELLOW', label: 'yellow' }
  ]
  
  const vehicleTypes = [
    { value: 1, label: 'car' },
    { value: 20, label: 'ro_mooc' },
    { value: 10, label: 'other' }
  ]

  const vehicleFuelTypes = [
    { value: 1, label: 'gasoline' },
    { value: 2, label: 'oil' }
  ]

const EditFile = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const { vehicleProfileId } = location.state
  const readArea = readAllArea()
  const { register, handleSubmit, errors} = useForm({
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

  const getDetailUserById = (vehicleProfileId) => {
    VehicleProfile.getDetailUserById({
      id: vehicleProfileId
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
    const newData = {
      id : data.id,
      data : {...data.data,
      vehicleForBusiness : data.data.vehicleForBusiness === true ? 1 : 0,
      vehicleForRenovation : data.data.vehicleForRenovation === true ? 1 : 0,
      equipCruiseControlDevice : data.data.equipCruiseControlDevice === true ? 1 : 0,
      equipDashCam : data.data.equipDashCam === true ? 1 : 0,
      vehicleForNoStamp : data.data.vehicleForNoStamp === true ? 1 : 0,
      vehicleFuelType : +data.data.vehicleFuelType
      }
    } 
    console.log(newData);
    VehicleProfile.updateById(newData).then((res) => {
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
    getDetailUserById(vehicleProfileId)
  }, [])

  return (
    <Fragment>
      <Row>
        <Col sm="10" xs="12">
          <Card>
            <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
              <ChevronLeft />
              {intl.formatMessage({ id: 'goBack' })}
            </div>
            <CardHeader className="justify-content-center flex-column">
              <CardText className="h3">{intl.formatMessage({ id: 'edit_file' })}</CardText>
            </CardHeader>
            <hr color="#808080" />
            <CardBody className="justify-content-center flex-column">
              <Form
                onSubmit={handleSubmit((data) => {
                  handleUpdateData({
                    id: vehicleProfileId,
                    data: data
                  })
                })}>
                <Row>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</Label>
                      <Input
                        type="text"
                        id="vehiclePlateNumber"
                        name="vehiclePlateNumber"
                        bsSize="md"
                        innerRef={register({ required: true })}
                        invalid={errors.vehiclePlateNumber && true}
                        value={userData.vehiclePlateNumber || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}></Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'license-plate-color' })}</Label>
                      <Input
                        type="select"
                        name="vehiclePlateColor"
                        bsSize="md"
                        value={userData.vehiclePlateColor || ''}
                        invalid={errors.vehiclePlateColor && true}
                        innerRef={register({ required: true })}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
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
                        invalid={errors.vehicleType && true}
                        innerRef={register({ required: true })}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
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
                        innerRef={register()}
                        value={userData.vehicleRegistrationCode || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'types' })}</Label>
                      <Input
                        id="vehicleBrandModel"
                        name="vehicleBrandModel"
                        innerRef={register()}
                        value={userData.vehicleBrandModel || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'frame_number' })}</Label>
                      <Input
                        id="chassisNumber"
                        name="chassisNumber"
                        innerRef={register()}
                        value={userData.chassisNumber || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'phone_number' })}</Label>
                      <Input
                        id="engineNumber"
                        name="engineNumber"
                        innerRef={register()}
                        value={userData.engineNumber || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup >
                      <div className="checkbox_style">
                        <Input
                          id="vehicleForBusiness"
                          name="vehicleForBusiness"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.vehicleForBusiness || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'transportation_business' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_style">
                        <Input
                          id="vehicleForRenovation"
                          name="vehicleForRenovation"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.vehicleForRenovation || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'renovations' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_style">
                        <Input
                          id="equipCruiseControlDevice"
                          name="equipCruiseControlDevice"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.equipCruiseControlDevice || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'monitoring_device' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_style">
                        <Input
                          id="equipDashCam"
                          name="equipDashCam"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.equipDashCam || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'camera_installed' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <div className="checkbox_style">
                        <Input
                          id="vehicleNoStamp"
                          name="vehicleNoStamp"
                          type="checkbox"
                          innerRef={register()}
                          value={userData.vehicleNoStamp || ''}
                          onChange={(e) => {
                            const { name, value } = e.target
                            handleOnchange(name, value)
                          }}
                        />
                        <Label>{intl.formatMessage({ id: 'no_stamps' })}</Label>
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'stationsNote' })}</Label>
                      <Input
                        id="vehicleNote"
                        name="vehicleNote"
                        type='textarea'
                        rows='3'
                        innerRef={register()}
                        value={userData.vehicleNote || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    {/* <FormGroup>
                      <UploadFilesImage setDataFiles={setDataFiles} userData={{}} documentFiles={[]} />
                    </FormGroup> */}
                  </Col>
                  <Col sm="6" xs="12">
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'wheel_recipe' })}</Label>
                      <Input
                        id="wheelFormula"
                        name="wheelFormula"
                        innerRef={register()}
                        value={userData.wheelFormula || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'wheel_marks' })}</Label>
                      <Input
                        id="wheelTreat"
                        name="wheelTreat"
                        innerRef={register()}
                        value={userData.wheelTreat || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'bag_size' })}</Label>
                      <Input
                        id="overallDimension"
                        name="overallDimension"
                        innerRef={register()}
                        value={userData.overallDimension || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'dimensions' })}</Label>
                      <Input
                        id="truckDimension"
                        name="truckDimension"
                        innerRef={register()}
                        value={userData.truckDimension || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'standard_long' })}</Label>
                      <Input
                        id="wheelBase"
                        name="wheelBase"
                        type='number'
                        innerRef={register()}
                        value={userData.wheelBase || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'self_mass' })}</Label>
                      <Input
                        id="vehicleWeight"
                        name="vehicleWeight"
                        type='number'
                        innerRef={register()}
                        value={userData.vehicleWeight || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'volume_goods' })}</Label>
                      <Input
                        id="vehicleGoodsWeight"
                        name="vehicleGoodsWeight"
                        type='number'
                        innerRef={register()}
                        value={userData.vehicleGoodsWeight || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'total_weight' })}</Label>
                      <Input
                        id="vehicleTotalWeight"
                        name="vehicleTotalWeight"
                        type='number'
                        innerRef={register()}
                        value={userData.vehicleTotalWeight || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'drag_mass' })}</Label>
                      <Input
                        id="vehicleTotalMass"
                        name="vehicleTotalMass"
                        type='number'
                        innerRef={register()}
                        value={userData.vehicleTotalMass || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'number_people' })}</Label>
                      <Input
                        id="vehicleSeatsLimit"
                        name="vehicleSeatsLimit"
                        type='number'
                        innerRef={register()}
                        value={userData.vehicleSeatsLimit || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'fuel_type' })}</Label>
                      <Input
                        id="vehicleFuelType"
                        name="vehicleFuelType"
                        type="select"
                        innerRef={register({ required: true })}
                        invalid={errors.vehicleFuelType && true}
                        value={userData.vehicleFuelType || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}>
                        <option value={''}>{intl.formatMessage({ id: 'chose' })}</option>
                        {vehicleFuelTypes.map((item) => {
                          return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
                        })}
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'engine_working' })}</Label>
                      <Input
                        id="engineDisplacement"
                        name="engineDisplacement"
                        type='number'
                        innerRef={register()}
                        value={userData.engineDisplacement || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'maximum_power' })}</Label>
                      <Input
                        id="maxCapacity"
                        name="maxCapacity"
                        type='number'
                        innerRef={register()}
                        value={userData.maxCapacity || ''}
                        onChange={(e) => {
                          const { name, value } = e.target
                          handleOnchange(name, value)
                        }}
                      />
                    </FormGroup>
                    <FormGroup>
                      <Label className="label_color">{intl.formatMessage({ id: 'number_tires' })}</Label>
                      <Input
                        id="vehicleTires"
                        name="vehicleTires"
                        type='number'
                        innerRef={register()}
                        value={userData.vehicleTires || ''}
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

export default injectIntl(memo(EditFile))
