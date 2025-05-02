import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pag/Home";
import Board from "./pag/Board";
import Login from "./auth/LoginForm";
import Register from "./auth/RegisterForm";
import { ThemeProvider } from "./theme-context";
import { Provider } from 'react-redux';
import { AuthProvider } from './auth/AuthContext';
import store from './redux/store';
import PrivateRoute from './auth/PrivateRoute';
import "./App.css";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <div className="app-container">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/board/:boardId" element={<PrivateRoute><Board /></PrivateRoute>} />
              </Routes>
            </div>
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
    </DndProvider>
  );
}

export default App;