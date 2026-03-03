import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootLayout from "./routes/RootLayout";
import Home from "./routes/Home";
import Markets from "./routes/Markets";
import MarketDetail from "./routes/MarketDetail";
import Login from "./routes/Login";
import Account from "./routes/Account";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="markets" element={<Markets />} />
          <Route path="market/:id" element={<MarketDetail />} />
          <Route path="login" element={<Login />} />
          <Route path="account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
