// pages/api/s3/delete.js
import { S3 } from 'aws-sdk';

export default async function handler(req, res) {
  const { fileName } = req.body;

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  };

  try {
    await s3.deleteObject(s3Params).promise();
    res.status(200).json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
}
