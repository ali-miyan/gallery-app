import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/Signup";
import LoginPage from "./pages/Login";
import HomePage from "./pages/Home";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toast } from "./pages/Toast";
import ProtectedRoute from "./routes/protectedRoute";
import { AuthProvider } from "./context/authContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Provider store={store}>
          <BrowserRouter>
            <Routes>
              <Route element={<ProtectedRoute isProtected={false} />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
              </Route>
              <Route element={<ProtectedRoute isProtected={true} />}>
                <Route path="/home" element={<HomePage />} />
              </Route>
            </Routes>
          </BrowserRouter>
          <Toast />
        </Provider>
      </AuthProvider>
    </>
  );
}

export default App;
