import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PrivateRoutes from "./components/PrivateWrappers";
import AppLayout from "./layouts/AppLayout";
import "ldrs/react/DotSpinner.css";
import "leaflet/dist/leaflet.css";
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
import ClientPage from "./pages/ClientPage";
import ConfirmOrders from "./pages/ConfirmOrders";
import { useAuth } from "./store/authStore";
import { useEffect } from "react";
import { connectSocket } from "./services/socket";
import toast from "react-hot-toast";
import successSound from "./assets/success.mp3";

function App() {
  const { id } = useAuth();

  const playSound = (path: string) => {
    const audio = new Audio(path);
    audio.play().catch(() => {}); // prevent console error if autoplay blocked
  };

  useEffect(() => {
    if (!id) return;

    const socket = connectSocket();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);

      socket.emit("joinCompany", Number(id));
    });

    socket.on("newOrder", (order) => {
      console.log("New Order Received:", order);
      playSound(successSound);
      toast.success(`يوجد طلب جديد #${order.id} من العميل ${order.name} `, {
        style: {
          fontSize: "20px",
          padding: "15px 20px",
          textAlign: "center",
          background: "#10B981",
          color: "#fff",
          borderRadius: "10px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#10B981",
        },
        position: "top-left",
        duration: 3000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/client/:key" element={<ClientPage />} />
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
            path="/clientOrders"
            element={
              <AppLayout>
                <ConfirmOrders />
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
