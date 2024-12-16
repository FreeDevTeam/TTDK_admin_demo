import React, { memo, useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'
import { ChevronDown } from 'react-feather'
import { injectIntl } from 'react-intl'
import ReactPaginate from 'react-paginate'
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'
import { toast } from 'react-toastify'
import { Card, Col, Row } from 'reactstrap'
import { BANNER_TYPE } from '../../../constants/app'
import { readAllStationsDataFromLocal } from '../../../helper/localStorage'
import TemplateService from '../../../services/template'
import BasicAutoCompleteDropdown from '../../components/BasicAutoCompleteDropdown/BasicAutoCompleteDropdown'
import BasicTablePaging from '../../components/BasicTablePaging'

function Marketing({ intl }) {
  const DefaultFilter = {
    filter: {},
    skip: 0,
    limit: 20
  }
//   const history = useHistory()
  const [currentPage, setCurrentPage] = useState(1)
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const readLocal = readAllStationsDataFromLocal()
  const listStation = readLocal.sort((a, b) => a - b)
  const listNewStation = listStation.map((item) => {
    return {
      ...item,
      label: item.stationCode,
      value: item.stationsId
    }
  })
  listNewStation?.unshift({ value: '', label: 'Tất cả mã trạm' })

  function getData(params) {
    const newParams = {
      ...params
    }
    TemplateService.getList(newParams).then((res) => {
      if (res) {
        const { statusCode, data, message } = res
        setParamsFilter(newParams)
        if (statusCode === 200) {
          setItems(data.data)
        } else {
          toast.warn(intl.formatMessage({ id: 'failed' }))
        }
      } else {
        setItems([])
      }
    })
  }

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value ? value : undefined
      },
      skip: 0
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])

  const columns = [
    {
      name: intl.formatMessage({ id: 'messagesDetail-customerMessageCategories' }),
      minWidth: '200px',
      maxWidth: '200px',
      selector: (row) => row.messageTemplateType
    },
    {
      name: intl.formatMessage({ id: 'offering_partners' }),
      selector: (row) => <div className="click_row">{row.bannerName}</div>,
      sortable: true,
      minWidth: '200px',
      maxWidth: '200px'
    },
    {
      name: intl.formatMessage({ id: 'subject_greets' }),
      minWidth: '200px',
      maxWidth: '200px',
      selector: (row) => row.bannerUrl
    },
    {
      name: intl.formatMessage({ id: 'purpose' }),
      minWidth: '150px',
      maxWidth: '150px',
      selector: (row) => row.bannerUrl
    },
    {
      name: intl.formatMessage({ id: 'smsName' }),
      minWidth: '180px',
      maxWidth: '180px',
      selector: (row) => row.bannerUrl
    },
    {
      name: intl.formatMessage({ id: 'smsContent' }),
      minWidth: '120px',
      maxWidth: '120px',
      cell: (row) => {
        const { bannerUrl } = row
        return <div>{bannerUrl}</div>
      }
    },
    {
      name: intl.formatMessage({ id: 'time' }),
      minWidth: '180px',
      maxWidth: '180px',
      selector: (row) => row.bannerNote
    },
    {
      name: intl.formatMessage({ id: 'condition' }),
      minWidth: '180px',
      maxWidth: '180px',
      selector: (row) => row.bannerNote
    },
    {
      name: intl.formatMessage({ id: 'smsTempalte' }),
      minWidth: '250px',
      maxWidth: '250px',
      selector: (row) => row.bannerNote
    }
  ]

  const handlePaginations = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: (page - 1) * paramsFilter.limit
    }
    if (page === 1) {
      getData(newParams)
      return null
    }
    getData(newParams)
    setCurrentPage(page + 1)
  }

  const CustomPaginations = () => {
    const lengthItem = items.length
    return <BasicTablePaging items={lengthItem} handlePaginations={handlePaginations} skip={paramsFilter.skip} />
  }

  return (
    <>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col sm="6" md="4" lg="2" xs="12" className="mb-1">
            <BasicAutoCompleteDropdown
              placeholder="Mã trạm"
              name="stationsId"
              options={listNewStation}
              onChange={({ value }) => handleFilterChange('stationsId', value)}
            />
          </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            // pagination
            paginationServer
            className="react-dataTable"
            columns={columns}
            sortIcon={<ChevronDown size={10} />}
            // paginationComponent={CustomPagination}
            data={items}
            // progressPending={isLoading}
          />
          {CustomPaginations()}
        </div>
      </Card>
    </>
  )
}
export default injectIntl(memo(Marketing))
