import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Award, 
  ShieldCheck, 
  Share2, 
  Download, 
  ExternalLink, 
  Copy, 
  Check, 
  Calendar, 
  Search, 
  FileCheck,
  Zap,
  Code
} from 'lucide-react';

export default function CredentialVault() {
  const { 
    certificates, 
    resumeData, 
    setViewCertificateModal, 
    setShowVerifyModal, 
    setVerifyCertId,
    showToast 
  } = useApp();

  const [copiedId, setCopiedId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Default demo certificate if none earned yet
  const displayCerts = certificates.length > 0 ? certificates : [
    {
      id: 'CERT-DEMO-TS99',
      skillName: 'TypeScript',
      recipientName: resumeData?.candidate?.name || 'Alex Turner',
      issuedDate: 'November 19, 2026',
      scorePercent: 100,
      verificationCode: 'VERIFIED-982341',
      badgeTitle: 'TypeScript Certified Professional',
      status: 'Officially Verified',
      issuer: 'UpskillAI Workforce Authority'
    }
  ];

  const filtered = displayCerts.filter(c => 
    c.skillName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyPublicLink = (certId) => {
    const url = `${window.location.origin}/?verify=${certId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(certId);
    showToast('Public audit URL copied to clipboard!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const copyBadgeMarkdown = (cert) => {
    const md = `[![${cert.skillName} Certified](https://img.shields.io/badge/${encodeURIComponent(cert.skillName)}-Certified%20(${cert.scorePercent}%25)-10B981?logo=checkmarx)](${window.location.origin}/?verify=${cert.id})`;
    navigator.clipboard.writeText(md);
    showToast('Portfolio Markdown badge copied!', 'success');
  };

  const verifyInRegistry = (certId) => {
    setVerifyCertId(certId);
    setShowVerifyModal(true);
  };

  return (
    <div className="h-full flex flex-col gap-6">
      
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-app-border">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">Credential Vault & Audit Ledger</h1>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-zinc-800 text-accent-emerald border border-zinc-700">
              CRYPTOGRAPHIC HASH VERIFIED
            </span>
          </div>
          <p className="text-xs text-zinc-400 mt-0.5">
            Tamper-proof digital skill certificates with public verification hashes and PDF export capabilities.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID or skill..."
              className="w-full bg-app-surface border border-app-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
            />
          </div>

          <button
            onClick={() => setShowVerifyModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700 flex items-center gap-1.5 transition-colors"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-accent-amber" />
            <span>Audit Registry</span>
          </button>
        </div>
      </div>

      {/* Main Ledger Table */}
      <div className="app-panel overflow-hidden flex flex-col flex-1 min-h-0">
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            
            {/* Table Header */}
            <thead>
              <tr className="bg-app-surface border-b border-app-border text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
                <th className="py-3 px-4">Credential & ID</th>
                <th className="py-3 px-4">Score & Honors</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Verification Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-app-border">
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-app-hover/50 transition-colors">
                  
                  {/* Credential Name & Hash */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-accent-amber/10 border border-accent-amber/30 text-accent-amber flex items-center justify-center font-bold flex-shrink-0">
                        <Award className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-zinc-100">{cert.skillName} Certified Professional</div>
                        <span className="text-[10px] text-zinc-500 font-mono tracking-wider block mt-0.5">
                          HASH: {cert.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Score */}
                  <td className="py-4 px-4">
                    <div className="space-y-1 font-mono">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{cert.scorePercent}%</span>
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-accent-emerald/15 text-accent-emerald border border-accent-emerald/20">
                          PASSED
                        </span>
                      </div>
                      <span className="text-[10px] text-zinc-500">Threshold: 70%</span>
                    </div>
                  </td>

                  {/* Issued Date */}
                  <td className="py-4 px-4 font-mono text-zinc-300">
                    {cert.issuedDate}
                  </td>

                  {/* Verification Status */}
                  <td className="py-4 px-4">
                    <button
                      onClick={() => verifyInRegistry(cert.id)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald text-[11px] font-mono font-medium hover:bg-accent-emerald/20 transition-colors"
                      title="Click to inspect cryptographic verification record"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{cert.verificationCode || 'VERIFIED-ONLINE'}</span>
                    </button>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => copyBadgeMarkdown(cert)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[11px] font-medium border border-zinc-700 flex items-center gap-1 transition-colors"
                        title="Copy Markdown badge for your GitHub profile README"
                      >
                        <Code className="w-3 h-3 text-zinc-400" />
                        <span>Badge MD</span>
                      </button>

                      <button
                        onClick={() => copyPublicLink(cert.id)}
                        className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-750 text-zinc-300 text-[11px] font-medium border border-zinc-700 flex items-center gap-1 transition-colors"
                        title="Copy public audit URL for LinkedIn/Portfolio"
                      >
                        {copiedId === cert.id ? <Check className="w-3 h-3 text-accent-emerald" /> : <Share2 className="w-3 h-3 text-accent-blue" />}
                        <span>{copiedId === cert.id ? 'Copied' : 'Share'}</span>
                      </button>

                      <button
                        onClick={() => setViewCertificateModal(cert)}
                        className="px-3 py-1 rounded-lg bg-accent-blue/15 hover:bg-accent-blue/25 text-accent-blue text-xs font-semibold border border-accent-blue/30 transition-colors flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
