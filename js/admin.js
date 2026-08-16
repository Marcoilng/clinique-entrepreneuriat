// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    onAuthStateChanged, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-auth.js";
import { 
    getFirestore, 
    collection, 
    addDoc, 
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.9.0/firebase-firestore.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBLJSGXgLwZ-az2_H6rU0LHCnOVwqTdO30",
    authDomain: "clinique-entrepreneuriat-blog.firebaseapp.com",
    projectId: "clinique-entrepreneuriat-blog",
    storageBucket: "clinique-entrepreneuriat-blog.firebasestorage.app",
    messagingSenderId: "525866668337",
    appId: "1:525866668337:web:a91026c7432430fe8da010"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Quill editor
let quill;
document.addEventListener('DOMContentLoaded', () => {
    quill = new Quill('#editor-container', {
        theme: 'snow',
        placeholder: 'Rédigez votre article ici...',
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'blockquote'],
                ['clean']
            ]
        }
    });
});

// DOM Elements
const authSection = document.getElementById('authSection');
const dashboardSection = document.getElementById('dashboardSection');
const loginForm = document.getElementById('loginForm');
const articleForm = document.getElementById('articleForm');
const logoutBtn = document.getElementById('logoutBtn');
const submitBtn = document.getElementById('submitBtn');

const authError = document.getElementById('authError');
const authErrorMessage = document.getElementById('authErrorMessage');
const publishSuccess = document.getElementById('publishSuccess');
const publishError = document.getElementById('publishError');
const publishErrorMessage = document.getElementById('publishErrorMessage');

// --- AUTHENTICATION STATE ---

// Listen to auth state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        authSection.classList.add('hidden');
        dashboardSection.classList.remove('hidden');
        logoutBtn.classList.remove('hidden');
    } else {
        // User is signed out
        dashboardSection.classList.add('hidden');
        logoutBtn.classList.add('hidden');
        authSection.classList.remove('hidden');
    }
});

// --- LOGIN ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    authError.classList.add('hidden');
    
    try {
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged will handle the UI switch
    } catch (error) {
        console.error("Login failed", error);
        authError.classList.remove('hidden');
        
        switch (error.code) {
            case 'auth/invalid-credential':
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                authErrorMessage.textContent = "Email ou mot de passe incorrect.";
                break;
            case 'auth/too-many-requests':
                authErrorMessage.textContent = "Trop de tentatives. Veuillez réessayer plus tard.";
                break;
            default:
                authErrorMessage.textContent = "Erreur de connexion : " + error.message;
        }
    }
});

// --- LOGOUT ---
logoutBtn.addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error("Logout error", error);
    });
});

// --- PUBLISH ARTICLE ---
articleForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Hide previous messages
    publishSuccess.classList.add('hidden');
    publishError.classList.add('hidden');
    
    // Get values
    const title = document.getElementById('articleTitle').value.trim();
    const categoryId = document.getElementById('articleCategory').value;
    const categoryName = document.getElementById('articleCategory').options[document.getElementById('articleCategory').selectedIndex].text;
    const imageUrl = document.getElementById('articleImage').value.trim();
    
    // Get HTML content from Quill
    const contentHtml = quill.root.innerHTML;
    // Get plain text for excerpt (remove formatting)
    const excerpt = quill.getText().trim().substring(0, 150) + '...';

    if (quill.getText().trim() === '') {
        publishErrorMessage.textContent = "L'article ne peut pas être vide.";
        publishError.classList.remove('hidden');
        return;
    }

    try {
        // Change button state
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Publication...';
        submitBtn.disabled = true;

        // Add to Firestore collections "posts"
        await addDoc(collection(db, "posts"), {
            title: title,
            categoryId: categoryId,
            categoryName: categoryName,
            imageUrl: imageUrl,
            content: contentHtml,
            excerpt: excerpt,
            createdAt: serverTimestamp(),
            // Basic reading time estimation (200 words per minute)
            readingTime: Math.max(1, Math.ceil(quill.getText().split(/\s+/).length / 200))
        });

        // Reset UI on success
        publishSuccess.classList.remove('hidden');
        articleForm.reset();
        quill.setContents([]);
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            publishSuccess.classList.add('hidden');
        }, 5000);

    } catch (error) {
        console.error("Error adding document: ", error);
        publishErrorMessage.textContent = "Erreur lors de la publication : " + error.message;
        publishError.classList.remove('hidden');
    } finally {
        // Restore button state
        submitBtn.innerHTML = '<span>Publier sur le blog</span><i class="fas fa-paper-plane ml-2"></i>';
        submitBtn.disabled = false;
    }
});
