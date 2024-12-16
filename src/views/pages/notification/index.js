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
import { ChevronDown, Trash, Edit } from "react-feather";

const DefaultFilter = {
    filter: {
    },
    skip: 0,
    limit: 20,
};

const Notification = ({ intl }) => {

    const serverSideColumns = [
        {
            name: intl.formatMessage({ id: "code" }),
            selector: "staffNotificationId",
            center: true,
            maxWidth: "300px"
        },
        {
            name: intl.formatMessage({ id: "title" }),
            selector: "notificationTitle",
            center: true,
            maxWidth: "300px"
        },
        {
            name: intl.formatMessage({ id: "content" }),
            selector: "notificationContent",
            center: true,
            maxWidth: "300px"
        },
        {
            name: intl.formatMessage({ id: "image" }),
            selector: "notificationImageUrl",
            center: true,
            maxWidth: "300px",
            cell: (row) => {
                const { notificationImageUrl } = row
                return (
                    <a href={notificationImageUrl ? notificationImageUrl : ""}>
                        <img
                            loading="lazy"
                            src={notificationImageUrl ? notificationImageUrl : ""}
                            alt={notificationImageUrl}
                        />
                    </a>
                )
            }
        },
        {
            name: intl.formatMessage({ id: "createdAt" }),
            selector: "createdAt",
            center: true,
            maxWidth: "300px",
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
                const { notificationId } = row;
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
                            onClick={() => {
                                setModal(true)
                                notificationId({ notificationId })
                            }}
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
    const handleFilter = (e) => {
        const { value } = e.target;
        setSearchValue();
        const newParams = {
            ...paramsFilter,
            searchText: value || undefined,
            skip: 0
        };
        getDataSearch(newParams);
    };

    const handleFilterDay = (date) => {
        const newDateObj = date.toString()
        const newDate = moment(newDateObj).format("DD/MM/YYYY")
        setDate(newDate)
        const newParams = {
            ...paramsFilter,
            filter: {
                createdAt: newDate
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
                    <Col sm="2" xs='12' className='mb-1'>
                        <InputGroup className="input-search-group">
                            <Input
                                placeholder={intl.formatMessage({ id: "Search" })}
                                className="dataTable-filter form-control-input"
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
                    <Col sm="2" xs='6' className='mb-1'>
                        <Flatpickr
                            id='single'
                            value={date}
                            options={{ mode: 'single', dateFormat: 'd/m/Y' }}
                            placeholder={intl.formatMessage({ id: "createdAt" })}
                            className='form-control form-control-input'
                            onChange={(date) => {
                                document.getElementById("clear").style.display = 'block'
                                handleFilterDay(date)
                            }}
                        />
                    </Col>

                    <Col sm='1' xs='2' className='mb-1 clear_text' id='clear'>
                        <Button.Ripple
                            className='form-control-input'
                            onClick={() => {
                                getDataSearch({
                                    ...paramsFilter,
                                    filter: {

                                    },
                                })
                                setDate('')
                                document.getElementById("clear").style.display = 'none'
                            }}>X</Button.Ripple>
                    </Col>
                    <Col sm='2' xs='6'>
                        <Button.Ripple
                            color='primary'
                            type='button'
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
                                onClick={() => {
                                    handleDelete(notificationId.stationDocumentId)
                                    setModal(false)
                                }}
                            >{intl.formatMessage({ id: "yes" })}</Button>
                        </Col>
                        <Col className='col-6'>
                            <Button onClick={() => setModal(false)}>{intl.formatMessage({ id: "no" })}</Button>
                        </Col>
                    </Row>
                </ModalBody>
            </Modal>
        </Fragment>
    )
}

export default injectIntl(Notification);