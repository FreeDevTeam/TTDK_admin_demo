import React, { Fragment, memo, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { Card, Col, Row, Table, InputGroup, Button, Input } from 'reactstrap'
import MySwitch from '../../components/switch'
import { useHistory } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { injectIntl } from "react-intl";

const IntegratedPage = ({intl}) =>{
    const [searchValue, setSearchValue] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(20)
    const [total, setTotal] = useState(20)

    const [items, setItems] = useState([
        {num: "01",code: "0101",name: "Trạm số 01", momo: 0, zalo: 0,sms: 1, email:0, vnpay: 1},
        {num: "02",code: "0102",name: "Trạm số 01", momo: 0, zalo: 0,sms: 1, email:0, vnpay: 1},
        {num: "03",code: "0103",name: "Trạm số 01", momo: 0, zalo: 0,sms: 1, email:0, vnpay: 1},
    ])
    const history = useHistory()
    // const onUpdateEnableUse = (code,name) => {
    //  items.forEach((item) => {
    //   if(item.code == code){

    //   }
    //  })
    // }

    const handleSearch = () => {
     
    }
    const columns = [
        {
            name: intl.formatMessage({ id: 'index' }),
            selector: row => row.num,
            sortable: true,
            minWidth: '80px',
            maxWidth: '100px',
            cell: (row) => {
             return <a 
             className='text-primary'
             onClick={()=> history.push(`/pages/detail-integrated/${row.code}`)}>
                {row.num}
             </a>
            }
        },{
            name: intl.formatMessage({ id: 'stationCode' }),
            minWidth: '90px',
            maxWidth: '120px',
            center: true,
            selector: row => row.code,
            cell: (row) => {
             return <a 
             className='text-primary'
             onClick={()=> history.push(`/pages/detail-integrated/${row.code}`)}>
                {row.code}
             </a>
            }
        },{
            name: intl.formatMessage({ id: 'stationsName' }),
            minWidth: '150px',
            maxWidth: '500px',
            center: true,
            selector: row => row.name
        },{
            name: intl.formatMessage({ id: 'momo' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { momo } = row
                return (
                  <MySwitch
                    checked={momo === 0 ? true : false}
                    // onChange={e => {
                    //   onUpdateStationEnableUse('Stations/updateById', {
                    //     id: row.stationsId,
                    //     data: {
                        // momo = e.target.checked ? 0 : 1
                    //     }
                    //   })
                    // }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'Zalo_ZNS' }),
            center: true,
            minWidth: '120px',
            maxWidth: '120px',
            cell: (row) => {
                const { zalo } = row
                return (
                  <MySwitch
                    checked={zalo === 0 ? true : false}
                    // onChange={e => {
                    //   onUpdateStationEnableUse('Stations/updateById', {
                    //     id: row.stationsId,
                    //     data: {
                    //       isHidden: e.target.checked ? 0 : 1
                    //     }
                    //   })
                    // }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'sms' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { sms } = row
                return (
                  <MySwitch
                    checked={sms === 0 ? true : false}
                    // onChange={e => {
                    //   onUpdateStationEnableUse('Stations/updateById', {
                    //     id: row.stationsId,
                    //     data: {
                    //       isHidden: e.target.checked ? 0 : 1
                    //     }
                    //   })
                    // }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'stationsEmail' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { email } = row
                return (
                  <MySwitch
                    checked={email === 0 ? true : false}
                    // onChange={e => {
                    //   onUpdateStationEnableUse('Stations/updateById', {
                    //     id: row.stationsId,
                    //     data: {
                    //       isHidden: e.target.checked ? 0 : 1
                    //     }
                    //   })
                    // }}
                  />
                )
              }
        },{
            name: intl.formatMessage({ id: 'VNPAY' }),
            center: true,
            minWidth: '100px',
            maxWidth: '100px',
            cell: (row) => {
                const { vnpay } = row
                return (
                  <MySwitch
                    checked={vnpay === 0 ? true : false}
                    // onChange={e => {
                    //   onUpdateStationEnableUse('Stations/updateById', {
                    //     id: row.stationsId,
                    //     data: {
                    //       isHidden: e.target.checked ? 0 : 1
                    //     }
                    //   })
                    // }}
                  />
                )
              }
        }
    ]

    const CustomPagination = () => {
        const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))  
        return (
          <ReactPaginate
            previousLabel={''}
            nextLabel={''}
            breakLabel='...'
            pageCount={count || 1}
            marginPagesDisplayed={2}
            pageRangeDisplayed={2}
            activeClassName='active'
            forcePage={currentPage !== 0 ? currentPage - 1 : 0}
            // onPageChange={page => handlePagination(page)}
            pageClassName={'page-item'}
            nextLinkClassName={'page-link'}
            nextClassName={'page-item next'}
            previousClassName={'page-item prev'}
            previousLinkClassName={'page-link'}
            pageLinkClassName={'page-link'}
            breakClassName='page-item'
            breakLinkClassName='page-link'
            containerClassName={
              'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'
            }
          />
        )
      }
  return (
    <Fragment>
        <Card>
        <Row className='mx-0 mt-1 mb-50'>
        <Col   md = '2' sm='4' xs='12' className='d-flex mt-sm-0 mt-1'>
          <InputGroup className="input-search-group">
            <Input
              placeholder={intl.formatMessage({ id: 'Search' })}
              className='dataTable-filter'
              type="search"
              bsSize='sm'
              id='search-input' 
              value={searchValue}
              onChange={(e) => { setSearchValue(e.target.value) }}
            />
            </InputGroup>
            <Button color='primary'
              size="sm"
              className='mb-1'
              onClick={() => handleSearch()}
              >
                <Search size={15}/>
            </Button>
          </Col>
        </Row>

        <div className='mx-0 mb-50'>
            <DataTable
            noHeader
            pagination
            paginationServer
            className='react-dataTable'
            columns= {columns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={items}
            // progressPending={isLoading}
          />
        </div>
        </Card>

    </Fragment>
  )
}

export default injectIntl(memo(IntegratedPage)) 
