import  { Schema, Document, model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const userModel = model<IUser>('User', userSchema);

export default userModel;
