import React from 'react';
import { Link } from 'react-router-dom';

function NavBar() {
  const cartCount = localStorage.getItem(`cartCount`)
    ? JSON.parse(localStorage.getItem(`cartCount`))
    : 0;
  const totalItems = localStorage.getItem(`totalItems`)
    ? JSON.parse(localStorage.getItem(`totalItems`))
    : 0;

  return (
    <div style={{ padding: '0 10px' }}>
      <h1>
        <Link to='/'>My Ecommerce Site</Link>

        <Link
          to={{
            pathname: `/cart`,
          }}
        >
          <span className='pull-right'>Cart( {cartCount})</span>
        </Link>
      </h1>
      <h5> Total Items : {totalItems} </h5>

      <hr />
    </div>
  );
}

export default NavBar;
