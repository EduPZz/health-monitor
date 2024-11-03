import "./App.css";
import Sidebar from "./components/sidebar/sidebar";
import Dashboard from "./pages/dashboard/dashboard";
import Login from "./pages/login";
import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Login />
          {/* <Sidebar />
      <Dashboard /> */}
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
