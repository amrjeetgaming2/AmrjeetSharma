const Header = ({ user, setView, handleLogin }) => {
  return (
    <header className="app-header glass">
            {/* 1. Brand Logo: Click to go Home */}
            <div className="brand" onClick={() => setView('feed')}>
                <i className="fa-solid fa-brain" style={{marginRight:'8px'}}></i>
                AI Nexus
            </div>

            {/* 2. Right Side: Auth State */}
            <div>
                {user ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                        {/* Home Button */}
                        <i 
                            className="fa-solid fa-house" 
                            style={{fontSize: '1.2rem', cursor: 'pointer', color: 'var(--text-secondary)'}}
                            onClick={() => setView('feed')}
                        ></i>

                        {/* Profile Avatar */}
                        <img 
                            src={user.photoURL} 
                            alt="Profile" 
                            className="user-avatar-sm"
                            onClick={() => setView('profile')}
                            style={{cursor: 'pointer'}}
                        />
                    </div>
                ) : (
                    <button className="btn btn-primary" onClick={handleLogin}>
                        <i className="fa-brands fa-google"></i> Sign In
                    </button>
                )}
            </div>
        </header>
  );
};

// Expose to global scope for app.js
window.Header = Header;