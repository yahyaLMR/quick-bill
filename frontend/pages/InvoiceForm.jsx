import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../src/lib/api';
import {
  IconFileInvoice,
  IconUser,
  IconPlus,
  IconTrash,
  IconEye,
  IconDeviceFloppy,
  IconX,
  IconDownload,
} from '@tabler/icons-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import InvoicePDF from '../src/components/InvoicePDF';

/**
 * InvoiceForm Component
 * 
 * Purpose: Create new invoices with line items, VAT calculations, and preview
 * 
 * Data Sources:
 * - Settings (sessionStorage: 'appSettings') - VAT config, currency, numbering
 * - Clients (sessionStorage: 'clients') - Client picker dropdown
 * - Invoices (sessionStorage: 'invoices') - Auto-increment invoice numbers
 * 
 * Features:
 * - Dynamic line items with add/remove
 * - Global VAT rate applied to subtotal
 * - Discount support (global)
 * - Live preview before saving
 * - Auto-numbered invoices based on settings
 * 
 * VAT Calculation:
 * - Apply single VAT rate to subtotal after discount
 */
const InvoiceForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // Load settings and clients from backend
  const [settings, setSettings] = useState({
    vatEnabled: true,
    vatRate: 0.2,
    currency: 'DH',
    numberingPrefix: 'INV',
    zeroPadding: 4,
    companyName: 'Your Company',
    companyAddress: 'Your Address',
    companyICE: 'Your ICE',
  });
  const [clients, setClients] = useState([]);
  const [nextNumber, setNextNumber] = useState(1);

  // Fetch initial data (settings, clients, invoices)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, clientsRes, invoicesRes] = await Promise.all([
          api.get('/settings'),
          api.get('/clients'),
          api.get('/invoices')
        ]);
        
        setSettings(settingsRes.data);
        setClients(clientsRes.data);
        
        const existingInvoices = invoicesRes.data;
        // Calculate next number based on existing invoices count or max ID logic if applicable
        // Assuming simple count + 1 for now or parsing the last number
        // Ideally backend should handle numbering
        const maxId = existingInvoices.length > 0 
          ? Math.max(...existingInvoices.map(inv => parseInt(inv.number.split('-').pop()) || 0)) 
          : 0;
        setNextNumber(maxId + 1);

      } catch (error) {
        console.error('Error fetching data:', error);
         localStorage.removeItem("token");
        navigate('/login');
      }
    };
    fetchData();
  }, [navigate]);

  const [formData, setFormData] = useState({
    clientName: '',
    clientAddress: '',
    clientICE: '',
    dueDate: '',
    notes: '',
    discount: 0,
    items: [
      {
        description: '',
        quantity: 1,
        unitPrice: 0,
      },
    ],
  });

  // Handle duplicate invoice data
  useEffect(() => {
    if (location.state?.duplicateInvoice) {
      const { duplicateInvoice } = location.state;

      // Calculate discount if not present
      let discount = duplicateInvoice.discount || 0;
      if (!discount && duplicateInvoice.items && duplicateInvoice.subtotal) {
        const itemsTotal = duplicateInvoice.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        if (itemsTotal > 0 && duplicateInvoice.subtotal < itemsTotal) {
          // Round to 2 decimal places to avoid floating point issues
          discount = Math.round(((itemsTotal - duplicateInvoice.subtotal) / itemsTotal) * 100 * 100) / 100;
        }
      }

      setFormData(prev => ({
        ...prev,
        clientName: duplicateInvoice.clientName || '',
        clientAddress: duplicateInvoice.clientAddress || '',
        clientICE: duplicateInvoice.clientICE || '',
        dueDate: '', // Reset due date
        notes: duplicateInvoice.notes || '',
        discount: discount,
        items: duplicateInvoice.items?.map(item => ({
          description: item.description || '',
          quantity: item.quantity || 1,
          unitPrice: item.unitPrice || 0,
        })) || [{ description: '', quantity: 1, unitPrice: 0 }],
      }));
    }
  }, [location.state]);

  const [showPreview, setShowPreview] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const previewRef = useRef(null);

  const currency = settings.currency || 'DH';

  // Client picker
  const pickClient = (id) => {
    const client = clients.find((c) => String(c._id) === String(id));
    if (!client) return;
    setFormData({
      ...formData,
      clientName: client.name || '',
      clientAddress: client.address || '',
      clientICE: client.ice || '',
    });
  };

  // Item management
  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          description: '',
          quantity: 1,
          unitPrice: 0,
        },
      ],
    });
  };

  const removeItem = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  // ============================================
  // CALCULATION FUNCTIONS
  // ============================================
  
  /**
   * Calculate total for a single line item
   * Returns quantity × unit price
   */
  const calcItemTotal = (item) => {
    return (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
  };

  /**
   * Calculate invoice subtotal (before VAT)
   * Sum all items, then apply global discount
   */
  const calculateSubtotal = () => {
    const base = formData.items.reduce(
      (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0),
      0
    );
    const discountAmount = base * ((Number(formData.discount) || 0) / 100);
    return Math.max(base - discountAmount, 0);
  };

  /**
   * Calculate total VAT amount
   * Apply global VAT rate to subtotal
   */
  const calculateVAT = () => {
    if (!settings.vatEnabled) return 0;
    const rate = Number(settings.vatRate || 0.2);
    return calculateSubtotal() * rate;
  };

  const calculateTotal = () => calculateSubtotal() + calculateVAT();

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const now = new Date();
    const invoice = {
      number: `${settings.numberingPrefix}-${now.getFullYear()}-${String(nextNumber).padStart(settings.zeroPadding, '0')}`,
      date: now.toISOString().split('T')[0],
      dueDate: formData.dueDate,
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      clientICE: formData.clientICE,
      status: 'pending',
      items: formData.items,
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      total: calculateTotal(),
      notes: formData.notes,
    };

    try {
      await api.post('/invoices', invoice);
      
      // Reset form
      setFormData({
        clientName: '',
        clientAddress: '',
        clientICE: '',
        dueDate: '',
        notes: '',
        discount: 0,
        items: [
          {
            description: '',
            quantity: 1,
            unitPrice: 0,
          },
        ],
      });
      setShowPreview(false);
      setNextNumber(prev => prev + 1);
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error saving invoice:', error);
      setShowErrorMessage(true);
      setTimeout(() => setShowErrorMessage(false), 3000);
    }
  };

  // Display number for preview
  const getDisplayNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const padded = String(nextNumber).padStart(3, '0');
    return `FAC-${year}-${padded}`;
  };

  // Preview mode
  if (showPreview) {
    const now = new Date();
    const displayNumber = getDisplayNumber();

    const invoiceForPDF = {
      number: displayNumber,
      date: now.toISOString(),
      dueDate: formData.dueDate,
      clientName: formData.clientName,
      clientAddress: formData.clientAddress,
      clientICE: formData.clientICE,
      items: formData.items,
      subtotal: calculateSubtotal(),
      vat: calculateVAT(),
      total: calculateTotal(),
      notes: formData.notes,
    };

    return (
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8" ref={previewRef}>
            <h2 className="text-3xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-8">
              INVOICE
            </h2>

            {/* Header */}
            <div className="flex justify-between mb-8 pb-6 border-b border-neutral-200 dark:border-neutral-700">
              <div>
                <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Seller</h3>
                {settings.logoDataUrl && (
                  <img src={settings.logoDataUrl || null} alt="logo" loading="lazy" className="h-10 mb-2" />
                )}
                <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                  {settings.companyName || 'Your Company'}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300 whitespace-pre-line">
                  {settings.companyAddress || 'Your Address'}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  ICE: {settings.companyICE || 'Your ICE'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-neutral-900 dark:text-neutral-100">
                  Invoice № {displayNumber}
                </p>
                <p className="text-neutral-700 dark:text-neutral-300">
                  Date: {now.toLocaleDateString()}
                </p>
                {formData.dueDate && (
                  <p className="text-neutral-700 dark:text-neutral-300">
                    Due Date: {new Date(formData.dueDate).toLocaleDateString()}
                  </p>
                )}
                <p className="text-neutral-700 dark:text-neutral-300">Currency: {currency}</p>
              </div>
            </div>

            {/* Buyer */}
            <div className="mb-8">
              <h3 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Buyer</h3>
              <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                {formData.clientName}
              </p>
              <p className="text-neutral-700 dark:text-neutral-300">{formData.clientAddress}</p>
              <p className="text-neutral-700 dark:text-neutral-300">ICE: {formData.clientICE}</p>
            </div>

            {/* Items Table */}
            <table className="w-full mb-8">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Description
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Unit Price ({currency})
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Total ({currency})
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {formData.items.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                      {item.description}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">
                      {Number(item.unitPrice).toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                      {calcItemTotal(item).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="flex justify-end mb-8">
              <div className="w-80">
                <div className="flex justify-between py-2 text-neutral-700 dark:text-neutral-300">
                  <span>Subtotal:</span>
                  <span className="font-semibold">
                    {calculateSubtotal().toFixed(2)} {currency}
                  </span>
                </div>
                {settings.vatEnabled && (
                  <div className="flex justify-between py-2 text-neutral-700 dark:text-neutral-300">
                    <span>
                      VAT ({Math.round((settings.vatRate || 0.2) * 100)}%):
                    </span>
                    <span className="font-semibold">
                      {calculateVAT().toFixed(2)} {currency}
                    </span>
                  </div>
                )}
                <div className="flex justify-between py-3 border-t border-neutral-200 dark:border-neutral-700 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  <span>Total:</span>
                  <span>
                    {calculateTotal().toFixed(2)} {currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Notes */}
            {formData.notes && (
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                <h5 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">Notes:</h5>
                <p className="text-neutral-700 dark:text-neutral-300">{formData.notes}</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setShowPreview(false)}
              className="flex items-center gap-2 px-6 py-2 bg-neutral-500 hover:bg-neutral-600 text-white rounded-lg transition-colors"
            >
              <IconX className="h-5 w-5" />
              Cancel
            </button>

            <PDFDownloadLink
              document={<InvoicePDF invoice={invoiceForPDF} settings={settings} />}
              fileName={`invoice_${displayNumber}.pdf`}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              {({ blob, url, loading, error }) => (
                <>
                  <IconDownload className="h-5 w-5" />
                  {loading ? 'Generating...' : 'Download PDF'}
                </>
              )}
            </PDFDownloadLink>

            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <IconDeviceFloppy className="h-5 w-5" />
              Save Invoice
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Form view
  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3">
            <IconFileInvoice className="h-8 w-8 text-neutral-700 dark:text-neutral-200" />
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Create New Invoice
            </h1>
          </div>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Invoice № {String(nextNumber).padStart(settings.zeroPadding || 4, '0')}
          </p>
        </div>

        {showSuccessMessage && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
            <p className="text-green-800 dark:text-green-200 font-medium">
              ✓ Invoice saved successfully!
            </p>
          </div>
        )}

        {showErrorMessage && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg">
            <p className="text-red-800 dark:text-red-200 font-medium">
              ⚠ Error saving invoice. Please try again.
            </p>
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            setShowPreview(true);
          }}
        >
          {/* Client Information */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <IconUser className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
              <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
                Client Information
              </h2>
            </div>

            {/* Client Picker */}
            {clients.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Choose Existing Client
                </label>
                <select
                  onChange={(e) => pickClient(e.target.value)}
                  defaultValue=""
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="" disabled>
                    Select a client...
                  </option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Due Date
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.clientAddress}
                  onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  ICE Number
                </label>
                <input
                  type="text"
                  value={formData.clientICE}
                  onChange={(e) => setFormData({ ...formData, clientICE: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-4">
              Items / Services
            </h2>

            <div className="space-y-4">
              {formData.items.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                >
                  <div className="md:col-span-4">
                    <input
                      type="text"
                      placeholder="Description"
                      required
                      value={item.description}
                      onChange={(e) => updateItem(index, 'description', e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Qty"
                      required
                      min="1"
                      value={(item.quantity ?? 1).toString()}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        const qty = isNaN(value) ? 1 : Math.max(1, value);
                        updateItem(index, 'quantity', qty);
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <input
                      type="number"
                      placeholder="Unit Price"
                      required
                      min="0"
                      step="0.01"
                      value={(item.unitPrice ?? 0).toString()}
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        const price = isNaN(value) ? 0 : Math.max(0, value);
                        updateItem(index, 'unitPrice', price);
                      }}
                      className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="md:col-span-4">
                    <div className="flex items-center gap-2 h-full">
                      <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {calcItemTotal(item).toFixed(2)} {currency}
                      </span>
                      {formData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(index)}
                          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="Remove item"
                        >
                          <IconTrash className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addItem}
              className="flex items-center gap-2 mt-4 px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors"
            >
              <IconPlus className="h-5 w-5" />
              Add Item
            </button>
          </div>

          {/* Additional Details */}
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Global Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={(formData.discount ?? 0).toString()}
                  onChange={(e) => {
                    const percent = parseFloat(e.target.value);
                    const discount = isNaN(percent) ? 0 : Math.max(0, Math.min(100, percent));
                    setFormData({ ...formData, discount });
                  }}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Notes
                </label>
                <textarea
                  rows="3"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Totals Summary */}
          <div className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-200 dark:border-blue-700 p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                <span>Subtotal:</span>
                <strong className="text-neutral-900 dark:text-neutral-100">
                  {calculateSubtotal().toFixed(2)} {currency}
                </strong>
              </div>
              <div className="flex justify-between text-neutral-700 dark:text-neutral-300">
                <span>VAT:</span>
                <strong className="text-neutral-900 dark:text-neutral-100">
                  {calculateVAT().toFixed(2)} {currency}
                </strong>
              </div>
              <div className="flex justify-between text-xl font-bold text-blue-600 dark:text-blue-400 pt-3 border-t-2 border-blue-300 dark:border-blue-600">
                <span>Total:</span>
                <span>
                  {calculateTotal().toFixed(2)} {currency}
                </span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium rounded-lg transition-colors"
            >
              <IconEye className="h-6 w-6" />
              Preview Invoice
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvoiceForm;
