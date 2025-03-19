import Layout from '@/components/Layout';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Image from 'next/image';

export default function Settings() {
  const [products, setProducts] = useState([]);
  const [featuredProduct, setFeaturedProduct] = useState('');
  const [featuredImage, setFeaturedImage] = useState('');
  const [featuredDescription, setFeaturedDescription] = useState('');
  const [featured, setFeatured] = useState({});

  //alert('This page is currently under maintance!');

  useEffect(() => {
    axios.get('/api/products')
      .then(response => {
        setProducts(response.data);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  useEffect(() => {
    axios.get('/api/featured?id=664b20b089a45de583ce7ba6').then(response => {
        setFeatured(response.data);
    });
  }, []);

  async function updateFeatured(ev) {
    ev.preventDefault();
    try {
      let data = { featuredProduct, featuredDescription, featuredImage };
      if (featured._id) {
        await axios.put(`/api/featured/${featured._id}`, data);
      } else {
        await axios.post('/api/featured', data);
      }
    } catch (error) {
      console.error('Error updating featured product:', error);
    }
  }

  return (
    <Layout>

      <div className='w-full p-10'>
        <div className='w-full text-2xl text-slate-900'>Management System</div>
        
      </div>
    </Layout>
  );
}
