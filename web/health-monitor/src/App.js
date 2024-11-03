import { AuthProvider } from "./context/AuthContext";
import { BrowserRouter as Router, } from 'react-router-dom';
import AppRoutes from "./appRoutes";

function App() {
  return (
    <Router>
      <AuthProvider>
          <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
