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
  CardText,
  Badge
} from 'reactstrap'
import { useForm } from 'react-hook-form'
import Service from '../../../services/request'
import { toast } from 'react-toastify'
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from 'react-feather'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import ReactPaginate from 'react-paginate'
import UserService from '../../../services/userService'
import { LICENSEPLATES_COLOR } from './../../../constants/app'
import { SCHEDULE_STATUS } from './../../../constants/app'
import { VEHICLE_TYPE } from './../../../constants/app'

const FormSchedule = ({ intl }) => {
  const location = useLocation()
  const history = useHistory()
  const {
    stationsAddress,
    fullnameSchedule,
    phone,
    firstName,
    licensePlates,
    vehicleType,
    dateSchedule,
    time,
    CustomerScheduleStatus,
    scheduleCode,
    scheduleNote,
    licensePlateColor,
    stationCode
  } = location.state

  const { register, handleSubmit } = useForm({
    mode: 'onSubmit',
    defaultValues: {}
  })

  return (
    <Fragment>
      <Card>
        <div className="pt-1 pl-1 pointer" onClick={history.goBack}>
          <ChevronLeft />
          {intl.formatMessage({ id: 'goBack' })}
        </div>
        <Row>
          <Col sm="8" xs="12">
            <Card className="mt-2">
              <CardHeader className="justify-content-center flex-column">
                <CardText className="h3">{intl.formatMessage({ id: 'schedule_information' })}</CardText>
              </CardHeader>
              <hr color="#808080" />
              <CardBody className="justify-content-center flex-column">
                <Row>
                  <Col sm="6" sx="12">
                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'place_of_booking' })}</Label>
                      <p>{stationCode} - {stationsAddress}</p>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'firstName' })}</Label>
                      <p>{fullnameSchedule}</p>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'messagesDetail-customerMessagePlateNumber' })}</Label>
                      <CardText
                        className={`color_licensePlates 
                          ${licensePlateColor === LICENSEPLATES_COLOR.white ? 'color_white' : ' '}
                          ${licensePlateColor === LICENSEPLATES_COLOR.blue ? 'color_blue' : ' '}
                          ${licensePlateColor === LICENSEPLATES_COLOR.yellow ? 'color_yellow' : ' '}
                          ${licensePlateColor === LICENSEPLATES_COLOR.red ? 'color_red' : ' '}
                        `}>
                        {licensePlates}
                      </CardText>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'day' })}</Label>
                      <p>{dateSchedule}</p>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'messageStatus' })}</Label>
                      <CardText>
                        {CustomerScheduleStatus === SCHEDULE_STATUS.NEW ? (
                          <Badge color="light-info" className="size_text">
                            {intl.formatMessage({ id: 'unconfimred' })}
                          </Badge>
                        ) : CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED ? (
                          <Badge color="light-warning" className="size_text">
                            {intl.formatMessage({ id: 'confirmed' })}
                          </Badge>
                        ) : CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED ? (
                          <Badge color="light-danger" className="size_text">
                            {intl.formatMessage({ id: 'canceled' })}
                          </Badge>
                        ) : (
                          <Badge color="light-success" className="size_text">
                            {intl.formatMessage({ id: 'closed' })}
                          </Badge>
                        )}
                      </CardText>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'phoneNumber' })}</Label>
                      <p>{phone}</p>
                    </FormGroup>

                    <FormGroup className='label_size'>
                      <Label className='label_color'>{intl.formatMessage({ id: 'transportation' })}</Label>
                      <CardText>
                        {vehicleType === VEHICLE_TYPE.CAR ? (
                          <Badge color="light-success" className="size_text">
                            {intl.formatMessage({ id: 'car' })}
                          </Badge>
                        ) : vehicleType === VEHICLE_TYPE.OTHER ? (
                          <Badge color="light-danger" className="size_text">
                            {intl.formatMessage({ id: 'other' })}
                          </Badge>
                        ) : (
                          <Badge color="light-info" className="size_text">
                            {intl.formatMessage({ id: 'ro_mooc' })}
                          </Badge>
                        )}
                      </CardText>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'hour' })}</Label>
                      <p>{time}</p>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'code_schedule' })}</Label>
                      <p>{scheduleCode}</p>
                    </FormGroup>

                    <FormGroup>
                      <Label className='label_color'>{intl.formatMessage({ id: 'stationsNote' })}</Label>
                      <p>{scheduleNote}</p>
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(FormSchedule))
