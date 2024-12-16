import React, { useEffect, Fragment, useContext } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import WigdetCenterRevenue from '../../components/wigdetCenterRevenue'
import { ThemeColors } from '@src/utility/context/ThemeColors'
import WigdetCenterOrder from '../../components/wigdetCenterOder'

const OverviewCenter = () => {
  const { colors } = useContext(ThemeColors)

  return (
    <Fragment>
      <Row>
        <Col md="4" xs="12">
          <WigdetCenterRevenue success={colors.success.main} />
        </Col>
        <Col md="2" xs="6">
          <WigdetCenterOrder warning={colors.warning.main} title={'Lịch hẹn'}/>
        </Col>
        <Col md="2" xs="6">
          <WigdetCenterOrder warning={colors.warning.main} title={'Đã xử lý'}/>
        </Col>
        <Col md="2" xs="6">
          <WigdetCenterOrder warning={colors.warning.main} title={'Chưa xử lý'}/>
        </Col>
      </Row>
    </Fragment>
  )
}

export default OverviewCenter
