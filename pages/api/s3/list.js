// pages/api/s3/list.js
import { S3 } from 'aws-sdk';

export default async function handler(req, res) {
  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
  };

  try {
    const data = await s3.listObjectsV2(s3Params).promise();
    const files = data.Contents.map((item) => ({
      key: item.Key,
      lastModified: item.LastModified,
      size: item.Size,
    }));
    res.status(200).json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to list files' });
  }
}
