import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Layout from "@/components/Layout";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  weight: existingWeight,
  stock: existingStock,
  price: existingPrice,
  images: existingImages,
  category: existingCategory,
  properties:assignedProperties,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [weight, setWeight] = useState(existingWeight || '');
  const [stock, setStock] = useState(existingStock || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || '');
  const [productProperties,setProductProperties] = useState(assignedProperties || {});
  const [goToProducts, setGoToProducts] = useState(false);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories')
      .then(result => {
        setCategories(result.data);
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []); // Empty dependency array to execute only once on mount

  async function saveProduct(ev) {
    ev.preventDefault();
    try {
      if (!title || !price || !description || !weight || !stock) {
        alert("Please fill in all required fields.");
        return;
      }
  
      let categoryToSend = category; // Initialize categoryToSend with the selected category
  
      // If category is empty or null, set it to null for the API request
      if (!category) {
        categoryToSend = null;
      }
  
      const data = { title, description, weight, stock, price, images, category: categoryToSend, properties: productProperties };
  
      if (_id) {
        // Update
        await axios.put('/api/products', { ...data, _id });
      } else {
        // Create
        await axios.post('/api/products', data);
      }
  
      setGoToProducts(true);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  }
  

  useEffect(() => {
    if (goToProducts) {
      router.push('/products');
    }
  }, [goToProducts, router]);

  function handleImageChange(index, value) {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  }

  function addNewImage() {
    setImages([...images, ""]);
  }

  function setProductProp(propName,value) {
    setProductProperties(prev => {
      const newProductProps = {...prev};
      newProductProps[propName] = value;
      return newProductProps;
    });
  }


  const propertiesToFill = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({_id}) => _id === category);
    propertiesToFill.push(...catInfo.properties);
    while(catInfo?.parent?._id) {
      const parentCat = categories.find(({_id}) => _id === catInfo?.parent?._id);
      propertiesToFill.push(...parentCat.properties);
      catInfo = parentCat;
    }
  }

  return (
    <div className="w-full h-full p-5 text-lime-900">
      <form onSubmit={saveProduct}>
        <div className="p-5 flex flex-col gap-10">
          <div>
            <label htmlFor="productName">Product Name</label>
            <input
              type="text"
              name="productName"
              placeholder="Enter the name of the product"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={title}
              onChange={(ev) => setTitle(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              placeholder="Enter the product description"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={description}
              onChange={(ev) => setDescription(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="desweightcription">Weight</label>
            <input
              name="weight"
              placeholder="Enter the product weight"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={weight}
              onChange={(ev) => setWeight(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="stock">Stock</label>
            <input
              min={1}
              type="number"
              name="stock"
              placeholder="Enter the product stock"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={stock}
              onChange={(ev) => setStock(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category" className="mr-3">Category</label>
            <select
              name="category"
              className="px-3 py-1 rounded shadow-md"
              value={category}
              onChange={(ev) => setCategory(ev.target.value)}
            >
              <option value={null}>None</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            {propertiesToFill.length > 0 && propertiesToFill.map(p => (
              <div key={p.name} className="ml-10 pl-10 flex mt-2 items-center">
                <label className="mr-3">{p.name[0].toUpperCase()+p.name.substring(1)}</label>
                <div>
                  <select 
                  value={productProperties[p.name]}
                  onChange={ev =>
                    setProductProp(p.name,ev.target.value)
                  }
                  className="px-3 py-1 rounded shadow-md"
                  >
                    {p.values.map(v => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
          

          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Price in LKR"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={price}
              onChange={(ev) => setPrice(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="image">Image URLs</label>
            <div>
              {images.map((img, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder="Enter the image URL"
                  className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
                  value={img}
                  onChange={(ev) => handleImageChange(index, ev.target.value)}
                />
              ))}
              <button
                type="button"
                className="bg-lime-400 mt-3 px-2 py-1 text-white rounded"
                onClick={addNewImage}
              >
                Add Image
              </button>
              <div className="max-w-full overflow-x-auto">
              <div className="w-96 mt-5 flex gap-2 ">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    className="w-full rounded shadow-md object-cover"
                    alt=""
                  />
                ))}
              </div>
              </div>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="btn btn-wait mt-2 mb-10 font-bold text-white bg-lime-400 w-50 rounded-full p-2 px-8 ml-5"
        >
          { _id ? "Update" : "Upload" }
        </button>
      </form>
    </div>
  );
}
