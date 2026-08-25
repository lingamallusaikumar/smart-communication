'use client';

import { useState, useEffect } from 'react';
import { FileText, Plus, Download, Eye, DollarSign, Clock, AlertTriangle, CheckCircle, Trash2, Search, Filter, X, ChevronDown, Receipt } from 'lucide-react';

interface Customer { id: string; firstName: string; lastName: string; email: string; }
interface LineItem { id: string; description: string; quantity: number; unitPrice: number; total: number; }
interface Invoice {
  id: string;
  invoiceNumber: string;
  status: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  notes: string;
  customer: Customer;
  lineItems: LineItem[];
  createdAt: string;
}
interface BillingMetrics {
  totalInvoices: number;
  paidRevenue: number;
  pendingRevenue: number;
  overdueRevenue: number;
  paidCount: number;
  sentCount: number;
  overdueCount: number;
}

const DEMO_CUSTOMERS: Customer[] = [
  { id: '1', firstName: 'Alex', lastName: 'Morgan', email: 'alex@acme.com' },
  { id: '2', firstName: 'Sarah', lastName: 'Chen', email: 'sarah@globetech.com' },
  { id: '3', firstName: 'Mike', lastName: 'Johnson', email: 'mike@techstart.io' },
  { id: '4', firstName: 'Lisa', lastName: 'Park', email: 'lisa@innovate.co' },
];

const DEMO_INVOICES: Invoice[] = [
  { id: '1', invoiceNumber: 'INV-01001', status: 'PAID', issueDate: '2026-07-01', dueDate: '2026-07-31', subtotal: 499.99, taxTotal: 90.00, grandTotal: 589.99, notes: 'Annual CRM Enterprise subscription.', customer: DEMO_CUSTOMERS[0], lineItems: [{ id: 'l1', description: 'CRM Enterprise Plan - Annual', quantity: 1, unitPrice: 499.99, total: 499.99 }], createdAt: '2026-07-01T00:00:00Z' },
  { id: '2', invoiceNumber: 'INV-01002', status: 'SENT', issueDate: '2026-08-01', dueDate: '2026-08-31', subtotal: 229.98, taxTotal: 41.40, grandTotal: 271.38, notes: '', customer: DEMO_CUSTOMERS[1], lineItems: [{ id: 'l2', description: 'CRM Professional Plan', quantity: 1, unitPrice: 149.99, total: 149.99 }, { id: 'l3', description: 'Email Marketing Add-on', quantity: 1, unitPrice: 79.99, total: 79.99 }], createdAt: '2026-08-01T00:00:00Z' },
  { id: '3', invoiceNumber: 'INV-01003', status: 'OVERDUE', issueDate: '2026-06-01', dueDate: '2026-06-30', subtotal: 850.00, taxTotal: 153.00, grandTotal: 1003.00, notes: 'Custom integration development - 1 day', customer: DEMO_CUSTOMERS[2], lineItems: [{ id: 'l4', description: 'Custom Integration Development', quantity: 1, unitPrice: 850.00, total: 850.00 }], createdAt: '2026-06-01T00:00:00Z' },
  { id: '4', invoiceNumber: 'INV-01004', status: 'DRAFT', issueDate: '2026-08-20', dueDate: '2026-09-19', subtotal: 1799.00, taxTotal: 323.82, grandTotal: 2122.82, notes: 'Onboarding + Enterprise subscription bundle.', customer: DEMO_CUSTOMERS[3], lineItems: [{ id: 'l5', description: 'CRM Enterprise Plan', quantity: 1, unitPrice: 499.99, total: 499.99 }, { id: 'l6', description: 'Onboarding Service', quantity: 1, unitPrice: 299.00, total: 299.00 }, { id: 'l7', description: 'Data Migration Service', quantity: 1, unitPrice: 1000.00, total: 1000.00 }], createdAt: '2026-08-20T00:00:00Z' },
  { id: '5', invoiceNumber: 'INV-01005', status: 'PAID', issueDate: '2026-07-15', dueDate: '2026-08-14', subtotal: 299.00, taxTotal: 53.82, grandTotal: 352.82, notes: 'Onboarding assistance', customer: DEMO_CUSTOMERS[1], lineItems: [{ id: 'l8', description: 'Onboarding Service - 8 hours', quantity: 1, unitPrice: 299.00, total: 299.00 }], createdAt: '2026-07-15T00:00:00Z' },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  DRAFT: { label: 'Draft', color: 'bg-gray-100 text-gray-600', icon: <FileText className="w-3 h-3" /> },
  SENT: { label: 'Sent', color: 'bg-blue-100 text-blue-700', icon: <Clock className="w-3 h-3" /> },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
  OVERDUE: { label: 'Overdue', color: 'bg-red-100 text-red-700', icon: <AlertTriangle className="w-3 h-3" /> },
  CANCELLED: { label: 'Cancelled', color: 'bg-gray-100 text-gray-400', icon: <X className="w-3 h-3" /> },
};

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(DEMO_INVOICES);
  const [filtered, setFiltered] = useState<Invoice[]>(DEMO_INVOICES);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<BillingMetrics>({ totalInvoices: 5, paidRevenue: 942.81, pendingRevenue: 271.38, overdueRevenue: 1003.00, paidCount: 2, sentCount: 1, overdueCount: 1 });

  const [newInvoiceForm, setNewInvoiceForm] = useState({
    customerId: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    notes: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
  });

  useEffect(() => {
    let result = invoices;
    if (activeTab !== 'all') result = result.filter(i => i.status === activeTab.toUpperCase());
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(i => i.invoiceNumber.toLowerCase().includes(q) || i.customer.firstName.toLowerCase().includes(q) || i.customer.lastName.toLowerCase().includes(q) || i.customer.email.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [activeTab, search, invoices]);

  useEffect(() => {
    const paid = invoices.filter(i => i.status === 'PAID').reduce((s, i) => s + i.grandTotal, 0);
    const pending = invoices.filter(i => i.status === 'SENT').reduce((s, i) => s + i.grandTotal, 0);
    const overdue = invoices.filter(i => i.status === 'OVERDUE').reduce((s, i) => s + i.grandTotal, 0);
    setMetrics({ totalInvoices: invoices.length, paidRevenue: paid, pendingRevenue: pending, overdueRevenue: overdue, paidCount: invoices.filter(i => i.status === 'PAID').length, sentCount: invoices.filter(i => i.status === 'SENT').length, overdueCount: invoices.filter(i => i.status === 'OVERDUE').length });
  }, [invoices]);

  const addLineItem = () => setNewInvoiceForm(f => ({ ...f, lineItems: [...f.lineItems, { description: '', quantity: 1, unitPrice: 0 }] }));
  const removeLineItem = (idx: number) => setNewInvoiceForm(f => ({ ...f, lineItems: f.lineItems.filter((_, i) => i !== idx) }));
  const updateLineItem = (idx: number, field: string, value: string | number) => {
    setNewInvoiceForm(f => ({ ...f, lineItems: f.lineItems.map((li, i) => i === idx ? { ...li, [field]: value } : li) }));
  };

  const calcSubtotal = () => newInvoiceForm.lineItems.reduce((s, li) => s + li.quantity * li.unitPrice, 0);
  const calcTax = () => calcSubtotal() * 0.18;
  const calcGrandTotal = () => calcSubtotal() + calcTax();

  const handleCreateInvoice = async () => {
    if (!newInvoiceForm.customerId) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    const customer = DEMO_CUSTOMERS.find(c => c.id === newInvoiceForm.customerId) || DEMO_CUSTOMERS[0];
    const subtotal = calcSubtotal();
    const taxTotal = calcTax();
    const grandTotal = calcGrandTotal();
    const newInvoice: Invoice = {
      id: String(Date.now()),
      invoiceNumber: `INV-0${1000 + invoices.length + 1}`,
      status: 'DRAFT',
      issueDate: newInvoiceForm.issueDate,
      dueDate: newInvoiceForm.dueDate,
      subtotal,
      taxTotal,
      grandTotal,
      notes: newInvoiceForm.notes,
      customer,
      lineItems: newInvoiceForm.lineItems.map((li, i) => ({ id: `nl${i}`, description: li.description, quantity: li.quantity, unitPrice: li.unitPrice, total: li.quantity * li.unitPrice })),
      createdAt: new Date().toISOString(),
    };
    setInvoices(prev => [newInvoice, ...prev]);
    setShowCreateModal(false);
    setNewInvoiceForm({ customerId: '', issueDate: new Date().toISOString().split('T')[0], dueDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0], notes: '', lineItems: [{ description: '', quantity: 1, unitPrice: 0 }] });
    setLoading(false);
  };

  const markAsPaid = (id: string) => setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'PAID' } : i));
  const markAsSent = (id: string) => setInvoices(prev => prev.map(i => i.id === id ? { ...i, status: 'SENT' } : i));

  const tabs = ['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Receipt className="w-8 h-8 text-blue-600" />
            Invoices
          </h1>
          <p className="text-gray-500 mt-1">Manage billing and track revenue across all your customers</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md">
          <Plus className="w-5 h-5" /> Create Invoice
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Total Invoices</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">{metrics.totalInvoices}</p>
          <p className="text-xs text-gray-400 mt-1">All time</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Revenue Collected</span>
            <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${metrics.paidRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-green-600 mt-1">{metrics.paidCount} paid invoices</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Pending Amount</span>
            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${metrics.pendingRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-blue-600 mt-1">{metrics.sentCount} sent invoices</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500">Overdue Amount</span>
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">${metrics.overdueRevenue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
          <p className="text-xs text-red-600 mt-1">{metrics.overdueCount} overdue invoices</p>
        </div>
      </div>

      {/* Filter Tabs + Search */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center gap-1 px-4 pt-4 border-b border-gray-100">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium rounded-t-lg capitalize transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}
            >
              {tab}{tab !== 'all' && invoices.filter(i => i.status === tab.toUpperCase()).length > 0 && (
                <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-blue-500' : 'bg-gray-100 text-gray-500'}`}>
                  {invoices.filter(i => i.status === tab.toUpperCase()).length}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="p-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Invoice #</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Issue Date</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Due Date</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-center px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-16 text-gray-400"><FileText className="w-12 h-12 mx-auto mb-3 opacity-30" /><p className="font-medium">No invoices found</p></td></tr>
            ) : filtered.map(invoice => {
              const cfg = STATUS_CONFIG[invoice.status] || STATUS_CONFIG.DRAFT;
              return (
                <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono font-semibold text-blue-600 text-sm">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{invoice.customer.firstName} {invoice.customer.lastName}</p>
                      <p className="text-xs text-gray-400">{invoice.customer.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden md:table-cell">{invoice.issueDate}</td>
                  <td className="px-6 py-4 text-sm hidden md:table-cell">
                    <span className={invoice.status === 'OVERDUE' ? 'text-red-600 font-semibold' : 'text-gray-600'}>{invoice.dueDate}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-lg font-bold text-gray-900">${invoice.grandTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.color}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button onClick={() => setViewInvoice(invoice)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg" title="Download PDF">
                        <Download className="w-4 h-4" />
                      </button>
                      {invoice.status === 'DRAFT' && (
                        <button onClick={() => markAsSent(invoice.id)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs font-medium px-2" title="Mark as Sent">Send</button>
                      )}
                      {(invoice.status === 'SENT' || invoice.status === 'OVERDUE') && (
                        <button onClick={() => markAsPaid(invoice.id)} className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg text-xs font-medium px-2" title="Mark as Paid">Paid</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <p className="text-sm text-gray-500">Showing {filtered.length} of {invoices.length} invoices</p>
        </div>
      </div>

      {/* View Invoice Modal */}
      {viewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{viewInvoice.invoiceNumber}</h2>
                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold mt-1 ${STATUS_CONFIG[viewInvoice.status]?.color}`}>
                  {STATUS_CONFIG[viewInvoice.status]?.icon}{STATUS_CONFIG[viewInvoice.status]?.label}
                </span>
              </div>
              <button onClick={() => setViewInvoice(null)} className="p-2 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-gray-400 uppercase mb-1">Customer</p><p className="font-semibold">{viewInvoice.customer.firstName} {viewInvoice.customer.lastName}</p><p className="text-sm text-gray-500">{viewInvoice.customer.email}</p></div>
                <div><p className="text-xs text-gray-400 uppercase mb-1">Dates</p><p className="text-sm">Issue: {viewInvoice.issueDate}</p><p className="text-sm">Due: {viewInvoice.dueDate}</p></div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase mb-3">Line Items</p>
                <table className="w-full border border-gray-100 rounded-xl overflow-hidden">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-4 py-2 text-xs font-semibold text-gray-500">Description</th>
                      <th className="text-center px-4 py-2 text-xs font-semibold text-gray-500">Qty</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Price</th>
                      <th className="text-right px-4 py-2 text-xs font-semibold text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {viewInvoice.lineItems.map(li => (
                      <tr key={li.id} className="border-t border-gray-50">
                        <td className="px-4 py-3 text-sm">{li.description}</td>
                        <td className="px-4 py-3 text-sm text-center">{li.quantity}</td>
                        <td className="px-4 py-3 text-sm text-right">${li.unitPrice.toFixed(2)}</td>
                        <td className="px-4 py-3 text-sm text-right font-semibold">${li.total.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span>${viewInvoice.subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-500">Tax (18%)</span><span>${viewInvoice.taxTotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-lg font-bold border-t border-gray-200 pt-2 mt-2"><span>Grand Total</span><span className="text-blue-600">${viewInvoice.grandTotal.toFixed(2)}</span></div>
              </div>
              {viewInvoice.notes && <div><p className="text-xs text-gray-400 uppercase mb-1">Notes</p><p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl">{viewInvoice.notes}</p></div>}
            </div>
          </div>
        </div>
      )}

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[95vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white z-10">
              <h2 className="text-xl font-bold text-gray-900">Create Invoice</h2>
              <p className="text-sm text-gray-500 mt-1">Build a professional invoice with line items</p>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Customer *</label>
                <select value={newInvoiceForm.customerId} onChange={e => setNewInvoiceForm(f => ({ ...f, customerId: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a customer...</option>
                  {DEMO_CUSTOMERS.map(c => <option key={c.id} value={c.id}>{c.firstName} {c.lastName} — {c.email}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Issue Date</label><input type="date" value={newInvoiceForm.issueDate} onChange={e => setNewInvoiceForm(f => ({ ...f, issueDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label><input type="date" value={newInvoiceForm.dueDate} onChange={e => setNewInvoiceForm(f => ({ ...f, dueDate: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-gray-700">Line Items</label>
                  <button onClick={addLineItem} className="flex items-center gap-1 text-sm text-blue-600 hover:underline"><Plus className="w-4 h-4" />Add Item</button>
                </div>
                <div className="space-y-3">
                  {newInvoiceForm.lineItems.map((li, idx) => (
                    <div key={idx} className="flex gap-2 items-start bg-gray-50 p-3 rounded-xl">
                      <div className="flex-1"><input type="text" placeholder="Description" value={li.description} onChange={e => updateLineItem(idx, 'description', e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div className="w-16"><input type="number" min="1" placeholder="Qty" value={li.quantity} onChange={e => updateLineItem(idx, 'quantity', Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div className="w-24"><input type="number" min="0" step="0.01" placeholder="Price" value={li.unitPrice || ''} onChange={e => updateLineItem(idx, 'unitPrice', Number(e.target.value))} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
                      <div className="w-20 text-right py-2 text-sm font-semibold text-gray-700">${(li.quantity * li.unitPrice).toFixed(2)}</div>
                      {newInvoiceForm.lineItems.length > 1 && <button onClick={() => removeLineItem(idx)} className="p-2 text-red-400 hover:text-red-600"><Trash2 className="w-4 h-4" /></button>}
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 rounded-xl p-4 mt-3 space-y-1">
                  <div className="flex justify-between text-sm text-gray-600"><span>Subtotal</span><span>${calcSubtotal().toFixed(2)}</span></div>
                  <div className="flex justify-between text-sm text-gray-600"><span>Tax (18%)</span><span>${calcTax().toFixed(2)}</span></div>
                  <div className="flex justify-between font-bold text-blue-700 text-base border-t border-blue-200 pt-2 mt-1"><span>Grand Total</span><span>${calcGrandTotal().toFixed(2)}</span></div>
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label><textarea value={newInvoiceForm.notes} onChange={e => setNewInvoiceForm(f => ({ ...f, notes: e.target.value }))} rows={2} placeholder="Payment terms, references, or additional info..." className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            </div>
            <div className="p-6 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
              <button onClick={() => setShowCreateModal(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              <button onClick={handleCreateInvoice} disabled={loading || !newInvoiceForm.customerId} className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Creating...' : 'Create Invoice'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
