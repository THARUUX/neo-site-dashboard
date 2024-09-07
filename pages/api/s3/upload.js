// pages/api/s3/upload.js
import { S3 } from 'aws-sdk';

export default async function handler(req, res) {
  const { fileName, fileType } = req.body;

  const s3 = new S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });

  const s3Params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Expires: 60, // Signed URL expiration (in seconds)
    ContentType: fileType,
  };

  try {
    const uploadURL = await s3.getSignedUrlPromise('putObject', s3Params);
    res.status(200).json({ uploadURL });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate upload URL' });
  }
}
