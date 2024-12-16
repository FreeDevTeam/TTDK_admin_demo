import React, { Fragment, memo, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Button, Card, Col, Input, InputGroup, Nav, NavItem, NavLink, Row, TabContent, TabPane } from 'reactstrap'
import { ChevronDown, ChevronLeft, Eye, Search } from 'react-feather'
import { injectIntl } from 'react-intl'
import NewsService from '../../../services/news'
import moment from 'moment'
import DataTable from 'react-data-table-component'
import ListNews from './ListNews'
import addKeyLocalStorage from '../../../helper/localStorage'
import { toast } from 'react-toastify'
import PostNews from './PostNews'
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import '@styles/react/libs/tables/react-dataTable-component.scss'
const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20
}

function News({ intl }) {
  const history = useHistory()
  const [activeTab, setActiveTab] = useState('1')
  const [searchValue, setSearchValue] = useState('')
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter)
  const [items, setItems] = useState([])
  const [total, setTotal] = useState(20)
  const [embeddedCode , setEmbeddedCode ] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(20)
  const [currentPage, setCurrentPage] = useState(1)
  const [updatePost, setUpdatePost] = useState('')
  const [flat, setFlat] = useState('')
  // const [file, setFile] = useState()
  const [postData, setPostData] = useState({
    postTitle: "",
      documentContent: "",
      embeddedCode: ""
  })
  const [blob, setBlob] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const handleSearch = () => {
    const newParams = {
      ...paramsFilter,
      searchText: searchValue
    }
    if (newParams.searchText) {
      setParamsFilter(newParams)
      getData(newParams)
    } else {
      getData(DefaultFilter)
    }
  }

  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit
    }
    getData(newParams)
    setCurrentPage(page.selected + 1)
  }

  function getData(params) {
    const newParams = {
      ...params
    }
    const token = window.localStorage.getItem(addKeyLocalStorage('accessToken'))
    if (token) {
      const newToken = token.replace(/"/g, '')
      NewsService.getList(params, newToken).then((res) => {
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
  function handelUpdatePost(row) {
    setUpdatePost(row)
    setPostData({
      ...postData,
      postTitle: row.stationNewsTitle,
      documentContent: row.stationNewsContent,
      category: row.stationNewsCategories,
      embeddedCode: row.embeddedCode
    })
    setEmbeddedCode(row.embeddedCode || "");
    setBlob(row.stationNewsAvatar)
    setActiveTab('2')
  }

  const handleFilterStartDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format('DD/MM/YYYY')
    setStartDate(newDate)
  }
  const handleFilterEndDate = (date) => {
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).add(1, "days").format("DD-MM-YYYY");
    setEndDate(newDate)
    const newDateFlat = moment(newDateObj).format('DD/MM/YYYY')
    setFlat(newDateFlat)
  }

  const handleFilterDay = () => {
    const newParams = {
      ...paramsFilter,
      skip: 0,
      limit: 20,
      startDate: startDate,
      endDate: endDate
    }
    setParamsFilter(newParams)
    getData(newParams)
  }

  useEffect(() => {
    getData(paramsFilter)
  }, [])
  return (
    <Fragment>
      <Card >
        {activeTab == 1 ?<Row className="mx-0 mt-1 mb-50 pt-2">
          <Col md="2" sm="4" xs="12">
            {intl.formatMessage({ id: 'list-news' })}
          </Col>
          <Col md="2" sm="4" xs="12" className="d-flex mt-sm-0 mt-1 h-100">
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
              <Button color="primary" size="sm" className="mb-1" onClick={() => handleSearch()}>
                <Search size={15} />
              </Button>
            </InputGroup>
          </Col>
          <Col className="mb-1 d-flex" sm="4" xs="12">
            <Flatpickr
              id="single"
              value={startDate}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'start-date' })}
              className="form-control form-control-input font"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterStartDate(date)
              }}
            />
            <Flatpickr
              id="single"
              value={flat}
              options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: 'true' }}
              placeholder={intl.formatMessage({ id: 'end-date' })}
              className="form-control form-control-input font"
              onChange={(date) => {
                // document.getElementById('clear').style.display = 'block'
                handleFilterEndDate(date)
              }}
            />
            <Button color="primary" size="sm" className="mb-1" onClick={() => handleFilterDay()}>
              <Search size={15} />
            </Button>
          </Col>
        </Row> : <Row></Row>}
        <Nav tabs>
          <NavItem>
            <NavLink className={activeTab == '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
              {intl.formatMessage({ id: 'list' })}
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink className={activeTab == '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
              {intl.formatMessage({ id: 'post' })}
            </NavLink>
          </NavItem>
        </Nav>

        <TabContent activeTab={activeTab}>
          <TabPane tabId="1">
            <div className="mx-0 mb-50 [dir]">
              <ListNews
                items={items}
                total={total}
                rowsPerPage={rowsPerPage}
                currentPage={currentPage}
                handlePagination={handlePagination}
                getData={getData}
                paramsFilter={paramsFilter}
                handelUpdatePost={handelUpdatePost}
              />
            </div>
          </TabPane>
          <TabPane tabId="2">
            <PostNews
              paramsFilter={paramsFilter}
              getData={getData}
              updatePost={updatePost}
              blob={blob}
              setBlob={setBlob}
              postData={postData}
              embeddedCode={embeddedCode}
              setEmbeddedCode={setEmbeddedCode}
              setPostData={setPostData}
            />
          </TabPane>
        </TabContent>
      </Card>
    </Fragment>
  )
}
export default injectIntl(memo(News))
