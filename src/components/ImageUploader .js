import React from 'react';
import axios from 'axios';

function ImageUploader({ onImageUploaded }) {
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post('http://localhost:8080/usr/article/uploadImage', formData);
      onImageUploaded(response.data.imageUrl); // 업로드된 이미지 URL을 부모 컴포넌트로 전달
    } catch (error) {
      console.error('Image upload failed:', error);
    }
  };

  return (
    <input type="file" accept="image/*" onChange={handleImageUpload} />
  );
}

export default ImageUploader;
