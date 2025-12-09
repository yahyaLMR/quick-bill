const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const invoiceSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    number: { type: String, required: true },
    date: { type: Date, required: true },
    dueDate: { type: Date },
    clientName: { type: String, required: true },
    clientAddress: { type: String },
    clientICE: { type: String },
    status: { type: String, enum: ['paid', 'pending', 'overdue', 'draft', 'cancelled'], default: 'pending' },
    items: [{
        description: { type: String, required: true },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true }
    }],
    subtotal: { type: Number, required: true },
    vat: { type: Number, default: 0 },
    total: { type: Number, required: true },
    notes: { type: String }
});
module.exports = mongoose.model('Invoice', invoiceSchema);