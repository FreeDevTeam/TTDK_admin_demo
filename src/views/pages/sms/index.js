import _ from "lodash";
import moment from "moment";
import { Fragment, memo, useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { ChevronDown, Edit, MoreVertical, Trash } from "react-feather";
import { injectIntl } from "react-intl";
import ReactPaginate from "react-paginate";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  Card,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  Label,
  Row,
  UncontrolledDropdown,
} from "reactstrap";

import Service from "../../../services/request";

const DefaultFilter = {
  filter: {},
  skip: 0,
  limit: 20,
  order: {
    key: "createdAt",
    value: "desc",
  },
};

function SMS({ intl }) {
  const history = useHistory();

  const [sms, setSms] = useState([]);
  const [total, setTotal] = useState(20);
  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);

  function fetchSms(params, isNoLoading) {
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

    Service.send({
      method: "POST",
      path: "MessageTemplate/user/getList",
      data: newParams,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, data } = res;
        setParamsFilter(newParams);
        if (statusCode === 200) {
          setTotal(data.total);
          setSms(data.data);
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
        setSms([]);
      }
      if (!isNoLoading) {
        setIsLoading(false);
      }
    });
  }

  useEffect(() => {
    fetchSms(paramsFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateSms = (item, messageSuccess) => {
    Service.send({
      method: "POST",
      path: "MessageTemplate/updateById",
      data: item,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode } = res;
        if (statusCode === 200) {
          toast.success(messageSuccess || "Action update successful!");
          fetchSms(paramsFilter);
        }
      } else {
        toast.warn(
          intl.formatMessage(
            { id: "actionFailed" },
            { action: intl.formatMessage({ id: "update" }) }
          )
        )
      }
    });
  };

  // ** Function to handle filter
  const handleFilter = (e) => {
    if (e.keyCode === 13) {
      const { value } = e.target;
      const searchText = value ? value : undefined
      setSearchValue();
      const newParams = {
        ...paramsFilter,
        searchText,
        skip: 0,
      };
      getDataSearch(newParams);
    }
  };

  const getDataSearch = _.debounce((params) => {
    fetchSms(params, true);
  }, 2000);

  // ** Function to handle Pagination and get data
  const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    fetchSms(newParams);
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
      selector: "messageTemplateId",
      sortable: true,
      maxWidth: "60px",
    },
    {
      name: intl.formatMessage({ id: "smsName" }),
      selector: "messageTemplateName",
      sortable: true,
      minWidth: "200px",
      maxWidth: "280px",
    },
    {
      name: intl.formatMessage({ id: "stationsName" }),
      selector: "stationsName",
      sortable: true,
      minWidth: "200px",
      maxWidth: "320px",
    },
    {
      name: intl.formatMessage({ id: "updatedAt" }),
      selector: "updatedAt",
      sortable: true,
      maxWidth: "200px",
      cell: (row) => {
        const { updatedAt } = row;

        return <div>{moment(updatedAt).format("hh:mm DD/MM/YYYY")}</div>;
      },
    },
    {
      name: intl.formatMessage({ id: "action" }),
      selector: "action",
      cell: (row) => {
        const { messageTemplateId, messageTemplateName, messageTemplateContent } = row;
        return (
          <>
            <UncontrolledDropdown>
              <DropdownToggle
                className="icon-btn hide-arrow"
                color="transparent"
                size="sm"
                caret
              >
                <MoreVertical size={15} />
              </DropdownToggle>
              <DropdownMenu right>
                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    history.push("/pages/form-template-sms", row);
                  }}
                >
                  <Edit className="mr-50" size={15} />{" "}
                  <span className="align-middle">
                    {intl.formatMessage({ id: "edit" })}
                  </span>
                </DropdownItem>

                <DropdownItem
                  href="/"
                  onClick={(e) => {
                    e.preventDefault();
                    handleUpdateSms({
                      id: messageTemplateId,
                      data: {
                        isDeleted: 0 ? 1 : 1,
                        messageTemplateName,
                        messageTemplateContent
                      },
                    });
                  }}
                >
                  <Trash className="mr-50" size={15} />{" "}
                  <span className="align-middle">
                    {intl.formatMessage({ id: "delete" })}
                  </span>
                </DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
          </>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Card>
        <Row className="mx-0 mt-1 mb-50">
          <Col
            className="d-flex align-items-center justify-content-sm-end mt-sm-0 mt-1"
            sm="4"
          >
            <Label sm="4" className="mr-1" for="search-input">
              {intl.formatMessage(
                { id: "Search" }
              )} {" "}
              {intl.formatMessage(
                { id: "stationsName" }
              )}
            </Label>
            <Input
              className="dataTable-filter"
              type="text"
              bsSize="sm"
              id="search-input"
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              onKeyDown={handleFilter}
            />
          </Col>

          <Col className="d-flex align-items-center ml-3" sm="2">
            <Button.Ripple
              color="primary"
              size="sm"
              onClick={() => {
                history.push("/pages/form-template-sms", {});
              }}
            >
              {intl.formatMessage({ id: "add" })}
            </Button.Ripple>
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
          data={sms}
          progressPending={isLoading}
        />
      </Card>
    </Fragment>
  );
}

export default injectIntl(memo(SMS));
