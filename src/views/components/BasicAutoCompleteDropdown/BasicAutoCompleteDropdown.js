import React, { Fragment } from 'react'
import Select from 'react-select'
import { selectThemeColors } from '@utils'

const BasicAutoCompleteDropdown = (props) => {
    const customStyles = {
        control: base => ({
          ...base,
          height: 30,
          minHeight: 30  
        }),
      };
  return (
    <Fragment>
      <Select
        theme={selectThemeColors}
        className="react-select"
        classNamePrefix="select"
        isClearable={false}
        // styles={customStyles}
        {...props}
      />
    </Fragment>
  )
}

export default BasicAutoCompleteDropdown
