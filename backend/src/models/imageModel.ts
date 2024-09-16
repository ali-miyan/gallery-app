import { Schema, model, Document } from 'mongoose';

interface IImage extends Document {
  userId: Schema.Types.ObjectId;
  order: number;
  title: string;
  url: string;
}

const imageSchema = new Schema<IImage>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  order: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
}, { timestamps: true });

const ImageModel = model<IImage>('Image', imageSchema);

export default ImageModel;
