import Layout from '@/components/Layout'
import axios from 'axios';
import { useRouter } from 'next/router'
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';

export default function DeleteProductPage() {

    const router = useRouter();
    const {id} = router.query;
    const [productInfo, setProductInfo] = useState('');
    const deleteButton = "Delete";

    useEffect(() => {
        if (!id) {
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
            setProductInfo(response.data);
        });
    }, [id]);

    function goBack(){
        router.push('/products');
    }

    async function deleteProduct(){
        await axios.delete('/api/products?id='+id);
        router.push('/products');
        const deleteButton = "Deleted";
    }

  return (
    <Layout>
        <div className='p-5'>
            <h1 className='text-2xl text-red-600'>Do you really want to delete product &quot;{productInfo?.title}&quot;?</h1>
            <div className='w-full flex gap-10 mt-5 pr-10'>
                <button id='delete-yes-button' onClick={deleteProduct} className='bg-red-600 text-white px-4 py-2 rounded shadow-md w-20'>{deleteButton}</button>
                <button onClick={() => goBack()} className='bg-green-600 text-white px-4 py-2 rounded shadow-md w-20'>BACK</button>
            </div>
        </div>
    </Layout>
  )
}
