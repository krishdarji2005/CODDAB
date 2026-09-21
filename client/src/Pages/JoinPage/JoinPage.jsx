import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, RefreshCw, AlertCircle, Users, Swords } from 'lucide-react';
import styles from './JoinPage.module.css';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

/* ── Generate a UUID-style room ID ── */
const generateRoomId = () => {
  return uuidv4();
};

const JoinPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  /* ── Mode: 'join' | 'create' ── */
  const [mode, setMode] = useState('join');

  /* ── Room type: 'collab' | 'battle' ── */
  const [roomType, setRoomType] = useState('collab');

  /* ── Form state ── */
  const [roomId, setRoomId]     = useState('');
  const [username, setUsername] = useState(user?.name || '');
  const [errors, setErrors]     = useState({});
  const [generated, setGenerated] = useState(false);

  useEffect(() => {
    if (user?.name && !username) {
      setUsername(user.name);
    }
  }, [user]);

  /* ── Switch mode — reset fields ── */
  const switchMode = (m) => {
    setMode(m);
    setRoomId('');
    setUsername(user?.name || '');
    setErrors({});
    setGenerated(false);
  };

  const handleSelectRoomType = (type) => {
    if (type === 'battle' && !isAuthenticated) {
      toast.error('Please log in first to access 1v1 Battle rooms.');
      navigate('/login', { state: { from: '/join' } });
      return;
    }
    setRoomType(type);
  };

  /* ── Generate room ID ── */
  const handleGenerate = useCallback(() => {
    const id = generateRoomId();
    setRoomId(id);
    setGenerated(true);
    setErrors((e) => ({ ...e, roomId: undefined }));
    toast.success('Room ID generated!');
  }, []);

  /* ── Validate ── */
  const validate = () => {
    const errs = {};
    const trimmedRoom = roomId.trim();
    const trimmedUser = username.trim();

    if (!trimmedRoom) {
      errs.roomId = 'Room ID is required.';
    } else if (trimmedRoom.length < 4) {
      errs.roomId = 'Room ID must be at least 4 characters.';
    }

    if (!trimmedUser) {
      errs.username = 'Display name is required.';
    } else if (trimmedUser.length < 2) {
      errs.username = 'Name must be at least 2 characters.';
    } else if (trimmedUser.length > 24) {
      errs.username = 'Name must be under 24 characters.';
    }

    return errs;
  };

  /* ── Submit ── */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (roomType === 'battle' && !isAuthenticated) {
      toast.error('Please log in first to access 1v1 Battle rooms.');
      navigate('/login', { state: { from: '/join' } });
      return;
    }

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      toast.error('Please fix the validation errors.');
      return;
    }
    
    toast.success(isCreate ? 'Room created successfully!' : 'Joined room!');

    // Navigate to editor — pass username + roomType via location state
    navigate(`/editor/${roomId.trim()}`, {
      state: {
        username: username.trim(),
        roomType,              // 'collab' | 'battle'
        isCreate,
      },
    });
  };

  const handleInputEnter = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const isJoin   = mode === 'join';
  const isCreate = mode === 'create';
  const canSubmit = roomId.trim().length >= 4 && username.trim().length >= 2;

  return (
    <div className={styles.page}>
      <div className={styles.column}>

        {/* ── Top bar ── */}
        <div className={styles.topBar}>
          <Link to="/" className={styles.brand}>
            <img src="/CoddabLogoKrish.svg" alt="Coddab logo" className={styles.logoMark} />
            <span className={styles.brandName}>Coddab</span>
          </Link>
          <Link to="/" className={styles.backLink}>
            <ArrowLeft size={14} />
            Back to home
          </Link>
        </div>

        {/* ── Main ── */}
        <main className={styles.main}>
          <div className={styles.card}>

            {/* ── Card header ── */}
            <div className={styles.cardHead}>
              <span className={styles.eyebrow}>
                {isJoin ? 'Join a Session' : 'Create a Session'}
              </span>
              <h1 className={styles.cardTitle}>
                {isJoin
                  ? 'Enter your room'
                  : 'Create your room'}
              </h1>
              <p className={styles.cardSubtitle}>
                {isJoin
                  ? 'Paste the room ID you received, enter your display name, and jump straight into the editor.'
                  : 'Generate a unique room ID, select your room mode, and start coding instantly.'}
              </p>
            </div>

            {/* ── Mode toggle ── */}
            <div className={styles.modeToggle}>
              <button
                type="button"
                className={`${styles.modeBtn} ${isJoin ? styles.modeBtnActive : ''}`}
                onClick={() => switchMode('join')}
              >
                Join existing room
              </button>
              <button
                type="button"
                className={`${styles.modeBtn} ${isCreate ? styles.modeBtnActive : ''}`}
                onClick={() => switchMode('create')}
              >
                Create new room
              </button>
            </div>

            {/* ── Room type selector ── */}
            <div className={styles.roomTypeSection}>
              <p className={styles.roomTypeLabel}>Select Room Mode</p>
              <div className={styles.roomTypeGrid}>
                <button
                  type="button"
                  className={`${styles.roomTypeCard} ${roomType === 'battle' ? styles.roomTypeCardActiveBattle : ''}`}
                  onClick={() => handleSelectRoomType('battle')}
                >
                  <span className={`${styles.roomTypeIcon} ${styles.roomTypeIconBattle}`}><Swords size={18} /></span>
                  <span className={styles.roomTypeName}>1v1 Battle Arena</span>
                  <span className={styles.roomTypeDesc}>Compete head-to-head on DSA problems</span>
                  {roomType === 'battle' && <span className={styles.roomTypeCheckBattle}>✓</span>}
                </button>

                <button
                  type="button"
                  className={`${styles.roomTypeCard} ${roomType === 'collab' ? styles.roomTypeCardActive : ''}`}
                  onClick={() => handleSelectRoomType('collab')}
                >
                  <span className={styles.roomTypeIcon}><Users size={18} /></span>
                  <span className={styles.roomTypeName}>Collab Room</span>
                  <span className={styles.roomTypeDesc}>Pair program with multi-cursor sync</span>
                  {roomType === 'collab' && <span className={styles.roomTypeCheck}>✓</span>}
                </button>
              </div>
            </div>

            {/* ── Form ── */}
            <form className={styles.form} onSubmit={handleSubmit} noValidate>

              {/* Room ID field */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="roomId">
                  <span>Room ID</span>
                  {generated && (
                    <span className={styles.generatedBadge}>
                      <span className={styles.generatedDot} />
                      Generated
                    </span>
                  )}
                </label>

                <div className={styles.inputWrap}>
                  <input
                    id="roomId"
                    type="text"
                    value={roomId}
                    onChange={(e) => {
                      setRoomId(e.target.value);
                      setGenerated(false);
                      if (errors.roomId) setErrors((er) => ({ ...er, roomId: undefined }));
                    }}
                    placeholder={isJoin ? 'e.g. 4f9a2c89' : 'Click generate →'}
                    className={`${styles.input} ${isCreate ? styles.inputWithAction : ''} ${errors.roomId ? styles.inputError : ''}`}
                    spellCheck={false}
                    autoComplete="off"
                    readOnly={isCreate && generated}
                    onKeyUp={handleInputEnter}
                  />
                  {isCreate && (
                    <button
                      type="button"
                      className={styles.inputAction}
                      onClick={handleGenerate}
                      title="Generate a random room ID"
                    >
                      <RefreshCw size={11} className={styles.refreshIcon} />
                      {generated ? 'Regenerate' : 'Generate'}
                    </button>
                  )}
                </div>

                {errors.roomId && (
                  <span className={styles.errorMsg}>
                    <AlertCircle size={12} />
                    {errors.roomId}
                  </span>
                )}
              </div>

              {/* Display name field */}
              <div className={styles.fieldGroup}>
                <label className={styles.label} htmlFor="username">
                  Display name
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors((er) => ({ ...er, username: undefined }));
                  }}
                  placeholder="e.g. alex"
                  className={`${styles.input} ${styles.inputName} ${errors.username ? styles.inputError : ''}`}
                  maxLength={24}
                  autoComplete="off"
                />
                {errors.username && (
                  <span className={styles.errorMsg}>
                    <AlertCircle size={12} />
                    {errors.username}
                  </span>
                )}
              </div>

              <div className={styles.divider} />

              {/* Submit Button — Tactile Beveled Style */}
              <button
                type="submit"
                disabled={!canSubmit}
                className={styles.submitBtn}
              >
                {isJoin ? 'Join room' : 'Create & enter room'}
                <ArrowRight size={16} />
              </button>

            </form>

            {/* ── Hint ── */}
            <p className={styles.hint}>
              {isJoin ? (
                <>
                  Don't have a room ID?{' '}
                  <button className={styles.hintLink} onClick={() => switchMode('create')}>
                    Create a new room
                  </button>
                </>
              ) : (
                <>
                  Already have a room ID?{' '}
                  <button className={styles.hintLink} onClick={() => switchMode('join')}>
                    Join it instead
                  </button>
                </>
              )}
            </p>

          </div>
        </main>

      </div>
    </div>
  );
};

export default JoinPage;