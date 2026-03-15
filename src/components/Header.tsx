import { useState, useRef, useEffect } from 'react';
import {
  Flame, Package, Calculator, BarChart3, History, Settings,
  ShoppingCart, User, LogOut, ChevronDown, Menu, X
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';
import { useToastContext } from '../contexts/ToastContext';

type ActiveSection = 'hero' | 'catalog' | 'simulator' | 'history' | 'dashboard' | 'settings';

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  cartCount: number;
}

export default function Header({ activeSection, onNavigate, cartCount }: HeaderProps) {
  const { user, signOut } = useAuth();
  const { toast } = useToastContext();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 1024) setMobileMenuOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const navItems = [
    { id: 'catalog' as ActiveSection,   label: 'Catalogue',       icon: <Package size={16} />,    shortLabel: 'Catalogue' },
    { id: 'simulator' as ActiveSection, label: 'Simulateur',      icon: <Calculator size={16} />, shortLabel: 'Devis' },
    { id: 'history' as ActiveSection,   label: 'Historique',      icon: <History size={16} />,    shortLabel: 'Historique' },
    { id: 'dashboard' as ActiveSection, label: 'Tableau de bord', icon: <BarChart3 size={16} />,  shortLabel: 'Dashboard' },
    { id: 'settings' as ActiveSection,  label: 'Paramètres',      icon: <Settings size={16} />,   shortLabel: 'Réglages' },
  ];

  const getUserDisplayName = () => {
    if (!user) return '';
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(' ')[0];
    return user.email?.split('@')[0] || 'Utilisateur';
  };

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    setMobileMenuOpen(false);
    toast.info('Déconnecté', { message: 'À bientôt !', duration: 2500 });
  };

  const navigate = (section: ActiveSection) => {
    onNavigate(section);
    setMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(135deg, #0F172A 0%, #1A365D 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '60px', gap: '8px' }}>

            {/* ── Logo ── */}
            <button onClick={() => navigate('hero')} style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0,
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                borderRadius: '9px', padding: '7px',
                boxShadow: '0 2px 8px rgba(237,137,54,0.4)',
              }}>
                <Flame size={18} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '17px', color: 'white', lineHeight: 1 }}>
                  GazNet<span style={{ color: '#ED8936' }}>Pro</span>
                </div>
                <div className="logo-sub" style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: '8px', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em', lineHeight: 1, marginTop: '2px' }}>
                  GESTION GAZ
                </div>
              </div>
            </button>

            {/* ── Desktop Nav ── */}
            <nav className="hdr-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '2px', flex: 1, justifyContent: 'center' }}>
              {navItems.map(item => {
                const active = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => navigate(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '5px',
                    padding: '6px 11px', borderRadius: '7px', border: 'none', cursor: 'pointer',
                    transition: 'all 0.2s',
                    fontFamily: 'Poppins', fontWeight: 500, fontSize: '12.5px',
                    background: active ? 'rgba(237,137,54,0.18)' : 'transparent',
                    color: active ? '#ED8936' : 'rgba(255,255,255,0.7)',
                    borderBottom: active ? '2px solid #ED8936' : '2px solid transparent',
                    whiteSpace: 'nowrap',
                  }}
                    onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)'; (e.currentTarget as HTMLElement).style.color = 'white'; } }}
                    onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.7)'; } }}
                  >
                    {item.icon}
                    <span className="nav-label-full">{item.label}</span>
                    <span className="nav-label-short">{item.shortLabel}</span>
                  </button>
                );
              })}
            </nav>

            {/* ── Right actions ── */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
              {/* Cart */}
              <button onClick={() => navigate('simulator')} title="Simulateur de devis" style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
                width: '36px', height: '36px', cursor: 'pointer', color: 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative',
                transition: 'background 0.2s',
              }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ED8936', color: 'white', borderRadius: '50%',
                    width: '17px', height: '17px', fontSize: '9px', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Poppins', border: '2px solid #1A365D',
                  }}>
                    {cartCount > 9 ? '9+' : cartCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div style={{ position: 'relative' }} ref={userMenuRef}>
                  <button onClick={() => setShowUserMenu(!showUserMenu)} style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'rgba(237,137,54,0.15)', border: '1px solid rgba(237,137,54,0.3)',
                    borderRadius: '8px', padding: '5px 10px', cursor: 'pointer',
                    color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '12.5px',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                      background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 800, fontSize: '10px',
                    }}>
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <span className="user-name-label" style={{ maxWidth: '90px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown size={13} style={{ transition: 'transform 0.2s', transform: showUserMenu ? 'rotate(180deg)' : 'none', flexShrink: 0 }} />
                  </button>

                  {showUserMenu && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: 'white', borderRadius: '12px', minWidth: '200px',
                      boxShadow: '0 12px 40px rgba(0,0,0,0.18)', border: '1px solid #E2E8F0',
                      overflow: 'hidden', zIndex: 200, animation: 'fadeInDown .2s ease',
                    }}>
                      <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '13px', color: '#1E293B' }}>
                          {user.user_metadata?.full_name || getUserDisplayName()}
                        </div>
                        <div style={{ fontFamily: 'Poppins', fontSize: '11.5px', color: '#64748B', marginTop: '2px', wordBreak: 'break-all' }}>
                          {user.email}
                        </div>
                      </div>
                      {[
                        { label: 'Paramètres', icon: <Settings size={14} />, action: () => navigate('settings') },
                        { label: 'Mes devis', icon: <History size={14} />, action: () => navigate('history') },
                        { label: 'Tableau de bord', icon: <BarChart3 size={14} />, action: () => navigate('dashboard') },
                      ].map(item => (
                        <button key={item.label} onClick={item.action} style={{
                          width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                          fontFamily: 'Poppins', fontSize: '13px', color: '#334155', textAlign: 'left',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ color: '#64748B' }}>{item.icon}</span>{item.label}
                        </button>
                      ))}
                      <div style={{ borderTop: '1px solid #E2E8F0', padding: '4px' }}>
                        <button onClick={handleSignOut} style={{
                          width: '100%', padding: '10px 12px', border: 'none', background: 'transparent',
                          cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                          fontFamily: 'Poppins', fontSize: '13px', color: '#E53E3E', borderRadius: '8px',
                        }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut size={14} />Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setShowAuthModal(true)} style={{
                  display: 'flex', alignItems: 'center', gap: '5px',
                  background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                  border: 'none', borderRadius: '8px', padding: '7px 13px',
                  cursor: 'pointer', color: 'white', fontFamily: 'Poppins',
                  fontWeight: 600, fontSize: '12.5px', boxShadow: '0 2px 8px rgba(237,137,54,0.3)',
                  whiteSpace: 'nowrap',
                }}>
                  <User size={14} />
                  <span className="login-label">Connexion</span>
                </button>
              )}

              {/* Mobile hamburger */}
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="hdr-hamburger" style={{
                background: mobileMenuOpen ? 'rgba(237,137,54,0.15)' : 'rgba(255,255,255,0.08)',
                border: 'none', borderRadius: '8px',
                width: '36px', height: '36px', cursor: 'pointer', color: 'white',
                display: 'none', alignItems: 'center', justifyContent: 'center',
              }}>
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileMenuOpen && (
          <div style={{
            background: '#0F1F3D', borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '8px 12px 16px', animation: 'fadeInDown 0.2s ease',
          }}>
            {/* Nav items */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '10px' }}>
              {navItems.map(item => {
                const active = activeSection === item.id;
                return (
                  <button key={item.id} onClick={() => navigate(item.id)} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '11px 14px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                    background: active ? 'rgba(237,137,54,0.18)' : 'rgba(255,255,255,0.05)',
                    color: active ? '#ED8936' : 'rgba(255,255,255,0.8)',
                    fontFamily: 'Poppins', fontWeight: active ? 700 : 500, fontSize: '13px',
                    borderLeft: active ? '3px solid #ED8936' : '3px solid transparent',
                  }}>
                    {item.icon}{item.label}
                  </button>
                );
              })}
            </div>

            {/* Auth row in mobile */}
            {!user && (
              <button onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} style={{
                width: '100%', padding: '12px', borderRadius: '9px', border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg, #ED8936, #F6AD55)', color: 'white',
                fontFamily: 'Poppins', fontWeight: 700, fontSize: '14px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              }}>
                <User size={16} /> Se connecter / Créer un compte
              </button>
            )}
            {user && (
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '9px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: '13px', color: 'white' }}>{getUserDisplayName()}</div>
                  <div style={{ fontFamily: 'Poppins', fontSize: '11px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{user.email}</div>
                </div>
                <button onClick={handleSignOut} style={{
                  background: 'rgba(229,62,62,0.15)', border: '1px solid rgba(229,62,62,0.3)',
                  borderRadius: '7px', padding: '7px 12px', cursor: 'pointer', color: '#FC8181',
                  fontFamily: 'Poppins', fontSize: '12px', fontWeight: 600,
                  display: 'flex', alignItems: 'center', gap: '5px',
                }}>
                  <LogOut size={13} /> Déconnexion
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 1024px) {
          .hdr-desktop-nav { display: none !important; }
          .hdr-hamburger   { display: flex !important; }
        }
        @media (max-width: 640px) {
          .user-name-label { display: none; }
          .nav-label-full  { display: none; }
          .logo-sub        { display: none; }
        }
        @media (min-width: 641px) {
          .nav-label-short { display: none; }
        }
        @media (max-width: 400px) {
          .login-label { display: none; }
        }
      `}</style>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
