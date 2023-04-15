import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

adminSchema.index({ email: 1 }, { unique: true });

const Admin = mongoose.model('Admin', adminSchema);

export default Admin;
