import React, { Fragment, useState, memo, useEffect } from 'react'
import { injectIntl } from 'react-intl'
import { Card, Input, Label, Row, Col, Button, FormGroup, Form, TabContent, TabPane, CardHeader, CardBody, CardText } from 'reactstrap'
import Service from '../../../services/request'
import { useForm } from 'react-hook-form'
import { selectThemeColors } from '@utils'
import Select from 'react-select'
import _ from 'lodash'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import moment from 'moment'
import { toast } from 'react-toastify'

const Job = ({ intl, appUserId }) => {
  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })
  const [userData, setUserData] = useState({})
  const [userDataTouched, setUserDataTouched] = useState({});
  const [role, setRole] = useState([])
  const [from, setFrom] = useState('')
  const [end, setEnd] = useState('')
  const [decision, setDecision] = useState('')

  const getDetailUserById = (appUserId) => {
    Service.send({
      method: 'POST',
      path: 'AppUserWorkInfo/findById',
      data: {
        id: appUserId
      },
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setUserData(data)
          setDecision(data.licenseDecisionDate)
          setEnd(data.licenseDateEnd)
          setFrom(data.licenseDateFrom)
        }
      }
    })
  }

  const handleUpdateData = (data) => {
    Service.send({
      method: 'POST',
      path: 'AppUserWorkInfo/updateById',
      data: data,
      query: null
    }).then((res) => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getDetailUserById(appUserId)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
        }
      }
    })
  }

  const getListRole = () => {
    Service.send({
      method: 'POST',
      path: 'AppUserRole/find',
      data: {
        filter: {}
      }
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res
        if (statusCode === 200) {
          setRole(data.data)
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
      [name]: value,
    })
  }

  useEffect(() => {
    getListRole()
    getDetailUserById(appUserId)
  }, [])

  return (
    <Fragment>
      <Card>
        <CardHeader className="justify-content-center flex-column">
          <CardText className="mt-2 h3">{intl.formatMessage({ id: 'job' })}</CardText>
        </CardHeader>
        <hr color="#808080" />
        <CardBody className="justify-content-center flex-column">
          <Form
            onSubmit={handleSubmit((data) => {
              handleUpdateData({
                id: appUserId,
                data: userDataTouched
              })
            })}>
            <FormGroup>
              <Label for="rank">{intl.formatMessage({ id: 'rank' })}</Label>
              <Input
                type="select"
                name="appUserLevel"
                bsSize="md"
                value={userData.appUserLevel || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}>
                <option value={''}> {intl.formatMessage({ id: 'chose' })}</option>
                {role.map((item) => {
                  return <option value={item.appUserRoleId}>{item.appUserRoleName}</option>
                })}
              </Input>
            </FormGroup>

            <FormGroup>
              <Label for="certificate_number">{intl.formatMessage({ id: 'certificate_number' })}</Label>
              <Input
                id="licenseNumber"
                name="licenseNumber"
                value={userData.licenseNumber || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="from_date">{intl.formatMessage({ id: 'from_date' })}</Label>
              <Flatpickr
                id="licenseDateFrom"
                name="licenseDateFrom"
                value={userData.licenseDateFrom || ''}
                options={{ mode: 'single', dateFormat: 'd/m/Y', showMonths: true }}
                placeholder={intl.formatMessage({ id: 'chose' })}
                className="form-control col-sm-12 col-xs-12"
                onChange={(date, dateString) => {
                  const newDateObjs = date.toString()
                  const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                  handleOnchange("licenseDateFrom", newDates);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="end_date">{intl.formatMessage({ id: 'end_date' })}</Label>
              <Flatpickr
                id="licenseDateEnd"
                name="licenseDateEnd"
                value={userData.licenseDateEnd || ''}
                options={{ mode: 'single', dateFormat: 'd/m/Y', showMonths: true }}
                placeholder={intl.formatMessage({ id: 'chose' })}
                className="form-control col-sm-12 col-xs-12"
                onChange={(date) => {
                  const newDateObjs = date.toString()
                  const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                  handleOnchange("licenseDateEnd", newDates);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="decision_day">{intl.formatMessage({ id: 'decision_day' })}</Label>
              <Flatpickr
                id="licenseDecisionDate"
                name="licenseDecisionDate"
                value={userData.licenseDecisionDate || ''}
                options={{ mode: 'single', dateFormat: 'd/m/Y', showMonths: true }}
                placeholder={intl.formatMessage({ id: 'chose' })}
                className="form-control col-sm-12 col-xs-12"
                onChange={(date) => {
                  const newDateObjs = date.toString()
                  const newDates = moment(newDateObjs).format('DD/MM/YYYY')
                  handleOnchange("licenseDecisionDate", newDates);
                }}
              />
            </FormGroup>

            <FormGroup>
              <Label for="commit_year">{intl.formatMessage({ id: 'commit_year' })}</Label>
              <Input
                name="licenseCommitmentYear"
                type="number"
                value={userData.licenseCommitmentYear || ''}
                onChange={(e) => {
                  const { name, value } = e.target
                  handleOnchange(name, value)
                }}
              />
            </FormGroup>

            <FormGroup className="d-flex mb-0 justify-content-center">
              <Button.Ripple className="mr-1" color="primary" type="submit">
                {intl.formatMessage({ id: 'submit' })}
              </Button.Ripple>
            </FormGroup>
          </Form>
        </CardBody>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Job))
