import React, { Fragment, useState, memo, useEffect } from "react";
import { toast } from "react-toastify";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import moment from "moment";
import { injectIntl } from "react-intl";
import { CardBody } from "reactstrap";
import "./index.scss";
import { SCHEDULE_STATUS } from "../../../constants/app";
import { LICENSEPLATES_COLOR } from "../../../constants/app";

const RegistrationHistory = ({ intl, appUserId }) => {
console.log(appUserId);
  const DefaultFilter = {
    // filter: {
    //   appUserId: appUserId,
    // },
    // skip: 0,
    // limit: 10,
    // order: {
    //   key: "createdAt",
    //   value: "desc",
    // },
  };

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(20)
  const [rowsPerPage, setRowsPerPage] = useState(20)

  const tableColumns = [
    {
      name: intl.formatMessage({ id: "stationsName" }),
      selector: "stationsName",
      minWidth: "260px",
    },
    {
      name: intl.formatMessage({ id: "time" }),
      minWidth: "200px",
      cell: (row) => {
        return (
          <div>
            {row.time} {row.dateSchedule}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "messageStatus" }),
      selector: "CustomerScheduleStatus",
      minWidth: "150px",
      cell: (row) => {
        const { CustomerScheduleStatus } = row;
        return (
          <div>
            {CustomerScheduleStatus === SCHEDULE_STATUS.NEW
              ? intl.formatMessage({ id: "new-appointment" })
              : CustomerScheduleStatus === SCHEDULE_STATUS.CONFIRMED
              ? intl.formatMessage({ id: "appointment-confirmed" })
              : CustomerScheduleStatus === SCHEDULE_STATUS.CANCELED
              ? intl.formatMessage({ id: "appointment-cancelled" })
              : intl.formatMessage({ id: "appointment-closed" })}
          </div>
        );
      },
    },
    {
      name: intl.formatMessage({id: "messagesDetail-customerMessagePlateNumber"}),
      selector: "licensePlates",
      minWidth: "150px",
      cell : (row) =>{
        const {licensePlates, licensePlateColor } = row
        return(
          <p className={`color_licensePlates 
            ${licensePlateColor === LICENSEPLATES_COLOR.white ? 'color_white' : " "}
            ${ licensePlateColor === LICENSEPLATES_COLOR.blue ? 'color_blue' : " " }
            ${ licensePlateColor === LICENSEPLATES_COLOR.yellow ? 'color_yellow' : " " }
            ${ licensePlateColor === LICENSEPLATES_COLOR.red ? 'color_red' : " " }
          `}>{licensePlates}</p>
        )
      }
    },
  ];

  const handleRecordById = (appUserId) => {
    Service.send({
      method: "POST",
      path: "CustomerRecord/getDetailById",
      data: {
        id : appUserId
      },
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
          setTotal(data.total)
          setData(data.data);
        }
      }
    });
  };

   // ** Function to handle Pagination and get data
   const handlePagination = (page) => {
    const newParams = {
      ...paramsFilter,
      skip: page.selected * paramsFilter.limit,
    };
    handleRecordById(newParams);
    setCurrentPage(page.selected + 1);
  };

  const handlePerPage = e => {

    const newParams = {
      ...paramsFilter,
      limit: parseInt(e.target.value),
      skip: 0
    }
    setCurrentPage(1)
    setRowsPerPage(parseInt(e.target.value))
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

  useEffect(() => {
    handleRecordById(appUserId);
  }, []);

  return (
    <CardBody>
      <DataTable
        className="react-dataTable"
        pagination
        paginationServer
        paginationComponent={CustomPagination}
        columns={tableColumns}
        noHeader
        data={data}
      />
    </CardBody>
  );
};

export default injectIntl(memo(RegistrationHistory));
