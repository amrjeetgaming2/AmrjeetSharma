const { useState, useEffect } = React;

const Profile = ({ user, handleLogout }) => {
  const [myPosts, setMyPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Destructure Firebase tools
  const { db, collection, query, where, getDocs, orderBy } = window.firebase;
  
  // Fetch only the logged-in user's posts
  useEffect(() => {
    if (!user) return;
    
    const fetchMyPosts = async () => {
      const q = query(
        collection(db, "posts"),
        where("uid", "==", user.uid),
        orderBy("createdAt", "desc")
      );
      
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMyPosts(data);
      setLoading(false);
    };
    
    fetchMyPosts();
  }, [user]);
  
  if (!user) return <div className="container" style={{padding:'20px'}}>Please sign in.</div>;
  
  return (
    <div className="container">
            {/* 1. Profile Header (Avatar + Stats) */}
            <div className="profile-header">
                <img 
                    src={user.photoURL} 
                    alt="Profile" 
                    className="profile-pic"
                />
                
                <div className="stats">
                    <div className="stat-box">
                        <span>{myPosts.length}</span>
                        <small>Posts</small>
                    </div>
                    <div className="stat-box">
                        <span>1.2k</span>
                        <small>Followers</small>
                    </div>
                    <div className="stat-box">
                        <span>350</span>
                        <small>Following</small>
                    </div>
                </div>
            </div>

            {/* 2. Bio Section */}
            <div className="bio-section">
                <h3>{user.displayName}</h3>
                <p style={{color: 'var(--text-secondary)', fontSize:'0.9rem', margin:'5px 0 15px 0'}}>
                    AI Enthusiast & Developer 🚀 <br/>
                    Exploring the future of tech.
                </p>
                
                <div style={{display:'flex', gap:'10px'}}>
                    <button className="btn" style={{background:'#333', color:'white', flex:1}}>
                        Edit Profile
                    </button>
                    <button 
                        className="btn" 
                        style={{background:'var(--danger)', color:'white', flex:1}}
                        onClick={handleLogout}
                    >
                        Sign Out
                    </button>
                </div>
            </div>

            {/* 3. Post Grid (Gallery) */}
            <div style={{borderTop:'1px solid var(--glass-border)', paddingTop:'15px'}}>
                <div style={{display:'flex', gap:'20px', justifyContent:'center', marginBottom:'15px', color:'var(--text-secondary)'}}>
                    <i className="fa-solid fa-grid-2" style={{color:'var(--accent)'}}></i>
                    <i className="fa-regular fa-bookmark"></i>
                </div>

                {loading ? (
                    <div style={{textAlign:'center'}}>Loading Grid...</div>
                ) : (
                    <div className="grid-gallery">
                        {myPosts.map(post => (
                            <div key={post.id} className="grid-item">
                                <img src={post.image} alt="post" />
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Empty State */}
                {!loading && myPosts.length === 0 && (
                    <div style={{textAlign:'center', padding:'40px', color:'#555'}}>
                        <i className="fa-solid fa-camera fa-2x" style={{marginBottom:'10px'}}></i>
                        <p>No posts yet</p>
                    </div>
                )}
            </div>
        </div>
  );
};

window.Profile = Profile;