import React, { useEffect, Fragment } from 'react'
import { Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap'
import WigdetCenterRevenue from '../../components/wigdetCenterRevenue'

const OverviewCenter = () => {
  return (
    <Fragment>
      <Row>
        <Col md="6" xs="12">
          <WigdetCenterRevenue />
        </Col>
        <Col md="6" xs="12"></Col>
      </Row>
    </Fragment>
  )
}

export default OverviewCenter
