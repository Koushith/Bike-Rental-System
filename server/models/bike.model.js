import mongoose from 'mongoose';

const bikeSchema = new mongoose.Schema({
  bikeId: { type: String, required: true, unique: true },
  bikeName: { type: String, required: true },
  isAvailable: { type: Boolean, default: true },
});

bikeSchema.index({ bikeId: 1 }, { unique: true });

bikeSchema.path('bikeId').validate(async function (value) {
  const bike = await this.constructor.findOne({ bikeId: value });
  return !bike;
}, 'Bike ID already exists');

const Bike = mongoose.model('Bike', bikeSchema);

export default Bike;
