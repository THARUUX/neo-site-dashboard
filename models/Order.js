import mongoose, { model, models, Schema } from "mongoose";

const OrderSchema = new Schema({
  line_items: Object,
  name: String,
  contactNumber: String,
  city: String,
  district: String,
  streetAddress: String,
  pickupFromStore: String,
  deliveryFee: String,
  total: String,
  Final: String,
  weightTotal: String,
  paid: Boolean,
  status: String,
}, {
  timestamps: true,
});

export const Order = models?.Order || model('Order', OrderSchema);
