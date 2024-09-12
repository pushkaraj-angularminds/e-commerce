import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import NavBar from './NavBar';

const Cart = () => {
  const [cart, setCart] = useState(() =>
    localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : []
  );
  const [orderElem, setOrderElem] = useState([]);
  const [total, setTotal] = useState();

  const setLocalStorage = () => {
    localStorage.setItem('cartCount', cart.length);
    localStorage.setItem('cart', JSON.stringify(cart));
  };

  const setChange = (e, index) => {
    let obj = cart[index];
    obj.qty = e.target.value;
    cart[index] = obj;
    setCart(JSON.parse(JSON.stringify(cart)));
    setLocalStorage();
  };

  const decrement = (index) => {
    let obj = cart[index];
    obj.qty = obj.qty - 1;
    cart[index] = obj;
    setCart(JSON.parse(JSON.stringify(cart)));
    setLocalStorage();
  };

  const increment = (index) => {
    let obj = cart[index];
    obj.qty = Number(obj.qty) + 1;
    cart[index] = obj;
    setCart(JSON.parse(JSON.stringify(cart)));
    setLocalStorage();
  };

  const RemoveItem = (e, index) => {
    e.preventDefault();
    let tempArr = cart;
    tempArr.splice(index, 1);
    // console.log(tempArr);
    setCart(JSON.parse(JSON.stringify(tempArr)));
    setLocalStorage();
  };

  const cartItems = (arr) => {
    let arr2 = [];
    let total = 0;
    if (arr.length > 0) {
      arr2 = arr.map(({ _id, image, name, price, qty }, index) => {
        total += qty * price;
        return (
          <div key={_id}>
            <div className='row'>
              <div className='col-md-3'>
                <img src={image} width='100px' height='200px' alt={name} />
              </div>
              <div className='col-md-3'>
                {name}
                <br />
                <i className='fa fa-inr'></i>
                {price}
              </div>
              <div className='col-md-3'>
                <br />
                <button
                  onClick={() => decrement(index)}
                  disabled={qty <= 1 && true}
                >
                  -
                </button>
                <input
                  type='text'
                  name='quantity'
                  style={{ width: '90px', margin: '0 20px' }}
                  className=''
                  value={qty}
                  onChange={(e) => setChange(e, index)}
                />
                <button onClick={() => increment(index)}>+</button>
              </div>
              <div className='col-md-3'>
                <button
                  style={{ marginTop: '15px' }}
                  className='btn btn-warning'
                  onClick={(e) => RemoveItem(e, index)}
                >
                  remove
                </button>
              </div>
            </div>
            <hr />
          </div>
        );
      });
    }
    setTotal(total);
    setOrderElem(arr2);
  };

  useEffect(() => {
    cartItems(cart);
  }, [cart]);

  return (
    <div className='container'>
      <div className='row'>
        <NavBar />
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-heading'>
              MY CART (
              {localStorage.getItem('cartCount')
                ? localStorage.getItem('cartCount')
                : 0}
              )
              {total < 50 && (
                <span className='pull-right'>
                  Minimum Order Value : <strong>50</strong>
                </span>
              )}
            </div>

            <div className='panel-body'>
              {orderElem}
              <div className='row'>
                {cart.length > 0 ? (
                  <>
                    <div className='col-md-9'>
                      <label className='pull-right'>Amount Payable</label>
                    </div>
                    <div className='col-md-3 '>{total}</div>
                  </>
                ) : (
                  <div className='col-md-7'>
                    <label className='pull-right h4'>
                      Your Cart Is Empty :(
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className='panel-footer'>
              <Link to='/home' className='btn btn-success'>
                Continue Shopping
              </Link>
              {cart.length > 0 && total >= 50 ? (
                <Link to='/placeorder' className='pull-right btn btn-danger'>
                  Place Order
                </Link>
              ) : (
                <button className='pull-right btn btn-danger disabled'>
                  Place Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
