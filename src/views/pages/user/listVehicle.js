import React, { Fragment, useState, memo, useEffect } from "react";
import { toast } from "react-toastify";
import Service from "../../../services/request";
import ReactPaginate from "react-paginate";
import DataTable from "react-data-table-component";
import moment from "moment";
import { injectIntl } from "react-intl";
import { CardBody } from "reactstrap";
import "./index.scss";
import { SCHEDULE_STATUS } from "./../../../constants/app";
import { LICENSEPLATES_COLOR } from "./../../../constants/app";
import { VEHICLE_TYPE } from "./../../../constants/app";

const ListVehicle = ({ intl, appUserId }) => {

  const DefaultFilter = {
    filter: {
      appUserId: appUserId,
    },
    skip: 0,
    limit: 10,
    order: {
      key: "createdAt",
      value: "desc",
    },
  };

  const [paramsFilter, setParamsFilter] = useState(DefaultFilter);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataVehicle, setDataVehicle] = useState([]);

  const tableColumns = [
    {
      name: intl.formatMessage({ id: "vehicleBrandName" }),
      selector: "vehicleBrandName",
      minWidth: "200px",
    },
    {
      name: intl.formatMessage({ id: "vehicleExpiryDate" }),
      minWidth: "200px",
      cell: (row) => {
        const { vehicleExpiryDate } = row;
        return (
            <div>{moment(vehicleExpiryDate).format("DD/MM/YYYY")}</div>
        );
      },
    },
    {
      name: intl.formatMessage({ id: "vehicleType" }),
      selector: "vehicleType",
      minWidth: "150px",
      center : true,
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
      name: intl.formatMessage({id: "vehiclePlateColor"}),
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

  const getCustomerSchedule = (DefaultFilter) => {
    Service.send({
      method: "POST",
      path: "AppUserVehicle/find",
      data: DefaultFilter,
      query: null,
    }).then((res) => {
      if (res) {
        const { statusCode, message, data } = res;
        if (statusCode === 200) {
            setDataVehicle(data.data);
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
    getCustomerSchedule(newParams);
    setCurrentPage(page.selected + 1);
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

  useEffect(() => {
    getCustomerSchedule(DefaultFilter);
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
        data={dataVehicle}
      />
    </CardBody>
  );
};

export default injectIntl(memo(ListVehicle));
