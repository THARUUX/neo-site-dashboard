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
    axios.get('/api/products?id='+id).then(response => {
      setProductInfo(response.data);
    });
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