import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NavBar from './NavBar';
import axios from 'axios';
const PlaceOrder = () => {
  const navigate = useNavigate();
  const [orderElem, setOrderElem] = useState([]);
  const [total, setTotal] = useState();
  const [totalItem, setTotalItem] = useState();
  const [userInfo, setUserInfo] = useState({});
  const [error, setError] = useState({});

  const cartItems = (arr) => {
    let arr2 = [];
    let total = 0;
    let Totalqty = 0;
    if (arr.length > 0) {
      arr2 = arr.map(({ _id, name, price, qty }) => {
        total += qty * price;
        Totalqty++;
        return (
          <tr key={_id}>
            <td>{name} </td>
            <td>{qty}</td>
            <td>
              <i className='fa fa-inr'></i>
              {qty * price}
            </td>
          </tr>
        );
      });
    }
    setTotal(total);
    setTotalItem(Totalqty);
    setOrderElem(arr2);
  };

  const onChangeInfo = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    if (!userInfo || !userInfo.userName || !userInfo.address) {
      setError({ success: false, msg: 'UserInfo Required !' });
      alert(`Invalid Info`);
      return;
    } else {
      let localStoreArr = localStorage.getItem('cart')
        ? JSON.parse(localStorage.getItem('cart'))
        : [];

      let obj = {
        personName: userInfo.userName,
        deliveryAddress: userInfo.address,
        productsOrdered: localStoreArr.map(({ _id, qty, price }) => {
          return { productID: _id, qty: qty, price: price, total: qty * price };
        }),
        orderTotal: total,
      };

      axios
        .post('http://interviewapi.ngminds.com/api/placeOrder', obj)
        .then(() => {
          alert(`Order Placed Successfully`);
          setUserInfo({});
          localStorage.clear();
          setTimeout(() => navigate('/home'), 1000);
        })
        .catch((err) => console.error(err));
    }
  };

  useEffect(() => {
    const arr = JSON.parse(localStorage.getItem('cart'));
    if (arr.length) {
      cartItems(arr);
    } else {
      navigate('/home');
    }
  }, []);

  return (
    <div className='container'>
      <div className='row'>
        <NavBar />
        <div className='col-md-12'>
          <div className='panel panel-default'>
            <div className='panel-heading'>Place Order</div>
            <div className='panel-body'>
              <form className='form-horizontal' onSubmit={placeOrder}>
                <table className='table table-striped'>
                  <thead className='table-head'>
                    <tr>
                      <th>Product Name</th>
                      <th> Quntity</th>
                      <th> SubTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderElem}
                    <tr>
                      <td>
                        <strong>Total</strong>
                      </td>
                      <td>
                        <strong>{totalItem}</strong>
                      </td>
                      <td>
                        <strong>
                          <i className='fa fa-inr'></i>
                          {total}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <br />

                <br />
                <div className='form-group'>
                  <label
                    htmlFor='inputName3'
                    className='col-sm-2 control-label'
                  >
                    Enter Order Details
                  </label>
                  {Object.entries(error).length > 0 ? (
                    <small
                      htmlFor='inputName3'
                      className='col-sm-2 text-danger control-label pull-right'
                    >
                      *{error.msg}
                    </small>
                  ) : (
                    ''
                  )}
                </div>
                <div className='form-group'>
                  <label
                    htmlFor='inputName3'
                    className='col-sm-2 control-label'
                  >
                    Name
                  </label>
                  <div className='col-sm-6'>
                    <input
                      className='form-control'
                      id='inputName3'
                      name='userName'
                      placeholder='Name'
                      onChange={onChangeInfo}
                    />
                  </div>
                </div>
                <div className='form-group'>
                  <label
                    htmlFor='inputEmail3'
                    className='col-sm-2 control-label'
                  >
                    Address
                  </label>
                  <div className='col-sm-6'>
                    <textarea
                      className='form-control'
                      name='address'
                      id='inputEmail3'
                      placeholder='Deliver Address'
                      onChange={onChangeInfo}
                    ></textarea>
                  </div>
                </div>

                <div className='form-group'>
                  <label className='col-sm-2 control-label'></label>
                  <div className='col-sm-6'>
                    <button className='btn btn-warning' type='submit'>
                      Confirm Order
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrder;
