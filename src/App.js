import { Route, Routes } from 'react-router-dom';
import './App.css';
import Hero from './components/landing/hero';
import Layout from './components/landing/layout';
import CustomRoom from './components/custom-room/customRoom';
import OnlineRoom from './components/onlineRoom/OnlineRoom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Layout />}>
        <Route index element={<Hero />} />
        <Route path='/custom-room' element={<CustomRoom />} />
        <Route path='/play-online' element={<OnlineRoom />} />
      </Route>
    </Routes>
    
  );
}

export default App;