import { mongooseConnect } from "@/lib/mongoose";
import {Product} from "@/models/Product";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method == 'POST') {
      const {title, description, weight, stock, price, images, category} = req.body;
      console.log({images});
      const productDoc = await Product.create({
        title, description, weight, stock, price, images, category,
      })
      res.json(productDoc);
    }

    if (method === 'GET') {
      if (req.query?.id) {
        res.json(await Product.findOne({_id:req.query.id}));
      } else if(req.query?.title){
        res.json(await Product.findOne({title:req.query.title}));
      }
      res.json(await Product.find());
    }

    if (method === 'PUT'){
      const {title, description, weight, stock, price, _id, images, category} = req.body;
      await Product.updateOne({_id}, {title, description, weight, stock, price, images, category});
      console.log('image', images);
      res.json(true);
    }

    if (method === 'DELETE') {
      if (req.query?.id) {
        await Product.deleteOne({_id:req.query?.id});
      }
    }
}