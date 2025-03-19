import React, { useEffect } from 'react';
import Layout from "@/components/Layout";
import Link from 'next/link';
import axios from 'axios';
import { useState } from 'react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch products from API on component mount
  useEffect(() => {
    axios.get('/api/products').then(response => {
      setProducts(response.data);
      setFilteredProducts(response.data); // Initially set filtered products to all products
    });
  }, []);

  // Handle search and filter products
  const handleSearch = (query) => {
    setSearchQuery(query);
    setFilteredProducts(
      products.filter(product => 
        product.title?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <Layout>
      <div className='w-full p-4'>
        <Link href={'/Products/new'} className='bg-green-600 p-1 rounded-lg px-3 text-white font-bold'>
          Add new product
        </Link>
      </div>
      <div className='p-5'>
        <div className='w-full flex justify-between mb-10 pr-3'>
          <input
            type="text"
            placeholder="Search products"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)} // Corrected this part
            className="border border-gray-300 rounded-md px-3 py-1 mb-3"
          />
        </div>
        <table className='basic'>
          <thead>
            <tr>
              <td>Product List</td>
              <td>Stock</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.slice().reverse().map(product => (
              <tr key={product._id} className={product.stock < 11 ? "bg-red-500" : ""}>
                <td>{product.title}</td>
                <td>{product.stock}</td>
                <td className='text-center flex justify-center items-center gap-5'>
                  <Link href={'/Products/copy/' + product._id}>
                    <button className='bg-lime-100 px-4 py-2 rounded shadow-md hover:bg-lime-200 flex'>
                      Copy
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-2 w-6 h-6">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </button>
                  </Link>
                  <Link href={'/Products/edit/' + product._id}>
                    <button className='bg-lime-100 px-4 py-2 rounded shadow-md hover:bg-lime-200 flex'>
                      Edit
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-2 w-6 h-6">
                        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
                        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
                      </svg>
                    </button>
                  </Link>
                  <Link href={'/Products/delete/' + product._id}>
                    <button className='bg-lime-100 px-4 py-2 rounded shadow-md hover:bg-lime-200 flex'>
                      Delete
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                        <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
