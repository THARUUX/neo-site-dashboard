import { mongooseConnect } from "@/lib/mongoose";
import { Featured } from "@/models/Featured";

export default async function handle(req, res) {
    const {method} = req;
    await mongooseConnect();

    if (method == 'POST') {
      const {product, description, image} = req.body;
      const FeaturedDoc = await Featured.create({
        product, description, image,
      })
      res.json(FeaturedDoc);
    }

    if (method === 'GET') {
      if (req.query?.id) {
        res.json(await Featured.findOne({_id:req.query.id}));
      } else if(req.query?.title){
        res.json(await Featured.findOne({title:req.query.title}));
      }
      res.json(await Featured.find());
    }

    if (method === 'PUT'){
      const {product, description, image} = req.body;
      await Featured.updateOne({_id}, {product, description, image});
    }

}