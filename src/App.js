import './App.css';
import {Home} from './components/Home';
import Cart from './components/Cart';
import PlaceOrder from './components/PlaceOrder';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import ProductDetails from './components/ProductDetails';

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path='/home' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/placeorder' element={<PlaceOrder />} />
          <Route path='/product-details' element={<ProductDetails />} />

          <Route path='/*' element={<Navigate to={'/home'}></Navigate>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
