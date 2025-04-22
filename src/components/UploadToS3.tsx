import React, { useState } from 'react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const UploadToS3 = () => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first');
      return;
    }

    setUploading(true);
    setMessage('Uploading...');

    // הגדרת הלקוח של S3
    const s3 = new S3Client({
      region: 'us-east-1', // החלף לאזור שלך
      credentials: {
        accessKeyId: 'YOUR_ACCESS_KEY', // הכנס את המפתח שלך
        secretAccessKey: 'YOUR_SECRET_KEY', // הכנס את המפתח הסודי שלך
      },
    });

    // פרמטרים להעלאת הקובץ ל-S3
    const uploadParams = {
      Bucket: 'your-bucket-name', // שם ה-bucket שלך
      Key: file.name, // שם הקובץ ב-S3
      Body: file, // הגוף הוא הקובץ עצמו
      ContentType: file.type, // סוג התוכן של הקובץ
      ACL: 'public-read', // אם אתה רוצה שהקובץ יהיה ציבורי
    };

    try {
      // העלאת הקובץ ל-S3
      const data = await s3.send(new PutObjectCommand(uploadParams));
      setMessage('File uploaded successfully!');
    } catch (err) {
      console.error('Error uploading file:', err);
      setMessage('Error uploading file.');
    }

    setUploading(false);
  };

  return (
    <div>
      <h2>Upload File to S3</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? 'Uploading...' : 'Upload'}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadToS3;
