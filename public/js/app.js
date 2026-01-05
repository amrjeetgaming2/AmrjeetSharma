// Firebase को इंपोर्ट करना
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// आपकी Secret Key (जो आपने मुझे दी थी)
const firebaseConfig = {
    apiKey: "AIzaSyDN_BnTqr6wV9B0L1lsRDZi3kl3HOfch8s",
    authDomain: "studio-9104778941-d15b9.firebaseapp.com",
    projectId: "studio-9104778941-d15b9",
    storageBucket: "studio-9104778941-d15b9.firebasestorage.app",
    messagingSenderId: "443523890689",
    appId: "1:443523890689:web:41b9c7ecc152db15764a00",
    measurementId: "G-RQZTZHESXP"
};

// ऐप स्टार्ट करना
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- लॉजिक शुरू ---

let isLoginMode = true; // पहले लॉगिन मोड रहेगा

// 1. लॉगिन/साइन-अप बटन बदलने का फंक्शन
window.toggleAuthMode = () => {
    isLoginMode = !isLoginMode;
    document.getElementById('form-title').innerText = isLoginMode ? "Login" : "Create Account";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Login" : "Register";
    document.getElementById('switch-text').innerText = isLoginMode ? "New here? Create Account" : "Have account? Login";
    document.getElementById('signup-fields').style.display = isLoginMode ? "none" : "block";
    document.getElementById('error-msg').innerText = "";
}

// 2. लॉगिन बटन दबाने पर क्या होगा
window.handleAuth = async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error-msg');
    const btn = document.getElementById('auth-btn');
    
    if(!email || !password) { errorEl.innerText = "Please fill all fields"; return; }
    btn.innerText = "Processing...";

    try {
        if (isLoginMode) {
            // लॉगिन करें
            await signInWithEmailAndPassword(auth, email, password);
        } else {
            // नया अकाउंट बनाएं
            const username = document.getElementById('username').value;
            const referral = document.getElementById('referral').value;
            
            if(!username) { throw new Error("Name is required"); }

            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // डेटाबेस में सेव करें (100 कॉइन बोनस)
            await setDoc(doc(db, "users", user.uid), {
                username: username,
                email: email,
                coins: 100,
                referralCode: user.uid.slice(0, 5),
                createdAt: new Date()
            });
        }
    } catch (error) {
        // एरर को साफ़ दिखाएं
        errorEl.innerText = error.message.replace("Firebase: ", "");
        btn.innerText = isLoginMode ? "Login" : "Register";
    }
}

// 3. चेक करें कि यूजर लॉगिन है या नहीं
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // लॉगिन है -> होम पेज दिखाओ
        document.getElementById('auth-screen').classList.remove('active-screen');
        document.getElementById('app-screen').classList.add('active-screen');
        loadUserData(user.uid);
    } else {
        // लॉगिन नहीं है -> लॉगिन पेज दिखाओ
        document.getElementById('app-screen').classList.remove('active-screen');
        document.getElementById('auth-screen').classList.add('active-screen');
        document.getElementById('auth-btn').innerText = "Login";
    }
});

// 4. यूजर का नाम और कॉइन लाना
async function loadUserData(uid) {
    try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById('coin-balance').innerText = data.coins;
            document.getElementById('welcome-text').innerText = "Hello, " + data.username + "!";
        }
    } catch (e) {
        console.log("Data Error:", e);
    }
}

// 5. लॉग आउट
window.logoutUser = () => {
    signOut(auth);
}
