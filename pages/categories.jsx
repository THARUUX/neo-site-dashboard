import Layout from '@/components/Layout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withSwal } from 'react-sweetalert2';
import Loader from '@/components/loader';

function Categories({ swal }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    setLoading(true);
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
      setLoading(false);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();

    setLoading(true);

    if(!name){
      alert('Please fill the inputs first.');
    }else {
      let data = {
        name,
        description,
        image,
        parentCategory: parentCategory || null,
        properties: properties.map(p => ({
          name: p.name,
          values: p.values.split(','),
        })),
      };
  
      if (parentCategory) {
        data.parentCategory = parentCategory;
      }
      
      if (editedCategory) {
        data._id = editedCategory._id;
        await axios.put('/api/categories', data);
        setEditedCategory(null);
        swal
          .fire({
            title: 'Saved !',
            text: `The category was successfully saved.`,
            showCancelButton: false,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'OK',
            confirmButtonColor: '#86ff0c',
            reverseButtons: true,
          })
          .then({
          });
      } else {
        await axios.post('/api/categories', data);
        setLoading(false);
        swal
          .fire({
            title: 'Added !',
            text: `The category was successfully added.`,
            showCancelButton: false,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'OK',
            confirmButtonColor: '#86ff0c',
            reverseButtons: true,
          })
          .then({
          });
      }
    }

    setName('');
    setDescription('');
    setImage('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }
  

  function editCategory(category) {
    //console.log(category);
    let Cato = '';
    if (category.parent?._id) {
      Cato = category.parent._id;
    }
    setEditedCategory(category);
    setName(category.name);
    setDescription(category.description);
    setImage(category.image);
    setParentCategory(Cato);
    setProperties(
      category.properties.map(({name, values}) => ({
        name,
        values: Array.isArray(values) ? values.join(',') : values
      }))
    );
    const element = document.querySelector('#category-main');

    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    })

    setTimeout(() => {
      document.getElementById('category-name-input').focus();
    }, 300);

  }
  
  
  

  function deleteCategory(category) {
    swal
      .fire({
        title: 'Are you sure?',
        text: `Do you want to delete ${category.name}?`,
        showCancelButton: true,
        cancelButtonText: 'Cancel',
        confirmButtonText: 'Yes, Delete!',
        confirmButtonColor: '#d55',
        reverseButtons: true,
      })
      .then(async result => {
        if (result.isConfirmed) {
          setLoading(true);
          const { _id } = category;
          await axios.delete('/api/categories?_id=' + _id);
          setLoading(false);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    /*setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });*/
    window.alert('This function is currently under development.');
  }

  function handlePropertyNameChange(index, newName) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index] = {
        ...updatedProperties[index],
        name: newName,
      };
      return updatedProperties;
    });
  }

  function handlePropertyValuesChange(index, newValues) {
    setProperties(prev => {
      const updatedProperties = [...prev];
      updatedProperties[index] = {
        ...updatedProperties[index],
        values: newValues,
      };
      return updatedProperties;
    });
  }

  function removeProperty(indexToRemove) {
    setProperties(prev => {
      return prev.filter((_, pIndex) => pIndex !== indexToRemove);
    });
  }

  return (
    <Layout>
      <Loader handle={loading} />
      <div className="p-5" id='category-main'>
        <h1 className="text-xl text-lime-600">Categories</h1>
        <form onSubmit={saveCategory}>
          <div className="flex flex-col gap-2 mb-5 mt-5">
            <label htmlFor="categoryName" className="text-lime-900">
              {editedCategory
                ? `Edit category  " ${editedCategory.name} "`
                : 'Create new category'}
            </label>
            <div className="w-full">
              <form className="flex flex-col">
                <div>
                  <input
                    id='category-name-input'
                    type="text"
                    placeholder="Category Name"
                    className="border-b-2  px-2 flex-grow mr-2 mb-0 h-full focus:border-lime-500"
                    value={name}
                    onChange={ev => setName(ev.target.value)}
                  />
                  <select
                    name=""
                    id=""
                    className="border rounded px-2 flex-grow mr-5 mb-0 h-full drop-shadow-md focus:border-lime-500"
                    onChange={ev => setParentCategory(ev.target.value)}
                    value={parentCategory}
                  >
                    <option value="">No parent category</option>
                    {categories.length > 0 &&
                      categories.map(category => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div className={`mt-5`}>
                <textarea
                    type="text"
                    placeholder="Category Description"
                    className="border-b-2  px-2 flex-grow mr-2 mb-0 h-full focus:border-lime-500"
                    value={description}
                    onChange={ev => setDescription(ev.target.value)}
                  />
                </div>
                <div className={`mt-5 ${parentCategory ? '' : ''}`}>
                <input
                    type="text"
                    placeholder="Category Image URL"
                    className="border-b-2  px-2 flex-grow mr-2 mb-0 h-full focus:border-lime-500"
                    value={image}
                    onChange={ev => setImage(ev.target.value)}
                  />
                </div>
                <div className="mt-3">
                  <label htmlFor="properties" className="mt-3 text-lime-900 block">
                    Properties
                  </label>
                  <button
                    onClick={addProperty}
                    type="button"
                    className="bg-gray-200 ml-4 px-4 w-46 py-1 mt-2 rounded shadow-md mr-2 mb-0 focus:border-lime-500 hover:bg-gray-300"
                  >
                    Add new property
                  </button><span className='text-slate-400 text-xs'>This function is currently under development.</span>
                  {properties.length > 0 &&
                    properties.map((property, index) => (
                      <div key={index} className="flex gap-5 mb-2 mt-2 ml-4">
                        <input
                          type="text"
                          value={property.name}
                          className="mb-0 border-b-2"
                          onChange={ev => handlePropertyNameChange(index, ev.target.value)}
                          placeholder="property name (example: color)"
                        />
                        <input
                          type="text"
                          className="mb-0 border-b-2"
                          onChange={ev => handlePropertyValuesChange(index, ev.target.value)}
                          value={property.values}
                          placeholder="values, comma separated"
                        />
                        <button
                          onClick={() => removeProperty(index)}
                          type="button"
                          className="btn py-1 px-3 rounded bg-red-100 shadow-md hover:bg-red-500"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                </div>
              </form>
              <button type="submit" className="bg-lime-400 mt-5 px-4 py-1 rounded drop-shadow-md text-white hover:bg-lime-500">
                Save
              </button>
            </div>
          </div>
        </form>
        <div className="max-h-80 mb-36 overflow-y-auto shadow-lg">
          <table className="basic shadow-lg">
            <thead>
              <tr>
                <td>Category Name</td>
                <td></td>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 &&
                categories.map(category => (
                  <tr key={category._id}>
                    <td>
                      <span className="text-gray-400">
                        {category?.parent?.name ? `${category?.parent?.name} >` : ''}
                      </span>{' '}
                      {category.name}
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          className="btn btn-wait bg-lime-400 px-3 py-1 rounded shadow-md hover:bg-lime-500"
                          onClick={() => editCategory(category)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn bg-red-500 px-3 py-1 rounded shadow-md hover:bg-red-600"
                          onClick={() => deleteCategory(category)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => <Categories swal={swal} />);

