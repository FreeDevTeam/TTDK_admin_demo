import React, { Fragment, memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown, Search } from 'react-feather'
import { Card, Col, Row, Table, InputGroup, Button, Input } from 'reactstrap'
import MySwitch from '../../components/switch'
import { useHistory } from 'react-router-dom'
import ReactPaginate from 'react-paginate'
import { injectIntl } from 'react-intl'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import IntegratedService from '../../../services/Integrated'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import '@styles/react/libs/tables/react-dataTable-component.scss'
import LoadingDialog from "../../components/buttons/ButtonLoading";
import XLSX from 'xlsx'

const DefaultFilter = {
  filter: {},
  skip : 0,
  limit : 20
}
const Registry = ({ intl }) => {
  const [searchValue, setSearchValue] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [total, setTotal] = useState(20)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [isLoading, setIsLoading] = useState(false)
  const [items, setItems] = useState([])
  const history = useHistory()

  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue
    }
    if (newParams.searchText) {
      getData(newParams)
    } else {
      getData(paramsFilter)
    }
  }
  const columns = [
    {
      name: intl.formatMessage({ id: 'code' }),
      minWidth: '90px',
      maxWidth: '90px',
      center: true,
      selector: (row) => row.stationCode,
      cell: (row) => {
        return (
          <div>
            {row.stationCode}
          </div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: 'stationsName' }),
      minWidth: '150px',
      maxWidth: '500px',
      selector: (row) => row.stationsName
    },
    {
      name: intl.formatMessage({ id: 'day' }),
      minWidth: '150px',
      maxWidth: '150px',
      selector: (row) => row.reportDay
    },
    {
        name: intl.formatMessage({ id: "total_registereds" }),
        sortable: true,
        minWidth: "400px",
        maxWidth: "400px",
        cell: (row) => {
          const {totalCustomerCheckingCanceled, totalCustomerCheckingCompleted, totalCustomerCheckingFailed} = row
          return (
            <div>
              {totalCustomerCheckingCanceled} / {totalCustomerCheckingCompleted} / {totalCustomerCheckingFailed}
            </div>
          );
        },
      },
      {
        name: intl.formatMessage({ id: "total_scheduleds" }),
        sortable: true,
        minWidth: "400px",
        maxWidth: "400px",
        cell: (row) => {
          const {totalCustomerScheduleClosed, totalCustomerScheduleCanceled} = row
          return (
            <div>
              {totalCustomerScheduleClosed} / {totalCustomerScheduleCanceled}
            </div>
          );
        },
      },
  ]

  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))
    return (
      <ReactPaginate
        previousLabel={''}
        nextLabel={''}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={'page-item'}
        nextLinkClassName={'page-link'}
        nextClassName={'page-item next'}
        previousClassName={'page-item prev'}
        previousLinkClassName={'page-link'}
        pageLinkClassName={'page-link'}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={'pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1'}
      />
    )
  }

  function getData(params) {
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      IntegratedService.getListReport(params, newToken).then((res) => {
        if (res) {
          const { statusCode, data, message } = res
          if (statusCode === 200) {
            setItems(data.data)
            setTotal(data.total)
          } else {
            toast.warn(intl.formatMessage({ id: 'actionFailed' }))
          }
        } else {
          setTotal(1)
          setItems([])
        }
      })
    } else {
      window.localStorage.clear()
    }
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const onExportExcel = async () => {
    let number = Math.ceil(total / 20)
    let params = Array.from(Array.from(new Array(number)),(element, index)  => index)
    let results = [];
    async function fetchData(param) {
      paramsFilter.skip = param * 20
      const response = await IntegratedService.getListReport(paramsFilter)
      const data = await response.data.data;
      return data;
    } 
      for (const param of params) {
        const result = await fetchData(param);
         results = [...results , ...result]
      }
      const convertedData = results.map(appUser => {
        return {
          'Mã trạm': appUser.stationCode,
          'Tên trạm': appUser.stationsName,
          'Ngày': appUser.reportDay,
          'tổng số xe đăng kiểm (hủy / thành công / thất bại)': appUser.totalCustomerCheckingCanceled / appUser.totalCustomerCheckingCompleted / appUser.totalCustomerCheckingFailed,
          'tổng số lịch hẹn (thành công / hủy)': appUser.totalCustomerScheduleClosed / appUser.totalCustomerScheduleCanceled
        }
      })

        let wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(convertedData);
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet');
        XLSX.writeFile(wb, "BaoCaoDangKiem.xlsx");
  }

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col md="2" sm="4" xs="12" className="d-flex mt-sm-0 mt-1">
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: 'Search' })}
                className="dataTable-filter"
                type="search"
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value)
                }}
              />
            </InputGroup>
            <Button color="primary" size="sm" className="mb-1" onClick={() => handleSearch()}>
              <Search size={15} />
            </Button>
          </Col>
          <Col sm='2' xs='6'>
            <LoadingDialog 
            onExportListCustomers={onExportExcel}
            title={intl.formatMessage({ id: "export" })}
            />
          </Col>
        </Row>

        <div className="mx-0 mb-50 [dir]">
          <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
        </div>
      </Card>
    </Fragment>
  )
}

export default injectIntl(memo(Registry))