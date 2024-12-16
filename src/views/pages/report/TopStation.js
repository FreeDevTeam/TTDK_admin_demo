import React from 'react'
import {
  Card,
  Col,
  Row,
  CardTitle,
  CardHeader,
  CardBody
} from "reactstrap";
import DataTable from "react-data-table-component";

const TopStation = ({ intl, scheduleByStation, active, area }) => {
  const topArea = area.slice(0, 10)
  const ColumnsOne = [
    {
      name: intl.formatMessage({ id: 'station_code' }),
      selector: "stationCode",
    },
    {
      name: intl.formatMessage({ id: 'SLLH' }),
      selector: "totalScheduleCount",
    },
  ]

  const ColumnsTwo = [
    {
      name: intl.formatMessage({ id: 'Area' }),
      selector: "stationArea",
    },
    {
      name: intl.formatMessage({ id: 'SL_station' }),
      selector: "totalActiveStationCount",
    },
  ]

  const ColumnsThree = [
    {
      name: intl.formatMessage({ id: 'Area' }),
      selector: "stationArea",
    },
    {
      name: intl.formatMessage({ id: 'SLLH' }),
      selector: "totalScheduleCount",
    },
  ]

  return (
    <Row className='d-flex'>
      <Col sm='4' md='4' lg='4'>
        <div className='text mb-3'>{intl.formatMessage({ id: 'top_schedule' })}</div>
        <DataTable
          noHeader
          className="react-dataTable"
          columns={ColumnsOne}
          data={scheduleByStation}
        />
      </Col>
      <Col sm='4' md='4' lg='4 mt'>
        <div className='text mb-1 equal'>{intl.formatMessage({ id: 'top_center' })}</div>
        <DataTable
          noHeader
          className="react-dataTable position-table"
          columns={ColumnsTwo}
          data={active}
        />
      </Col>
      <Col sm='4' md='4' lg='4' className='mt-70'>
        <div className='text mb-3'>{intl.formatMessage({ id: 'top_area' })}</div>
        <DataTable
          noHeader
          className="react-dataTable"
          columns={ColumnsThree}
          data={topArea}
        />
      </Col>
    </Row>
  )
}

export default TopStation