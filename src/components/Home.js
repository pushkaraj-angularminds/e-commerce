/* eslint-disable react/jsx-no-comment-textnodes */
import axios from 'axios';
import { useEffect, useState } from 'react';
import NavBar from './NavBar';
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  const [sort, setSort] = useState(() => 'Default');

  const [cartCount, setCartCount] = useState(() => {
    return localStorage.getItem('cartCount')
      ? JSON.parse(localStorage.getItem('cartCount'))
      : 0;
  });

  useEffect(() => {
    axios
      .get(`https://fakestoreapi.com/products`)
      .then((response) => {
        console.log(response);
        // setProducts(response.data.products);
        setProducts(response.data);
        localStorage.setItem(
          'totalItems',
          JSON.stringify(response.data.length)
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // console.log(products);
  function handleAddToCart(product) {
    console.log(product);

    let localStorageData = JSON.parse(localStorage.getItem('cart'));
    let arr = localStorageData ? localStorageData : [];

    if (arr.length === 0) {
      let obj = { ...product, qty: 1 };
      arr.push(obj);
      localStorage.setItem('cart', JSON.stringify(arr));
      localStorage.setItem('cartCount', JSON.stringify(arr.length));
      setCartCount((prev) => prev + 1);
    } else {
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

  const setSelectOption = (e) => {
    setSort(e.target.value);
    let arr = [...products];
    currentItems = sorting(arr, e.target.value);
  };

  // for returning a soted arr
  function sorting(arr, type) {
    console.log(`sorting`);
    switch (type) {
      case 'LowToHigh':
        return arr.sort((a, b) => a.price - b.price);
      case 'HighToLow':
        return arr.sort((a, b) => b.price - a.price);
      default:
        return currentItems;
    }
  }

  // ******************* Pagination Starts ****************************  //

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);

  // eslint-disable-next-line no-unused-vars
  const [pageNumberLimit, setPageNumberLimit] = useState(
    products.length % itemPerPage
  );

  const [maxPageLimit, setMaxPageLimit] = useState(10);
  const [minPageLimit, setMinPageLimit] = useState(0);

  const pages = [];

  for (let i = 1; i <= Math.ceil(products.length / itemPerPage); i++) {
    pages.push(i);
  }

  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;

  let currentItems = products.slice(indexOfFirstItem, indexOfLastItem);

  // console.log(currentItems);

  const handlePagination = (e) => {
    setCurrentPage(Number(e.target.id));
  };

  const renderPageNumber = pages.map((number) => {
    if (number > minPageLimit && number < maxPageLimit + 1) {
      return (
        <li
          key={number}
          id={number}
          className={`page-item ${
            currentPage === Number(number) ? 'active' : null
          }`}
          onClick={(e) => handlePagination(e)}
          style={{ cursor: 'pointer' }}
        >
          <span className='page-link' key={number} id={number}>
            {number}
          </span>
        </li>
      );
    } else {
      return null;
    }
  });

  const handlePrev = (p1, p2) => {
    if (p1 <= p2) return;

    setCurrentPage(currentPage - 1);

    if ((currentPage - 1) % pageNumberLimit === 0) {
      setMaxPageLimit(maxPageLimit - pageNumberLimit);
      setMinPageLimit(minPageLimit - pageNumberLimit);
    }
  };

  const handleNext = (p1, page2) => {
    if (p1 >= page2) return;

    setCurrentPage(currentPage + 1);
    if (currentPage + 1 > maxPageLimit) {
      setMaxPageLimit(maxPageLimit + pageNumberLimit);
      setMinPageLimit(minPageLimit + pageNumberLimit);
    }
  };

  // ******************* Pagination Ends ****************************  //

  const renderProducts = () => {
    currentItems = sorting(currentItems, sort);

    const productElemets = currentItems.map((product, ind) => (
      <>
        <div
          role='button'
          className='col-md-3 mt-5 text-center'
          key={product.id}
        >
          <div
            className={`${
              ind % 4 === 0
                ? `bg-info`
                : ind % 4 === 1
                ? `bg-success`
                : ind % 4 === 2
                ? `bg-warning`
                : `bg-danger`
            }  `}
          >
            <img
              src={product.image}
              width='100'
              height='200'
              style={{ marginTop: '15px' }}
              alt={`product_image`}
              onClick={() =>
                navigate('/product-details', {
                  state: product,
                })
              }
            />
            <br />
            <p>{product.name}</p>
            <p>
              <i className='fa fa-inr'></i>
              {product.price}
            </p>
            <button
              className='btn btn-warning'
              onClick={() => handleAddToCart(product)}
              style={{ marginBottom: '15px' }}
            >
              Add to Cart
            </button>
          </div>
          <hr />
          <br />
        </div>
      </>
    ));

    return productElemets;
  };

  return (
    <div className='container'>
      <NavBar />
      <div className='row '>
        <div className='col-sm-12'>
          <div style={{ margin: '25px 0px' }}>
            <label htmlFor='' className='control-label'>
              Sort by:
            </label>

            <select
              style={{ marginLeft: '5px' }}
              defaultValue={sort}
              onChange={setSelectOption}
            >
              <option value='Default'>Default</option>
              <option value='HighToLow'>High to Low</option>
              <option value='LowToHigh'>Low to High</option>
            </select>
          </div>
        </div>
      </div>

      <div className='row'>{renderProducts()}</div>

      <div className='row'>
        <div className='col-sm-8'>
          <nav aria-label='Page navigation example'>
            <ul className='pagination'>
              <li
                className={`page-item ${
                  currentPage === pages[0] ? 'disabled' : ''
                }`}
              >
                <span
                  className='page-link'
                  disabled={currentPage === pages[0] ? true : false}
                  onClick={() => handlePrev(currentPage, pages[0])}
                >
                  Previous
                </span>
              </li>

              {renderPageNumber}
              <li
                className={`page-item ${
                  currentPage === pages.length ? 'disabled' : ''
                }`}
              >
                <span
                  className='page-link'
                  disabled={
                    Number(currentPage) <= Number(pages[pages.length]) - 1
                      ? true
                      : false
                  }
                  onClick={() =>
                    handleNext(currentPage, pages[pages.length - 1])
                  }
                >
                  Next
                </span>
              </li>
            </ul>
          </nav>
        </div>
        <div className='col-sm-4 text-right'>
          <div style={{ margin: '25px 0px' }}>
            <label htmlFor='' className='control-label'>
              Items Per Page:
            </label>
            <select
              className='form-select-sm'
              onChange={(e) => {
                setItemPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              defaultValue={itemPerPage}
            >
              <option value='05'>05</option>
              <option value='10'>10</option>
              <option value='25'>25</option>
              <option value='100'>50</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
