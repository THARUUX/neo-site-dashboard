import { mongooseConnect } from "@/lib/mongoose";
import { Order } from "@/models/Order";

export default async function handler(req, res) {
  const { method } = req;

  await mongooseConnect();

  switch (method) {
    case 'PUT':
      return handlePutRequest(req, res);
    case 'GET':
      const { id } = req.query;
      if (id) {
        return handleGetOrderById(req, res, id);
      } else {
        return handleGetAllOrders(req, res);
      }
    case 'DELETE':
      const { id: deleteId } = req.query;
      if (deleteId) {
        return handleDeleteOrderById(req, res, deleteId);
      } else {
        return res.status(400).json({ error: 'Missing order ID' });
      }
    default:
      res.setHeader('Allow', ['PUT', 'GET', 'DELETE']);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}

async function handlePutRequest(req, res) {
  const { id, status } = req.body;

  if (!id) {
    return res.status(400).json({ error: 'Missing order ID' });
  }

  try {
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetAllOrders(req, res) {
  try {
    const orders = await Order.find({}, null, { sort: { '_id': -1 }});
    return res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleGetOrderById(req, res) {
  try {
    const id = req.query.id; // Assuming 'id' is passed in query parameters
    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function handleDeleteOrderById(req, res) {
  try {
    const id = req.query.id;
    const order = await Order.findByIdAndDelete(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    return res.status(200).json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
