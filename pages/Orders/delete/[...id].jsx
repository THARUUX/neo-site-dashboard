import Layout from '@/components/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';

export default function DeleteProductPage() {
  const router = useRouter();
  const { id } = router.query;
  const [orderInfo, setOrderInfo] = useState(null);
  const [deleteButtonText, setDeleteButtonText] = useState('Delete');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) {
      return;
    }
    axios.get(`/api/orders?id=${id}`)
      .then(response => {
        setOrderInfo(response.data);
      })
      .catch(err => {
        console.error('Error fetching order:', err);
        setError('Order not found');
      });
  }, [id]);

  function goBack() {
    router.push('/orders');
  }

  async function deleteProduct() {
    try {
      await axios.delete(`/api/orders?id=${id}`);
      setDeleteButtonText('Deleted');
      router.push('/orders');
    } catch (error) {
      console.error('Error deleting order:', error);
      setError('Error deleting order');
    }
  }

  return (
    <Layout>
      <div className='p-5'>
        <h1 className='text-2xl text-red-600'>
          {error ? error : `Do you really want to delete this order "${orderInfo?._id}"?`}
        </h1>
        <div className='w-full flex gap-10 mt-5 pr-10'>
          <button
            id='delete-yes-button'
            onClick={deleteProduct}
            className='bg-red-600 text-white px-4 py-2 rounded shadow-md w-20'
            disabled={deleteButtonText === 'Deleted'}
          >
            {deleteButtonText}
          </button>
          <button
            onClick={goBack}
            className='bg-green-600 text-white px-4 py-2 rounded shadow-md w-20'
          >
            BACK
          </button>
        </div>
      </div>
    </Layout>
  );
}
