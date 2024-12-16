import React from 'react'
import {
    Card,
    Col,
    Row,
    CardTitle,
    CardHeader,
    CardBody
  } from "reactstrap";
  import data from "./data.json";
import DataTable from "react-data-table-component";

const NotActiveStation = ({ intl, notActive }) => {
    const tableOne = notActive.slice(0,40)
    const tableTwo = notActive.slice(40,80)
    const tableThree = notActive.slice(80,120)
    const tableFour = notActive.slice(120,160)
    const tableFive = notActive.slice(160)

    const ColumnsOne = [
        {
            name : intl.formatMessage({ id: 'station_code' }),
            selector: "stationCode",
        }
    ]

    const ColumnsTwo = [
        {
            name : intl.formatMessage({ id: 'station_code' }),
            selector: "stationCode",
        }
    ]

    const ColumnsThree = [
        {
            name : intl.formatMessage({ id: 'station_code' }),
            selector: "stationCode",
        }
    ]

    const ColumnsFour = [
        {
            name : intl.formatMessage({ id: 'station_code' }),
            selector: "stationCode",
        }
    ]

    const ColumnsFive = [
        {
            name : intl.formatMessage({ id: 'station_code' }),
            selector: "stationCode",
        }
    ]
  return (
    <>
    <div className='text mb-3'>{intl.formatMessage({ id: 'list_not_active' })}</div>
    <Row className='d-flex'>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
         <DataTable
            noHeader
            className="react-dataTable"
            columns={ColumnsOne}
            data={tableOne.length > 0 ? tableOne : data}
          />
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
        <DataTable
            noHeader
            className="react-dataTable"
            columns={ColumnsTwo}
            data={tableTwo.length > 0 ? tableTwo : data}
          />
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
        <DataTable
            noHeader
            className="react-dataTable"
            columns={ColumnsThree}
            data={tableThree.length > 0 ? tableThree : data}
          />
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
        <DataTable
            noHeader
            className="react-dataTable"
            columns={ColumnsFour}
            data={tableFour.length > 0 ? tableFour : data}
          />
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
        <DataTable
            noHeader
            className="react-dataTable"
            columns={ColumnsFive}
            data={tableFive.length > 0 ? tableFive : data}
          />
        </Col>
    </Row>
    </>
  )
}

export default NotActiveStation