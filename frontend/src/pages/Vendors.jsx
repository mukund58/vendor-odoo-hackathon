import { useState } from 'react';
import { FiPlus, FiSearch, FiSliders, FiEdit2, FiTrash2, FiX } from 'react-icons/fi';
import './Vendors.css';

const initialVendors = [
  { id: 'VND-001', name: 'John Carter', company: 'Apex Metals Ltd', gst: '27AAACA1111A1Z1', email: 'john@apexmetals.com', phone: '+1-555-0199', category: 'Raw Materials', status: 'Active', badge: 'badge-success' },
  { id: 'VND-002', name: 'Emma Stone', company: 'NetScale Solutions', gst: '27BBBCB2222B2Z2', email: 'support@netscale.io', phone: '+1-555-0188', category: 'IT Solutions', status: 'Active', badge: 'badge-success' },
  { id: 'VND-003', name: 'Daniel Craig', company: 'Habitat Crafts', gst: '27CCCC3333C3Z3', email: 'sales@habitat.com', phone: '+1-555-0177', category: 'Office Goods', status: 'Probation', badge: 'badge-warning' },
  { id: 'VND-004', name: 'Sarah Connor', company: 'Titan Heavy Machinery', gst: '27DDDD4444D4Z4', email: 'info@titanheavy.com', phone: '+1-555-0166', category: 'Heavy Equipment', status: 'Active', badge: 'badge-success' },
  { id: 'VND-005', name: 'Bruce Wayne', company: 'Global Logistics Inc', gst: '27EEEE5555E5Z5', email: 'bruce@globallogistics.com', phone: '+1-555-0155', category: 'Logistics', status: 'Inactive', badge: 'badge-danger' },
  { id: 'VND-006', name: 'Tony Stark', company: 'Stark Industries', gst: '27FFFF6666F6Z6', email: 'contact@stark.com', phone: '+1-555-0144', category: 'Raw Materials', status: 'Active', badge: 'badge-success' },
  { id: 'VND-007', name: 'Peter Parker', company: 'Daily Bugle Media', gst: '27GGGG7777G7Z7', email: 'peter@bugle.com', phone: '+1-555-0133', category: 'Marketing', status: 'Active', badge: 'badge-success' },
  { id: 'VND-008', name: 'Clark Kent', company: 'Metropolis Power', gst: '27HHHH8888H8Z8', email: 'clark@dailyplanet.com', phone: '+1-555-0122', category: 'Utilities', status: 'Active', badge: 'badge-success' },
  { id: 'VND-009', name: 'Bruce Banner', company: 'Gamma Laboratories', gst: '27IIII9999I9Z9', email: 'banner@gamma.org', phone: '+1-555-0111', category: 'R&D', status: 'Active', badge: 'badge-success' },
  { id: 'VND-010', name: 'Arthur Curry', company: 'Atlantis Marine', gst: '27JJJJ0000J0Z0', email: 'arthur@atlantismarine.com', phone: '+1-555-0100', category: 'Logistics', status: 'Probation', badge: 'badge-warning' },
  { id: 'VND-011', name: 'Diana Prince', company: 'Themyscira Artifacts', gst: '27KKKK1111K1Z1', email: 'diana@museum.org', phone: '+1-555-0099', category: 'Consulting', status: 'Active', badge: 'badge-success' },
  { id: 'VND-012', name: 'Barry Allen', company: 'Central Labs', gst: '27LLLL2222L2Z2', email: 'barry@centrallabs.com', phone: '+1-555-0088', category: 'IT Solutions', status: 'Inactive', badge: 'badge-danger' },
];

const Vendors = () => {
  const [vendors, setVendors] = useState(initialVendors);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    company: '',
    gst: '',
    email: '',
    phone: '',
    category: 'Raw Materials',
    status: 'Active'
  });

  // Extract unique categories for filter select dropdown
  const categories = Array.from(new Set(vendors.map(v => v.category)));

  // Filter handlers
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setCategoryFilter(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  // Filtered dataset
  const filteredVendors = vendors.filter((vendor) => {
    const matchesSearch = 
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.gst.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter ? vendor.category === categoryFilter : true;
    const matchesStatus = statusFilter ? vendor.status === statusFilter : true;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredVendors.slice(indexOfFirstRow, indexOfLastRow);

  // Form handlers
  const openAddModal = () => {
    setModalMode('add');
    setFormData({
      id: `VND-0${vendors.length + 1}`,
      name: '',
      company: '',
      gst: '',
      email: '',
      phone: '',
      category: 'Raw Materials',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (vendor) => {
    setModalMode('edit');
    setFormData({ ...vendor });
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to remove this vendor partner?')) {
      const updated = vendors.filter(v => v.id !== id);
      setVendors(updated);
      if (currentPage > Math.ceil(updated.length / rowsPerPage) && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Status color configurations
    const badgeMap = {
      'Active': 'badge-success',
      'Probation': 'badge-warning',
      'Inactive': 'badge-danger'
    };

    if (modalMode === 'add') {
      const newVendor = {
        ...formData,
        badge: badgeMap[formData.status] || 'badge-info'
      };
      setVendors([newVendor, ...vendors]);
      setIsModalOpen(false);
    } else {
      const updated = vendors.map((v) => {
        if (v.id === formData.id) {
          return {
            ...formData,
            badge: badgeMap[formData.status] || 'badge-info'
          };
        }
        return v;
      });
      setVendors(updated);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="d-flex flex-column gap-4">
      {/* Header section with counts */}
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
        <div>
          <h1 className="h3 mb-1 text-white fw-bold">Vendor Management</h1>
          <p className="text-secondary small">Maintain procurement partners, GST details, and status reviews.</p>
        </div>
        <button 
          type="button" 
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={openAddModal}
        >
          <FiPlus /> Add New Vendor
        </button>
      </div>

      {/* Overview Cards Row */}
      <div className="row g-3">
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-secondary extra-small fw-semibold uppercase tracking-wider">Total Partners</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.length}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-success extra-small fw-semibold uppercase tracking-wider">Active Suppliers</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.filter(v => v.status === 'Active').length}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-warning extra-small fw-semibold uppercase tracking-wider">On Probation</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.filter(v => v.status === 'Probation').length}</div>
          </div>
        </div>
        <div className="col-12 col-md-3">
          <div className="card p-3" style={{ backgroundColor: 'var(--bg-card)' }}>
            <span className="text-danger extra-small fw-semibold uppercase tracking-wider">Inactive</span>
            <div className="fs-3 fw-bold text-white mt-1">{vendors.filter(v => v.status === 'Inactive').length}</div>
          </div>
        </div>
      </div>

      {/* Control Card: Filters & Search */}
      <div className="card p-3.5">
        <div className="d-flex flex-column flex-lg-row gap-3 justify-content-between align-items-stretch">
          {/* Search box */}
          <div className="d-flex align-items-center bg-secondary px-3 py-1.5 rounded-3 border border-light flex-grow-1" style={{ maxWidth: '450px' }}>
            <FiSearch className="text-muted me-2" size={16} />
            <input 
              type="text" 
              className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
              placeholder="Search by name, company, GST..." 
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>

          {/* Filter dropdowns */}
          <div className="d-flex flex-wrap gap-2">
            {/* Category Dropdown */}
            <div className="d-flex align-items-center bg-secondary px-2.5 py-1 rounded-3 border border-light">
              <FiSliders className="text-muted me-2" size={14} />
              <select 
                className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none" 
                style={{ width: '150px', outline: 'none' }}
                value={categoryFilter}
                onChange={handleCategoryChange}
              >
                <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat} style={{ backgroundColor: 'var(--bg-secondary)' }}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="d-flex align-items-center bg-secondary px-2.5 py-1 rounded-3 border border-light">
              <select 
                className="form-select form-select-sm bg-transparent border-0 text-white cursor-pointer py-0 outline-none" 
                style={{ width: '130px', outline: 'none' }}
                value={statusFilter}
                onChange={handleStatusChange}
              >
                <option value="" style={{ backgroundColor: 'var(--bg-secondary)' }}>All Statuses</option>
                <option value="Active" style={{ backgroundColor: 'var(--bg-secondary)' }}>Active</option>
                <option value="Probation" style={{ backgroundColor: 'var(--bg-secondary)' }}>Probation</option>
                <option value="Inactive" style={{ backgroundColor: 'var(--bg-secondary)' }}>Inactive</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Vendor Directory Table */}
      <div className="card p-4">
        <div className="table-responsive border-0">
          <table className="table custom-table text-nowrap align-middle">
            <thead>
              <tr>
                <th scope="col">Vendor Name</th>
                <th scope="col">Company Name</th>
                <th scope="col">GST Number</th>
                <th scope="col">Email Address</th>
                <th scope="col">Phone</th>
                <th scope="col">Category</th>
                <th scope="col">Status</th>
                <th scope="col" className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-5 text-secondary">
                    No suppliers match your search filters.
                  </td>
                </tr>
              ) : (
                currentRows.map((vendor) => (
                  <tr key={vendor.id}>
                    <td className="fw-semibold text-white">{vendor.name}</td>
                    <td>{vendor.company}</td>
                    <td className="font-monospace text-secondary small">{vendor.gst}</td>
                    <td>{vendor.email}</td>
                    <td className="text-secondary small">{vendor.phone}</td>
                    <td>{vendor.category}</td>
                    <td>
                      <span className={`badge-status ${vendor.badge}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-2">
                        <button 
                          type="button" 
                          className="btn btn-secondary btn-sm p-1.5 rounded-circle d-inline-flex"
                          onClick={() => openEditModal(vendor)}
                          title="Edit Details"
                        >
                          <FiEdit2 size={12} />
                        </button>
                        <button 
                          type="button" 
                          className="btn btn-danger btn-sm p-1.5 rounded-circle d-inline-flex bg-opacity-10 border-0"
                          onClick={() => handleDelete(vendor.id)}
                          title="Delete Partner"
                          style={{ color: 'var(--danger)', backgroundColor: 'rgba(239, 68, 68, 0.1)' }}
                        >
                          <FiTrash2 size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top border-light">
            <span className="text-secondary small">
              Showing <strong className="text-white">{indexOfFirstRow + 1}</strong> to <strong className="text-white">{Math.min(indexOfLastRow, filteredVendors.length)}</strong> of <strong className="text-white">{filteredVendors.length}</strong> suppliers
            </span>
            <div className="d-flex gap-1.5 align-items-center">
              <button 
                type="button" 
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  type="button"
                  className={`pagination-number ${currentPage === num ? 'active' : ''}`}
                  onClick={() => setCurrentPage(num)}
                >
                  {num}
                </button>
              ))}
              <button 
                type="button" 
                className="pagination-btn"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Form Modal Dialog */}
      {isModalOpen && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-content card p-4 glass border border-light">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2.5 border-bottom border-light">
              <h5 className="text-white fw-bold m-0">{modalMode === 'add' ? 'Add New Vendor' : 'Edit Vendor Details'}</h5>
              <button 
                type="button" 
                className="btn border-0 p-0 text-white text-muted-hover"
                onClick={() => setIsModalOpen(false)}
                aria-label="Close modal"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="d-flex flex-column gap-3">
              <div className="row g-3">
                {/* Contact Name */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-name">Contact Person</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-name"
                      type="text" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                {/* Company Name */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-company">Company Name</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-company"
                      type="text" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="e.g. Acme Corp"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    />
                  </div>
                </div>

                {/* GST Number */}
                <div className="col-12">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-gst">GSTIN Number</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-gst"
                      type="text" 
                      required 
                      pattern="^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none font-monospace" 
                      placeholder="e.g. 27AAACA1111A1Z1"
                      value={formData.gst}
                      onChange={(e) => setFormData({ ...formData, gst: e.target.value.toUpperCase() })}
                    />
                  </div>
                  <span className="text-muted extra-small mt-1 d-inline-block">Format: 15-digit Alpha-Numeric GSTIN</span>
                </div>

                {/* Email Address */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-email">Email Address</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-email"
                      type="email" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="name@company.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-phone">Phone Number</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <input 
                      id="vendor-phone"
                      type="text" 
                      required 
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none" 
                      placeholder="+1-555-0100"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                {/* Category Selection */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-category">Category</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <select 
                      id="vendor-category"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Raw Materials" style={{ backgroundColor: 'var(--bg-secondary)' }}>Raw Materials</option>
                      <option value="IT Solutions" style={{ backgroundColor: 'var(--bg-secondary)' }}>IT Solutions</option>
                      <option value="Office Goods" style={{ backgroundColor: 'var(--bg-secondary)' }}>Office Goods</option>
                      <option value="Heavy Equipment" style={{ backgroundColor: 'var(--bg-secondary)' }}>Heavy Equipment</option>
                      <option value="Logistics" style={{ backgroundColor: 'var(--bg-secondary)' }}>Logistics</option>
                      <option value="Consulting" style={{ backgroundColor: 'var(--bg-secondary)' }}>Consulting</option>
                      <option value="R&D" style={{ backgroundColor: 'var(--bg-secondary)' }}>R&D</option>
                    </select>
                  </div>
                </div>

                {/* Status Selection */}
                <div className="col-12 col-sm-6">
                  <label className="text-secondary small mb-1 fw-medium" htmlFor="vendor-status">Partner Status</label>
                  <div className="form-input-wrapper px-3 py-2 rounded-3">
                    <select 
                      id="vendor-status"
                      className="bg-transparent border-0 text-white w-100 fs-7 outline-none cursor-pointer"
                      style={{ backgroundColor: 'var(--bg-secondary)' }}
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="Active" style={{ backgroundColor: 'var(--bg-secondary)' }}>Active</option>
                      <option value="Probation" style={{ backgroundColor: 'var(--bg-secondary)' }}>Probation</option>
                      <option value="Inactive" style={{ backgroundColor: 'var(--bg-secondary)' }}>Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="d-flex justify-content-end gap-2 mt-4 pt-2.5 border-top border-light">
                <button 
                  type="button" 
                  className="btn btn-secondary btn-sm"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary btn-sm px-4 fw-medium"
                >
                  {modalMode === 'add' ? 'Save Vendor' : 'Update Details'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
