import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    // Encode file content to Base64
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64Data = reader.result.split(',')[1];
      try {
        const response = await axios.post('https://api.github.com/repos/Neo-Creative/neo-web/contents/', {
          message: 'Upload image',
          content: base64Data,
        });

        setImageUrl(response.data.content.download_url);
      } catch (error) {
        console.error('Error uploading image:', error);
      }
    };
  } catch (error) {
    console.error('Error preparing image upload:', error);
  }
};


  return (
    <div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
};

export default ImageUploader;
