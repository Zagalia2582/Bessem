import React, { useState } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, Flame, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
}

export default function AuthModal({ onClose }: AuthModalProps) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) {
          setError('Email ou mot de passe incorrect. Vérifiez vos identifiants.');
        } else {
          onClose();
        }
      } else {
        if (!fullName.trim()) {
          setError('Veuillez saisir votre nom complet.');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message?.includes('already registered')) {
            setError('Cet email est déjà utilisé. Connectez-vous plutôt.');
          } else {
            setError('Erreur lors de la création du compte. Réessayez.');
          }
        } else {
          setSuccess('Compte créé ! Vérifiez votre email pour confirmer votre inscription.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-content" style={{ maxWidth: '440px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1A365D 0%, #2C5282 100%)',
          padding: '28px 32px 24px',
          borderRadius: '16px 16px 0 0',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px',
              width: '32px', height: '32px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
            }}
          >
            <X size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              background: 'rgba(237, 137, 54, 0.2)',
              borderRadius: '10px', padding: '8px',
              border: '1px solid rgba(237, 137, 54, 0.3)'
            }}>
              <Flame size={20} color="#ED8936" />
            </div>
            <div>
              <h2 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 700, fontSize: '20px', margin: 0 }}>
                GazNet Pro
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', margin: 0, fontFamily: 'Poppins' }}>
                Système professionnel d'installation gaz
              </p>
            </div>
          </div>
          <h3 style={{ color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '16px', margin: '16px 0 0' }}>
            {mode === 'signin' ? 'Connexion à votre compte' : 'Créer un compte installateur'}
          </h3>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E2E8F0' }}>
          <button
            onClick={() => { setMode('signin'); setError(''); setSuccess(''); }}
            style={{
              flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px',
              background: 'transparent', transition: 'all 0.2s',
              color: mode === 'signin' ? '#2C5282' : '#94A3B8',
              borderBottom: mode === 'signin' ? '2px solid #2C5282' : '2px solid transparent',
            }}
          >
            Se connecter
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); setSuccess(''); }}
            style={{
              flex: 1, padding: '14px', border: 'none', cursor: 'pointer',
              fontFamily: 'Poppins', fontWeight: 600, fontSize: '14px',
              background: 'transparent', transition: 'all 0.2s',
              color: mode === 'signup' ? '#2C5282' : '#94A3B8',
              borderBottom: mode === 'signup' ? '2px solid #2C5282' : '2px solid transparent',
            }}
          >
            Créer un compte
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '28px 32px' }}>
          {error && (
            <div style={{
              background: '#FFF5F5', border: '1px solid #FEB2B2', borderRadius: '8px',
              padding: '12px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <AlertCircle size={16} color="#E53E3E" />
              <span style={{ fontSize: '13px', color: '#C53030', fontFamily: 'Poppins' }}>{error}</span>
            </div>
          )}
          {success && (
            <div style={{
              background: '#F0FFF4', border: '1px solid #9AE6B4', borderRadius: '8px',
              padding: '12px 16px', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '8px'
            }}>
              <CheckCircle size={16} color="#276749" />
              <span style={{ fontSize: '13px', color: '#276749', fontFamily: 'Poppins' }}>{success}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                Nom complet *
              </label>
              <div style={{ position: 'relative' }}>
                <User size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="input-field"
                  style={{ paddingLeft: '38px' }}
                  placeholder="Mohamed Ben Ali"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
              Email *
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="email"
                className="input-field"
                style={{ paddingLeft: '38px' }}
                placeholder="installateur@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
              Mot de passe *
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="#94A3B8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field"
                style={{ paddingLeft: '38px', paddingRight: '38px' }}
                placeholder={mode === 'signup' ? 'Minimum 6 caractères' : 'Votre mot de passe'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8'
                }}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '12px', borderRadius: '10px',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #2C5282 0%, #3182CE 100%)',
              color: 'white', border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'Poppins', fontWeight: 700, fontSize: '15px',
              transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}
          >
            {loading ? (
              <>
                <div style={{ width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%' }} className="animate-spin" />
                Traitement...
              </>
            ) : mode === 'signin' ? '→ Se connecter' : '→ Créer mon compte'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#94A3B8', fontFamily: 'Poppins' }}>
            {mode === 'signin' ? 'Pas encore de compte ? ' : 'Déjà un compte ? '}
            <button
              type="button"
              onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setSuccess(''); }}
              style={{ background: 'none', border: 'none', color: '#2C5282', cursor: 'pointer', fontWeight: 600, fontFamily: 'Poppins', fontSize: '12px' }}
            >
              {mode === 'signin' ? 'Créer un compte' : 'Se connecter'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
