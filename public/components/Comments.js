const { useState, useEffect } = React;

const Comments = ({ postId, user }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { db, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp, doc } = window.firebase;
  
  // 1. Comments Fetch Karna (Real-time)
  useEffect(() => {
    // Path: posts/[postId]/comments
    const commentsRef = collection(db, "posts", postId, "comments");
    const q = query(commentsRef, orderBy("createdAt", "asc")); // Purane comments pehle
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [postId]);
  
  // 2. Naya Comment Add Karna
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return; // Khali comment na bhejein
    if (!user) return alert("Please Sign In to comment!");
    
    try {
      const commentsRef = collection(db, "posts", postId, "comments");
      await addDoc(commentsRef, {
        text: newComment,
        uid: user.uid,
        userName: user.displayName,
        userPhoto: user.photoURL,
        createdAt: serverTimestamp()
      });
      setNewComment(''); // Input clear karein
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };
  
  return (
    <div style={{
            background: 'rgba(0,0,0,0.3)', 
            padding: '15px', 
            borderRadius: '12px',
            marginTop: '10px'
        }}>
            {/* Comments List */}
            <div style={{maxHeight: '200px', overflowY: 'auto', marginBottom: '15px'}}>
                {loading && <small>Loading discussions...</small>}
                
                {!loading && comments.length === 0 && (
                    <p style={{color:'#888', fontSize:'0.9rem'}}>No comments yet. Be the first!</p>
                )}

                {comments.map(comment => (
                    <div key={comment.id} style={{display:'flex', gap:'10px', marginBottom:'12px'}}>
                        <img src={comment.userPhoto} style={{width:'30px', height:'30px', borderRadius:'50%'}} />
                        <div>
                            <div style={{fontSize:'0.85rem', fontWeight:'bold', color:'var(--text-secondary)'}}>
                                {comment.userName}
                            </div>
                            <div style={{fontSize:'0.95rem'}}>{comment.text}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Add Comment Input */}
            <form onSubmit={handleAddComment} style={{display:'flex', gap:'10px'}}>
                <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Write a comment..." 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    style={{padding:'8px', fontSize:'0.9rem'}}
                />
                <button type="submit" className="btn btn-primary" style={{padding:'8px 15px'}}>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </form>
        </div>
  );
};

window.Comments = Comments;