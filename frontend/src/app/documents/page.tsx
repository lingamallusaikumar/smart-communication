'use client';

import { useState } from 'react';
import { File, Folder, UploadCloud, Search, Download, Trash2, Share2, MoreVertical, FileText, Image as ImageIcon, FileSpreadsheet, HardDrive, Lock } from 'lucide-react';

interface Document {
  id: string;
  filename: string;
  contentType: string;
  sizeBytes: number;
  category: string;
  uploadedByName: string;
  createdAt: string;
}

const DEMO_DOCS: Document[] = [
  { id: '1', filename: 'Enterprise_Service_Agreement_Acme.pdf', contentType: 'application/pdf', sizeBytes: 1048576 * 2.5, category: 'CONTRACT', uploadedByName: 'Alice Admin', createdAt: '2026-08-20T10:00:00Z' },
  { id: '2', filename: 'Q3_Financial_Report.xlsx', contentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', sizeBytes: 1048576 * 1.2, category: 'REPORT', uploadedByName: 'Bob Manager', createdAt: '2026-08-22T14:30:00Z' },
  { id: '3', filename: 'Brand_Guidelines_2026.pdf', contentType: 'application/pdf', sizeBytes: 1048576 * 5.8, category: 'OTHER', uploadedByName: 'Alice Admin', createdAt: '2026-08-01T09:15:00Z' },
  { id: '4', filename: 'Project_Proposal_Globetech.docx', contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', sizeBytes: 1048576 * 0.8, category: 'PROPOSAL', uploadedByName: 'Charlie Sales', createdAt: '2026-08-24T11:45:00Z' },
  { id: '5', filename: 'Invoice_INV-01002.pdf', contentType: 'application/pdf', sizeBytes: 1048576 * 0.1, category: 'INVOICE', uploadedByName: 'System', createdAt: '2026-08-01T00:00:00Z' },
];

function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const getIcon = (type: string) => {
  if (type.includes('pdf')) return <FileText className="w-8 h-8 text-red-500" />;
  if (type.includes('spreadsheet') || type.includes('csv')) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
  if (type.includes('image')) return <ImageIcon className="w-8 h-8 text-blue-500" />;
  if (type.includes('word')) return <FileText className="w-8 h-8 text-blue-600" />;
  return <File className="w-8 h-8 text-gray-500" />;
};

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>(DEMO_DOCS);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [category, setCategory] = useState('OTHER');
  const [loading, setLoading] = useState(false);

  const categories = ['ALL', 'CONTRACT', 'PROPOSAL', 'INVOICE', 'REPORT', 'OTHER'];

  const filtered = documents.filter(d => {
    const matchCat = activeCategory === 'ALL' || d.category === activeCategory;
    const matchQuery = d.filename.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchQuery;
  });

  const totalStorage = documents.reduce((sum, d) => sum + d.sizeBytes, 0);

  const handleUpload = async () => {
    if (!uploadFile) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    
    const newDoc: Document = {
      id: String(Date.now()),
      filename: uploadFile.name,
      contentType: uploadFile.type || 'application/octet-stream',
      sizeBytes: uploadFile.size,
      category,
      uploadedByName: 'Current User',
      createdAt: new Date().toISOString()
    };
    
    setDocuments([newDoc, ...documents]);
    setShowUploadModal(false);
    setUploadFile(null);
    setCategory('OTHER');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3"><Folder className="w-8 h-8 text-blue-600" />Document Hub</h1>
          <p className="text-gray-500 mt-1">Store, share, and manage your organization's files securely</p>
        </div>
        <button onClick={() => setShowUploadModal(true)} className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-blue-700 shadow-md transition-all">
          <UploadCloud className="w-5 h-5" /> Upload File
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 col-span-1 md:col-span-3">
          <h3 className="font-semibold text-gray-900 mb-4">Storage Usage</h3>
          <div className="w-full bg-gray-100 rounded-full h-3 mb-2 overflow-hidden">
            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${Math.min(100, (totalStorage / (1048576 * 1024)) * 100)}%` }}></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500">
            <span>{formatBytes(totalStorage)} used</span>
            <span>1 GB total limit</span>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center items-center text-center">
          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 text-purple-600"><File className="w-6 h-6" /></div>
          <p className="text-3xl font-bold text-gray-900">{documents.length}</p>
          <p className="text-sm text-gray-500 mt-1">Total Files</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 justify-between items-center bg-gray-50">
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${activeCategory === cat ? 'bg-white text-blue-600 shadow-sm border border-gray-200' : 'text-gray-500 hover:bg-gray-200 border border-transparent'}`}>
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold text-gray-500 uppercase">
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4 hidden sm:table-cell">Uploaded By</th>
                <th className="px-6 py-4 hidden md:table-cell">Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {getIcon(doc.contentType)}
                      <div className="flex flex-col">
                        <span className="font-semibold text-gray-900 text-sm truncate max-w-[200px] sm:max-w-xs">{doc.filename}</span>
                        <span className="text-[10px] bg-gray-100 text-gray-500 w-fit px-2 py-0.5 rounded uppercase mt-1">{doc.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{formatBytes(doc.sizeBytes)}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{doc.uploadedByName}</td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">{new Date(doc.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg" title="Download"><Download className="w-4 h-4" /></button>
                      <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg" title="Create Share Link"><Share2 className="w-4 h-4" /></button>
                      <button onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg" title="Delete"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="text-center py-16 text-gray-400">No files found matching your criteria.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Upload File</h2>
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center bg-gray-50 relative hover:bg-gray-100 transition-colors">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                <UploadCloud className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                {uploadFile ? <p className="text-sm font-semibold text-blue-600">{uploadFile.name}</p> : <p className="text-sm text-gray-600">Drag & drop or click to browse</p>}
              </div>
              
              {uploadFile && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                    <option value="CONTRACT">Contract</option>
                    <option value="PROPOSAL">Proposal</option>
                    <option value="INVOICE">Invoice</option>
                    <option value="REPORT">Report</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => {setShowUploadModal(false); setUploadFile(null);}} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 rounded-lg">Cancel</button>
              <button onClick={handleUpload} disabled={!uploadFile || loading} className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50">
                {loading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
