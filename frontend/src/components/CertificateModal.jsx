import React, { useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { 
  X, 
  Download, 
  ShieldCheck, 
  Award, 
  Zap, 
  CheckCircle2, 
  Share2, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export default function CertificateModal() {
  const { 
    viewCertificateModal, 
    setViewCertificateModal, 
    resumeData, 
    showToast,
    setShowVerifyModal,
    setVerifyCertId
  } = useApp();

  const certRef = useRef(null);
  const [copied, setCopied] = useState(false);

  if (!viewCertificateModal) return null;

  const cert = viewCertificateModal;
  const recipientName = cert.recipientName || resumeData?.candidate?.name || 'Candidate Professional';

  const downloadPDF = async () => {
    if (!certRef.current) return;
    try {
      showToast('Rendering high-resolution PDF certificate...', 'info');
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#090d16'
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${cert.skillName.replace(/\s+/g, '_')}_Certificate_${cert.id}.pdf`);
      showToast('Certificate PDF downloaded successfully!', 'success');
    } catch (err) {
      console.error('Failed to export PDF:', err);
      showToast('Failed to generate PDF: ' + err.message, 'error');
    }
  };

  const copyPublicLink = () => {
    const url = `${window.location.origin}/?verify=${cert.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    showToast('Public verification link copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const openVerifyRegistry = () => {
    setVerifyCertId(cert.id);
    setViewCertificateModal(null);
    setShowVerifyModal(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden my-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Digital Skill Credential &bull; {cert.id}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyPublicLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-750 text-slate-200 text-xs font-bold border border-slate-700 transition-colors"
              title="Copy shareable link for LinkedIn/Portfolio"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-sky-400" />}
              <span>{copied ? 'Link Copied' : 'Share Link'}</span>
            </button>

            <button
              onClick={downloadPDF}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-extrabold shadow-md hover:opacity-95 transition-opacity"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download PDF</span>
            </button>

            <button
              onClick={() => setViewCertificateModal(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Template */}
        <div className="p-4 sm:p-8 bg-slate-950 flex justify-center overflow-x-auto">
          <div
            ref={certRef}
            className="w-[800px] h-[540px] bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 p-10 border-8 border-indigo-500/30 rounded-2xl relative flex flex-col justify-between text-center select-none shadow-2xl overflow-hidden"
          >
            {/* Background Decorative Seals & Lines */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none"></div>

            {/* Header */}
            <div>
              <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="font-extrabold text-sm text-white tracking-tight">Upskill<span className="text-sky-400">AI</span></span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">Certificate ID</span>
                  <span className="text-xs font-mono text-slate-300 font-bold">{cert.id}</span>
                </div>
              </div>

              <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">
                Official Statement of Accomplishment
              </span>
              <h1 className="text-2xl font-extrabold text-white mt-1">CERTIFICATE OF PROVEABLE SKILL MASTERY</h1>
            </div>

            {/* Recipient Body */}
            <div className="my-auto space-y-3">
              <p className="text-xs text-slate-400 italic">This is to certify that</p>
              <h2 className="text-3xl font-extrabold text-sky-400 tracking-wide underline decoration-indigo-500/50 underline-offset-8">
                {recipientName}
              </h2>
              <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                has successfully completed the comprehensive AI Workforce evaluation curriculum for
              </p>
              <div className="inline-block px-6 py-2 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-white font-extrabold text-lg shadow-inner">
                {cert.skillName}
              </div>
              <p className="text-xs text-emerald-400 font-bold flex items-center justify-center gap-1">
                <CheckCircle2 className="w-4 h-4" />
                Examination Score: {cert.scorePercent}% &bull; Grade: Honors
              </p>
            </div>

            {/* Footer Signatures & QR */}
            <div className="flex items-end justify-between border-t border-slate-800/80 pt-4 text-left">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Issued Date</span>
                <span className="text-xs font-bold text-slate-200">{cert.issuedDate}</span>
              </div>

              {/* Gold Medal Badge */}
              <div 
                onClick={openVerifyRegistry}
                className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                title="Click to verify in online registry"
              >
                <div className="w-full h-full rounded-full bg-slate-950 flex flex-col items-center justify-center text-amber-400">
                  <ShieldCheck className="w-6 h-6" />
                  <span className="text-[8px] font-extrabold uppercase tracking-tighter mt-0.5">VERIFIED</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase block">Verification Code</span>
                <span className="text-xs font-mono text-slate-300 font-bold">{cert.verificationCode}</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
