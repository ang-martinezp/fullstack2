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

function App() {
  return (
    <Routes>
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
        <Route path="/admin/*" element={<Proximamente titulo="Panel administrador" />} />
      </Route>
    </Routes>
  );
}

export default App;