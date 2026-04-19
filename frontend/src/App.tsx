import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { PrimeReactProvider } from 'primereact/api';
import { HomePage } from './pages/HomePage';
import { QuotePage } from './pages/QuotePage';
import { QuotesListPage } from './pages/QuotesListPage';
import { InsuredPropertiesPage } from './pages/InsuredPropertiesPage';
import { PropertyDetailsPage } from './pages/PropertyDetailsPage';

// PrimeReact styles
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import './index.css';

function App() {
  return (
    <PrimeReactProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/cotizador" element={<QuotePage />} />
          <Route path="/quotes" element={<QuotesListPage />} />
          <Route path="/cotizaciones" element={<QuotesListPage />} />
          <Route path="/quote/:id/properties" element={<InsuredPropertiesPage />} />
          <Route path="/quote/:id/properties/details" element={<PropertyDetailsPage />} />
        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  );
}

export default App;
