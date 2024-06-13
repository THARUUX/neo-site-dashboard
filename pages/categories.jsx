import Layout from '@/components/Layout';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { withSwal } from 'react-sweetalert2';

function Categories({ swal }) {
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null);
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    axios.get('/api/categories').then(result => {
      setCategories(result.data);
    });
  }

  async function saveCategory(ev) {
    ev.preventDefault();
    let data = {
      name,
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
    setName('');
    setParentCategory('');
    setProperties([]);
    fetchCategories();
  }
  

  function editCategory(category) {
    let Cato = '';
    if (category.parent?._id) {
      Cato = category.parent._id;
    }
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(Cato);
    setProperties(
      category.properties.map(({name, values}) => ({
        name,
        values: Array.isArray(values) ? values.join(',') : values
      }))
    );
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
          const { _id } = category;
          await axios.delete('/api/categories?_id=' + _id);
          fetchCategories();
        }
      });
  }

  function addProperty() {
    setProperties(prev => {
      return [...prev, { name: '', values: '' }];
    });
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
      <div className="p-5">
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
                  </button>
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

