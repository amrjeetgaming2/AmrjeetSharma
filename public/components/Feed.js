const { useState, useEffect } = React;
// Note: Ensure window.Comments is loaded in index.html later if needed, 
// but since we rely on window object, it works as long as script order is correct.
const Comments = window.Comments;

const Feed = ({ user }) => {
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    
    // Kis post ka comment box khula hai? (Stores Post ID)
    const [activeCommentBox, setActiveCommentBox] = useState(null);
    
    const { db, collection, query, orderBy, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove } = window.firebase;
    
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const postsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPosts(postsData);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);
    
    const toggleLike = async (postId, currentLikes) => {
        if (!user) return alert("Please sign in to like!");
        const postRef = doc(db, "posts", postId);
        const isLiked = currentLikes.includes(user.uid);
        await updateDoc(postRef, { likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid) });
    };
    
    // Toggle Comment Section
    const toggleComments = (postId) => {
        if (activeCommentBox === postId) {
            setActiveCommentBox(null); // Band karein agar pehle se khula hai
        } else {
            setActiveCommentBox(postId); // Kholein
        }
    };
    
    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (post.category && post.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    return (
        <div className="container">
            {/* Search Bar */}
            <div style={{position: 'sticky', top: '70px', zIndex: 90, marginBottom: '20px'}}>
                <input 
                    type="text" 
                    className="form-input glass" 
                    placeholder="🔍 Search Tools, Categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{borderRadius: '50px', padding: '12px 20px'}}
                />
            </div>

            {loading && <div style={{textAlign:'center'}}>Loading AI Tools...</div>}

            {filteredPosts.map(post => {
                const isLiked = user && post.likes && post.likes.includes(user.uid);
                const isCommentOpen = activeCommentBox === post.id;
                
                return (
                    <div className="post-card" key={post.id}>
                        {/* Header */}
                        <div className="post-header">
                            <img src={post.userPhoto || "https://via.placeholder.com/40"} className="user-avatar-sm" alt="user" />
                            <div>
                                <strong>{post.userName}</strong>
                                <span style={{display:'block', fontSize:'0.75rem', color:'var(--accent)'}}>
                                    {post.category || 'Tech'}
                                </span>
                            </div>
                        </div>

                        {/* Image */}
                        <img src={post.image} alt={post.title} className="post-image" loading="lazy" />

                        {/* Actions Row */}
                        <div className="post-actions" style={{justifyContent: 'space-between'}}>
                            <div style={{display:'flex', gap:'20px'}}>
                                <i className={`fa-heart ${isLiked ? 'fa-solid' : 'fa-regular'}`} 
                                   style={{color: isLiked ? 'var(--danger)' : 'inherit'}}
                                   onClick={() => toggleLike(post.id, post.likes || [])}></i>
                                
                                {/* Comment Icon with Toggle Logic */}
                                <i className={`fa-regular fa-comment ${isCommentOpen ? 'fa-solid' : ''}`}
                                   onClick={() => toggleComments(post.id)}
                                   style={{color: isCommentOpen ? 'var(--accent)' : 'inherit'}}>
                                </i>
                            </div>

                            {post.toolUrl && (
                                <a href={post.toolUrl} target="_blank" className="btn btn-primary" 
                                   style={{padding:'5px 15px', fontSize:'0.9rem', textDecoration:'none'}}>
                                    Visit <i className="fa-solid fa-arrow-up-right-from-square"></i>
                                </a>
                            )}
                        </div>

                        {/* Content */}
                        <div className="post-content">
                            <div style={{marginBottom:'5px', fontWeight:'bold'}}>{(post.likes || []).length} likes</div>
                            <h3>{post.title}</h3>
                            <p style={{fontSize: '0.95rem', color: '#ccc'}}>{post.description}</p>
                        </div>

                        {/* Comment Section (Conditional Rendering) */}
                        {isCommentOpen && (
                            <div style={{padding: '0 12px 15px 12px'}}>
                                <Comments postId={post.id} user={user} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};
window.Feed = Feed;