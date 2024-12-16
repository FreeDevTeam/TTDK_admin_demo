// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { Calendar } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown, Trash, Edit, Square } from "react-feather";
import DataTable from "react-data-table-component";
import { useHistory } from 'react-router-dom'
import {
  Card,
  Input,
  Label,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  InputGroup,
  InputGroupButtonDropdown,
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  FormGroup,
  Form,
} from "reactstrap";
import moment from "moment";
import { injectIntl } from "react-intl";
import MySwitch from '../../components/switch';
import addKeyLocalStorage from "../../../helper/localStorage";
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'

const statusOptions = [
  { value: "", label: "all" },
  { value: 1, label: "ok" },
  { value: 0, label: "locked" },
];

const DefaultFilter = {
    filter: {
    },
    skip: 0,
    limit: 20,
};

const DataTableServerSide = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: intl.formatMessage({ id: "document-code" }),
      selector: row => <div 
      onClick={(e) => {
        e.preventDefault();
        history.push("/documentary/form-documentary", row)
      }}
      className="click_row"
      >{row.documentCode}</div>,
      sortable: true,
      maxWidth : "300px"
      // minWidth: "200px",
    },
    {
      name: intl.formatMessage({ id: "documentTitle" }),
      selector: row => <div 
      onClick={(e) => {
        e.preventDefault();
        history.push("/documentary/form-documentary", row)
      }}
      className="click_row"
      >{row.documentTitle}</div>,
      sortable: true,
      maxWidth : "400px"
    },
    {
      name: intl.formatMessage({ id: "release-date" }),
      selector: "documentPublishedDay",
      center: true,
      maxWidth : "300px"
      // minWidth: "130px",
    },
    {
      name: intl.formatMessage({ id: "documentExpireDay" }),
      selector: "documentExpireDay",
      center: true,
      maxWidth : "300px"
      // minWidth: "130px",
    },
    {
      name: intl.formatMessage({  id: 'show' }),
      maxWidth: '230px',
      minWidth: '230px', 
      center: true,
      cell: (row) => {
        return (
          <MySwitch
            checked={row.isHidden === 0 ? true : false}
            onChange={e => {
              onUpdateStationEnableUse('StationDocument/updateById',{
                id: row.stationDocumentId,
                data: {
                  documentTitle : row.documentTitle,
                  documentCode : row.documentCode,
                  isHidden: e.target.checked ? 0 : 1
                }
              })
            }}
          />
        )
      }
    },
    {
      name: intl.formatMessage({ id: "watched" }),
      center: true,
      maxWidth : "300px",
      cell : (row) =>{
        const { totalViewsCount, totalUserViewsCount, stationDocumentId} = row
        return (
          <div 
          onClick={() =>{
            handleClick(stationDocumentId)
            setModalone(true)
          }}
          className="click_row">{ totalUserViewsCount} / {totalViewsCount}</div>
        )
      }
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      center: true,
      cell: (row) => {
        const { stationDocumentId } = row;
        return (
          <>
           <div href='/' onClick={e => {e.preventDefault();
                  history.push("/documentary/form-documentary", row)
                }}>
                  <Edit className='mr-50 pointer' size={15} />
           </div>
            <div
                className="pointer"
                onClick={() =>{
                  setModal(true)
                  setUserData({stationDocumentId})}}
              >
                <Trash className="pointer ml-2" size={15}/>
            </div>
          </>
        );
      },
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const history = useHistory()
  // ** States
  const [modal, setModal] = useState(false);
  const [modalone, setModalone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [total, setTotal] = useState(20);
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  // const [passwordData, setPasswordData] = useState([]);
  const [sidebarPasswordOpen, setSidebarPasswordOpen] = useState(false);
  const [date, setDate] = useState('');
  const [notView, setNotView] = useState([])
  
  const togglePasswordOpen = () => {
    setSidebarPasswordOpen(!sidebarPasswordOpen);
  };
  // ** React hook form vars
  const { register, errors, handleSubmit } = useForm({
    defaultValues: {},
  });
  const [userData, setUserData] = useState({});

  function getData(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }
    Object.keys(newParams.filter).forEach((key) => {
      if (!newParams.filter[key] || newParams.filter[key] === "") {
        delete newParams.filter[key];
      }
    });
    const token = window.localStorage.getItem(addKeyLocalStorage("accessToken"));

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: "POST",
        path: "StationDocument/find",
        data: newParams,
        query: null,
        headers: {
          Authorization: `Bearer ` + newToken,
        },
      }).then((res) => {
        if (res) {
          const { statusCode, data, message } = res;
          setParamsFilter(newParams);
          if (statusCode === 200) {
            setTotal(data.total);
            setItems(data.data);
          } else {
            toast.warn(intl.formatMessage({ id: "actionFailed" }));
          }
        } else {
          setTotal(1);
          setItems([]);
        }
        if (!isNoLoading) {
          setIsLoading(false);
        }
      });
    } else {
      window.localStorage.clear();
    }
  }

  const getDataSearch = _.debounce((params) => {
    getData(params, true);
  }, 1000);

  // ** Get data on mount
  useEffect(() => {
    getData(paramsFilter);
  }, []);

  // ** Function to handle filter
  const handleFilter = (e) => {
    const { value } = e.target;
    setSearchValue();
    const newParams = {
      ...paramsFilter,
        searchText: value,
        skip : 0
    };
    getDataSearch(newParams);
  };

  const handleFilterDay = (date) =>{
    const newDateObj = date.toString()
    const newDate = moment(newDateObj).format("DD/MM/YYYY")
    setDate(newDate)
    const newParams = {
      ...paramsFilter,
      filter: {
        documentPublishedDay: newDate
      },
    };
    getDataSearch(newParams);
  }
  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    getData(newParams);
    setCurrentPage(page.selected + 1);
  };

  // ** Function to handle per page
  const handlePerPage = (e) => {
    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0,
    };
    getData(newParams);
    setCurrentPage(1);
    setRowsPerPage(parseInt(e.target.value));
  };

  const handleFilterChange = (name, value) => {
    const newParams = {
      ...paramsFilter,
      filter: {
        ...paramsFilter.filter,
        [name]: value,
      },
      skip: 0,
    };
    getData(newParams);
  };

  const handleDelete = (stationDocumentId) =>{
    Service.send({
      method: "POST",
      path: "StationDocument/deleteById",
      data: {
        id : stationDocumentId
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          getData(paramsFilter);
          toast.success(
            intl.formatMessage(
              { id: "actionSuccess" },
              { action: intl.formatMessage({ id: "delete" }) }
            )
          );
        } 
      }
    });
  }
  
  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0))

    return (
      <ReactPaginate
        previousLabel={""}
        nextLabel={""}
        breakLabel="..."
        pageCount={count || 1}
        marginPagesDisplayed={2}
        pageRangeDisplayed={2}
        activeClassName="active"
        forcePage={currentPage !== 0 ? currentPage - 1 : 0}
        onPageChange={(page) => handlePagination(page)}
        pageClassName={"page-item"}
        nextLinkClassName={"page-link"}
        nextClassName={"page-item next"}
        previousClassName={"page-item prev"}
        previousLinkClassName={"page-link"}
        pageLinkClassName={"page-link"}
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName={
          "pagination react-paginate separated-pagination pagination-sm justify-content-end pr-1 mt-1"
        }
      />
    );
  };

  const toggleDropDown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleOnchange = (name, value) => {
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const onUpdateStationEnableUse = (path, data) => {
    Service.send({
      method: 'POST', path: path, data: data, query: null
    }).then(res => {
      if (res) {
        const { statusCode } = res
        if (statusCode === 200) {
          getData(paramsFilter, true)
          toast.success(intl.formatMessage({ id: 'actionSuccess' }, { action: intl.formatMessage({ id: "update" }) }))
        } else {
          toast.warn(intl.formatMessage({ id: 'actionFailed' }, { action: intl.formatMessage({ id: "update" }) }))
        }
      }
    })
  }
 
  const handleClick = (id) =>{
    Service.send({
      method: "POST",
      path: "StationDocument/listStationsNotView",
      data: {
        id : id
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        if (statusCode === 200) {
          setNotView(data)
        } 
      }
    });
  }
  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
            <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="4"
          >
            <InputGroup className="input-search-group">
              <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className="dataTable-filter"
                type="text"
                bsSize="md"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  handleFilter(e);
                }}
              />
            </InputGroup>
            </Col >
            <Col className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="4">
          <Label for='single'></Label>
          <Flatpickr
                id='single'
                value={date}
                options={{ mode : 'single', dateFormat: 'd/m/Y' }}
                placeholder={intl.formatMessage({ id: "release-date" })}
                className='form-control'
                onChange={(date) => {
                  handleFilterDay(date)
                }}
              />
          </Col>

          <Col md='2' sm='12'>
                <Button onClick={() =>setDate('')}>X</Button>
          </Col>

          <Col  md='2' sm='12'>
              <Button.Ripple
                color='primary'
                type='button'
                onClick={(e) => {
                  e.preventDefault();
                  history.push("/documentary/add-documentary")
                }}
              >
              {intl.formatMessage({ id: "add_new" })}
              </Button.Ripple>
            </Col>
        </Row>
        <div id="users-data-table">
          <DataTable
            noHeader
            pagination
            paginationServer
            className="react-dataTable"
            columns={serverSideColumns}
            sortIcon={<ChevronDown size={10} />}
            paginationComponent={CustomPagination}
            data={items}
            progressPending={isLoading}
          />
        </div>
      </Card>
      <Modal
      isOpen={modal}
      toggle={() => setModal(false)}
      className={`modal-dialog-centered `}
      >
        <ModalHeader>
        {intl.formatMessage({ id: "do_you_delete" })}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col className='col-6'>
              <Button
              onClick={() =>{
                handleDelete(userData.stationDocumentId)
                setModal(false)
              }}
              >{intl.formatMessage({ id: "yes" })}</Button>
            </Col>
            <Col className='col-6'>
            <Button onClick={() =>setModal(false)}>{intl.formatMessage({ id: "no" })}</Button>
            </Col>
          </Row>
        </ModalBody>
      </Modal>
      <Modal
      isOpen={modalone}
      toggle={() => setModalone(false)}
      className={`modal-dialog-centered name_text`}
      >
        <ModalHeader>
        {intl.formatMessage({ id: "station_not_seen" })}
        </ModalHeader>
        <ModalBody>
        <Input
                placeholder={intl.formatMessage({ id: "Search" })}
                className="dataTable-filter"
                type="text"
                bsSize="sm"
                id="search"
                onChange={(e) => {
                  const text = e.target.value
                  const search = notView.filter(item =>{
                    return item.slice(0,text.length) === text
                  })
                  setNotView(search)
                }}/>
          <div className="name_text">{notView.map((item, index)=>{
            return (
              <div key={item.index}>
                <p >{item}</p>
              </div>
            )
          })}</div>
        </ModalBody>
      </Modal>
    </Fragment>
  );
};

export default injectIntl(memo(DataTableServerSide));
