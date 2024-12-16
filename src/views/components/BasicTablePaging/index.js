import { Pagination, PaginationItem, PaginationLink, Input } from 'reactstrap'
import "./style.scss";
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather'

const BasicTablePaging = ({handlePaginations, items}) => {
    const Enter = 13
    const [disabled, setDisabled] = useState(true)
    const [value, setValue] = useState(1)

    const onKeyDown = (e) =>{
      if(e.keyCode === Enter){  // click vào phím enter
        handlePaginations(Number(e.target.value))
      }
    }

    const moveToNextPage = () =>{
      if(value > 9999999){
        return null
      }
      handlePaginations(value + 1)
      setValue(value + 1)
    }

    const moveToPreviousPage = () =>{
      if(value < 2){
        return null
      }
      setValue(value - 1)
      handlePaginations(value - 1)
    }

    const handleChange = (value) =>{
      let newValue = Number(value.replace(/[^0-9]/g, ""));
      setValue(newValue)
    }

  return (
    <Pagination className="pagination react-paginate separated-pagination pagination-sm justify-content-end pr-3 mt-1">
      <div className="prev-item position-relative">
          <span 
           onClick={() =>moveToPreviousPage()} 
           className={`bg_left ${value === 1 ? 'disabled' : ''}`}
           >
            < ChevronLeft />
          </span>
      </div>
      <div>
        <Input 
          className='input_paging' 
          value={value}
          onKeyDown={(e) => onKeyDown(e)}
          onChange={(e) => { handleChange(e.target.value) }}
          />
      </div>
      <div className="next-item position-relative">
          <span 
            onClick={() =>moveToNextPage()} 
            className={`bg_right ${items < 20 ? 'disabled' : ''}`}
            >
              < ChevronRight />
          </span>
      </div>
    </Pagination>
  )
}

export default BasicTablePaging
