// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.9.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs, 
    query, 
    orderBy 
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
const db = getFirestore(app);

// Helper function to format dates (e.g., "15 Janvier 2026")
function formatDate(timestamp) {
    if (!timestamp) return "Aujourd'hui";
    const date = timestamp.toDate();
    const months = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
    ];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Function to map category IDs to Tailwind colors
function getCategoryColorClass(categoryId) {
    switch (categoryId) {
        case 'formation': return 'bg-clinique-blue';
        case 'evenement': return 'bg-clinique-orange';
        case 'tribune': return 'bg-clinique-gold';
        case 'pme': return 'bg-green-600';
        case 'temoignage': return 'bg-purple-600';
        default: return 'bg-gray-600';
    }
}

// Render dynamic articles into the grid
async function loadArticles() {
    const articlesGrid = document.getElementById('articles-grid');
    if (!articlesGrid) return;

    try {
        // Query posts, ordered by creation date descending
        const q = query(collection(db, "posts"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        
        // Temporarily store existing static HTML (optional, if you want dynamic ones first)
        const staticHtml = articlesGrid.innerHTML;
        
        // Clear grid and show loading state ideally, but we'll prepend new items
        let dynamicHtml = '';

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const dateStr = formatDate(data.createdAt);
            const colorClass = getCategoryColorClass(data.categoryId);
            const postId = doc.id;
            
            dynamicHtml += `
                <div class="card-article reveal active" data-category="${data.categoryId}">
                    <div class="relative">
                        <div class="image-wrapper h-48">
                            <img src="${data.imageUrl}" alt="${data.categoryName}" class="w-full h-full object-cover" onerror="this.src='img/clinique1.jpg'">
                        </div>
                        <span class="badge-category ${colorClass} text-white px-3 py-1 rounded-full text-xs font-semibold">${data.categoryName}</span>
                    </div>
                    <div class="p-6">
                        <div class="flex items-center justify-between text-gray-500 text-xs mb-3">
                            <div class="flex items-center gap-4">
                                <span><i class="far fa-calendar mr-1"></i>${dateStr}</span>
                            </div>
                            <span><i class="far fa-clock mr-1"></i>~${data.readingTime} min</span>
                        </div>
                        <h3 class="font-heading text-lg font-bold text-clinique-blue mb-3">
                            ${data.title}
                        </h3>
                        <div class="text-gray-600 text-sm mb-4 line-clamp-3">
                            ${data.excerpt}
                        </div>
                        <button onclick="openModal('${postId}')" class="text-clinique-orange font-semibold text-sm hover:underline">Lire la suite →</button>
                    </div>
                </div>
            `;
            
            // Note: In a real app, you would create a standalone article.html?id=xxx page. 
            // For simplicity here, we could use a modal or just expand it, 
            // but given the requirement, passing data to a reader modal is best.
        });

        // Prepend dynamic articles to static articles
        articlesGrid.innerHTML = dynamicHtml + staticHtml;

        // Store articles globally for the modal viewer
        window.firebaseArticles = {};
        querySnapshot.forEach(doc => {
            window.firebaseArticles[doc.id] = doc.data();
        });

    } catch(error) {
        console.error("Error loading articles from Firebase:", error);
    }
}

// --- ARTICLE MODAL VIEWER ---
// We inject a modal into the body to read dynamic articles since we don't have a template page yet
function createModal() {
    const modalHTML = `
        <div id="articleModal" class="fixed inset-0 z-[100] hidden flex-col bg-white overflow-y-auto">
            <button onclick="closeModal()" class="fixed top-4 right-4 z-[101] bg-white text-gray-800 rounded-full w-10 h-10 flex items-center justify-center shadow hover:bg-gray-100 p-2">
                <i class="fas fa-times text-xl"></i>
            </button>
            <div class="w-full h-64 md:h-96 relative">
                <img id="modalCoverImage" src="" alt="Cover" class="w-full h-full object-cover">
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div class="absolute bottom-0 left-0 right-0 p-8 max-w-4xl mx-auto text-white">
                    <span id="modalCategory" class="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"></span>
                    <h1 id="modalTitle" class="font-heading text-3xl md:text-5xl font-bold mb-4"></h1>
                    <div class="flex items-center gap-4 text-sm opacity-80">
                        <span id="modalDate"></span>
                        <span id="modalReadingTime"></span>
                    </div>
                </div>
            </div>
            <div class="max-w-3xl mx-auto p-8 py-12 w-full">
                <div id="modalContent" class="prose prose-lg prose-blue max-w-none text-gray-800"></div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    // Add simple prose styles
    const style = document.createElement('style');
    style.innerHTML = `
        .prose h1, .prose h2, .prose h3 { font-family: 'Montserrat', sans-serif; font-weight: bold; color: #125C5D; margin-top: 2em; margin-bottom: 0.5em; }
        .prose p { margin-bottom: 1.5em; line-height: 1.8; }
        .prose ul { list-style-type: disc; padding-left: 1.5em; margin-bottom: 1.5em; }
        .prose ol { list-style-type: decimal; padding-left: 1.5em; margin-bottom: 1.5em; }
        .prose a { color: #E8831A; text-decoration: underline; }
        .prose blockquote { border-left: 4px solid #D4AF37; padding-left: 1em; font-style: italic; color: #555; }
        .prose img { border-radius: 0.5rem; max-width: 100%; height: auto; }
    `;
    document.head.appendChild(style);
}

window.openModal = function(postId) {
    const article = window.firebaseArticles[postId];
    if (!article) return;

    document.getElementById('modalTitle').textContent = article.title;
    document.getElementById('modalCoverImage').src = article.imageUrl;
    
    const catEl = document.getElementById('modalCategory');
    catEl.textContent = article.categoryName;
    // Reset classes
    catEl.className = 'inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4 ' + getCategoryColorClass(article.categoryId);
    
    document.getElementById('modalDate').innerHTML = `<i class="far fa-calendar mr-2"></i>${formatDate(article.createdAt)}`;
    document.getElementById('modalReadingTime').innerHTML = `<i class="far fa-clock mr-2"></i>~${article.readingTime} min de lecture`;
    
    document.getElementById('modalContent').innerHTML = article.content;
    
    document.getElementById('articleModal').classList.remove('hidden');
    document.getElementById('articleModal').classList.add('flex');
    document.body.style.overflow = 'hidden'; // prevent background scrolling
}

window.closeModal = function() {
    document.getElementById('articleModal').classList.add('hidden');
    document.getElementById('articleModal').classList.remove('flex');
    document.body.style.overflow = 'auto';
}

// Setup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add grid ID to the grid container in blog.html
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        if (section.querySelector('h2') && section.querySelector('h2').textContent.includes('Derniers articles')) {
            const grid = section.querySelector('.grid.md\\:grid-cols-2.lg\\:grid-cols-3');
            if(grid) {
                grid.id = 'articles-grid';
            }
        }
    });

    createModal();
    loadArticles();
});
