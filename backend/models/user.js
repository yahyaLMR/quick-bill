const mongoose = require('mongoose');
const invoice = require('./invoice');
const settings = require('./settings');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String, default: '' },
    settings: { type: Schema.Types.ObjectId, ref: 'Settings' },
    invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
});

module.exports = mongoose.model('User', userSchema);