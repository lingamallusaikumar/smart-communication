'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Search, Edit, Trash2, CheckCircle, XCircle, DollarSign, Tag, BarChart2, RefreshCw } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  unitPrice: number;
  active: boolean;
  createdAt: string;
}

interface ProductStats {
  totalProducts: number;
  activeProducts: number;
  totalCatalogValue: number;
}

const DEMO_PRODUCTS: Product[] = [
  { id: '1', name: 'CRM Starter Plan', sku: 'CRM-STARTER-001', description: 'Basic CRM features for small teams up to 5 users', unitPrice: 49.99, active: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: '2', name: 'CRM Professional Plan', sku: 'CRM-PRO-002', description: 'Advanced CRM with automation, AI insights, and unlimited contacts', unitPrice: 149.99, active: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: '3', name: 'CRM Enterprise Plan', sku: 'CRM-ENT-003', description: 'Full suite with custom integrations, SLA support, and dedicated account manager', unitPrice: 499.99, active: true, createdAt: '2026-01-01T00:00:00Z' },
  { id: '4', name: 'Onboarding Service', sku: 'SVC-ONBOARD-001', description: 'Professional onboarding and setup assistance — 8 hours', unitPrice: 299.00, active: true, createdAt: '2026-01-05T00:00:00Z' },
  { id: '5', name: 'Custom Integration Development', sku: 'SVC-DEV-001', description: 'Custom API integration with your existing business systems (per day)', unitPrice: 850.00, active: true, createdAt: '2026-01-10T00:00:00Z' },
  { id: '6', name: 'Email Marketing Add-on', sku: 'ADD-EMAIL-001', description: 'Send up to 100,000 emails/month with advanced analytics', unitPrice: 79.99, active: true, createdAt: '2026-02-01T00:00:00Z' },
  { id: '7', name: 'WhatsApp Business Add-on', sku: 'ADD-WA-001', description: 'Unlimited WhatsApp messaging via official Business API', unitPrice: 59.99, active: true, createdAt: '2026-02-01T00:00:00Z' },
  { id: '8', name: 'AI Insights Module', sku: 'ADD-AI-001', description: 'GPT-powered customer scoring, churn prediction, and conversation summaries', unitPrice: 99.99, active: true, createdAt: '2026-02-15T00:00:00Z' },
  { id: '9', name: 'Premium Support SLA', sku: 'SVC-SLA-001', description: '24/7 phone and chat support with 1-hour response SLA', unitPrice: 199.00, active: false, createdAt: '2026-03-01T00:00:00Z' },
  { id: '10', name: 'Data Migration Service', sku: 'SVC-MIGRATE-001', description: 'Migrate all data from your existing CRM system to SmartCommunication', unitPrice: 1500.00, active: true, createdAt: '2026-03-15T00:00:00Z' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(DEMO_PRODUCTS);
  const [filtered, setFiltered] = useState<Product[]>(DEMO_PRODUCTS);
  const [search, setSearch] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');
  const [showModal, setShowModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', sku: '', description: '', unitPrice: '', active: true });
  const [formError, setFormError] = useState('');
  const [stats, setStats] = useState<ProductStats>({ totalProducts: 10, activeProducts: 9, totalCatalogValue: 0 });

  useEffect(() => {
    const total = products.reduce((sum, p) => sum + p.unitPrice, 0);
    const active = products.filter(p => p.active).length;
    setStats({ totalProducts: products.length, activeProducts: active, totalCatalogValue: total });
  }, [products]);

  useEffect(() => {
    let result = products;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (filterActive === 'active') result = result.filter(p => p.active);
    if (filterActive === 'inactive') result = result.filter(p => !p.active);
    setFiltered(result);
  }, [search, filterActive, products]);

  const openCreateModal = () => {
    setEditProduct(null);
    setForm({ name: '', sku: '', description: '', unitPrice: '', active: true });
    setFormError('');
    setShowModal(true);
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setForm({ name: product.name, sku: product.sku, description: product.description, unitPrice: String(product.unitPrice), active: product.active });
    setFormError('');
    setShowModal(true);
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) { setFormError('Product name is required'); return; }
    if (!form.unitPrice || isNaN(Number(form.unitPrice)) || Number(form.unitPrice) < 0) { setFormError('Enter a valid price'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    const payload: Product = {
      id: editProduct?.id || String(Date.now()),
      name: form.name.trim(),
      sku: form.sku.trim() || `SKU-${Date.now()}`,
      description: form.description.trim(),
      unitPrice: Number(form.unitPrice),
      active: form.active,
      createdAt: editProduct?.createdAt || new Date().toISOString(),
    };
    if (editProduct) {
      setProducts(prev => prev.map(p => p.id === editProduct.id ? payload : p));
    } else {
      setProducts(prev => [payload, ...prev]);
    }
    setLoading(false);
    setShowModal(false);
  };

  const handleDelete = async (id: string) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 300));
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeleteId(null);
    setLoading(false);
  };

  const toggleActive = async (product: Product) => {
    setProducts(prev => prev.map(p => p.id === product.id ? { ...p, active: !p.active } : p));
  };

  const avgPrice = products.length > 0 ? products.reduce((s, p) => s + p.unitPrice, 0) / products.length : 0;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Package className="w-8 h-8 text-blue-600" />
            Product Catalog
          </h1>
          <p className="text-gray-500 mt-1">Manage your products and services available for invoicing</p>
        </div>
        <button onClick={openCreateModal} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Total Products</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalProducts}</p>
          <p className="text-xs text-gray-400 mt-1">In your catalog</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Active Products</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeProducts}</p>
          <p className="text-xs text-green-600 mt-1">{stats.totalProducts > 0 ? Math.round(stats.activeProducts / stats.totalProducts * 100) : 0}% active</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Average Price</span>
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <BarChart2 className="w-5 h-5 text-purple-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${avgPrice.toFixed(2)}</p>
          <p className="text-xs text-gray-400 mt-1">Per unit</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Catalog Value</span>
            <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${stats.totalCatalogValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          <p className="text-xs text-gray-400 mt-1">Total list prices</p>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, SKU, or description..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterActive(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${filterActive === f ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Description</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Unit Price</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400">
                  <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p className="font-medium">No products found</p>
                  <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </td>
              </tr>
            ) : filtered.map(product => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Tag className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="font-semibold text-gray-900 text-sm">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">{product.sku}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <p className="text-sm text-gray-500 max-w-xs truncate">{product.description}</p>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-lg font-bold text-gray-900">${product.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </td>
                <td className="px-6 py-4 text-center">
                  <button onClick={() => toggleActive(product)} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${product.active ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                    {product.active ? <><CheckCircle className="w-3 h-3" />Active</> : <><XCircle className="w-3 h-3" />Inactive</>}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button onClick={() => openEditModal(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-3 border-t border-gray-100 flex items-center justify-between bg-gray-50">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {products.length} products</p>
          <button onClick={() => { setSearch(''); setFilterActive('all'); }} className="flex items-center gap-1 text-sm text-blue-600 hover:underline">
            <RefreshCw className="w-3 h-3" /> Reset filters
          </button>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <p className="text-sm text-gray-500 mt-1">{editProduct ? 'Update product details' : 'Create a new product or service for invoicing'}</p>
            </div>
            <div className="p-6 space-y-4">
              {formError && <div className="bg-red-50 text-red-700 text-sm p-3 rounded-xl border border-red-200">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. CRM Professional Plan" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <input type="text" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="e.g. CRM-PRO-001 (auto-generated if blank)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} placeholder="Brief description of the product or service..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Price (USD) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input type="number" min="0" step="0.01" value={form.unitPrice} onChange={e => setForm(f => ({ ...f, unitPrice: e.target.value }))} placeholder="0.00" className="w-full border border-gray-200 rounded-xl pl-8 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setForm(f => ({ ...f, active: !f.active }))} className={`relative w-11 h-6 rounded-full transition-colors ${form.active ? 'bg-blue-600' : 'bg-gray-300'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${form.active ? 'left-6' : 'left-1'}`} />
                </button>
                <span className="text-sm font-medium text-gray-700">Active (available for invoicing)</span>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setShowModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleSubmit} disabled={loading} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50 transition-all">
                {loading ? 'Saving...' : editProduct ? 'Save Changes' : 'Create Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">This will permanently remove the product from your catalog. Existing invoices will not be affected.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} disabled={loading} className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 disabled:opacity-50">
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
