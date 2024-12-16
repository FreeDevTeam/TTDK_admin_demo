import "@styles/react/libs/flatpickr/flatpickr.scss";
import _, { first } from "lodash";
import moment from "moment";
import { Fragment, memo, useEffect, useState } from "react";
import { injectIntl } from "react-intl";
import {
  Card,
  Col,
  Row,
  Spinner,
  Label
} from "reactstrap";

import Service from "../../../services/request";
import OverviewChart from "./OverviewChart";
import WidgetStatistic from "./WidgetStatistic";
import { toast } from "react-toastify";
import Select from "react-select";
import Flatpickr from "react-flatpickr";
import { selectThemeColors } from "@utils";

function MessageStatitical({ intl }) {
  const date = new Date();
  const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);

  const [data, setData] = useState({});
  const [isLoading, setIsloading] = useState(false);
  const [stations, setStations] = useState([]);
  const [stationId, setStationId] = useState("");
  const [startDate, setStartDate] = useState(firstDay);
  const [endDate, setEndDate] = useState(lastDay);


  async function fetchStations() {
    // const ms = name === "startDate" ? 1000 : 8639999

    const resp = await Service.send({
      method: "POST",
      path: "Stations/getList",
      data: {
        "filter": {

        }, 
        "skip": 0,
        "limit": 500,
        "order": {
          "key": "createdAt",
          "value": "desc"
        }
      }
    });

    if (resp) {
      const { statusCode, data } = resp;
      if (statusCode === 200) {
        setStations(data.data.map(station => {
          return { label: station.stationsName, value: station.stationsId }
        }));

        data.data.length > 0 && setStationId(data.data[0].stationsId);
        
      } else {
        toast.warn(
          intl.formatMessage(
            { id: "actionFailed" },
            { action: intl.formatMessage({ id: "fetchData" }) }
          )
        );
      }
    }
  }

  function fetchStatistic(params) {
    if(!stationId) return;
    
    Service.send({
      method: "POST",
      path: "CustomerMessage/reportTotalSMSByStation",
      data: {
        filter: {
          stationId: params.stationId,
        },
        startDate: moment(new Date(new Date(params.startDate).getTime() + 1000)).format("DD/MM/YYYY"),
        endDate: moment(new Date(new Date(params.endDate).getTime() + 1000)).format("DD/MM/YYYY"),
      }
    }).then((res) => {
      setIsloading(false)
      if (res) {
        const { statusCode, data } = res;

        if (statusCode === 200) {
          console.log(data);
          setData(data);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      }
    });
  }

  useEffect(() => {
    (async () => {
      setIsloading(true)
      await fetchStations();
    })();
  }, []);

  useEffect(() => {
    (async () => {
      fetchStatistic({
        stationId: stationId,
        startDate: startDate,
        endDate: endDate
      });
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stationId]);

  return (
    <Fragment>
      {
        isLoading ? <Spinner color='primary' /> : (
          <Card>
        <h1 className="text-center my-2">
          {intl.formatMessage({ id: "table-message-statistic" })}
        </h1>

        <Row className="pl-4 pl-4">
          <Col className="mb-1" md="6" sm="12">
            <Label>
              {intl.formatMessage({ id: "stationsName" })}{" "}
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select w-100"
              classNamePrefix="select"
              placeholder="Chọn trạm"
              isClearable={false}
              defaultValue={stations.find(station => {
                return station.value.toString() === stationId.toString()
              })}
              options={stations}
              onChange={(row) => {
                const { value } = row;
                setStationId(value);
              }}
            />
          </Col>
        </Row>

        <Row className="pl-4 pr-4">
        <Col className="mb-1" md="6" sm="12">
            <Label for="default-picker" className="white-space-nowrap">
              {intl.formatMessage({ id: "startDate" })} - {intl.formatMessage({ id: "endDate" })}
            </Label>
            <Flatpickr
              id='range-picker'
              className='form-control'
              onChange={date => {
                setStartDate(date[0])
                setEndDate(date[1])

                fetchStatistic({startDate: date[0], endDate: date[1], stationId: stationId })
              }}
              options={{
                mode: 'range',
                defaultDate: [firstDay, lastDay],
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col lg="4">
            <OverviewChart intl={intl} data={data} />
          </Col>

          <Col lg="8">
            <WidgetStatistic intl={intl} data={data} />
          </Col>
        </Row>
      </Card>
        )
      }
    </Fragment>
  );
}

export default injectIntl(memo(MessageStatitical));
