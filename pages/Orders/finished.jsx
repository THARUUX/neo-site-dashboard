import Layout from '@/components/Layout'
import React from 'react'
import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function Finished() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState([]);


  useEffect(() => {
    axios.get('/api/orders').then(response => {
      setOrders(response.data);
    });
  }, []);


  const filteredOrders = orders.filter(order =>
    order.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.contactNumber.includes(searchQuery.toLowerCase())
    // Add more fields if needed for search
  );
  return (
    <Layout>
      <div className='p-5'>
        <div className='text-xl mb-5'>Finished Orders</div>
        <div className="max-h-screen mb-36 overflow-y-auto shadow-lg">
          <div className='w-full flex justify-between mb-10 pr-3'>
          <input
            type="text"
            placeholder="Search finished orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 mb-3"
          />
          <Link href={'/orders'} className='px-3 py-1 btn cursor-pointer flex justify-center items-center bg-slate-200 rounded shadow-md hover:bg-slate-300 hover:shadow-lg'>Unfinished Orders</Link>
          </div>
          <table className="basic shadow-lg">
            <thead>
              <tr>
                <td>TimeStamp</td>
                <td>Customer Name</td>
                <td>Contact Number</td>
                <td>Products</td>
                <td>Delivery</td>
                <td>View</td>
                <td>Options</td>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  order.status == 'finished' ? (
                    <tr key={order._id} className='hover:bg-slate-200 cursor-pointer'>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>{order.name}</td>
                      <td>{order.contactNumber}</td>
                      <td>
                        {order.line_items.map(l => (
                          <div key={l._id}>
                            {l.price_data?.product_data.name} x {l.quantity}<br />
                          </div>
                        ))}
                      </td>
                      <td>
                        {order.pickupFromStore === "checked" ? 'Picking Up' : 'YES'}
                      </td>
                      <td>
                        <Link href={'/Orders/' + order._id}>
                          <button className='btn bg-slate-900 text-white rounded shadow-md px-2 py-1'>View</button>
                        </Link>
                      </td>
                      <td className='flex gap-2'>
                        <Link href={'/Orders/delete/' + order._id}>
                          <button className='btn bg-red-500 p-2 rounded shadow-md'>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                              <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </Link>
                      </td>
                    </tr>
                  ) : null
                ))
              ) : (
                <tr>
                  <td colSpan="7">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
