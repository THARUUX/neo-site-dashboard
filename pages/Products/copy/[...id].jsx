import Layout from "@/components/Layout";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import axios from "axios";
import ProductForm from "@/components/ProductForm";

export default function EditProductPage() {

  const [productInfo, setProductInfo] = useState(null);
  const router = useRouter();
  const {id} = router.query;

  useEffect(() => {
    if (!id) {
      return;
    }
  
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/products?id=${id}`);
        let dataToCopy = response.data;
  
        // Check if dataToCopy is an object
        if (dataToCopy && typeof dataToCopy === 'object' && !Array.isArray(dataToCopy)) {
          // Remove the _id property from the single product object
          const { _id, ...rest } = dataToCopy;
          dataToCopy = rest;
        } else {
          console.warn('Expected a single product object but received:', dataToCopy);
        }
  
        setProductInfo(dataToCopy);
      } catch (error) {
        console.error('Error fetching product info:', error);
      }
    };
  
    fetchData();
  }, [id]);
  
  
    

  return (
    <Layout>
      <div className="w-full h-full p-5 text-lime-900">
        <h1 className="text-xl">Edit Product</h1>
        {productInfo && (
          <ProductForm {...productInfo}/>
        )}
      </div>
    </Layout>
  );
}