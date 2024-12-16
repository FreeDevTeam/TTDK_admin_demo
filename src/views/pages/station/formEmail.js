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
import MySwitch from '../../components/switch';
import { ChevronLeft } from 'react-feather';

const FormSMTP = ({ intl }) => {
  // ** Store Vars
  const { state } = useLocation()
  const [userData, setUserData] = useState({})
  const [useUserSMTPBrandConfig, setUseUserSMTPBrandConfig] = useState(0)
  const history = useHistory()
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {}
  })

  
  useEffect(() => {
    if (state && Object.keys(state).length > 0) {
      setUserData(JSON.parse(state.stationCustomSMTPConfig))
      setUseUserSMTPBrandConfig(state.stationUseCustomSMTP)
    }
  }, [state])

  function handleUpdateData(item) {
    if(useUserSMTPBrandConfig === 1) {
      if(Object.keys(errors).length === 0) {
        const updateData = {
          "stationsId": state.stationsId,
          "smtpHost": item.smtpHost,
          "smtpPort": Number(item.smtpPort),
          "smtpSecure": userData.smtpSecure.toUpperCase(),
          "smtpAuth": {
            "user": item.smtpAuthUser,
            "pass": item.smtpAuthPass
          }
        }  
        Service.send({
          method: 'POST', path: 'Stations/updateConfigSMTP', data: updateData, query: null
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

  const onChangeUseCustomSMTPBrand = (newStatus) => {
    Service.send({
      method: 'POST', path: 'Stations/updateCustomSMTP', data: {
        stationsId: state.stationsId,
        CustomSMTP: newStatus
      }, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          setUseUserSMTPBrandConfig(newStatus)
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
            {intl.formatMessage({ id: "info" }, { type: "email server (SMTP)" }).toUpperCase()}
          </h1>
          <Row>
            <Col sm="12" md="8">
              <Form onSubmit={handleSubmit((data) => {
                handleUpdateData(data)
              })}
              >
                <div className="row">
                  <Label sm="3">
                    {intl.formatMessage({ id: "stationUseCustomSMSBrand" }, {type:"SMTP"})}
                  </Label>

                  <Col sm='9'>
                    <MySwitch
                      checked={useUserSMTPBrandConfig === 1 ? true : false}
                      onChange={(e) => onChangeUseCustomSMTPBrand(e.target.checked ? 1 : 0)}
                      
                    />
                  </Col>
                </div>

                <FormGroup row>
                  <Label sm="3" for='smtpSecure'>
                    Bảo mật SMTP (SMTP Secure)
                  </Label>

                  <Col sm='6'>
                    <MySwitch
                      checked={userData && userData.smtpSecure === "ON" ? true : false}
                      onChange={(e) => {
                        handleOnchange("smtpSecure", e.target.checked ? "ON" : "OFF")
                      }}
                      disabled={useUserSMTPBrandConfig === 0 ? true : false}
                    />
                  </Col>
                  
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpHost'>
                    SMTP Host
                  </Label>
                  <Col sm='5'>
                    <Input
                      id='smtpHost'
                      name='smtpHost'
                      innerRef={register({ required: useUserSMTPBrandConfig === 0 ? false : true })}
                      invalid={errors.smtpHost && true}
                      placeholder='SMS Url'
                      disabled={useUserSMTPBrandConfig === 0 ? true : false}
                      value={(userData && userData.smtpHost) || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: user17.emailserver.vn</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpPort'>
                    SMTP Port
                  </Label>

                  <Col sm='5'>
                    <Input
                      id='smtpPort'
                      name='smtpPort'
                      innerRef={register({ required: useUserSMTPBrandConfig === 0 ? false : true })}
                      invalid={errors.smtpPort && true}
                      placeholder='SMTP Port'
                      disabled={useUserSMTPBrandConfig === 0 ? true : false}
                      value={userData && userData.smtpPort && userData.smtpPort || ''}
                      onChange={(e) => {
                        const { name, value } = e.target
                        handleOnchange(name, value)
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: 123</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpAuthUser'>
                    Email
                  </Label>

                  <Col sm='5'>
                    <Input
                      name='smtpAuthUser'
                      id='smtpAuthUser'
                      innerRef={register({ required: useUserSMTPBrandConfig === 0 ? false : true })}
                      invalid={errors.smtpAuthUser && true}
                      value={userData && userData.smtpAuth && userData.smtpAuth.user || ""}
                      disabled={useUserSMTPBrandConfig === 0 ? true : false}
                      placeholder={intl.formatMessage({ id: "smsUsername" }, {type: "SMTP"})}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setUserData({
                          ...userData, 
                          smtpAuth: {...userData.smtpAuth, user: value }
                        })
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: example@example.vn</i>
                  </Col>
                </FormGroup>

                <FormGroup row>
                  <Label sm="3" for='smtpAuthPass'>
                    {intl.formatMessage({ id: "smsPassword" }, { type: ""})}
                  </Label>

                  <Col sm='5'>
                    <Input
                      name='smtpAuthPass'
                      id='smtpAuthPass'
                      innerRef={register({ required: true })}
                      invalid={errors.smtpAuthPass && true}
                      disabled={useUserSMTPBrandConfig === 0 ? true : false}
                      value={userData && userData.smtpAuth && userData.smtpAuth.pass || ""}
                      placeholder={intl.formatMessage({ id: "smsPassword" }, { type: "SMTP"})}
                      onChange={(e) => {
                        const { name, value } = e.target
                        setUserData({
                          ...userData, 
                          smtpAuth: {...userData.smtpAuth, pass: value }
                        })
                      }}
                    />
                  </Col>
                  <Col sm="4">
                    <i>Ví dụ: abc123...</i>
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
export default injectIntl(memo(FormSMTP))
