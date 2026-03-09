
import React, { useState, useEffect } from 'react';

// --- Constants & Configuration ---

const ROLES = {
  POLICYHOLDER: 'Policyholder',
  CLAIMS_OFFICER: 'Claims Officer',
  CLAIMS_MANAGER: 'Claims Manager',
  VERIFICATION_TEAM: 'Verification Team',
  FINANCE_TEAM: 'Finance Team',
};

const STATUS_MAP = {
  APPROVED: {
    label: 'Approved',
    className: 'status-approved',
    colorVarBg: 'var(--status-approved-bg)',
    colorVarBorder: 'var(--status-approved-border)',
  },
  IN_PROGRESS: {
    label: 'In Progress',
    className: 'status-in_progress',
    colorVarBg: 'var(--status-in-progress-bg)',
    colorVarBorder: 'var(--status-in-progress-border)',
  },
  PENDING: {
    label: 'Pending',
    className: 'status-pending',
    colorVarBg: 'var(--status-pending-bg)',
    colorVarBorder: 'var(--status-pending-border)',
  },
  REJECTED: {
    label: 'Rejected',
    className: 'status-rejected',
    colorVarBg: 'var(--status-rejected-bg)',
    colorVarBorder: 'var(--status-rejected-border)',
  },
  EXCEPTION: {
    label: 'Exception',
    className: 'status-exception',
    colorVarBg: 'var(--status-exception-bg)',
    colorVarBorder: 'var(--status-exception-border)',
  },
};

// --- Sample Data (Simulating API Responses) ---

const sampleClaims = [
  {
    id: 'C001',
    policyholder: 'Alice Johnson',
    type: 'Auto Accident',
    amount: 12500.00,
    status: 'IN_PROGRESS',
    submissionDate: '2023-10-26',
    lastUpdated: '2023-11-01',
    officer: 'John Doe',
    policyNumber: 'AP789012',
    description: 'Vehicle collision on main street, minor injuries, significant vehicle damage.',
    documents: [
      { name: 'Police Report.pdf', url: '#' },
      { name: 'Vehicle Damage Photos.zip', url: '#' },
    ],
    milestones: [
      { name: 'Claim Submitted', date: '2023-10-26', status: 'completed' },
      { name: 'Initial Review', date: '2023-10-27', status: 'completed' },
      { name: 'Document Verification', date: '2023-10-29', status: 'current' },
      { name: 'Approval Decision', date: null, status: 'pending' },
      { name: 'Payment Processing', date: null, status: 'pending' },
    ],
    auditLog: [
      { timestamp: '2023-10-26T10:00:00Z', user: 'Alice Johnson', action: 'Claim Submitted', details: 'Policyholder submitted new claim.' },
      { timestamp: '2023-10-27T09:15:00Z', user: 'John Doe (Claims Officer)', action: 'Status Update', details: 'Claim moved to Initial Review stage.' },
      { timestamp: '2023-10-29T14:30:00Z', user: 'Sarah Lee (Verification Team)', action: 'Document Review', details: 'Started verification of submitted documents.' },
    ],
  },
  {
    id: 'C002',
    policyholder: 'Bob Smith',
    type: 'Home Damage',
    amount: 5000.00,
    status: 'PENDING',
    submissionDate: '2023-10-20',
    lastUpdated: '2023-10-21',
    officer: 'Jane Green',
    policyNumber: 'HP123456',
    description: 'Minor flood damage due to burst pipe in kitchen.',
    documents: [
      { name: 'Damage Report.pdf', url: '#' },
      { name: 'Repair Quote.pdf', url: '#' },
    ],
    milestones: [
      { name: 'Claim Submitted', date: '2023-10-20', status: 'completed' },
      { name: 'Initial Review', date: '2023-10-21', status: 'current' },
      { name: 'Document Verification', date: null, status: 'pending' },
      { name: 'Approval Decision', date: null, status: 'pending' },
      { name: 'Payment Processing', date: null, status: 'pending' },
    ],
    auditLog: [
      { timestamp: '2023-10-20T11:30:00Z', user: 'Bob Smith', action: 'Claim Submitted', details: 'Policyholder submitted new claim.' },
      { timestamp: '2023-10-21T08:45:00Z', user: 'Jane Green (Claims Officer)', action: 'Status Update', details: 'Claim moved to Initial Review stage, awaiting further documents.' },
    ],
  },
  {
    id: 'C003',
    policyholder: 'Charlie Brown',
    type: 'Medical Expense',
    amount: 1500.00,
    status: 'APPROVED',
    submissionDate: '2023-09-15',
    lastUpdated: '2023-09-28',
    officer: 'Olivia White',
    policyNumber: 'MP987654',
    description: 'Emergency room visit for a sprained ankle.',
    documents: [
      { name: 'Medical Bill.pdf', url: '#' },
      { name: 'Doctor Note.pdf', url: '#' },
    ],
    milestones: [
      { name: 'Claim Submitted', date: '2023-09-15', status: 'completed' },
      { name: 'Initial Review', date: '2023-09-16', status: 'completed' },
      { name: 'Document Verification', date: '2023-09-18', status: 'completed' },
      { name: 'Approval Decision', date: '2023-09-20', status: 'completed' },
      { name: 'Payment Processing', date: '2023-09-28', status: 'completed' },
    ],
    auditLog: [
      { timestamp: '2023-09-15T09:00:00Z', user: 'Charlie Brown', action: 'Claim Submitted', details: 'Policyholder submitted new claim.' },
      { timestamp: '2023-09-16T10:00:00Z', user: 'Olivia White (Claims Officer)', action: 'Status Update', details: 'Claim moved to Initial Review stage.' },
      { timestamp: '2023-09-20T11:00:00Z', user: 'Olivia White (Claims Officer)', action: 'Approved Claim', details: 'Claim approved for payment.' },
      { timestamp: '2023-09-28T15:00:00Z', user: 'Finance Team', action: 'Payment Processed', details: 'Payment disbursed to policyholder.' },
    ],
  },
  {
    id: 'C004',
    policyholder: 'Diana Prince',
    type: 'Theft Claim',
    amount: 7500.00,
    status: 'REJECTED',
    submissionDate: '2023-08-01',
    lastUpdated: '2023-08-10',
    officer: 'Peter Parker',
    policyNumber: 'TC456789',
    description: 'Theft of personal belongings from home during vacation.',
    documents: [
      { name: 'Police Report.pdf', url: '#' },
      { name: 'Itemized List.pdf', url: '#' },
    ],
    milestones: [
      { name: 'Claim Submitted', date: '2023-08-01', status: 'completed' },
      { name: 'Initial Review', date: '2023-08-02', status: 'completed' },
      { name: 'Document Verification', date: '2023-08-04', status: 'completed' },
      { name: 'Approval Decision', date: '2023-08-10', status: 'completed' },
    ],
    auditLog: [
      { timestamp: '2023-08-01T14:00:00Z', user: 'Diana Prince', action: 'Claim Submitted', details: 'Policyholder submitted new claim.' },
      { timestamp: '2023-08-02T10:00:00Z', user: 'Peter Parker (Claims Officer)', action: 'Status Update', details: 'Claim moved to Initial Review stage.' },
      { timestamp: '2023-08-10T16:00:00Z', user: 'Peter Parker (Claims Officer)', action: 'Rejected Claim', details: 'Claim rejected due to insufficient evidence of forced entry.' },
    ],
  },
  {
    id: 'C005',
    policyholder: 'Eve Adams',
    type: 'Property Damage',
    amount: 20000.00,
    status: 'EXCEPTION',
    submissionDate: '2023-11-01',
    lastUpdated: '2023-11-02',
    officer: 'Alice Cooper',
    policyNumber: 'PD001122',
    description: 'Significant structural damage to garage due to fallen tree.',
    documents: [
      { name: 'Arborist Report.pdf', url: '#' },
      { name: 'Contractor Estimate.pdf', url: '#' },
      { name: 'Photos.zip', url: '#' },
    ],
    milestones: [
      { name: 'Claim Submitted', date: '2023-11-01', status: 'completed' },
      { name: 'Initial Review', date: '2023-11-02', status: 'current' },
      { name: 'Document Verification', date: null, status: 'pending' },
      { name: 'Complex Case Review', date: null, status: 'pending' },
      { name: 'Approval Decision', date: null, status: 'pending' },
      { name: 'Payment Processing', date: null, status: 'pending' },
    ],
    auditLog: [
      { timestamp: '2023-11-01T10:00:00Z', user: 'Eve Adams', action: 'Claim Submitted', details: 'Policyholder submitted new claim.' },
      { timestamp: '2023-11-02T09:00:00Z', user: 'Alice Cooper (Claims Officer)', action: 'Status Update', details: 'Claim moved to Initial Review. Flagged as exception due to high value and complexity.' },
      { timestamp: '2023-11-02T11:00:00Z', user: 'Claims Manager', action: 'Escalated', details: 'Claim escalated to Claims Manager for review.' },
    ],
  },
];

// --- Utility Functions ---

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// --- App Component ---

function App() {
  const [view, setView] = useState({ screen: 'DASHBOARD', params: {} });
  const [claims, setClaims] = useState(sampleClaims); // Use sample data directly for initial state
  const [currentUserRole, setCurrentUserRole] = useState(ROLES.CLAIMS_OFFICER); // Default role

  const handleClaimClick = (claimId) => {
    setView(prevState => ({ ...prevState, screen: 'CLAIM_DETAIL', params: { claimId } }));
  };

  const handleGoBack = () => {
    setView(prevState => ({ ...prevState, screen: 'DASHBOARD', params: {} }));
  };

  const handleApproveClaim = (claimId) => {
    // RBAC: Only Claims Officer/Manager can approve
    if (currentUserRole !== ROLES.CLAIMS_OFFICER && currentUserRole !== ROLES.CLAIMS_MANAGER) {
      alert("You don't have permission to approve claims.");
      return;
    }
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === claimId
          ? {
              ...claim,
              status: 'APPROVED',
              lastUpdated: new Date().toISOString().split('T')[0],
              milestones: claim.milestones?.map(m => m.name === 'Approval Decision' ? { ...m, status: 'completed', date: new Date().toISOString().split('T')[0] } : m),
              auditLog: [...(claim.auditLog || []), { timestamp: new Date().toISOString(), user: `${currentUserRole}`, action: 'Claim Approved', details: 'Claim has been approved.' }],
            }
          : claim
      )
    );
    alert(`Claim ${claimId} Approved!`);
  };

  const handleRejectClaim = (claimId) => {
    // RBAC: Only Claims Officer/Manager can reject
    if (currentUserRole !== ROLES.CLAIMS_OFFICER && currentUserRole !== ROLES.CLAIMS_MANAGER) {
      alert("You don't have permission to reject claims.");
      return;
    }
    setClaims(prevClaims =>
      prevClaims.map(claim =>
        claim.id === claimId
          ? {
              ...claim,
              status: 'REJECTED',
              lastUpdated: new Date().toISOString().split('T')[0],
              milestones: claim.milestones?.map(m => m.name === 'Approval Decision' ? { ...m, status: 'completed', date: new Date().toISOString().split('T')[0] } : m),
              auditLog: [...(claim.auditLog || []), { timestamp: new Date().toISOString(), user: `${currentUserRole}`, action: 'Claim Rejected', details: 'Claim has been rejected.' }],
            }
          : claim
      )
    );
    alert(`Claim ${claimId} Rejected!`);
  };

  const renderDashboard = () => {
    return (
      <div className="container">
        <div style={{ marginBottom: 'var(--spacing-lg)' }}>
          <h1 className="section-title">Claim Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--font-size-md)' }}>
            Overview of all active and recently processed insurance claims.
            <span style={{ marginLeft: 'var(--spacing-md)', fontWeight: 600, color: 'var(--color-info)' }}>
              ↗ Trends: Auto Claims up 5% this month.
            </span>
          </p>
        </div>
        <div className="dashboard-grid">
          {claims?.map(claim => (
            <div
              key={claim.id}
              className={`card ${STATUS_MAP[claim.status]?.className}`}
              onClick={() => handleClaimClick(claim.id)}
              style={{
                borderColor: STATUS_MAP[claim.status]?.colorVarBorder || 'var(--glass-border)',
              }}
            >
              <div className="card-header">
                <div className="card-title">Claim #{claim.id}</div>
                <div
                  className="card-status"
                  style={{
                    backgroundColor: STATUS_MAP[claim.status]?.colorVarBg,
                    borderColor: STATUS_MAP[claim.status]?.colorVarBorder,
                    color: STATUS_MAP[claim.status]?.colorVarBorder,
                  }}
                >
                  {STATUS_MAP[claim.status]?.label}
                </div>
              </div>
              <div className="card-body">
                <p><strong>Policyholder:</strong> {claim.policyholder}</p>
                <p><strong>Type:</strong> {claim.type}</p>
                <p><strong>Amount:</strong> {formatCurrency(claim.amount)}</p>
              </div>
              <div className="card-footer">
                <span>Submitted: {formatDate(claim.submissionDate)}</span>
                <span>Last Update: {formatDate(claim.lastUpdated)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderClaimDetail = (claimId) => {
    const claim = claims?.find(c => c.id === claimId);
    if (!claim) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: 'var(--spacing-xxl)' }}>
          <h2 style={{ color: 'var(--color-danger)' }}>Claim not found.</h2>
          <button className="button button-secondary" onClick={handleGoBack} style={{ marginTop: 'var(--spacing-lg)' }}>
            Go to Dashboard
          </button>
        </div>
      );
    }

    const canApproveReject = (currentUserRole === ROLES.CLAIMS_OFFICER || currentUserRole === ROLES.CLAIMS_MANAGER) &&
                            (claim.status === 'PENDING' || claim.status === 'IN_PROGRESS' || claim.status === 'EXCEPTION');
    const canViewFinanceData = currentUserRole === ROLES.FINANCE_TEAM || currentUserRole === ROLES.CLAIMS_MANAGER;

    return (
      <div className="container">
        <div className="subheader">
          <div className="subheader-breadcrumbs">
            <a onClick={handleGoBack}>Dashboard</a> <span>Claim #{claim.id}</span>
          </div>
          <div className="detail-view-actions">
            {canApproveReject && (
              <>
                <button className="button button-success" onClick={() => handleApproveClaim(claim.id)}>
                  Approve Claim
                </button>
                <button className="button button-danger" onClick={() => handleRejectClaim(claim.id)}>
                  Reject Claim
                </button>
              </>
            )}
            <button className="button button-secondary" onClick={handleGoBack}>
              Back to Dashboard
            </button>
          </div>
        </div>

        <h1 className="section-title">Claim #{claim.id} - {STATUS_MAP[claim.status]?.label}</h1>

        <div className="detail-grid" style={{ marginBottom: 'var(--spacing-lg)' }}>
          <div className="detail-section">
            <h3 className="detail-section-title">Claim Summary</h3>
            <div className="detail-item">
              <span className="detail-item-label">Policyholder:</span>
              <span className="detail-item-value">{claim.policyholder}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Policy Number:</span>
              <span className="detail-item-value">{claim.policyNumber}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Claim Type:</span>
              <span className="detail-item-value">{claim.type}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Claim Amount:</span>
              <span className="detail-item-value">{formatCurrency(claim.amount)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Status:</span>
              <span className="detail-item-value" style={{
                color: STATUS_MAP[claim.status]?.colorVarBorder,
                fontWeight: 600,
              }}>{STATUS_MAP[claim.status]?.label}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Submission Date:</span>
              <span className="detail-item-value">{formatDate(claim.submissionDate)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Last Updated:</span>
              <span className="detail-item-value">{formatDate(claim.lastUpdated)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-item-label">Assigned Officer:</span>
              <span className="detail-item-value">{claim.officer}</span>
            </div>
            <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="detail-item-label" style={{ marginBottom: 'var(--spacing-xs)' }}>Description:</span>
              <span className="detail-item-value">{claim.description}</span>
            </div>
            <div className="detail-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <span className="detail-item-label" style={{ marginBottom: 'var(--spacing-xs)' }}>Supporting Documents:</span>
              <div className="detail-item-value">
                {claim.documents?.length > 0 ? (
                  claim.documents.map((doc, index) => (
                    <div key={index} style={{ marginBottom: 'var(--spacing-xs)' }}>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary)', textDecoration: 'none' }}>
                        {doc.name}
                      </a>
                    </div>
                  ))
                ) : (
                  <span>No documents provided.</span>
                )}
              </div>
            </div>
            {canViewFinanceData && (
              <div style={{ marginTop: 'var(--spacing-md)', borderTop: '1px solid var(--border-light)', paddingTop: 'var(--spacing-md)' }}>
                <h4 style={{ fontSize: 'var(--font-size-md)', marginBottom: 'var(--spacing-sm)', color: 'var(--text-main)' }}>Finance Details (Internal)</h4>
                <div className="detail-item">
                  <span className="detail-item-label">Payment ID:</span>
                  <span className="detail-item-value">FIN-P-12345 (placeholder)</span>
                </div>
                <div className="detail-item">
                  <span className="detail-item-label">Cost Center:</span>
                  <span className="detail-item-value">CC-INS-AUTO (placeholder)</span>
                </div>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3 className="detail-section-title">Workflow Progress</h3>
            <div className="milestone-tracker">
              {claim.milestones?.map((milestone, index) => (
                <div key={index} className={`milestone-step ${milestone.status}`}>
                  <div className="milestone-step-indicator"></div>
                  <div className="milestone-step-content">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="milestone-step-title">{milestone.name}</span>
                      <span className="milestone-step-status">
                        {milestone.status}
                      </span>
                    </div>
                    {milestone.date && <span className="milestone-step-date">{formatDate(milestone.date)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="detail-section" style={{ gridColumn: '1 / -1' }}> {/* Spans full width */}
            <h3 className="detail-section-title">News/Audit Feed</h3>
            <div className="audit-feed">
              {claim.auditLog
                ?.filter(entry => {
                  // Basic RBAC for audit log visibility
                  if (currentUserRole === ROLES.POLICYHOLDER && !entry.user.includes('Policyholder')) {
                    // Policyholders only see their own actions
                    return entry.user === claim.policyholder;
                  }
                  return true; // Other roles see all logs for now
                })
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()) // Newest first
                .map((entry, index) => (
                  <div key={index} className="audit-entry">
                    <div className="audit-entry-timestamp">{formatDateTime(entry.timestamp)}</div>
                    <div className="audit-entry-details">
                      <strong>{entry.user}</strong>: {entry.details}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">Insurance Claim System</h1>
        <div className="header-meta">
          <span>Current Role: <span className="header-role">{currentUserRole}</span></span>
          {/* A simple role switcher for demo purposes */}
          <select
            value={currentUserRole}
            onChange={(e) => setCurrentUserRole(e.target.value)}
            style={{
              padding: 'var(--spacing-xs) var(--spacing-sm)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-main)',
              backgroundColor: 'var(--bg-secondary)',
              color: 'var(--text-main)',
              fontSize: 'var(--font-size-sm)'
            }}
          >
            {Object.values(ROLES).map(role => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
      </header>

      {view.screen === 'DASHBOARD' && renderDashboard()}
      {view.screen === 'CLAIM_DETAIL' && renderClaimDetail(view.params?.claimId)}
    </div>
  );
}

export default App;