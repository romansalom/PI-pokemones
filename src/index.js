import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Importa 'Routes'
import LandingPage from './components/LandingPage';

const App = () => {
  return (
    <Router>
      <Routes> {/* Cambia 'Switch' por 'Routes' */}
        <Route path="/" element={<LandingPage />} /> {/* Cambia 'component' por 'element' */}
        {/* Otras rutas de tu aplicación */}
      </Routes>
    </Router>
  );
};

export default App;
