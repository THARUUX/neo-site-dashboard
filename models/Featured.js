import mongoose, { model, models, Schema } from "mongoose";

const FeaturedSchema = new Schema({
  product: String,
  description: String,
  image: String,
}, {
  timestamps: true,
});

export const Featured = models?.Featured || model('Featured', FeaturedSchema);
