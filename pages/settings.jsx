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

        <div className='absolute opacity-60 bg-white w-full h-full flex justify-center items-center'>
            <div className="text-slate-900">
            This Page Is Currently Under Maintaince !
            </div>
        </div>



      <div className='w-full p-10'>
        <div className='w-full text-2xl text-slate-900'>Settings</div>
        <div className='mt-10'>
          <div>
            <label htmlFor="product" className='mr-5'>Featured Product</label>
            <select
              name="featuredProduct"
              id=""
              className="px-3 py-1 rounded shadow-md"
              value={featuredProduct}
              onChange={ev => setFeaturedProduct(ev.target.value)}
            >
              <option value="">none</option>
              {products.length > 0 && products.map(product => (
                <option key={product._id} value={product._id}>{product.title}</option>
              ))}
            </select>
          </div>
          <br />
          <label htmlFor="description" className=''>Featured Product Description</label>
          <input
            type="text"
            name="productDescription"
            id=""
            placeholder="enter the description of the featured image"
            className="border-b rounded-sm mt-1 mb-5 flex-grow flex w-full border-gray-300 px-2"
            value={featuredDescription}
            onChange={ev => setFeaturedDescription(ev.target.value)}
          />
          <label htmlFor="Image">Image URL</label>
          <input
            type="text"
            name="ImageUrl"
            id=""
            placeholder="enter the url of the featured image"
            className="border-b rounded-sm mt-1 mb-5 flex-grow flex w-full border-gray-300 px-2"
            value={featuredImage}
            onChange={ev => setFeaturedImage(ev.target.value)}
          />
        </div>
        <div>
          <button onClick={updateFeatured} className='btn px-3 py-1 bg-slate-800 text-slate-100 rounded shadow-lg'>
            SAVE
          </button>
        </div>

        <div>Featured Product</div>
        <div>{featured.title}</div>
        <div>{featured.description}</div>
        <div>{featured.image}</div>
        <Image src={featured.image ? featured.image : ''} alt='featured' width={100} height={100} />
      </div>
    </Layout>
  );
}
