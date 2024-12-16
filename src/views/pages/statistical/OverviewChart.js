import React from "react";
import {
  Card,
  Col,
  Row,
  CardHeader,
  CardTitle,
  CardBody,
  CardText,
} from "reactstrap";

import Chart from "react-apexcharts";
import "./statistic.scss";

function OverviewChart({ intl, data }) {
  const { totalSMSCount } = data;

  if(!totalSMSCount) return <></>;

  const options = {
      chart: {
        sparkline: {
          enabled: true,
        },
        dropShadow: {
          enabled: true,
          blur: 3,
          left: 1,
          top: 1,
          opacity: 0.1,
        },
      },
      colors: ["#51e5a8"],
      plotOptions: {
        radialBar: {
          offsetY: 10,
          startAngle: -150,
          endAngle: 150,
          hollow: {
            size: "77%",
          },
          track: {
            background: "#ebe9f1",
            strokeWidth: "50%",
          },
          dataLabels: {
            name: {
              show: false,
            },
            value: {
              color: "#5e5873",
              fontFamily: "Montserrat",
              fontSize: "2.86rem",
              fontWeight: "600",
            },
          },
        },
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "dark",
          type: "horizontal",
          shadeIntensity: 0.5,
          gradientToColors: ["#28c76f"],
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [0, 100],
        },
      },
      stroke: {
        lineCap: "round",
      },
      grid: {
        padding: {
          bottom: 30,
        },
      },
    },
    series = [
      totalSMSCount
        ? Math.floor((totalSMSCount.success * 100) / totalSMSCount.total)
        : 0,
    ];

  return (
    <Card className="py-2 ml-2">
      <CardHeader>
        <CardTitle tag="h4">Tỉ lệ thành công</CardTitle>
      </CardHeader>
      <CardBody className="p-0">
        <Chart
          options={options}
          series={series}
          type="radialBar"
          height={245}
        />
      </CardBody>
      <Row className='border-top text-center mx-0'>
        <Col xs='4' className='border-right py-1'>
          <CardText className='text-no-wrap text-muted mb-0'>Thành công</CardText>
          <h3 className='font-weight-bolder mb-0'>{totalSMSCount.success || 0}</h3>
        </Col>
        <Col xs='4' className='border-right py-1'>
          <CardText className='text-no-wrap text-muted mb-0'>Đang gửi</CardText>
          <h3 className='font-weight-bolder mb-0'>{totalSMSCount.sending}</h3>
        </Col>
        <Col xs='4' className='py-1'>
          <CardText className='text-no-wrap text-muted mb-0'>Thất bại</CardText>
          <h3 className='font-weight-bolder mb-0'>{totalSMSCount.failed}</h3>
        </Col>
      </Row>
    </Card>
  );
}

export default OverviewChart;
