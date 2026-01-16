import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DeviceDetails from './pages/DeviceDetails';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/device/:id" element={<DeviceDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
