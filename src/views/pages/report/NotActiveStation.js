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
 
    const newOne = Array.from(new Array(40 - tableOne.length) , x => ({stationCode : " "}))
    const totalOne = tableOne.concat(newOne)

    const newTwo = Array.from(new Array(40 - tableTwo.length) , x => ({stationCode : " "}))
    const totalTwo = tableTwo.concat(newTwo)

    const newThree = Array.from(new Array(40 - tableThree.length) , x => ({stationCode : " "}))
    const totalThree = tableThree.concat(newThree)

    const newFour = Array.from(new Array(40 - tableFour.length) , x => ({stationCode : " "}))
    const totalFour = tableFour.concat(newFour)

    const newFive = Array.from(new Array(40 - tableFive.length) , x => ({stationCode : " "}))
    const totalFive = tableFive.concat(newFive)

  return (
    <>
    <div className='text mb-3'>{intl.formatMessage({ id: 'list_not_active' })}</div>
    <Row className='d-flex'>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4 '>
         <table className='table'>
           <tbody>
             {totalOne.map(item =>{
              return (
                <tr>
                  <td>{item.stationCode}</td>
                </tr>
              )
             })}
           </tbody>
         </table>
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
         <table className='table'>
           <tbody>
             {totalTwo.map(item =>{
              return (
                <tr>
                  <td>{item.stationCode}</td>
                </tr>
              )
             })}
           </tbody>
         </table>
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
         <table className='table'>
           <tbody>
             {totalThree.map(item =>{
              return (
                <tr>
                  <td>{item.stationCode}</td>
                </tr>
              )
             })}
           </tbody>
         </table>
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
         <table className='table'>
           <tbody>
             {totalFour.map(item =>{
              return (
                <tr>
                  <td>{item.stationCode}</td>
                </tr>
              )
             })}
           </tbody>
         </table>
        </Col>
        <Col className='col-sm-2dot4 col-md-2dot4 col-lg-2dot4'>
         <table className='table'>
           <tbody>
             {totalFive.map(item =>{
              return (
                <tr>
                  <td>{item.stationCode}</td>
                </tr>
              )
             })}
           </tbody>
         </table>
        </Col>
    </Row>
    </>
  )
}

export default NotActiveStation