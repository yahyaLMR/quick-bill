import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../src/lib/api';
import {
  IconFileInvoice,
  IconDownload,
  IconEye,
  IconEdit,
  IconCopy,
  IconTrash,
  IconChevronDown,
  IconX,
  IconFilter,
  IconSearch,
} from '@tabler/icons-react';

/**
 * Invoices Component
 * 
 * Purpose: Display and manage invoice list with advanced filtering and actions
 * Storage: SessionStorage (key: 'invoices')
 * Created by: InvoiceForm component
 * 
 * Features:
 * - Filter by status (paid, pending, overdue, all)
 * - Search by client name or invoice number
 * - Sort by date, total, status
 * - View invoice details in modal
 * - Edit invoice information
 * - Duplicate existing invoices
 * - Delete invoices
 * - Export to CSV
 * - Statistics dashboard (total, paid, pending, overdue)
 * 
 * Invoice Data Structure:
 * {
 *   id, number, date, dueDate,
 *   clientName, clientAddress, clientICE,
 *   status ('paid' | 'pending' | 'overdue'),
 *   items: [{ description, quantity, unitPrice, taxRate, discount }],
 *   subtotal, vat, total, notes
 * }
 */
const Invoices = () => {
  const navigate = useNavigate();
  // Load invoices from backend
  const [invoices, setInvoices] = useState([]);
  const [settings, setSettings] = useState({
    companyName: '',
    companyAddress: '',
    companyICE: '',
    currency: 'DH',
    logoDataUrl: '',
  });

  // Fetch invoices and settings on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesRes, settingsRes] = await Promise.all([
          api.get('/invoices'),
          api.get('/settings')
        ]);
        setInvoices(invoicesRes.data);
        setSettings(settingsRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewInvoice, setViewInvoice] = useState(null);
  const [editInvoice, setEditInvoice] = useState(null);
  const [expandedActions, setExpandedActions] = useState(null);

  const currency = settings.currency || 'DH';

  // ============================================
  // FILTERING & SORTING LOGIC
  // ============================================
  // Uses useMemo for performance optimization
  // Recalculates only when dependencies change
  const filteredInvoices = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let list = invoices;

    // Time filter
    if (filter === 'month') {
      list = list.filter((inv) => {
        const d = new Date(inv.date);
        return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
      });
    } else if (filter === 'year') {
      list = list.filter((inv) => new Date(inv.date).getFullYear() === currentYear);
    }

    // Status filter
    if (statusFilter !== 'all') {
      list = list.filter((inv) => (inv.status || 'pending') === statusFilter);
    }

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (inv) =>
          (inv.clientName || '').toLowerCase().includes(q) ||
          (inv.number || '').toLowerCase().includes(q)
      );
    }

    // Sort
    list = [...list].sort((a, b) => {
      let vA, vB;
      if (sortKey === 'amount') {
        vA = a.total;
        vB = b.total;
      } else if (sortKey === 'number') {
        vA = a.number;
        vB = b.number;
      } else {
        vA = new Date(a.date).getTime();
        vB = new Date(b.date).getTime();
      }
      return sortDir === 'asc' ? vA - vB : vB - vA;
    });

    return list;
  }, [invoices, filter, search, sortKey, sortDir, statusFilter]);

  // Statistics
  const stats = useMemo(() => {
    const count = filteredInvoices.length;
    const total = filteredInvoices.reduce((s, i) => s + (Number(i.total) || 0), 0);
    const paid = filteredInvoices.filter((i) => (i.status || 'pending') === 'paid').length;
    const pending = filteredInvoices.filter((i) => (i.status || 'pending') === 'pending').length;
    const overdue = filteredInvoices.filter((i) => (i.status || 'pending') === 'overdue').length;
    return { count, total, paid, pending, overdue };
  }, [filteredInvoices]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      try {
        await api.delete(`/invoices/${id}`);
        setInvoices(prev => prev.filter((inv) => inv._id !== id));
      } catch (error) {
        console.error('Error deleting invoice:', error);
        localStorage.removeItem("token");
        navigate('/login');
      }
    }
  };

  const handleDuplicate = (id) => {
    const invoice = invoices.find((inv) => inv._id === id);
    if (invoice) {
      navigate('/invoice-form', { state: { duplicateInvoice: invoice } });
    }
  };

  const handleUpdateInvoice = async (id, updates) => {
    try {
      await api.put(`/invoices/${id}`, updates);
      setInvoices((prev) =>
        prev.map((inv) => (inv._id === id ? { ...inv, ...updates } : inv))
      );
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const exportToCSV = () => {
    const headers = ['Number', 'Date', 'Client', 'Status', `Amount (${currency})`];
    const rows = filteredInvoices.map((inv) => [
      inv.number,
      new Date(inv.date).toLocaleDateString(),
      inv.clientName,
      inv.status || 'pending',
      inv.total.toFixed(2),
    ]);
    const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoices_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const saveEdit = () => {
    if (!editInvoice) return;
    handleUpdateInvoice(editInvoice._id, {
      clientName: editInvoice.clientName,
      clientAddress: editInvoice.clientAddress,
      clientICE: editInvoice.clientICE,
      notes: editInvoice.notes,
      dueDate: editInvoice.dueDate,
      status: editInvoice.status,
    });
    setEditInvoice(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <IconFileInvoice className="h-8 w-8 text-neutral-700 dark:text-neutral-200" />
            <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">
              Invoice List
            </h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Invoices</div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.count}
              </div>
            </div>
            <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Amount</div>
              <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                {stats.total.toFixed(2)} {currency}
              </div>
            </div>
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-700 p-4">
              <div className="text-sm text-green-600 dark:text-green-400">Paid</div>
              <div className="text-2xl font-bold text-green-700 dark:text-green-300">
                {stats.paid}
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-700 p-4">
              <div className="text-sm text-yellow-600 dark:text-yellow-400">Pending</div>
              <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
                {stats.pending}
              </div>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700 p-4">
              <div className="text-sm text-red-600 dark:text-red-400">Overdue</div>
              <div className="text-2xl font-bold text-red-700 dark:text-red-300">
                {stats.overdue}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by client or number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="overdue">Overdue</option>
              </select>

              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">By Date</option>
                <option value="amount">By Amount</option>
                <option value="number">By Number</option>
              </select>

              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value)}
                className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="desc">↓ Descending</option>
                <option value="asc">↑ Ascending</option>
              </select>

              <button
                onClick={exportToCSV}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <IconDownload className="h-5 w-5" />
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Invoices Table */}
        {filteredInvoices.length === 0 ? (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-12 text-center">
            <IconFileInvoice className="h-16 w-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <p className="text-neutral-500 dark:text-neutral-400 text-lg">
              No invoices registered
            </p>
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 ">
            <div className="">
              <table className="w-full">
                <thead className="bg-neutral-50 dark:bg-neutral-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                  {filteredInvoices.map((invoice) => (
                    <tr
                      key={invoice._id}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        #{invoice.number}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                        {new Date(invoice.date).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                        {invoice.clientName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <select
                          value={invoice.status || 'pending'}
                          onChange={(e) =>
                            handleUpdateInvoice(invoice._id, { status: e.target.value })
                          }
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            invoice.status || 'pending'
                          )} border-0 cursor-pointer`}
                        >
                          <option value="pending">Pending</option>
                          <option value="paid">Paid</option>
                          <option value="overdue">Overdue</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-900 dark:text-neutral-100">
                        {invoice.total.toFixed(2)} {currency}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                        <div className="relative inline-block">
                          <button
                            onClick={() =>
                              setExpandedActions(
                                expandedActions === invoice._id ? null : invoice._id
                              )
                            }
                            className="flex items-center gap-1 px-3 py-1 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                          >
                            Actions
                            <IconChevronDown className="h-4 w-4" />
                          </button>

                          {expandedActions === invoice._id && (
                            <>
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setExpandedActions(null)}
                              />
                              <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-20">
                                <button
                                  onClick={() => {
                                    setViewInvoice(invoice);
                                    setExpandedActions(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                  <IconEye className="h-4 w-4" />
                                  Preview
                                </button>
                                <button
                                  onClick={() => {
                                    setEditInvoice(invoice);
                                    setExpandedActions(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                  <IconEdit className="h-4 w-4" />
                                  Edit
                                </button>
                                <button
                                  onClick={() => {
                                    handleDuplicate(invoice._id);
                                    setExpandedActions(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                                >
                                  <IconCopy className="h-4 w-4" />
                                  Duplicate
                                </button>
                                <button
                                  onClick={() => {
                                    handleDelete(invoice._id);
                                    setExpandedActions(null);
                                  }}
                                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors rounded-b-lg"
                                >
                                  <IconTrash className="h-4 w-4" />
                                  Delete
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Invoice Modal */}
        {viewInvoice && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setViewInvoice(null)}
          >
            <div
              className="bg-white dark:bg-neutral-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Invoice #{viewInvoice.number}
                </h3>
                <button
                  onClick={() => setViewInvoice(null)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6">
                {/* Company & Invoice Info */}
                <div className="flex justify-between mb-6 pb-6 border-b border-neutral-200 dark:border-neutral-700">
                  <div>
                    {settings.logoDataUrl && (
                      <img 
                        src={settings.logoDataUrl} 
                        alt="Company Logo" 
                        className="h-12 mb-2 object-contain" 
                      />
                    )}
                    <h4 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {settings.companyName}
                    </h4>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-line mt-1">
                      {settings.companyAddress}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      ICE: {settings.companyICE}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-neutral-600 dark:text-neutral-400">Date</div>
                    <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {new Date(viewInvoice.date).toLocaleDateString('fr-FR')}
                    </div>
                    {viewInvoice.dueDate && (
                      <>
                        <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          Due Date
                        </div>
                        <div className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {new Date(viewInvoice.dueDate).toLocaleDateString('fr-FR')}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Client Info */}
                <div className="mb-6">
                  <h5 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                    Billed To:
                  </h5>
                  <div className="text-neutral-700 dark:text-neutral-300">
                    <div className="font-semibold">{viewInvoice.clientName}</div>
                    <div className="text-sm">{viewInvoice.clientAddress}</div>
                    <div className="text-sm">ICE: {viewInvoice.clientICE}</div>
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-6">
                  <table className="w-full">
                    <thead className="bg-neutral-50 dark:bg-neutral-800">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Description
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Qty
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Unit Price
                        </th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                      {viewInvoice.items.map((item, idx) => (
                        <tr key={idx}>
                          <td className="px-4 py-3 text-neutral-900 dark:text-neutral-100">
                            {item.description}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-3 text-right text-neutral-700 dark:text-neutral-300">
                            {Number(item.unitPrice).toFixed(2)} {currency}
                          </td>
                          <td className="px-4 py-3 text-right font-semibold text-neutral-900 dark:text-neutral-100">
                            {(Number(item.quantity) * Number(item.unitPrice)).toFixed(2)}{' '}
                            {currency}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-6">
                  <div className="w-64">
                    <div className="flex justify-between py-2 text-neutral-700 dark:text-neutral-300">
                      <span>Subtotal:</span>
                      <span className="font-semibold">
                        {Number(viewInvoice.subtotal).toFixed(2)} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-neutral-700 dark:text-neutral-300">
                      <span>VAT (20%):</span>
                      <span className="font-semibold">
                        {Number(viewInvoice.vat).toFixed(2)} {currency}
                      </span>
                    </div>
                    <div className="flex justify-between py-3 border-t border-neutral-200 dark:border-neutral-700 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      <span>Total:</span>
                      <span>
                        {Number(viewInvoice.total).toFixed(2)} {currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                {viewInvoice.notes && (
                  <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg p-4">
                    <h5 className="font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                      Notes:
                    </h5>
                    <p className="text-neutral-700 dark:text-neutral-300">
                      {viewInvoice.notes}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Edit Invoice Modal */}
        {editInvoice && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setEditInvoice(null)}
          >
            <div
              className="bg-white dark:bg-neutral-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700 p-6 flex justify-between items-center">
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  Edit Invoice #{editInvoice.number}
                </h3>
                <button
                  onClick={() => setEditInvoice(null)}
                  className="p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                >
                  <IconX className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Client Name
                  </label>
                  <input
                    type="text"
                    value={editInvoice.clientName || ''}
                    onChange={(e) =>
                      setEditInvoice({ ...editInvoice, clientName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editInvoice.clientAddress || ''}
                    onChange={(e) =>
                      setEditInvoice({ ...editInvoice, clientAddress: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    ICE
                  </label>
                  <input
                    type="text"
                    value={editInvoice.clientICE || ''}
                    onChange={(e) =>
                      setEditInvoice({ ...editInvoice, clientICE: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editInvoice.status || 'pending'}
                    onChange={(e) =>
                      setEditInvoice({ ...editInvoice, status: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    value={editInvoice.dueDate ? editInvoice.dueDate.split('T')[0] : ''}
                    onChange={(e) =>
                      setEditInvoice({ ...editInvoice, dueDate: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Notes
                  </label>
                  <textarea
                    rows={4}
                    value={editInvoice.notes || ''}
                    onChange={(e) =>
                      setEditInvoice({ ...editInvoice, notes: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-2 justify-end pt-4 border-t border-neutral-200 dark:border-neutral-700">
                  <button
                    onClick={() => setEditInvoice(null)}
                    className="px-6 py-2 bg-neutral-500 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Invoices;
