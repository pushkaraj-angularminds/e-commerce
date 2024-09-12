import { useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
// import 'bootstrap/dist/css/bootstrap.min.css';

const ProductDetails = () => {
  const location = useLocation();
  const fallBackProd = {
    id: 3,
    title: 'Mens Cotton Jacket',
    price: 55.99,
    description:
      'great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.',
    category: "men's clothing",
    image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg',
    rating: {
      rate: 4.7,
      count: 500,
    },
  };

  const product = location.state || fallBackProd;

  const [cartCount, setCartCount] = useState(() => {
    return localStorage.getItem('cartCount')
      ? JSON.parse(localStorage.getItem('cartCount'))
      : 0;
  });

  function handleAddToCart(product) {
    let localStorageData = JSON.parse(localStorage.getItem('cart'));
    let arr = localStorageData ? localStorageData : [];

    if (arr.length === 0) {
      let obj = { ...product, qty: 1 };
      arr.push(obj);
      localStorage.setItem('cart', JSON.stringify(arr));
      localStorage.setItem('cartCount', JSON.stringify(arr.length));
      setCartCount((prev) => prev + 1);
    } else {
      console.log('object');
      let obj = { ...product, qty: 1 };
      let flag = true;
      let data = arr.map((item) => {
        if (item.id === product.id) {
          item.qty = item.qty + 1;
          flag = false;
        }
        return item;
      });

      if (flag) {
        data.push(obj);
        setCartCount(data.length);
      }
      localStorage.setItem('cartCount', data.length);
      localStorage.setItem('cart', JSON.stringify(data));
    }
  }
  return (
    <div className='container'>
      <NavBar />

      <div className='container mt-5'>
        <div className='row'>
          <div className='col-md-6 ml-5'>
            <h1 className='mb-3'>{product.title}</h1>
            <h4 className='text-primary mb-3'>${product.price.toFixed(2)}</h4>
            <p className='mb-3'>{product.description}</p>
            <p className='text-muted mb-3'>Category: {product.category}</p>
            <div className='mb-3'>
              <span className='badge bg-success'>{product.rating.rate} ⭐</span>
              <span className='text-muted' style={{ marginLeft: '5px' }}>
                ({product.rating.count} reviews)
              </span>
            </div>
            <button
              className='btn btn-primary'
              style={{ marginTop: '15px' }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
          <div className='col-md-3'>
            <img
              src={product.image}
              alt={product.title}
              style={{ height: '400px', width: '300px' }}
              className='img-fluid rounded w-100'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
