import React, { useState, useEffect } from 'react';
import { IconUserPlus, IconEdit, IconTrash } from '@tabler/icons-react';

/**
 * Clients Component
 * 
 * Purpose: Manage client records with CRUD operations
 * Storage: SessionStorage (key: 'clients')
 * Used by: InvoiceForm (client picker), Invoices (client data)
 * 
 * Data Structure:
 * {
 *   id: number,
 *   name: string,
 *   address: string,
 *   ice: string (ICE tax identification number)
 * }
 */
const Clients = () => {
  // Initialize clients from sessionStorage or use default sample data
  const [clients, setClients] = useState(() => {
    const savedClients = sessionStorage.getItem('clients');
    if (savedClients) {
      return JSON.parse(savedClients);
    }
    return [
      { id: 1, name: 'John Doe', address: '123 Main St, New York, NY 10001', ice: 'ICE001234567890' },
      { id: 2, name: 'Jane Smith', address: '456 Oak Ave, Los Angeles, CA 90001', ice: 'ICE002345678901' },
      { id: 3, name: 'Bob Johnson', address: '789 Pine Rd, Chicago, IL 60601', ice: 'ICE003456789012' },
    ];
  });

  // ============================================
  // DATA PERSISTENCE
  // ============================================
  // Auto-save to sessionStorage whenever clients array changes
  // This ensures InvoiceForm always has up-to-date client list
  useEffect(() => {
    sessionStorage.setItem('clients', JSON.stringify(clients));
  }, [clients]);

  // ============================================
  // FORM STATE MANAGEMENT
  // ============================================
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    ice: '',
  });

  // Track which client is being edited (null = add new)
  const [editingId, setEditingId] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.address && formData.ice) {
      if (editingId) {
        // Update existing client
        setClients(prev => prev.map(client => 
          client.id === editingId ? { ...client, ...formData } : client
        ));
        setEditingId(null);
      } else {
        // Add new client
        const newClient = {
          id: clients.length > 0 ? Math.max(...clients.map(c => c.id)) + 1 : 1,
          ...formData
        };
        setClients(prev => [...prev, newClient]);
      }
      setFormData({ name: '', address: '', ice: '' });
    }
  };

  const handleChange = (client) => {
    setFormData({
      name: client.name,
      address: client.address,
      ice: client.ice
    });
    setEditingId(client.id);
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = (id) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-100">Clients</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">Manage your client information</p>
        </div>

        {/* Form Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <IconUserPlus className="h-6 w-6 text-neutral-700 dark:text-neutral-200" />
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">
              {editingId ? 'Edit Client' : 'Add New Client'}
            </h2>
          </div>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Client Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter client name"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter client address"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="ice" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                ICE Number
              </label>
              <input
                type="text"
                id="ice"
                name="ice"
                value={formData.ice}
                onChange={handleInputChange}
                placeholder="Enter ICE number"
                className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div className="md:col-span-3 flex justify-end gap-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ name: '', address: '', ice: '' });
                  }}
                  className="flex items-center gap-2 px-6 py-2 bg-neutral-500 hover:bg-neutral-600 text-white font-medium rounded-lg transition-colors duration-200"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
              >
                <IconUserPlus className="h-5 w-5" />
                {editingId ? 'Update Client' : 'Add Client'}
              </button>
            </div>
          </form>
        </div>

        {/* Table Section */}
        <div className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100">Registered Clients</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
              {clients.length} {clients.length === 1 ? 'client' : 'clients'} registered
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    ICE Number
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-neutral-500 dark:text-neutral-400">
                      No clients registered yet. Add your first client above.
                    </td>
                  </tr>
                ) : (
                  clients.map((client) => (
                    <tr key={client.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100">
                        #{client.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {client.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-neutral-700 dark:text-neutral-300">
                        {client.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-700 dark:text-neutral-300">
                        {client.ice}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleChange(client)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mr-3 transition-colors"
                          title="Edit client"
                        >
                          <IconEdit className="h-5 w-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDelete(client.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                          title="Delete client"
                        >
                          <IconTrash className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Clients;
