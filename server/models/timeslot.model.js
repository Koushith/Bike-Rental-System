import mongoose from 'mongoose';

const timeslotSchema = new mongoose.Schema({
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  isAvailable: { type: Boolean, default: true },
});

timeslotSchema.index({ startTime: 1, endTime: 1 }, { unique: true });

timeslotSchema.path('endTime').validate(function (value) {
  return value > this.startTime;
}, 'End time must be after start time');

const Timeslot = mongoose.model('Timeslot', timeslotSchema);

export default Timeslot;
