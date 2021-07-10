import { Select } from 'antd';
import { Raw } from 'types';

type SelectProps = React.ComponentProps<typeof Select>;

interface IdSelectProps extends Omit<SelectProps, 'value' | 'onChange' | 'options'> {
  value: Raw | null | undefined;
  onChange: (value?: number) => void;
  defaultOptionName?: string;
  options?: { name: string; id: number }[];
}

/**
 * value 可以传入多种类型的值
 * onChange 只会回调 number|undefined 类型
 * @param props
 */
export const IdSelect = ({ value, onChange, defaultOptionName, options, ...restProps }: IdSelectProps) => {
  return (
    <Select
      value={options?.length ? toNumber(value) : 0}
      onChange={(val) => onChange(toNumber(val) || undefined)}
      {...restProps}
    >
      {defaultOptionName ? <Select.Option value={0}>{defaultOptionName}</Select.Option> : null}
      {options?.map((option) => (
        <Select.Option key={option.id} value={option.id}>
          {option.name}
        </Select.Option>
      ))}
    </Select>
  );
};

function toNumber(value: unknown) {
  return isNaN(Number(value)) ? 0 : Number(value);
}
