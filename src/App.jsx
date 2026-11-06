import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Proximamente from './pages/Proximamente';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Proximamente titulo="Home" />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:sku" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Proximamente titulo="Categorías" />} />
        <Route path="/categorias/:categoria" element={<Proximamente titulo="Categoría" />} />
        <Route path="/ofertas" element={<Proximamente titulo="Ofertas" />} />
        <Route path="/nosotros" element={<Proximamente titulo="Nosotros" />} />
        <Route path="/blog" element={<Proximamente titulo="Blog" />} />
        <Route path="/contacto" element={<Proximamente titulo="Contacto" />} />
        <Route path="/login" element={<Proximamente titulo="Iniciar sesión" />} />
        <Route path="/registro" element={<Proximamente titulo="Registro" />} />
        <Route path="/carrito" element={<Proximamente titulo="Carrito" />} />
        <Route path="/checkout" element={<Proximamente titulo="Checkout" />} />
        <Route path="/admin/*" element={<Proximamente titulo="Panel administrador" />} />
      </Route>
    </Routes>
  );
}

export default App;