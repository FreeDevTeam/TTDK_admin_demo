import React from "react";
import {
  Card,
  Col,
  Row,
  CardTitle,
} from "reactstrap";

import Chart from "react-apexcharts";
import { formatNumber } from '../../../helper/formatNumber';

function WidgetStatistic({ intl, data }) {
  let { monthlySMSCount, totalSMSCount } = data;
  monthlySMSCount = monthlySMSCount ? monthlySMSCount : [];

  const revenueOptions = {
      chart: {
        stacked: true,
        type: "bar",
        toolbar: { show: false },
      },
      grid: {
        padding: {
          top: -20,
          bottom: -10,
        },
        yaxis: {
          lines: { show: false },
        },
      },
      xaxis: {
        categories: monthlySMSCount.map(
          (item) => "T" + (new Date(item.month + "/01").getMonth() + 1)
        ),
        labels: {
          style: {
            colors: "#b9b9c3",
            fontSize: "0.86rem",
          },
        },
        axisTicks: {
          show: false,
        },
        axisBorder: {
          show: false,
        },
      },
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      colors: ["#7367f0", "#ff9f43"],
      plotOptions: {
        bar: {
          columnWidth: "17%",
          endingShape: "rounded",
        },
        distributed: true,
      },
      yaxis: {
        labels: {
          style: {
            colors: "#b9b9c3",
            fontSize: "0.86rem",
          },
        },
      },
    },
    revenueSeries = [
      {
        name: "Thành công",
        data: monthlySMSCount.map((item) => item.smsCount.completed + item.smsCount.new),
      },
      {
        name: "Thất bại",
        data: monthlySMSCount.map((item) => (item.smsCount.failed + item.smsCount.canceled) * -1),
      },
    ];

  const budgetSeries = [
      {
        data: [61, 48, 69, 52, 60, 40, 79, 60, 59, 43, 62],
      },
      {
        data: [20, 10, 30, 15, 23, 0, 25, 15, 20, 5, 27],
      },
    ],
    budgetOptions = {
      chart: {
        toolbar: { show: false },
        zoom: { enabled: false },
        type: "line",
        sparkline: { enabled: true },
      },
      stroke: {
        curve: "smooth",
        dashArray: [0, 5],
        width: [2],
      },
      colors: ["7367f0", "#dcdae3"],
      tooltip: {
        enabled: false,
      },
    };

  return (
    <Card className="card-revenue-budget py-1 my-auto">
      <Row className="mx-0">
        <Col className="revenue-report-wrapper" md="8" xs="12">
          <div className="d-sm-flex justify-content-between align-items-center mb-3">
            <CardTitle className="mb-50 mb-sm-0">Thống kê</CardTitle>
            <div className="d-flex align-items-center">
              <div className="d-flex align-items-center mr-2">
                <span className="bullet bullet-primary mr-50 cursor-pointer"></span>
                <span>Thành công</span>
              </div>
              <div className="d-flex align-items-center">
                <span className="bullet bullet-warning mr-50 cursor-pointer"></span>
                <span>Thất bại</span>
              </div>
            </div>
          </div>
          <Chart
            id="revenue-report-chart"
            type="bar"
            height="230"
            options={revenueOptions}
            series={revenueSeries}
          />
        </Col>

        <Col className="budget-wrapper d-flex justify-content-center" md="4" xs="12">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              flexFlow: "column",
              justifyContent: "center",
            }}
          >
            <h2 className="mb-25">{formatNumber(totalSMSCount?.cost || 0)}</h2>
            <div className="d-flex justify-content-center">
              <span className="font-weight-bolder mr-25">
                SL SMS T{new Date().getMonth() + 1}:
              </span>
              <span>{
                monthlySMSCount.length === 0 ? 0 : monthlySMSCount[monthlySMSCount.length -1].smsCount.total
              }
              </span>
            </div>

            <Chart
              id="budget-chart"
              type="line"
              height="80"
              options={budgetOptions}
              series={budgetSeries}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}

export default WidgetStatistic;
