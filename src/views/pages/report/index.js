// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from "react-feather";
import _ from "lodash";
import "./index.scss";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import {
  Card,
  CardHeader,
  CardBody,
  CardText,
  Input,
  Label,
  Row,
  Col,
} from "reactstrap";
import moment from "moment";
import { injectIntl } from "react-intl";
import ScheduleChart from "./ScheduleChart";
import TopStation from "./TopStation";
import NotActiveStation from "./NotActiveStation";
import ReportService from '../../../services/reportService'
import { kFormatter } from '@utils'
import TotalActiveStation from '@src/views/ui-elements/cards/statistics/TotalActiveStation'
import TotalInActiveStation from '@src/views/ui-elements/cards/statistics/TotalInActiveStation'
import TotalUser from '@src/views/ui-elements/cards/statistics/TotalUser'
import TotalCompletedSchedule from '@src/views/ui-elements/cards/statistics/TotalCompletedSchedule'

const DefaultFilter = {
};

const DataTableServerSide = ({ intl }) => {
  // ** Store Vars
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [data, setData] = useState([]);
  const [days, setDays] = useState([])
  const [scheduleByStation, setScheduleByStation] = useState([])
  const [active , setActive] = useState([])
  const [area, setArea] = useState([])
  const [notActive, setNotActive]  = useState([])
  const listActive = active.slice(0,10)

  const getData = (paramsFilter) =>{
    ReportService.getList(paramsFilter).then((result) => {
      if (result) {
        setData(result);
      }})
  }

  const DataChart = (paramsFilter) =>{
    ReportService.DataChart(paramsFilter).then((result) => {
      if (result) {
        setDays(result.data);
      }})
  }

  const DataScheduleByStation = (paramsFilter) =>{
    ReportService.DataScheduleByStation(paramsFilter).then((result) => {
      if (result) {
        setScheduleByStation(result.data);
      }})
  }

  const DataActiveStation = (paramsFilter) =>{
    ReportService.DataActiveStation(paramsFilter).then((result) => {
      if (result) {
        setActive(result.data);
      }})
  }

  const DataStationArea = (paramsFilter) =>{
    ReportService.DataStationArea(paramsFilter).then((result) => {
      if (result) {
        setArea(result.data);
      }})
  }

  const DatanotActiveStation = (paramsFilter) =>{
    ReportService.DatanotActiveStation(paramsFilter).then((result) => {
      if (result) {
        setNotActive(result.data);
      }})
  }

  // ** Get data on mount
  useEffect(() => {
    DatanotActiveStation(paramsFilter)
    DataActiveStation(paramsFilter)
    DataStationArea(paramsFilter)
    DataScheduleByStation(paramsFilter)
    DataChart(paramsFilter)
    getData(paramsFilter)
  }, []);

  return (
    <Fragment>
      <Card className='background-color'>
        <CardHeader className="justify-content-center flex-column">
          <h1 className="">{intl.formatMessage({ id: 'application_report' })}</h1>
        </CardHeader>
        <CardBody className="justify-content-center flex-column mt-3">
          <Row>
            <Col lg='3' sm='6'>
              <TotalActiveStation data={data} kFormatter={kFormatter} />
            </Col>
            <Col lg='3' sm='6'>
              <TotalInActiveStation data={data} kFormatter={kFormatter} />
            </Col>
            <Col lg='3' sm='6'>
              <TotalUser data={data} kFormatter={kFormatter} />
            </Col>
            <Col lg='3' sm='6'>
            <TotalCompletedSchedule data={data} kFormatter={kFormatter} />
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col sm='12' md='12' lg='12'>
               <ScheduleChart intl={intl} days={days}/>
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col>
              <TopStation 
              intl={intl} 
              scheduleByStation={scheduleByStation}
              active={listActive}
              area={area}
              />
            </Col>
          </Row>
          <Row className='mt-3'>
            <Col>
              <NotActiveStation intl={intl} notActive={notActive}/>
            </Col>
          </Row>
        </CardBody>
      </Card>

    </Fragment>
  );
};

export default injectIntl(memo(DataTableServerSide));
