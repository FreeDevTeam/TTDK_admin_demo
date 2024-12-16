import { Bar } from 'react-chartjs-2'
import { memo } from "react";
import { Card, CardHeader, CardBody } from 'reactstrap'
import { injectIntl } from "react-intl";
import "./index.scss";
const ChartReport = ({  gridLineColor,intl, days }) => {

     const options = {
        elements: {
            rectangle: {
                borderWidth: 1,
                borderSkipped: 'bottom',
            }
        },
        responsive: true,
        maintainAspectRatio: false,
        responsiveAnimationDuration: 500,
        legend: {
            display: false
        },
        tooltips: {
            // Updated default tooltip UI
            shadowOffsetX: 1,
            shadowOffsetY: 1,
            shadowBlur: 8,
            shadowColor: ["#16a34a"],
            backgroundColor: '#fff',
            titleFontColor: '#000',
            bodyFontColor: gridLineColor,
        },
        scales: {
            xAxes: [
                {
                    display: true,
                    gridLines: {
                        display: true,
                        color: gridLineColor,
                        zeroLineColor: gridLineColor,

                    },
                    scaleLabel: {
                        display: true
                    },
                    ticks: {
                        fontColor: gridLineColor
                    }
                }
            ],
            yAxes: [
                {
                    display: true,
                    borderColor: 'transparent',
                    gridLines: {
                        display: true,
                        zeroLineColor: gridLineColor,
                    },
                    ticks: {
                        stepSize: 1,
                        min: 0,
                        max: days.legenth,
                        fontColor: gridLineColor,
                    }
                }
            ]
        }
     },
     
     data = {
            labels:
                days.map(item => {
                    return item.date
                })
            ,
            datasets: [
                {
                    data: days.map(item => {
                        return item.quantity
                    }),
                    backgroundColor:  "#7367f0",
                    borderColor: 'transparent',
                    barThickness: 70,
                    borderWidth: 1
                }
            ]
     }

    return (
        <Card>
            <CardHeader className='d-flex justify-content-between align-items-sm-center align-items-start flex-sm-row flex-column'>
                <h2 className='title'>{intl.formatMessage({ id: 'schedule_every_day' })}</h2>
            </CardHeader>
            <CardBody>
                <div style={{ height: '400px' }}>
                    <Bar data={data} options={options} height={400} />
                </div>
            </CardBody>
        </Card>
    )
}

export default injectIntl(memo(ChartReport))
