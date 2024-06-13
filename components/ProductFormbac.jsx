import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import axios from "axios";
import Spinner from "@/components/Spinner";
import Layout from "@/components/Layout";
import {ReactSortable} from "react-sortablejs";

export default function ProductForm({
  _id,
  title:existingTitle, 
  description:existingDescription, 
  price:exsistingPrice,
  image:exsistingImage,
  category: existingCategory,
}){
    const [title,setTitle] = useState(existingTitle || '');
    const [description, setDescription] = useState(existingDescription || '');
    const [price, setPrice] = useState(exsistingPrice || '');
    const [image, setImage] = useState(exsistingImage || []);
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(existingCategory || '');

    const [goToProducts, setGoToProducts] = useState(false);

    const router = useRouter();

    useEffect(() => {
      axios.get('/api/categories').then(result => {
        setCategories(result.data);
      })
    })

    async function saveProduct(ev) {
        ev.preventDefault();
        let data = {title,description,price,image, category};
        if (_id) {
          //update
          await axios.put('/api/products', {...data,_id});
        } else {
          //create
          await axios.post('/api/products', data);
        }
        setGoToProducts(true);
    }

    if (goToProducts) {
        router.push('/products');
    }

    /*async function uploadImages(ev) {
      const files = ev.target?.files;
      if (files?.length > 0) {
        const data = new FormData();
        for (const file of files) {
          data.append('file', file);
        }
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        })
        console.log(res);
      }
    }*/

    function addNewImage(){
      const aniI = `<input 
      type="text" 
      name="image" 
      id="" 
      placeholder="Enter the image URL" 
      className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
      value={image}
      onChange={ev => setImage(ev.target.value)}
    />`;
      document.getElementById('image-urls').innerHTML =+ aniI ;
    }


  return (
        <div className="w-full h-full p-5 text-lime-900">
            <form onSubmit={saveProduct}>
            <div className="p-5 flex flex-col gap-10">
                    <div className="">
                        <div>
                            <label htmlFor="productName">Product Name</label>
                            <input 
                            type="text" 
                            name="productName" 
                            id="" 
                            placeholder="enter the name of the product" 
                            className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
                            value={title}
                            onChange={ev => setTitle(ev.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="description">Description</label>
                            <textarea 
                            name="description" 
                            placeholder="enter the name of the product description" 
                            className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
                            value={description}
                            onChange={ev => setDescription(ev.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                      <div className="flex gap-3">
                        <label htmlFor="category" className="mb-0 items-center">Category</label>
                        <select 
                        name="category" 
                        id="" 
                        className="px-3 py-1 rounded shadow-md"
                        value={category}
                        onChange={ev => setCategory(ev.target.value)}
                        >
                          <option value="">none</option>
                          {categories.length > 0 && categories.map(c => (
                            <option  key={index} value={c._id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                        <div>
                            <label htmlFor="price">Price</label>
                            <input 
                            type="number" 
                            name="price" id="" 
                            placeholder="price in LKR" 
                            className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
                            value={price}
                            onChange={ev => setPrice(ev.target.value)}
                            />
                        </div>
                    </div>
                    <div>
                      <div>
                        <label htmlFor="image">Image URL</label>
                        <div id="images-urls">
                          <input 
                            type="text" 
                            name="image" 
                            id="" 
                            placeholder="Enter the image URL" 
                            className="border-b rounded-sm mt-1 flex-grow flex w-full border-gray-300 px-2"
                            value={image}
                            onChange={ev => setImage(ev.target.value)}
                          />
                        </div>
                        <button className="bg-lime-400 mt-3 px-2 py-1 text-white rounded" onClick={addNewImage()}>
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                            <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
                          </svg>
                        </button>
                        <div className="w-96 mt-5 flex gap-2">
                          {image.length > 0 && categories.map(c => (
                            <img  key={index} src={image} className=" w-full rounded shadow-md object-cover" alt="" />
                          ))}
                        </div>
                      </div>
                    </div>
                    
            </div>
                <button type="submit" className="btn mt-10 font-bold text-white bg-lime-400 w-50 rounded-full p-2 px-8 ml-5">Upload</button>
        </form>
        </div>
      
  );
}


