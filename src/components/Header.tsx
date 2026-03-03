import { useState, useRef, useEffect } from 'react';
import {
  Flame, Package, Calculator, BarChart3, History, Settings,
  ShoppingCart, User, LogOut, ChevronDown, Menu, X, Bell
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

type ActiveSection = 'hero' | 'catalog' | 'simulator' | 'history' | 'dashboard' | 'settings';

interface HeaderProps {
  activeSection: ActiveSection;
  onNavigate: (section: ActiveSection) => void;
  cartCount: number;
}

export default function Header({ activeSection, onNavigate, cartCount }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { id: 'catalog' as ActiveSection, label: 'Catalogue', icon: <Package size={16} /> },
    { id: 'simulator' as ActiveSection, label: 'Simulateur', icon: <Calculator size={16} /> },
    { id: 'history' as ActiveSection, label: 'Historique', icon: <History size={16} /> },
    { id: 'dashboard' as ActiveSection, label: 'Tableau de bord', icon: <BarChart3 size={16} /> },
    { id: 'settings' as ActiveSection, label: 'Paramètres', icon: <Settings size={16} /> },
  ];

  const getUserDisplayName = () => {
    if (!user) return '';
    const fullName = user.user_metadata?.full_name;
    if (fullName) return fullName.split(' ')[0];
    return user.email?.split('@')[0] || 'Utilisateur';
  };

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'linear-gradient(135deg, #0F172A 0%, #1A365D 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>

            {/* Logo */}
            <button
              onClick={() => onNavigate('hero')}
              style={{
                display: 'flex', alignItems: 'center', gap: '10px',
                background: 'none', border: 'none', cursor: 'pointer', padding: 0
              }}
            >
              <div style={{
                background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                borderRadius: '10px', padding: '8px',
                boxShadow: '0 2px 8px rgba(237, 137, 54, 0.4)',
              }}>
                <Flame size={20} color="white" />
              </div>
              <div>
                <div style={{ fontFamily: 'Poppins', fontWeight: 800, fontSize: '18px', color: 'white', lineHeight: '1' }}>
                  GazNet<span style={{ color: '#ED8936' }}>Pro</span>
                </div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', lineHeight: '1', marginTop: '2px' }}>
                  GESTION INSTALLATION GAZ
                </div>
              </div>
            </button>

            {/* Desktop Navigation */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }} className="desktop-nav">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '7px 14px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', transition: 'all 0.2s',
                    fontFamily: 'Poppins', fontWeight: 500, fontSize: '13px',
                    background: activeSection === item.id
                      ? 'rgba(237, 137, 54, 0.15)'
                      : 'transparent',
                    color: activeSection === item.id
                      ? '#ED8936'
                      : 'rgba(255,255,255,0.7)',
                    borderBottom: activeSection === item.id
                      ? '2px solid #ED8936'
                      : '2px solid transparent',
                  }}
                  onMouseEnter={e => {
                    if (activeSection !== item.id) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,255,255,0.08)';
                      (e.currentTarget as HTMLButtonElement).style.color = 'white';
                    }
                  }}
                  onMouseLeave={e => {
                    if (activeSection !== item.id) {
                      (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                      (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)';
                    }
                  }}
                >
                  {item.icon}
                  {item.label}
                </button>
              ))}
            </nav>

            {/* Right side actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Notification bell */}
              <button style={{
                background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
                width: '36px', height: '36px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                <Bell size={16} />
              </button>

              {/* Cart */}
              <button
                onClick={() => onNavigate('simulator')}
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
                  width: '36px', height: '36px', cursor: 'pointer', color: 'rgba(255,255,255,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'
                }}
              >
                <ShoppingCart size={16} />
                {cartCount > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-4px',
                    background: '#ED8936', color: 'white', borderRadius: '50%',
                    width: '18px', height: '18px', fontSize: '10px', fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'Poppins', border: '2px solid #1A365D'
                  }}>
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </button>

              {/* Auth */}
              {user ? (
                <div style={{ position: 'relative' }} ref={userMenuRef}>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'rgba(237, 137, 54, 0.15)', border: '1px solid rgba(237, 137, 54, 0.3)',
                      borderRadius: '8px', padding: '6px 12px', cursor: 'pointer',
                      color: 'white', fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px'
                    }}
                  >
                    <div style={{
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 700, fontSize: '11px', color: 'white'
                    }}>
                      {getUserDisplayName().charAt(0).toUpperCase()}
                    </div>
                    <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {getUserDisplayName()}
                    </span>
                    <ChevronDown size={14} style={{ transition: 'transform 0.2s', transform: showUserMenu ? 'rotate(180deg)' : 'none' }} />
                  </button>

                  {showUserMenu && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: 'white', borderRadius: '12px', minWidth: '200px',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.2)', border: '1px solid #E2E8F0',
                      overflow: 'hidden', zIndex: 200, animation: 'fadeInUp 0.2s ease-out'
                    }}>
                      <div style={{ padding: '12px 16px', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                        <div style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: '13px', color: '#1E293B' }}>
                          {user.user_metadata?.full_name || 'Utilisateur'}
                        </div>
                        <div style={{ fontFamily: 'Poppins', fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                          {user.email}
                        </div>
                      </div>
                      {[
                        { label: 'Mon profil', icon: <User size={14} />, action: () => { setShowUserMenu(false); } },
                        { label: 'Paramètres', icon: <Settings size={14} />, action: () => { onNavigate('settings'); setShowUserMenu(false); } },
                        { label: 'Mes devis', icon: <History size={14} />, action: () => { onNavigate('history'); setShowUserMenu(false); } },
                      ].map(item => (
                        <button
                          key={item.label}
                          onClick={item.action}
                          style={{
                            width: '100%', padding: '10px 16px', border: 'none', background: 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                            fontFamily: 'Poppins', fontSize: '13px', color: '#334155', textAlign: 'left',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#F1F5F9')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span style={{ color: '#64748B' }}>{item.icon}</span>
                          {item.label}
                        </button>
                      ))}
                      <div style={{ borderTop: '1px solid #E2E8F0', padding: '4px' }}>
                        <button
                          onClick={() => { signOut(); setShowUserMenu(false); }}
                          style={{
                            width: '100%', padding: '10px 12px', border: 'none', background: 'transparent',
                            cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                            fontFamily: 'Poppins', fontSize: '13px', color: '#E53E3E', borderRadius: '8px',
                            transition: 'background 0.15s'
                          }}
                          onMouseEnter={e => (e.currentTarget.style.background = '#FFF5F5')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <LogOut size={14} />
                          Se déconnecter
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowAuthModal(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    background: 'linear-gradient(135deg, #ED8936, #F6AD55)',
                    border: 'none', borderRadius: '8px', padding: '8px 16px',
                    cursor: 'pointer', color: 'white', fontFamily: 'Poppins',
                    fontWeight: 600, fontSize: '13px', boxShadow: '0 2px 8px rgba(237,137,54,0.3)'
                  }}
                >
                  <User size={15} />
                  Connexion
                </button>
              )}

              {/* Mobile menu toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="mobile-menu-btn"
                style={{
                  background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '8px',
                  width: '36px', height: '36px', cursor: 'pointer', color: 'white',
                  display: 'none', alignItems: 'center', justifyContent: 'center'
                }}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div style={{
            background: '#1A365D', borderTop: '1px solid rgba(255,255,255,0.1)',
            padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '12px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer',
                  background: activeSection === item.id ? 'rgba(237, 137, 54, 0.15)' : 'transparent',
                  color: activeSection === item.id ? '#ED8936' : 'rgba(255,255,255,0.8)',
                  fontFamily: 'Poppins', fontWeight: 500, fontSize: '14px', textAlign: 'left',
                }}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      <style>{`
        @media (max-width: 1024px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}
