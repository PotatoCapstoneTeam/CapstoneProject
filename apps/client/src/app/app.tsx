import { BrowserRouter, Route, Routes } from 'react-router-dom';
import GameRoom from '../routes/GameRoom';
import Intro from '../routes/Intro';
import Lobby from '../routes/Lobby';
import SignUp from '../routes/SignUp';
import { CookiesProvider } from 'react-cookie';

export function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Intro />} />
          <Route path="/lobby" element={<Lobby />} />
          <Route path="/SignUp" element={<SignUp />} />
          <Route path="/game_room/:id" element={<GameRoom />} />
        </Routes>
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
