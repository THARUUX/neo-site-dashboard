import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  image: existingImages,
  category: existingCategory,
}) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription || '');
  const [price, setPrice] = useState(existingPrice || '');
  const [images, setImages] = useState(existingImages || []);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState(existingCategory || '');
  const [goToProducts, setGoToProducts] = useState(false);

  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev) {
    ev.preventDefault();
    let data = { title, description, price, images, category };
    if (_id) {
      await axios.put('/api/products', { ...data, _id });
    } else {
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }

  function handleImageChange(index, value) {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  }

  function handleRemoveImage(index) {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  }

  function addNewImageInput() {
    setImages([...images, '']); 
  }
  

  if (goToProducts) {
    router.push('/products');
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
              onChange={ev => setTitle(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              placeholder="Enter the product description"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={description}
              onChange={ev => setDescription(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="category">Category</label>
            <select
              name="category"
              className="px-3 py-1 rounded shadow-md"
              value={category}
              onChange={ev => setCategory(ev.target.value)}
            >
              <option value="">None</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="price">Price</label>
            <input
              type="number"
              name="price"
              placeholder="Price in LKR"
              className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
              value={price}
              onChange={ev => setPrice(ev.target.value)}
            />
          </div>
          <div>
            <label htmlFor="image">Image URLs</label>
            <div id="images-urls">
              {images.map((image, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type="text"
                    placeholder={`Enter image URL ${index + 1}`}
                    className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
                    value={image}
                    onChange={ev => handleImageChange(index, ev.target.value)}
                  />
                  <button type="button" onClick={() => handleRemoveImage(index)}>Remove</button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addNewImageInput}>Add Image</button>
          </div>
        </div>
        <button type="submit" className="btn mt-10 font-bold text-white bg-lime-400 w-50 rounded-full p-2 px-8 ml-5">Upload</button>
      </form>
    </div>
  );
}
