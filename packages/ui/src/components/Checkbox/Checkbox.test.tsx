import { fireEvent, render, screen } from '@testing-library/react';

// Components
import { Checkbox } from './index';

const handleCheck = jest.fn();
const labelDescription = 'This is description';

describe('Checkbox component', () => {
  test('should render correct snapshot', () => {
    const { asFragment } = render(
      <Checkbox
        label="Option 1"
        id="option1"
        disabled
        description={labelDescription}
        onChange={handleCheck}
        customClass={{
          description: 'text-white',
          label: 'text-black',
        }}
      />,
    );
    expect(asFragment()).toMatchSnapshot();
    expect(screen.getByText('Option 1')).toHaveClass('text-black');
    expect(screen.getByText(labelDescription)).toHaveClass('text-white');
  });

  test('renders the Checkbox with label and description', () => {
    render(<Checkbox label="Option 1" description="Description 1" />);
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  test('handle onChange event when click on checkbox', () => {
    render(<Checkbox label="Option 1" id="option1" onChange={handleCheck} />);
    fireEvent.click(screen.getByRole('checkbox'));
    expect(handleCheck).toHaveBeenCalledTimes(1);
  });

  test('handle onChange event when click on label', () => {
    render(<Checkbox label="Option 1" id="option1" onChange={handleCheck} />);
    fireEvent.click(screen.getByText('Option 1'));
    expect(handleCheck).toHaveBeenCalledTimes(2);
  });
});
