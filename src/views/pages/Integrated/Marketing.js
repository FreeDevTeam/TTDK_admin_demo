import React, { memo, useEffect, useState, Fragment } from 'react'
import { Row, Col } from 'reactstrap'
import MySwitch from '../../components/switch'
import { injectIntl } from 'react-intl'
import { useHistory, useParams } from 'react-router-dom'
import IntegratedService from '../../../services/Integrated'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'

const Marketing = ({ intl }) => {
  const { id } = useParams()
  const [items, setItems] = useState([])
  console.log(items)
  const getData = (id) => {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.getStationById(id, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setItems(data)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setItems([])
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  const onUpdateStationEnableUse = (id, data) => {
    const dataUpdate = {
      id: id,
      data: data
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.handleUpdateData(dataUpdate, newToken).then((res) => {
        if (res) {
          const { statusCode } = res
          if (statusCode === 200) {
            getData(id)
            toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: 'update' }) }))
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: 'update' }) }))
          }
        }
      })
    }
  }

  useEffect(() => {
    getData(id)
  }, [])

  return (
    <Fragment>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'SMS_CSKH' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'SMS_advert' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'zalo_CSKH' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'zalo_advert' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'Email' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'apns' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
      <Row className='mt-2'>
        <Col sm="2" md="2" lg="2" xs="6">
          {intl.formatMessage({ id: 'auto_call' })}
        </Col>
        <Col sm="2" md="2" lg="2" xs="6">
          <MySwitch
            checked={items.stationEnableUseZNS === 1 ? true : false}
            // onChange={(e) => {
            //   onUpdateStationEnableUse(items.stationsId, {
            //     stationEnableUseZNS: e.target.checked ? 1 : 0
            //   })
            // }}
          />
        </Col>
      </Row>
    </Fragment>
  )
}

export default injectIntl(memo(Marketing))
