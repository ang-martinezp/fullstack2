import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Productos from './pages/Productos';
import DetalleProducto from './pages/DetalleProducto';
import Home from './pages/Home';
import Categorias from './pages/Categorias';
import CategoriaDetalle from './pages/CategoriaDetalle';
import Proximamente from './pages/Proximamente';

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/productos/:sku" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:categoria" element={<CategoriaDetalle />} />
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