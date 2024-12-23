import { Route, Routes } from 'react-router-dom';
import './App.css';
import Hero from './components/landing/hero';
import Layout from './components/landing/layout';
import CustomRoom from './components/custom-room/customRoom';
import ComputerRoom from './components/computerRoom/computerRoom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Hero />} />
        <Route path='/custom-room' element={<CustomRoom />} />
        <Route path='/computer-room' element={<ComputerRoom />} />
      </Route>
    </Routes>
    
  );
}

export default App;