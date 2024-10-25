import Layout from '@/components/Layout';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { DATETIME } from 'mysql/lib/protocol/constants/types';

export default function OrderDetails() {
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  const [total, setTotal] = useState('');
  const [dileveryFee, setDileveryFee] = useState('');


  useEffect(() => {
      if (!id) {
        return;
      }

      const fetchOrder = async () => {
        try {
          const response = await axios.get(`/api/orders?id=${id}`);
          if (response.data) {
            setOrderInfo(response.data);
            console.log('order', response.data);
          } else {
            console.log('Order not found');
          }
        } catch (error) {
          console.error('Error fetching order:', error);
        }
      };

      fetchOrder();
    }, [id]);

  
  return (
    <Layout>
      <div className='p-10'>
        <h1 className='text-2xl text-lime-900'>Order Details</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : orderInfo ? (
          <div className='mt-5 flex flex-col gap-4'>
            <p className='border-b-2 border-slate-700'>Order ID: <span className='font-bold'>{orderInfo._id}</span></p>
            <p className='border-b-2 border-slate-700'>Customer Name: <span className='font-bold'>{orderInfo.name}</span></p>
            <p className='border-b-2 border-slate-700'>Contact Number: <span className='font-bold'>{orderInfo.contactNumber}</span></p>
            <p className='border-b-2 border-slate-700'>City: <span className='font-bold'>{orderInfo.city}</span></p>
            <p className='border-b-2 border-slate-700'>District: <span className='font-bold'>{orderInfo.district}</span></p>
            <p className='border-b-2 border-slate-700'>Street Address: <span className='font-bold'>{orderInfo.streetAddress}</span></p>
            <p className='border-b-2 border-slate-700'>Pickup From Store: <span className='font-bold'>{orderInfo.pickupFromStore}</span></p>
            <p className='border-b-2 border-slate-700'>Delivery Fee: <span className='font-bold'>Rs. {orderInfo.deliveryFee}</span></p>
            <p className='border-b-2 border-slate-700'>Total: <span className='font-bold'>Rs. {orderInfo.total}</span></p>
            <p className='border-b-2 border-slate-700'>Final: <span className='font-bold'>Rs. {orderInfo.pickupFromStore === "false" ? (+orderInfo.deliveryFee + +orderInfo.total) : orderInfo.total}</span></p>
            <p className='border-b-2 border-slate-700'>Weight: <span className='font-bold'>{orderInfo.weightTotal} Kg</span></p>
            <p className='border-b-2 border-slate-700'>Order Date: <span className='font-bold'>{(orderInfo.createdAt)}</span></p>
            <p className='border-b-2 border-slate-700'>Products: <span className='font-bold'>{orderInfo.line_items && orderInfo.line_items.map(l => (
              <div key={l._id}>
                {l.price_data?.product_data.name} x {l.quantity}<br />
              </div>
            ))}</span></p>
            <p className='border-b-2 border-slate-700'>Order Status: {orderInfo.status == "finished" ? orderInfo.status : "Unfinished"}</p>
          </div>
          
        ) : (
          <p>No order found</p>
        )}

        <div className='mt-5 flex flex-row gap-14  '>
          <button className='btn px-4 bg-slate-900 text-white py-2 rounded shadow-md '>Get Report</button>
          <Link href={'/orders'}>
            <button className='btn px-4 bg-slate-900 text-white py-2 rounded shadow-md '>Back</button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
