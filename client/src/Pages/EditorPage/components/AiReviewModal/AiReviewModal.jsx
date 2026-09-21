import React from 'react';
import { Sparkles, X, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import styles from './AiReviewModal.module.css';

const AiReviewModal = ({ isOpen, onClose, isLoading, review }) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    if (!review) return;
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      toast.success('Review copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy review.');
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.titleArea}>
            <div className={styles.iconWrap}>
              <Sparkles size={16} />
            </div>
            <h3 className={styles.title}>AI Code Review</h3>
          </div>

          <div className={styles.headerActions}>
            {review && !isLoading && (
              <button
                type="button"
                className={styles.copyBtn}
                onClick={handleCopy}
              >
                {copied ? <Check size={13} color="#22c55e" /> : <Copy size={13} />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            )}
            <button
              type="button"
              className={styles.iconBtn}
              onClick={onClose}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className={styles.content}>
          {isLoading ? (
            <div className={styles.loadingBox}>
              <div className={styles.spinner} />
              <p className={styles.loadingText}>Analyzing your code with Gemini...</p>
            </div>
          ) : review ? (
            <pre className={styles.reviewBody}>{review}</pre>
          ) : (
            <p className={styles.loadingText}>No review available. Click "AI Review" to analyze your code.</p>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            type="button"
            className="tactile-btn-primary tactile-btn-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiReviewModal;
