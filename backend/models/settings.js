const mongoose = require('mongoose');
const user = require('./user');
const Schema = mongoose.Schema;

const settingsSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    companyName: { type: String, default: '' },
    companyAddress: { type: String, default: '' },
    companyICE: { type: String, default: '' },
    logoDataUrl: { type: String, default: '' },
    vatEnabled: { type: Boolean, default: true },
    vatRate: { type: Number, default: 0.2 }, // 20%
    currency: { type: String, default: 'DH' },
    numberingPrefix: { type: String, default: 'INV' },
    zeroPadding: { type: Number, default: 4 },
    resetNumberYearly: { type: Boolean, default: true },
    businessType: { type: String, enum: ['services', 'commerce'], default: 'services' },
    monthlyCap: { type: Number, default: 200000 }
});

module.exports = mongoose.model('Settings', settingsSchema);