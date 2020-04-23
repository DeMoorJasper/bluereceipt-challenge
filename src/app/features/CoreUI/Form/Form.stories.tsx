import React, { FC, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { action } from '@storybook/addon-actions';

import '../../App/Root/Root.scss';
import FormInput from '../FormInput/FormInput';
import TwoColumnGrid from '../TwoColumnGrid/TwoColumnGrid';
import Button from '../Button/Button';
import CheckBox from '../CheckBox/CheckBox';
import Select from '../Select/Select';

export default { title: 'Form' };

interface FormData {
  firstname: string;
  lastname: string;
  email: string;
  phone?: string;
  marketing: boolean;
  marketing2: boolean;
  weeklytips: boolean;
  newfeatures: boolean;
}

interface Props {
  onSubmit: (data: FormData) => void;
}

const MARKETING_ROLE_OPTIONS = [
  {
    label: 'test',
    value: '1',
  },
  {
    label: 'test 2',
    value: '2',
  },
  {
    label: 'test 3',
    value: '3',
  },
  {
    label: 'test 4',
    value: '4',
  },
];

const Form: FC<Props> = ({ onSubmit }) => {
  const { register, handleSubmit, errors, setValue } = useForm();
  const mapSubmitHandler = useCallback((data) => onSubmit(data), [onSubmit]);
  // Took this from the use-form example, but I'm sure there's a better way to do this
  // would be nice is useForm had a property values that we could just use...
  // https://github.com/react-hook-form/react-hook-form/blob/master/examples/customInput.tsx
  const [marketingRoleValue, setMarketingRoleValue] = React.useState<Array<string>>([]);

  useEffect(() => {
    register({ name: 'marketingRole' });
  }, []);

  return (
    <form onSubmit={handleSubmit(mapSubmitHandler)}>
      <TwoColumnGrid>
        <FormInput
          fillWidth
          label='Firstname *'
          name='firstname'
          ref={register({ required: true })}
          error={errors.firstname && 'First name is required.'}
        />
        <FormInput
          fillWidth
          label='Lastname *'
          name='lastname'
          ref={register({ required: true })}
          error={errors.lastname && 'Last name is required.'}
        />
        <FormInput
          fillWidth
          label='E-Mail *'
          name='email'
          type='email'
          ref={register({ required: true })}
          error={errors.email && 'E-Mail is required.'}
        />
        <FormInput fillWidth label='Phone Number' name='phone' ref={register({})} />
        <CheckBox label='Customer Accepts Marketing' name='acceptMarketing' id='acceptMarketing' ref={register({})} />
        <Select
          options={[...MARKETING_ROLE_OPTIONS]}
          placeholder='Select a marketing role'
          value={marketingRoleValue}
          onChange={(selectedOptions) => {
            setMarketingRoleValue(selectedOptions);
            setValue('marketingRole', selectedOptions);
          }}
          isMultiSelect
        />
        <Button size='big' type='submit'>
          Submit
        </Button>
      </TwoColumnGrid>
    </form>
  );
};

export const normal = () => <Form onSubmit={action('submit')} />;
