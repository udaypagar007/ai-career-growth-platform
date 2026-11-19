import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Search, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Award, 
  Calendar, 
  ExternalLink,
  Share2
} from 'lucide-react';

export default function CertificateVerification() {
  const { 
    showVerifyModal, 
    setShowVerifyModal, 
    verifyCertId, 
    setVerifyCertId,
    showToast 
  } = useApp();

  const [queryId, setQueryId] = useState(verifyCertId || 'CERT-DEMO-TS99');
  const [loading, setLoading] = useState(false);
  const [certData, setCertData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (verifyCertId) {
      setQueryId(verifyCertId);
      lookupCertificate(verifyCertId);
    } else {
      lookupCertificate('CERT-DEMO-TS99');
    }
  }, [verifyCertId]);

  const lookupCertificate = async (idToLookup) => {
    const id = (idToLookup || queryId).trim();
    if (!id) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch(`/api/certificate/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success && data.certificate) {
        setCertData(data.certificate);
      } else {
        setCertData(null);
        setErrorMsg(data.error || 'No verified record found with that Certificate ID.');
      }
    } catch (err) {
      setErrorMsg('Error querying verification registry: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/?verify=${certData?.id || queryId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Public verification link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!showVerifyModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl bg-app-surface rounded-xl border border-app-border shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-app-border bg-app-card">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-accent-amber" />
            <h2 className="text-sm font-bold text-white tracking-tight">Public Credential Audit Registry</h2>
          </div>
          <button
            onClick={() => setShowVerifyModal(false)}
            className="p-1 rounded-md text-zinc-500 hover:text-white hover:bg-app-hover transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          
          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-zinc-300">
              Certificate ID or Cryptographic Hash:
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={queryId}
                  onChange={(e) => setQueryId(e.target.value)}
                  placeholder="e.g. CERT-DEMO-TS99"
                  className="w-full bg-app-card border border-app-border rounded-lg pl-8 pr-3 py-2 text-xs text-white uppercase tracking-wider font-mono placeholder:normal-case placeholder:tracking-normal placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
                />
              </div>
              <button
                disabled={loading}
                onClick={() => lookupCertificate()}
                className="px-4 py-2 rounded-lg bg-accent-blue hover:bg-blue-600 text-white font-bold text-xs shadow-sm transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {errorMsg && (
            <div className="p-3 rounded-lg bg-accent-rose/10 border border-accent-rose/30 text-accent-rose text-xs flex items-center gap-2 font-mono">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Verified Certificate Card */}
          {certData && (
            <div className="p-5 rounded-xl bg-app-card border border-accent-emerald/30 space-y-4 shadow-xl">
              
              {/* Status Banner */}
              <div className="flex items-center justify-between border-b border-app-border pb-3">
                <div className="flex items-center gap-1.5 text-accent-emerald font-mono font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                  <span>OFFICIALLY VERIFIED CREDENTIAL</span>
                </div>
                <span className="text-[10px] font-mono text-zinc-500">ID: {certData.id}</span>
              </div>

              {/* Recipient and Skill Details */}
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-widest block">Recipient Candidate</span>
                <h3 className="text-lg font-bold text-white">{certData.recipientName}</h3>
                <div className="pt-1 flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-xs">
                    {certData.skillName}
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-accent-emerald/10 border border-accent-emerald/30 text-accent-emerald font-mono font-bold text-xs flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Passed: {certData.scorePercent}%
                  </span>
                </div>
              </div>

              {/* Meta Info Grid */}
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-app-border text-xs">
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Date Issued</span>
                  <span className="text-zinc-300 font-medium">{certData.issuedDate}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Audit Code</span>
                  <span className="text-zinc-300 font-mono font-semibold">{certData.verificationCode}</span>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block">Authority</span>
                  <span className="text-zinc-300 font-medium">{certData.issuer || 'UpskillAI'}</span>
                </div>
              </div>

              {/* Share & Copy Link Actions */}
              <div className="pt-3 border-t border-app-border flex items-center justify-between">
                <button
                  onClick={copyPublicLink}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-750 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-accent-emerald" /> : <Share2 className="w-3.5 h-3.5 text-accent-blue" />}
                  <span>{copied ? 'Link Copied!' : 'Copy Shareable Audit Link'}</span>
                </button>

                <span className="text-[10px] text-zinc-500 font-mono">
                  Audited by employers & recruiters
                </span>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
}
