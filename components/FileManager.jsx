import { useState, useEffect } from 'react';

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [copySuccess, setCopySuccess] = useState(null);

  // Fetch files from S3
  const fetchFiles = async () => {
    const res = await fetch('/api/s3/list');
    const data = await res.json();
    setFiles(data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload file to S3
  const uploadFile = async () => {
    if (!selectedFile) return;

    const res = await fetch('/api/s3/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName: selectedFile.name,
        fileType: selectedFile.type,
      }),
    });

    const { uploadURL } = await res.json();

    await fetch(uploadURL, {
      method: 'PUT',
      headers: {
        'Content-Type': selectedFile.type,
      },
      body: selectedFile,
    });

    fetchFiles();
    setSelectedFile(null);
  };

  // Delete file from S3
  const deleteFile = async (fileName) => {
    await fetch('/api/s3/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileName }),
    });

    fetchFiles();
  };

  const copyLink = (fileURL) => {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(fileURL).then(() => {
          setCopySuccess(fileURL); // Indicate the text has been copied
          alert('Url copied to the clipboard');
          setTimeout(() => setCopySuccess(null), 2000); // Clear success message after 2 seconds
        }).catch(err => {
          console.error('Failed to copy: ', err);
        });
      } catch (err) {
        console.error('Failed to execute clipboard command: ', err);
      }
    } else {
      console.warn('Clipboard API not available');
      alert('Please update your browser.')
      // Optionally provide a fallback method here
    }
  };

  const [searchQuery, setSearchQuery] = useState('');

  // Function to filter files based on the search query
  const filteredFiles = files.filter((file) =>
    file.key.toLowerCase().includes(searchQuery.toLowerCase())
  );
  

  return (
    <div className="space-y-6">
      {/* File Upload */}
      {/*<div className="flex items-center space-x-4">
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          className="block w-full text-sm text-gray-500 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
        />
        <button
          onClick={uploadFile}
          className="px-4 py-2 bg-slate-600 text-white font-semibold rounded-lg hover:bg-slate-700"
        >
          Upload
        </button>
      </div>*/}

      {/* File List */}

      <div className='w-full'>
      {/* Search bar */}
      <input
        type="text"
        placeholder='Search...'
        className='py-1 px-3 focus:outline-none bg-slate-100 w-full'
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)} // Update search query
      />

      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Uploaded Files</h2>

        {/* File list filtered by the search query */}
        <div className="space-y-3 w-full flex gap-5 flex-wrap justify-around max-h-screen overflow-x-scroll">
          {filteredFiles.map((file) => (
            <div
              onClick={() => {
                copyLink(`https://neocreative.s3.eu-north-1.amazonaws.com/${file.key}`);
              }}
              key={file.key}
              className="flex scale-100 hover:scale-105 ease-in-out duration-300 cursor-pointer w-1/5 flex-col justify-between items-center p-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <img
                src={`https://neocreative.s3.eu-north-1.amazonaws.com/${file.key}`}
                className='w-full'
                alt=""
              />
              <div className="text-gray-800 w-full flex gap-2 flex-col">
                <div className='text-nowrap overflow-hidden'>{file.key}</div>
                <div className='flex w-full p-0 text-xs justify-between'>
                  <div className='text-nowrap overflow-hidden'>
                    {new Date(file.lastModified).toLocaleDateString()}
                  </div>
                  <div className='text-nowrap overflow-hidden'>
                    {(file.size / 1000000).toFixed(1)} MB
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  );
}
