const { useState, useEffect } = React;
const { createRoot } = ReactDOM;

// Retrieve components we attached to window in previous steps
const Header = window.Header;
const Feed = window.Feed;
const Profile = window.Profile;
const Modal = window.Modal;

const App = () => {
  // --- State Management ---
  const [user, setUser] = useState(null); // Current Logged-in User
  const [view, setView] = useState('feed'); // Current Page: 'feed' or 'profile'
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
  const [loading, setLoading] = useState(true); // Initial Auth Loading
  
  // Retrieve Firebase Auth methods
  const { auth, googleProvider, signInWithPopup, signOut, onAuthStateChanged } = window.firebase;
  
  // --- Effects ---
  // Listen to Firebase Auth state changes (Persistent Session)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User Logged In:", currentUser.displayName);
        setUser(currentUser);
      } else {
        console.log("User Logged Out");
        setUser(null);
      }
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);
  
  // --- Handlers ---
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login Error:", error);
      alert("Login failed. Check console for details.");
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView('feed'); // Go back to feed after logout
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };
  
  // Show nothing (or a spinner) while checking if user is logged in
  if (loading) return null;
  
  return (
    <React.Fragment>
            {/* 1. Header (Navigation) */}
            <Header 
                user={user} 
                setView={setView} 
                handleLogin={handleLogin} 
            />

            {/* 2. Main Content Area */}
            <main>
                {view === 'feed' && <Feed user={user} />}
                
                {view === 'profile' && (
                    <Profile 
                        user={user} 
                        handleLogout={handleLogout} 
                    />
                )}
            </main>

            {/* 3. Floating Action Button (FAB) - Only show if logged in */}
            {user && (
                <div className="fab" onClick={() => setIsModalOpen(true)}>
                    <i className="fa-solid fa-plus"></i>
                </div>
            )}

            {/* 4. Create Post Modal */}
            <Modal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                user={user} 
            />

        </React.Fragment>
  );
};

// --- Render the App ---
const root = createRoot(document.getElementById('root'));
root.render(<App />);