// @ts-nocheck
// ** React Imports
import { Fragment, useState, useEffect, memo } from "react";
// ** Store & Actions
import { toast } from "react-toastify";
import { MoreVertical, Edit, Lock, Shield, RotateCcw } from "react-feather";
import _ from "lodash";
import "./index.scss";
import { useForm } from "react-hook-form";
import "@styles/react/libs/tables/react-dataTable-component.scss";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import { ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
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
import { VEHICLE_TYPE } from "./../../../constants/app";

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
  order: {
    key: "createdAt",
    value: "desc",
  },
};
const ListVehicle = ({ intl }) => {
  // ** Store Vars
  const serverSideColumns = [
    {
      name: "BSX",
      selector: "vehicleIdentity",
      sortable: true,
      // maxWidth: "80px",
      minWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "transportation" }),
      selector: "vehicleType",
      minWidth: "200px",
      cell: (row) => {
        const { vehicleType } = row;
        return (
          <div>
            {vehicleType === VEHICLE_TYPE.CAR
              ? intl.formatMessage({ id: "car" })
              : intl.formatMessage({ id: "other" })}
          </div>
        );
      },
    },

    {
      name: intl.formatMessage({ id: "management-number" }),
      selector: "vehicleRegistrationCode",
      sortable: true,
      minWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "brand" }),
      selector: "vehicleBrandModel",
      sortable: true,
      minWidth: "150px",
    },
    {
      name: intl.formatMessage({ id: "types" }),
      selector: "vehicleBrandName",
      sortable: true,
      minWidth: "50px",
    },
    {
      name: intl.formatMessage({ id: "image-registration" }),
      selector: "username",
      center: true,
      minWidth: "250px",
      cell: (row) => {
        const { vehicleRegistrationImageUrl } = row;

        return <div>
          <img src={vehicleRegistrationImageUrl}
          style={{
            width : 45,
            height : 45,
          }}/>
        </div>;
      },
    },
    {
      name: intl.formatMessage({ id: "expiration-date" }),
      selector: "vehicleExpiryDate",
      sortable: true,
      minWidth: "140px",
      // maxWidth: "150px",
      cell: (row) => {
        const { vehicleExpiryDate } = row;

        return <div>{moment(vehicleExpiryDate).format("DD/MM/YYYY")}</div>;
      },
    },
    {
      name: intl.formatMessage({id: "license-plate-color"}),
      selector: "vehiclePlateColor",
      minWidth: "150px",
      cell : (row) =>{
        const { vehiclePlateColor } = row
        return(
          <p className={`licensePlates
            ${vehiclePlateColor === 'WHITE' ? 'color_white' : " "}
            ${ vehiclePlateColor === 'BLUE' ? 'color_blue' : " " }
            ${ vehiclePlateColor === 'YELLOW' ? 'color_yellow' : " " }
            ${ vehiclePlateColor === 'RED' ? 'color_red' : " " }
          `}></p>
        )
      }
    },
  ];
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);

  // ** States
  const [modal, setModal] = useState(false);
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
  const [idTrans, setIdTrans] = useState(null);

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
    const token = window.localStorage.getItem("accessToken");

    if (token) {
      const newToken = token.replace(/"/g, "");

      Service.send({
        method: "POST",
        path: "AppUserVehicle/find",
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
        order: {
          key: "createdAt",
          value: "desc"
        }
    };
    getDataSearch(newParams);
  };

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

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = 20;

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
                bsSize="sm"
                id="search-input"
                value={searchValue}
                onChange={(e) => {
                  handleFilter(e);
                }}
              />
            </InputGroup>
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
    </Fragment>
  );
};

export default injectIntl(memo(ListVehicle));