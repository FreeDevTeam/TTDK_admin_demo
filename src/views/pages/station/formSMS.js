// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from 'react'
// ** Store & Actions
import { toast } from 'react-toastify';
import _ from 'lodash'
import "./index.scss"
import { useForm } from 'react-hook-form'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import Service from '../../../services/request'
import 'uppy/dist/uppy.css'
import '@uppy/status-bar/dist/style.css'
import '@styles/react/libs/file-uploader/file-uploader.scss'
import {
  Card, Input, Label, Row, Col,
  Button, FormGroup, Form
} from 'reactstrap'
import { useLocation } from 'react-router-dom'
import { injectIntl } from 'react-intl';
import { useHistory } from 'react-router-dom'
import MySwitch from '../../components/switch/index'
import { ChevronLeft } from 'react-feather';

const FormSMS = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation()
  const [userData, setUserData] = useState({})
  const [useUserSMSBrandConfig, setUseUserSMSBrandConfig] = useState(0)
  const [stationEnableUseSMS, setStationEnableUseSMS] = useState(0)
  const history = useHistory()
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })
  
  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      setUserData(state.stationCustomSMSBrandConfig ? JSON.parse(state.stationCustomSMSBrandConfig) : {})
      setStationEnableUseSMS(state.stationEnableUseSMS)
      setUseUserSMSBrandConfig(state.stationUseCustomSMSBrand)
    }
  }, [state])

  function handleUpdateData(item) {
    if(stationEnableUseSMS === 1 && useUserSMSBrandConfig === 1) {
      if(Object.keys(errors).length === 0) {
        Service.send({
          method: 'POST', path: 'Stations/updateConfigSMS', data: item, query: null
        }).then(res => {
          if (res) {
            const { statusCode } = res
            if (statusCode === 200) {
              toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
              setTimeout(() => {
                history.push('/pages/station')
              }, 1000)
            } else {
              toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
            }
          }
        })
      }
    } else {
      toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
      setTimeout(() => {
        history.push('/pages/station')
      }, 1000)
    }
  }

  const handleOnchange = (name, value) => {
    setUserData(
      {
        ...userData,
        [name]: value
      }
    )
  }

  const onChangeUseCustomSMSBrand = (newValue) => {
    Service.send({
      method: 'POST', path: 'Stations/updateCustomSMSBrand', data: {
        stationsId: state.stationsId,
        stationUseCustomSMSBrand: newValue
      }, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          setUseUserSMSBrandConfig(newValue)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  const onUpdateStationEnableUseSMS = (newValue) => {
    Service.send({
      method: 'POST', path: 'Stations/updateById', data: {
        id: state.stationsId,
        data: {
          stationEnableUseSMS: newValue
        }
      }, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          setStationEnableUseSMS(newValue)
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }

  return (
    <Fragment>
      <Card  >
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: "goBack" })}
        </div>
        <div className="accountAdmin">
          <h1 className="accountAdmin__title">
            {intl.formatMessage({ id: "info" }, { type: "SMS" }).toUpperCase()}
          </h1>
          <Row>
            <Col sm="12" md="9">
              <Form onSubmit={handleSubmit((data) => {
                handleUpdateData({
                  ...data,
                  stationsId: state.stationsId
                })
              })}
              >

                <FormGroup row>
                  <Label sm="3" for='smsUrl'>
                    SMS Enable
                  </Label>
                  <Col sm='9'>
                    <MySwitch
                      checked={stationEnableUseSMS === 1 ? true : false}
                      onChange={(e) => {
                        onUpdateStationEnableUseSMS(e.target.checked ? 1 : 0)
                      }}
                    />
                  </Col>
                </FormGroup>
                <div className="row">
                  <Label sm="3">
                    {intl.formatMessage({ id: "stationUseCustomSMSBrand" }, {type:"SMS Brandname"})}
                  </Label>

                  <Col sm='9'>
                    <MySwitch
                      checked={useUserSMSBrandConfig === 1 ? true : false}
                      onChange={(e) => {
                        onChangeUseCustomSMSBrand(e.target.checked ? 1 : 0)
                      }}
                      disabled={(stationEnableUseSMS === 1) ? false : true}
                    />
                  </Col>

                </div>

                <FormGroup row>
                  <Label sm="3" for='smsUrl'>
                    SMS Url
                  </Label>
                  <Col sm='5'>
                    <Input
                      id='smsUrl'
                      name='smsUrl'
                      disabled={(useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? false : true}
                      innerRef={register({ required: (useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? true : false })}
                      invalid={errors.smsUrl && true}
                      placeholder='SMS Url'
                      value={(userData && userData.smsUrl) || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: https://example.vn/SMS</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smsUserName'>
                    {intl.formatMessage({ id: "smsUsername" }, {type: "SMS"})}
                  </Label>

                  <Col sm='5'>
                    <Input
                      id='smsUserName'
                      name='smsUserName'
                      disabled={(useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? false : true}
                      innerRef={register({ required: (useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? true : false })}
                      invalid={errors.smsUserName && true}
                      placeholder={intl.formatMessage({ id: "smsUsername" }, {type: "SMS"})}
                      value={(userData && userData.smsUserName) || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: example123</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smsPassword'>
                    {intl.formatMessage({ id: "smsPassword" }, { type: "SMS"})}
                  </Label>

                  <Col sm='5'>
                    <Input
                      name='smsPassword'
                      id='smsPassword'
                      disabled={(useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? false : true}
                      innerRef={register({ required: (useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? true : false })}
                      invalid={errors.smsPassword && true}
                      value={(userData && userData.smsPassword) || ""}
                      placeholder={intl.formatMessage({ id: "smsPassword" }, {type:'SMS'})}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: ...abc123</i>
                  </Col>

                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smsBrand'>
                    {intl.formatMessage({ id: "smsBrand" })}
                  </Label>

                  <Col sm='5'>
                    <Input
                      name='smsBrand'
                      id='smsBrand'
                      disabled={(useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? false : true}
                      innerRef={register({ required: (useUserSMSBrandConfig === 1 && stationEnableUseSMS === 1) ? true : false })}
                      invalid={errors.smsBrand && true}
                      value={(userData && userData.smsBrand) || ""}
                      placeholder={intl.formatMessage({ id: "smsBrand" })}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: KiemDinhOto</i>
                  </Col>

                </FormGroup>

                <FormGroup className='d-flex mb-0 justify-content-center'>
                  <Button.Ripple className='mr-1' color='primary' type='submit'>
                    {intl.formatMessage({ id: "submit" })}
                  </Button.Ripple>

                </FormGroup>
              </Form>

            </Col>
          </Row>
        </div>
      </Card>


    </Fragment >
  )
}
export default injectIntl(memo(FormSMS))
