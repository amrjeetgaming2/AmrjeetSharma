const { useState } = React;

const Modal = ({ isOpen, onClose, user }) => {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [image, setImage] = useState('');
    const [toolUrl, setToolUrl] = useState(''); // NEW: Website Link
    const [category, setCategory] = useState('Chatbot'); // NEW: Category
    const [loading, setLoading] = useState(false);

    const { db, collection, addDoc, serverTimestamp } = window.firebase;

    // Pre-defined Categories
    const categories = ["Chatbot", "Image Generator", "Coding", "Video AI", "Productivity", "Other"];

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !desc) return alert("Title aur Description zaroori hai!");

        setLoading(true);

        try {
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                userName: user.displayName,
                userPhoto: user.photoURL,
                title: title,
                description: desc,
                image: image || "https://source.unsplash.com/random/800x600/?technology",
                toolUrl: toolUrl || "", // Save URL
                category: category,     // Save Category
                tags: [category, "#AI"], // Auto-tag category
                likes: [],
                createdAt: serverTimestamp()
            });

            // Reset Form
            setTitle(''); setDesc(''); setImage(''); setToolUrl('');
            setLoading(false);
            onClose();
            
        } catch (error) {
            console.error("Error:", error);
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                
                <div style={{display:'flex', justifyContent:'space-between', marginBottom:'15px'}}>
                    <h3>Add New AI Tool</h3>
                    <i className="fa-solid fa-xmark" onClick={onClose} style={{fontSize:'1.5rem', cursor:'pointer'}}></i>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Tool Name */}
                    <div className="form-group">
                        <input className="form-input" placeholder="Tool Name (e.g. ChatGPT)" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    
                    {/* Description */}
                    <div className="form-group">
                        <textarea className="form-input" rows="3" placeholder="Short description..." value={desc} onChange={(e) => setDesc(e.target.value)}></textarea>
                    </div>

                    {/* Category Dropdown (NEW) */}
                    <div className="form-group">
                        <label style={{color:'#ccc', fontSize:'0.8rem'}}>Category:</label>
                        <select className="form-input" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                    </div>

                    {/* Website Link (NEW) */}
                    <div className="form-group">
                        <input type="url" className="form-input" placeholder="Website Link (https://...)" value={toolUrl} onChange={(e) => setToolUrl(e.target.value)} />
                    </div>

                    {/* Image URL */}
                    <div className="form-group">
                        <input className="form-input" placeholder="Image URL (Optional)" value={image} onChange={(e) => setImage(e.target.value)} />
                    </div>

                    <button type="submit" className="btn btn-primary" style={{width:'100%'}} disabled={loading}>
                        {loading ? 'Publishing...' : '🚀 Launch Tool'}
                    </button>
                </form>
            </div>
        </div>
    );
};
window.Modal = Modal;