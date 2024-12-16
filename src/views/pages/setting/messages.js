import "@styles/react/libs/flatpickr/flatpickr.scss";
import _, { filter, pickBy } from "lodash";
import moment from "moment";
import { Fragment, memo, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown } from "react-feather";
import { injectIntl } from "react-intl";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import { Card, Col, FormGroup, Input, Label, Row } from "reactstrap";

import Flatpickr from "react-flatpickr";
import Select from "react-select";
import { selectThemeColors } from "@utils";

import Service from "../../../services/request";
import "./messages.scss";

const DefaultFilter = {
  filter: {
    customerMessageCategories: "SMS",
  },
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};



const providers = [
  { value: "VIETTEL", label: "VIETTEL" },
  { value: "VIVAS", label: "VIVAS" },
  { value: "VMG", label: "VMG" },
];

function Messages({ intl }) {

  const messageStatus = [
    { value: "NEW", label: intl.formatMessage({ id: "new" }) },
    { value: "PENDING", label: intl.formatMessage({ id: "pending" }) },
    { value: "SENDING", label: intl.formatMessage({ id: "sending" }) },
    { value: "COMPLETED", label: intl.formatMessage({ id: "completed" }) },
    { value: "CANCELED", label: intl.formatMessage({ id: "canceled" }) },
  ];

  const history = useHistory();

  const [messages, setMessages] = useState([]);
  const [total, setTotal] = useState(20);
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);

  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  const [filterObj, setFilterObj] = useState({
    filter: {
      messageSendStatus: "",
      stationsName: "",
      externalProvider: "",
      customerMessageCategories: "SMS",
    },
    startDate: "",
    endDate: "",
  });
  const [stationsName, setStationName] = useState("");
  const [externalProvider, setExternalProvider] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  //   const [isLoading, setIsLoading] = useState(false);

  function fetchMessages(params, isNoLoading) {
    const newParams = {
      ...params,
    };
    if (!isNoLoading) {
      setIsLoading(true);
    }

    Service.send({
      method: "POST",
      path: "CustomerMessage/getList",
      data: newParams,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        setParamsFilter(newParams);
        if (statusCode === 200) {
          setTotal(data.total);
          setMessages(data.data);
        } else {
          toast.warn(
            intl.formatMessage(
              { id: "actionFailed" },
              { action: intl.formatMessage({ id: "fetchData" }) }
            )
          );
        }
      } else {
        setTotal(1);
        setMessages([]);
      }
      if (!isNoLoading) {
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    fetchMessages(paramsFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (name, value) => {
    if (name === "startDate" || name === "endDate") {
      const newFilterObj = pickBy(
        {
          ...filterObj,
          [name]: value?.toString().trim(),
          filter: pickBy({ ...filterObj.filter }, (v) => v !== ""),
        },
        (v) => v !== ""
      );
      setFilterObj(newFilterObj);
      getDataSearch(newFilterObj);

      return;
    }

    const newFilterObj = pickBy(
      {
        ...filterObj,
        filter: pickBy(
          {
            ...filterObj.filter,
            [name]: value.trim(),
          },
          (v) => v !== ""
        ),
        skip: 0,
      },
      (v) => v !== ""
    );

    setFilterObj(newFilterObj);
    getDataSearch(newFilterObj);
  };

  const getDataSearch = _.debounce((params) => {
    fetchMessages(params, true);
  }, 300);

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    fetchMessages(newParams);
    setCurrentPage(page.selected + 1);
  };

  // ** Custom Pagination
  const CustomPagination = () => {
    const count = Number(Math.ceil(total / rowsPerPage).toFixed(0));

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

  const serverSideColumns = [
    {
      name: "ID",
      selector: "messageCustomerId",
      sortable: true,
      maxWidth: "60px",
    },
    {
      name: intl.formatMessage({ id: "phone" }),
      selector: "customerMessagePhone",
      maxWidth: "120px",
    },
    {
      name: intl.formatMessage({ id: "plateNumber" }),
      selector: "customerMessagePlateNumber",
      maxWidth: "220px",
    },
    {
      name: intl.formatMessage({ id: "stations" }),
      selector: "stationsName",
      maxWidth: "250px",
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: "provider" }),
      selector: "externalProvider",
      maxWidth: "250px",
      sortable: true,
    },
    {
      name: intl.formatMessage({ id: "messageStatus" }),
      selector: "messageSendStatus",
      sortable: true,
      maxWidth: "120px",
      cell: (row) => {
        return row.messageSendStatus
          ? intl.formatMessage({ id: row.messageSendStatus.toLowerCase() })
          : "";
      },
    },
    {
      name: intl.formatMessage({ id: "smsContent" }),
      selector: "customerMessageContent",
      minWidth: "320px",
      maxWidth: "520px",
    },
    {
      name: intl.formatMessage({ id: "time" }),
      selector: "messageSendDate",
      sortable: true,
      maxWidth: "150px",
      cell: (row) => {
        const { messageSendDate } = row;

        return messageSendDate ? <div>{moment(messageSendDate).format("hh:mm DD/MM/YYYY")}</div> : "";
      },
    },
  ];

  return (
    <Fragment>
      <Card>
        <h1 className="text-center my-4">
          {intl.formatMessage({ id: "table-message-title" })}
        </h1>

        <Row className="p-4">
          <Col className="mb-1" md="6" sm="12">
            <Label for="stationsName">
              {intl.formatMessage({ id: "Search" })}{" "}
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="md"
              id="stationsName"
              placeHolder={intl.formatMessage({ id: "stationsName" })}
              value={stationsName}
              onChange={(e) => {
                setStationName(e.target.value);
                handleFilterChange("stationsName", e.target.value);
              }}
            />
          </Col>
          <Col className="mb-1" md="6" sm="12">
            <Label>
              {intl.formatMessage({ id: "messagesDetail-messageSendStatus" })}{" "}
            </Label>
            <Select
              theme={selectThemeColors}
              className="react-select w-100"
              classNamePrefix="select"
              isClearable={true}
              defaultValue={{
                value: "",
                label: "Chọn trạng thái"
              }}
              options={messageStatus}
              onChange={(row) => {
                if (!row) {
                  handleFilterChange("messageSendStatus", "");
                  return;
                }
                const { value } = row;
                handleFilterChange("messageSendStatus", value);
              }}
            />
          </Col>
          <Col className="mb-1" md="6" sm="12">
            <Label for="default-picker" className="white-space-nowrap">
              {intl.formatMessage({ id: "startDate" })}
            </Label>
            <Flatpickr
              id="startDate"
              name="startDate"
              className="form-control"
              onChange={(date) => {
                handleFilterChange("startDate", date[0]);
                setStartDate(date[0]);
              }}
              value={intl.formatMessage({ id: "startDate" })}
              options={{
                dateFormat: "Y-m-d",
              }}
            />
          </Col>

          <Col className="mb-1" md="6" sm="12">
            <Label>{intl.formatMessage({ id: "provider" })} </Label>
            <Select
              theme={selectThemeColors}
              className="react-select w-100"
              classNamePrefix="select"
              defaultValue={{
                value: "",
                label: "Chọn nhà cung cấp"
              }}
              isClearable={true}
              options={providers}
              onChange={(row) => {
                if (!row) {
                  handleFilterChange("externalProvider", "");
                  setExternalProvider("");
                  return;
                }
                const { value } = row;
                handleFilterChange("externalProvider", value);
                setExternalProvider(value);
              }}
            />
          </Col>

          <Col className="mb-1" md="6" sm="12">
            <Label for="endDate" className="white-space-nowrap">
              {intl.formatMessage({ id: "endDate" })}
            </Label>
            <Flatpickr
              id="endDate"
              name="endDate"
              className="form-control"
              onChange={(date) => {
                handleFilterChange("endDate", date[0]);
                setEndDate(date[0]);
              }}
              value={endDate}
              options={{
                dateFormat: "Y-m-d",
              }}
            />
          </Col>

        </Row>

        <DataTable
          noHeader
          pagination
          paginationServer
          className="react-dataTable"
          columns={serverSideColumns}
          sortIcon={<ChevronDown size={10} />}
          paginationComponent={CustomPagination}
          data={messages}
          progressPending={isLoading}
          onRowClicked={(row, event) => {
            event.preventDefault();
            history.push("/pages/sent-messages/detail", row);
          }}
          pointerOnHover={true}
          highlightOnHover={true}
        />
      </Card>
    </Fragment>
  );
}

export default injectIntl(memo(Messages));
