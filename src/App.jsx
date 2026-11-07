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
import Proximamente from './pages/Proximamente';

// Componentes y Vistas del Módulo de Administración
import RutaProtegida from './components/admin/RutaProtegida';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';

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
        <Route path="/login" element={<Proximamente titulo="Iniciar sesión" />} />
        <Route path="/registro" element={<Proximamente titulo="Registro" />} />
        <Route path="/carrito" element={<Proximamente titulo="Carrito" />} />
        <Route path="/checkout" element={<Proximamente titulo="Checkout" />} />
      </Route>

      {/* Rutas Protegidas del Backoffice Admin (Seguridad Fail-Closed) */}
      <Route element={<RutaProtegida rolesPermitidos={['Administrador', 'Vendedor']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="productos" element={<Proximamente titulo="Gestión de Productos" />} />
          <Route path="productos/criticos" element={<Proximamente titulo="Productos en Stock Crítico" />} />
          <Route path="productos/nuevo" element={<Proximamente titulo="Nuevo Producto" />} />
          <Route path="productos/editar/:sku" element={<Proximamente titulo="Editar Producto" />} />
          <Route path="categorias" element={<Proximamente titulo="Gestión de Categorías" />} />
          <Route path="ordenes" element={<Proximamente titulo="Órdenes de Compra" />} />
          <Route path="ordenes/:id/boleta" element={<Proximamente titulo="Detalle de Boleta" />} />
          <Route path="usuarios" element={<Proximamente titulo="Gestión de Usuarios" />} />
          <Route path="usuarios/nuevo" element={<Proximamente titulo="Nuevo Usuario" />} />
          <Route path="usuarios/editar/:run" element={<Proximamente titulo="Editar Usuario" />} />
          <Route path="usuarios/:run/historial" element={<Proximamente titulo="Historial de Compras de Usuario" />} />
          <Route path="reportes" element={<Proximamente titulo="Reportes del Negocio" />} />
          <Route path="perfil" element={<Proximamente titulo="Perfil de Administrador" />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
