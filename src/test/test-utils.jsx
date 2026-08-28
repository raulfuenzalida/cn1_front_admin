import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { MsalProvider } from '@azure/msal-react';
import { msalInstance } from '../config/msalConfig';
import { ThemeProvider } from '../context/ThemeContext';

/**
 * Helper para renderizar componentes con providers necesarios
 */
export const renderWithProviders = (ui, options = {}) => {
  return render(
    <MsalProvider instance={msalInstance}>
      <ThemeProvider>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </MsalProvider>,
    options
  );
};
