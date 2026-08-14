import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Public Pages
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Properties from "./pages/Properties/Properties";
import PropertyDetails from "./pages/PropertyDetails/PropertyDetails";

// Protected Pages
import Dashboard from "./pages/Dashboard/Dashboard";
import Profile from "./pages/Profile/Profile";
import AddProperty from "./pages/AddProperty/AddProperty";
import EditProperty from "./pages/EditProperty/EditProperty";
import MyProperties from "./pages/MyProperties/MyProperties";
import SavedProperties from "./pages/SavedProperties/SavedProperties";
import Settings from "./pages/Settings/Settings";

// 404
import NotFound from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      {/* =====================================
          PUBLIC ROUTES
      ===================================== */}

      <Route path="/" element={<Home />} />

      {/* AUTH */}

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      {/* =====================================
          PUBLIC PROPERTY ROUTES
      ===================================== */}

      <Route path="/properties" element={<Properties />} />

      <Route path="/properties/:id" element={<PropertyDetails />} />

      {/* =====================================
          PROTECTED ROUTES
      ===================================== */}

      <Route element={<ProtectedRoute />}>
        {/* DASHBOARD */}

        <Route path="/dashboard" element={<Dashboard />} />

        {/* PROFILE */}

        <Route path="/profile" element={<Profile />} />

        {/* MY PROPERTIES */}

        <Route path="/my-properties" element={<MyProperties />} />

        {/* ADD PROPERTY */}

        <Route path="/add-property" element={<AddProperty />} />

        {/* EDIT PROPERTY */}

        <Route path="/edit-property/:id" element={<EditProperty />} />

        {/* SAVED PROPERTIES */}

        <Route path="/saved-properties" element={<SavedProperties />} />

        {/* SETTINGS */}

        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* =====================================
          404
      ===================================== */}

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
