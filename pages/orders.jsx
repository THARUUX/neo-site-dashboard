import Layout from '@/components/Layout';
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const router = useRouter();
  const { orderstatus } = router.query;

  // Fetch Orders
  const fetchOrders = useCallback(async () => {
    try {
      const response = await axios.get('/api/orders');
      let allOrders = response.data;

      console.log(allOrders);

      if (orderstatus) {
        setActiveTab(orderstatus);
        allOrders = allOrders.filter(order => order.status === orderstatus);
      } else {
        setActiveTab('All');
      }

      setOrders(allOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  }, [orderstatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Handle Order Status Update
  const handleOrderStatus = useCallback(async (id, value) => {
    try {
      await axios.put('/api/orders', { id, status: value });
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === id ? { ...order, status: value } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  }, []);

  // Filter Orders
  const filteredOrders = orders.filter(order =>
    order.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.contactNumber?.includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className='p-5'>
        <div className='text-xl mb-5'>Orders Management</div>
        <div className='w-full flex justify-between mb-10 pr-3'>
          <input
            type="text"
            placeholder="Search orders"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 mb-3"
          />
        </div>
        <div className="max-h-screen mb-36 overflow-y-auto shadow-lg">
          <div className='flex gap-5'>
            {['All', 'Pending', 'Waiting for customer', 'Processing', 'Finished', 'Delivery', 'Completed'].map(status => (
              <Link key={status} href={status === 'All' ? '/orders' : `/orders?orderstatus=${encodeURIComponent(status)}`} className={`cursor-pointer py-3 ${activeTab === status ? "bg-lime-100 px-8 border-t-2 rounded-t-md border-x-2" : "bg-slate-300 px-8 rounded-t-md"}`}>
                {status}
              </Link>
            ))}
          </div>
          <table className="basic shadow-lg">
            <thead>
              <tr>
                <td>TimeStamp</td>
                <td>Customer Name</td>
                <td>Contact Number</td>
                <td>Products</td>
                <td>Delivery</td>
                <td>Status</td>
                <td>View</td>
                <td>Options</td>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <tr key={order._id} className='hover:bg-slate-200 cursor-pointer'>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.name}</td>
                    <td>{order.contactNumber}</td>
                    <td>
                      {order.line_items?.map(l => (
                        <div key={l._id}>
                          {l.price_data?.product_data?.name} x {l.quantity}<br />
                        </div>
                      ))}
                    </td>
                    <td>{order.pickupFromStore === "checked" ? 'Picking Up' : 'YES'}</td>
                    <td>
                      <select className='bg-white shadow-md border-0 py-1 px-2 rounded-md' value={order.status} onChange={ev => handleOrderStatus(order._id, ev.target.value)}>
                        {['Pending', 'Waiting for customer', 'Processing', 'Finished', 'Delivery', 'Completed'].map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <Link href={'/Orders/' + order._id}>
                        <button className='btn bg-slate-900 text-white rounded shadow-md px-2 py-1'>View</button>
                      </Link>
                    </td>
                    <td>
                      <Link href={'/Orders/delete/' + order._id}>
                        <button className='btn bg-red-500 p-2 rounded shadow-md'>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-6 h-6">
                            <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}
