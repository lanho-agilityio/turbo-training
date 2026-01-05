import { render, screen, fireEvent, waitFor } from '@testing-library/react';

import { InputPassword } from '.';

describe('InputPassword component', () => {
  const handleChange = jest.fn();

  test('render the default InputPassword', () => {
    expect(render(<InputPassword onChange={handleChange} />)).toMatchSnapshot();
  });

  test('Test handle change events', () => {
    render(<InputPassword onChange={handleChange} />);
    fireEvent.change(screen.getByTestId('input-password'), {
      target: { value: 'Test input' },
    });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test('Test show/hide password', async () => {
    const { getByTestId, getByTitle } = render(
      <InputPassword onChange={handleChange} />,
    );

    fireEvent.click(getByTestId('toggle-button'));

    await waitFor(() => {
      expect(getByTitle('hide-password')).toBeInTheDocument();
    });
  });

  test('Test input when disabled', () => {
    const { queryByTestId } = render(
      <InputPassword onChange={handleChange} disabled />,
    );
    expect(queryByTestId('toggle-button')).not.toBeInTheDocument();
  });
});
