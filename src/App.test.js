import { render, screen } from '@testing-library/react';
import ReactDOM from 'react-dom/client';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/Prisijunkite prie sistemos/i);
  expect(linkElement).toBeInTheDocument();
});

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.createRoot(div).render(<App />);
  //ReactDOM.unmountComponentAtNode(div);
});