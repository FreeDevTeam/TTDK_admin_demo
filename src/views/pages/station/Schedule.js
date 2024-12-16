import { Fragment, useState, useEffect, memo } from 'react'
import Service from '../../../services/request'
import { injectIntl } from 'react-intl';
import SationService from '../../../services/station'
import { ChevronDown, } from 'react-feather'
import DataTable from 'react-data-table-component'
import ReactPaginate from 'react-paginate'
import {
  Card, Input, Label, Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle,
  Modal, ModalHeader, ModalBody,
  Button, FormGroup, Form, InputGroup, InputGroupButtonDropdown
} from 'reactstrap'

const DefaultFilter = {
  filter: {

  },
  skip: 0,
  limit: 5,
}
const statusOptions = [
  { value: '', label: 'all' },
  { value: 1, label: 'CAR' },
  { value: 20, label: 'RO_MOC' },
  { value: 10, label: 'OTHER' },
]

const Schedule = ({ intl }) => {
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [data, setData] = useState([])
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  
  const scheduleDay = (paramsFilter) => {
    const newParams = {
      ...paramsFilter
    }

    Object.keys(newParams.filter).forEach(key => {
      if (!newParams.filter[key] || newParams.filter[key] === '') {
        delete newParams.filter[key]
      }
    })

    SationService.getList(newParams).then((result) => {
      if (result) {
        setData(result.data);
      }
    })
  }

  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: 'schedules' }),
      selector: 'dateSchedule',
      sortable: true,
      minWidth: '150px',
      maxWidth: '150px',
    },
    {
      name: intl.formatMessage({ id: 'transportation' }),
      selector: 'vehicleType',
      minWidth: '200px',
      maxWidth: '200px',
    }
  ]

  // ** Function to handle Pagination and get data
  const handlePagination = page => {

    const newParams = {
      ...paramsFilter,
      skip: (page.selected) * paramsFilter.limit
    }
    scheduleDay(newParams)
    setCurrentPage(page.selected + 1)

  }

  // ** Custom Pagination
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
        onPageChange={page => handlePagination(page)}
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
  
  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value
      },
      skip: 0,
    }
    scheduleDay(newParams)
  }


  useEffect(() => {
    scheduleDay(paramsFilter)
  }, []);

  return (
    <>
      <Row className='mx-0 mt-1 mb-50'>
        <Col className='d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1 mb-1' sm='2' xs='12'>
        </Col>
        <Col sm='2' xs='6'>
          <Input onChange={(e) => {
            const { name, value } = e.target
            handleFilterChange(name, value)
          }} type='select' value={paramsFilter.filter ? (paramsFilter.filter.active || '') : ''} name='active' bsSize='sm' >
            {
              statusOptions.map(item => {
                return <option value={item.value}>{intl.formatMessage({ id: item.label })}</option>
              })
            }
          </Input>
        </Col>
      </Row>
      <div id="stations-data-table">
        <DataTable
          noHeader
          pagination
          paginationServer
          className='react-dataTable'
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={data}
          progressPending={isLoading}
        />
      </div>
    </>
  )
}

export default injectIntl(memo(Schedule));