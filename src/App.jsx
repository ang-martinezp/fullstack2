import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Ofertas from './pages/Ofertas';
import Nosotros from './pages/Nosotros';
import Blog from './pages/Blog';
import BlogDetalle from './pages/BlogDetalle';
import Contacto from './pages/Contacto';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Carrito from './pages/Carrito';
import Checkout from './pages/Checkout';
import CompraExitosa from './pages/CompraExitosa';
import CompraError from './pages/CompraError';

// Componentes y Vistas del Módulo de Administración
import RutaProtegida from './components/admin/RutaProtegida';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductos from './pages/admin/AdminProductos';
import AdminProductosCriticos from './pages/admin/AdminProductosCriticos';
import AdminProductoForm from './pages/admin/AdminProductoForm';
import AdminCategorias from './pages/admin/AdminCategorias';
import AdminUsuarios from './pages/admin/AdminUsuarios';
import AdminUsuarioForm from './pages/admin/AdminUsuarioForm';
import AdminUsuarioHistorial from './pages/admin/AdminUsuarioHistorial';
import AdminOrdenes from './pages/admin/AdminOrdenes';
import AdminBoleta from './pages/admin/AdminBoleta';
import AdminReportes from './pages/admin/AdminReportes';
import AdminPerfil from './pages/admin/AdminPerfil';

function App() {
  return (
    <Routes>
      {/* Rutas Públicas de la Tienda (con Header y Footer) */}
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:sku" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/nosotros" element={<Nosotros />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetalle />} />
        <Route path="/contacto" element={<Contacto />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/carrito" element={<Carrito />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/checkout/exito" element={<CompraExitosa />} />
        <Route path="/checkout/error" element={<CompraError />} />
      </Route>

      {/* Rutas Protegidas del Backoffice Admin (Seguridad Fail-Closed) */}
      <Route
        element={
          <RutaProtegida
            rolesPermitidos={['Administrador', 'Vendedor']}
            redirigirA="/"
            mensajeAlerta="Acceso Denegado: Los clientes solo tienen acceso a la tienda."
          />
        }
      >
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<AdminProductos />} />
          <Route path="productos/criticos" element={<AdminProductosCriticos />} />
          <Route path="productos/nuevo" element={<AdminProductoForm />} />
          <Route path="productos/editar/:sku" element={<AdminProductoForm />} />
          <Route path="categorias" element={<AdminCategorias />} />
          <Route path="ordenes" element={<AdminOrdenes />} />
          <Route path="ordenes/:id/boleta" element={<AdminBoleta />} />
          <Route path="reportes" element={<AdminReportes />} />
          <Route path="perfil" element={<AdminPerfil />} />

          {/* Submódulo de Usuarios: Exclusivo solo para Administrador (Fail-Closed) */}
          <Route
            element={
              <RutaProtegida
                rolesPermitidos={['Administrador']}
                redirigirA="/admin/productos"
                mensajeAlerta="Acceso Denegado: Los vendedores no tienen permisos para gestionar cuentas de usuario."
              />
            }
          >
            <Route path="usuarios" element={<AdminUsuarios />} />
            <Route path="usuarios/nuevo" element={<AdminUsuarioForm />} />
            <Route path="usuarios/editar/:run" element={<AdminUsuarioForm />} />
            <Route path="usuarios/:run/historial" element={<AdminUsuarioHistorial />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
