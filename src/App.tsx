import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateWrappers";
import AppLayout from "./layouts/AppLayout";
import "ldrs/react/DotSpinner.css";
import "leaflet/dist/leaflet.css";
import { useAuth } from "./store/authStore";
import CompaniesPage from "./pages/Companies";
import AddCompany from "./pages/AddCompany";
import EditCompany from "./pages/EditCompany";
import DeliveriesPage from "./pages/Deliveries";
import AddDelivery from "./pages/AddDelivery";
import EditDelivery from "./pages/EditDelivery";
import ClientsPage from "./pages/Clients";
import AddClinet from "./pages/AddClinet";
import EditClinet from "./pages/EditClient";
import OrdersPage from "./pages/orders";
import DeliveryMapPage from "./pages/Map";
import Setting from "./pages/Settings";
import DeliveriesOrdersPage from "./pages/DeliveriesWithOrders";
import DeliveryPage from "./pages/Delivery";

function App() {
  const { role } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route Component={PrivateRoutes}>
          <Route
            path="/home"
            element={
              <AppLayout>
                <Home />
              </AppLayout>
            }
          />

          <>
            <Route
              path="/companies"
              element={
                <AppLayout>
                  <CompaniesPage />
                </AppLayout>
              }
            />

            <Route
              path="/company/add"
              element={
                <AppLayout>
                  <AddCompany />
                </AppLayout>
              }
            />
            <Route
              path="/company/edit/:id"
              element={
                <AppLayout>
                  <EditCompany />
                </AppLayout>
              }
            />
          </>
          <Route
            path="/current-deliveries"
            element={
              <AppLayout>
                <DeliveriesOrdersPage />
              </AppLayout>
            }
          />
          <Route
            path="/deliveries"
            element={
              <AppLayout>
                <DeliveriesPage />
              </AppLayout>
            }
          />
          <Route
            path="/map"
            element={
              <AppLayout>
                <DeliveryMapPage />
              </AppLayout>
            }
          />
          <Route
            path="/setting"
            element={
              <AppLayout>
                <Setting />
              </AppLayout>
            }
          />
          <Route
            path="/clients"
            element={
              <AppLayout>
                <ClientsPage />
              </AppLayout>
            }
          />
          <Route
            path="/orders"
            element={
              <AppLayout>
                <OrdersPage />
              </AppLayout>
            }
          />
          <Route
            path="/current-deliveries/delivery/:id"
            element={
              <AppLayout>
                <DeliveryPage />
              </AppLayout>
            }
          />
          <Route
            path="/client/add"
            element={
              <AppLayout>
                <AddClinet />
              </AppLayout>
            }
          />
          <Route
            path="/client/edit/:id"
            element={
              <AppLayout>
                <EditClinet />
              </AppLayout>
            }
          />
          <Route
            path="/deliveries/add"
            element={
              <AppLayout>
                <AddDelivery />
              </AppLayout>
            }
          />
          <Route
            path="/delivery/edit/:id"
            element={
              <AppLayout>
                <EditDelivery />
              </AppLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
