import { Fragment, useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import {
    Card,
    Input,
    Row,
    Col,
    InputGroup,
    Modal,
    ModalHeader,
    ModalBody,
    Button,
} from "reactstrap";
import moment from "moment";
import { injectIntl } from "react-intl";
import Flatpickr from 'react-flatpickr'
import '@styles/react/libs/flatpickr/flatpickr.scss'
import NotificationService from '../../../services/notificationService'
import addKeyLocalStorage from "../../../helper/localStorage";
import { toast } from "react-toastify";
import _ from "lodash";
import ReactPaginate from "react-paginate";
import { useHistory } from 'react-router-dom'
import { ChevronDown, Trash, Edit, Search } from "react-feather";
import "./index.scss";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const DefaultFilter = {
    filter: {
    },
    skip: 0,
    limit: 20,
};

const Notification = ({ intl }) => {
    const MySwal = withReactContent(Swal)
    const ModalSwal = (staffNotificationId) =>{
        return MySwal.fire({
          title: intl.formatMessage({ id: "do_you_delete" }),
          showCancelButton: true,
          confirmButtonText : intl.formatMessage({ id: "agree" }),
          cancelButtonText : intl.formatMessage({ id: "shut" }),
          customClass: {
            confirmButton: 'btn btn-danger',
            cancelButton: 'btn btn-primary ml-1'
          },
        }).then((result) => {
          if (result.isConfirmed) {
              Swal.fire(
                'Deleted!',
                'Your file has been deleted.',
                'success',
                handleDelete(staffNotificationId),
              )
      }})}

    const serverSideColumns = [
        {
            name: intl.formatMessage({ id: "code" }),
            selector: row => <div 
            onClick={(e) => {
              e.preventDefault();
              history.push("/notification/form-notification", row)
            }}
            className="click_row"
            >{row.staffNotificationId}</div>,
            center: true,
            width: "70px"
        },
        {
            name: intl.formatMessage({ id: "title" }),
            selector: "notificationTitle",
            center: true,
            width: "660px"
        },
        // {
        //     name: intl.formatMessage({ id: "content" }),
        //     selector: "notificationContent",
        //     center: true,
        //     width: "560px",
        //     cell : (row) =>{
        //         const { notificationContent} = row
        //         return (
        //             <div dangerouslySetInnerHTML={{__html: notificationContent}} className="text"/>
        //         )
        //     }
        // },
        {
            name: intl.formatMessage({ id: "image" }),
            selector: "notificationImageUrl",
            center: true,
            width: "150px",
            cell: (row) => {
                const { notificationImageUrl } = row
                return (
                    <>
                    {notificationImageUrl === null ? <div>-</div> : <a href={notificationImageUrl ? notificationImageUrl : ""} target='_blank'>
                    <img
                        loading="lazy"
                        src={notificationImageUrl ? notificationImageUrl : ""}
                        alt={notificationImageUrl}
                        style={{
                            width: 45,
                            height: 45,
                          }}
                    />
                </a>}
                    </>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "createdAt" }),
            selector: "createdAt",
            center: true,
            width: "150px",
            cell: (row) => {
                const { createdAt } = row
                return (
                    <div>
                        {moment(createdAt).format('DD/MM/YYYY')}
                    </div>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "action" }),
            selector: "action",
            center: true,
            cell: (row) => {
                const { staffNotificationId } = row;
                return (
                    <>
                        <div href='/' onClick={e => {
                            e.preventDefault();
                            history.push("/notification/form-notification", row)
                        }}>
                            <Edit className='mr-50 pointer' size={15} />
                        </div>
                        <div
                            className="pointer"
                            onClick={() => ModalSwal(staffNotificationId)}
                        >
                            <Trash className="pointer ml-2" size={15} />
                        </div>
                    </>
                );
            },
        },
    ];

    const history = useHistory()
    const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
    const [data, setData] = useState([])
    const [total, setTotal] = useState(20);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [date, setDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20);
    const [modal, setModal] = useState(false);
    const [notificationId, setNotificationId] = useState({});

    const getData = (params, isNoLoading) => {
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

            NotificationService.getList(params, newToken).then((res) => {

                if (res) {
                    const { statusCode, data, message } = res;
                    setParamsFilter(newParams);
                    if (statusCode === 200) {
                        setData(data.data);
                    } else {
                        toast.warn(intl.formatMessage({ id: "actionFailed" }));
                    }
                } else {
                    setTotal(1);
                    setData([]);
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

    // ** Function to handle filter
    const handleSearch = (e) => {
        const newParams = {
            ...paramsFilter,
            searchText: searchValue || undefined,
            order: {
              key: "createdAt",
              value: "desc"
            },
            skip: 0
          }
          getData(newParams)
    };

    const handleFilterDay = (date) => {
        const newDateObj = date.toString()
        const newDate = moment(newDateObj).format("DD/MM/YYYY")
        setDate(newDate)
        const newParams = {
            filter: {
            },
            skip: 0,
            limit: 20,
            startDate: newDate,
            endDate : newDate,
            order: {
                "key": "createdAt",
                "value": "desc"
            }
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

    const handleDelete = (NotificationId) => {
        NotificationService.deleteNotificationById(NotificationId).then((res) => {
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

    // ** Get data on mount
    useEffect(() => {
        getData(paramsFilter);
    }, []);

    return (
        <Fragment>
            <Card>
                <Row className="mx-0 mt-1 mb-50">
                    <Col sm="2" xs='8' className='mb-1 d-flex'>
                        <InputGroup className="input-search-group">
                            <Input
                                placeholder={intl.formatMessage({ id: "Search" })}
                                className="dataTable-filter form-control-input"
                                type="search" 
                                bsSize="sm"
                                id="search-input"
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
                    </Col >
                    <Col sm="2" xs='6' className='mb-1'>
                        <Flatpickr
                            id='single'
                            value={date}
                            options={{ mode: 'single', dateFormat: 'd/m/Y', disableMobile: "true" }}
                            placeholder={intl.formatMessage({ id: "createdAt" })}
                            className='form-control form-control-input small'
                            onChange={(date) => {
                                document.getElementById("clear").style.display = 'block'
                                handleFilterDay(date)
                            }}
                        />
                    </Col>

                    <Col sm='1' xs='2' className='mb-1 clear_text' id='clear'>
                        <Button.Ripple
                            className='form-control-input'
                            size="sm"
                            onClick={() => {
                                getData({filter : {}});
                                setDate('')
                                document.getElementById("clear").style.display = 'none'
                            }}>X</Button.Ripple>
                    </Col>
                    <Col sm='2' xs='6' md="3">
                        <Button.Ripple
                            color='primary'
                            type='button'
                            size="sm"
                            onClick={(e) => {
                                e.preventDefault();
                                history.push("/notification/add-notification")
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
                        data={data}
                        progressPending={isLoading}
                    />
                </div>
            </Card>
        </Fragment>
    )
}

export default injectIntl(Notification);