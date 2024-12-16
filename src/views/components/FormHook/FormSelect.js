import { Controller } from 'react-hook-form';
import {
  FormGroup,
  Input,
  Label,
  CustomInput,
} from 'reactstrap';

const RequiredMark = () => {
  return (
    <span style={{ color: "red", marginLeft: 4, fontSize: 12 }}>*</span>
  )
}

const FormSelect = ({ control, labelId, name, rules, errors, intl, isRequired, type = 'text', options , defaultValue = "" }) => {
  return (
    <FormGroup>
      <Label for={name} className='text-small align-items-center d-flex'>
        <div>
          {intl.formatMessage({ id: labelId })}
        </div>
        {isRequired && <RequiredMark />}
      </Label>
      <Controller
        control={control}
        name={name}
        rules={rules}
        defaultValue={defaultValue}
        render={field =>
          <CustomInput type="select" id={name} {...field} className={errors[name] ? 'is-invalid' : ''}>
            {options.map((option, index) => (
              <option key={index} value={option.value}>
                {option.label}
              </option>
            ))}
            {!options.some(option => option.value === field.value) && field.value && (
              <option value={field.value} disabled>
                {field.value}
              </option>
            )}
            {!field.value && <option value={field.value} disabled>{intl.formatMessage({ id: 'no_value' })}</option>}
          </CustomInput>
        }
      />
      {errors[name] && <div className="text-danger">{errors[name].message}</div>}
    </FormGroup>
  );
};

export default FormSelect;
