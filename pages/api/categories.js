import {Category} from "@/models/Category";
import {mongooseConnect} from "@/lib/mongoose";

export default async function handle(req, res) {
  const {method} = req;
  await mongooseConnect();
  //await isAdminRequest(req,res);

  if (method === 'GET') {
    res.json(await Category.find().populate('parent'));
  }

  if (method === 'POST') {
    const {name,description,image,parentCategory,properties} = req.body;
    const categoryDoc = await Category.create({
      name,
      description,
      image,
      parent: parentCategory || null,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === 'PUT') {
    const {name,description,image,parentCategory,properties,_id} = req.body;
    const categoryDoc = await Category.updateOne({_id},{
      name,
      description,
      image,
      parent: parentCategory || null,
      properties,
    });
    res.json(categoryDoc);
  }

  if (method === 'DELETE') {
    const {_id} = req.query;
    await Category.deleteOne({_id});
    res.json('ok');
  }

}


