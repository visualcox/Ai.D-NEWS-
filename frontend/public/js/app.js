// App.js - Main JavaScript file for Ai.D NEWS
const API_BASE_URL = 'https://3001-i402476dd7n2ezs3gvmuv-6532622b.e2b.dev/api';

// DOM Elements
const articlesGrid = document.getElementById('articles-grid');
const articlesLoading = document.getElementById('articles-loading');
const newsletterForm = document.getElementById('newsletter-form');
const playBtn = document.getElementById('play-btn');

// State
let isPlaying = false;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    loadFeaturedArticles();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Newsletter form
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Podcast player
    if (playBtn) {
        playBtn.addEventListener('click', togglePodcast);
    }
    
    // Smooth scroll for navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Load featured articles
async function loadFeaturedArticles() {
    try {
        showLoading(true);
        
        const response = await fetch(`${API_BASE_URL}/articles/featured?limit=6`);
        if (!response.ok) {
            throw new Error('Failed to fetch articles');
        }
        
        const data = await response.json();
        if (data.success && data.data) {
            displayArticles(data.data);
        } else {
            throw new Error('Invalid response format');
        }
    } catch (error) {
        console.error('Error loading articles:', error);
        displayError();
    } finally {
        showLoading(false);
    }
}

// Display articles
function displayArticles(articles) {
    if (!articlesGrid) return;
    
    articlesGrid.innerHTML = articles.map(article => `
        <article class="article-card">
            <div class="article-image">
                <span class="article-category ${getCategoryClass(article.category?.slug)}">${article.category?.name || 'News'}</span>
            </div>
            <div class="article-content">
                <h3 class="article-title">${article.title}</h3>
                <p class="article-excerpt">${article.excerpt || ''}</p>
                <div class="article-meta">
                    <span>📅 ${formatDate(article.publishedAt)}</span>
                    <span>⏱️ ${article.readTime || 5}분 읽기</span>
                    <span>👁️ ${article.viewCount || 0}회</span>
                </div>
            </div>
        </article>
    `).join('');
}

// Display error message
function displayError() {
    if (!articlesGrid) return;
    
    articlesGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
            <p style="color: #6b7280; font-size: 16px;">뉴스를 불러오는 중 오류가 발생했습니다.</p>
            <button onclick="loadFeaturedArticles()" class="btn btn-primary" style="margin-top: 16px;">다시 시도</button>
        </div>
    `;
}

// Show/hide loading
function showLoading(show) {
    if (!articlesLoading) return;
    
    if (show) {
        articlesLoading.classList.add('show');
        if (articlesGrid) articlesGrid.style.display = 'none';
    } else {
        articlesLoading.classList.remove('show');
        if (articlesGrid) articlesGrid.style.display = 'grid';
    }
}

// Handle newsletter form submission
async function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const categories = Array.from(e.target.querySelectorAll('input[name="categories"]:checked'))
        .map(cb => cb.value);
    
    console.log('Form submission:', { email, categories }); // Debug log
    
    if (!email) {
        alert('이메일 주소를 입력해주세요.');
        return;
    }
    
    if (categories.length === 0) {
        alert('최소 하나의 분야를 선택해주세요.');
        return;
    }
    
    try {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = '구독 중...';
        submitBtn.disabled = true;
        
        console.log('Making API request to:', `${API_BASE_URL}/subscriptions`); // Debug log
        
        const requestBody = {
            email,
            categories,
            preferences: {
                frequency: 'weekly',
                format: 'html',
                language: 'ko'
            }
        };
        
        console.log('Request body:', requestBody); // Debug log
        
        const response = await fetch(`${API_BASE_URL}/subscriptions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });
        
        console.log('Response status:', response.status); // Debug log
        console.log('Response headers:', response.headers); // Debug log
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Response data:', data); // Debug log
        
        if (data.success) {
            alert('구독이 완료되었습니다! 확인 이메일을 확인해주세요.');
            e.target.reset();
        } else {
            throw new Error(data.error || '구독 처리 중 오류가 발생했습니다.');
        }
        
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        console.error('Error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        
        let errorMessage = '구독 처리 중 오류가 발생했습니다.';
        if (error.message.includes('Failed to fetch')) {
            errorMessage = '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.';
        } else if (error.message.includes('HTTP error')) {
            errorMessage = `서버 오류가 발생했습니다. (${error.message})`;
        }
        
        alert(errorMessage);
    } finally {
        const submitBtn = e.target.querySelector('button[type="submit"]');
        submitBtn.textContent = '무료 구독하기';
        submitBtn.disabled = false;
    }
}

// Toggle podcast play/pause
function togglePodcast() {
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        playBtn.textContent = '⏸️';
        // In a real app, you would start audio playback here
        simulateProgress();
    } else {
        playBtn.textContent = '▶️';
        // In a real app, you would pause audio playback here
    }
}

// Simulate podcast progress (for demo)
function simulateProgress() {
    const progressBar = document.querySelector('.progress');
    if (!progressBar || !isPlaying) return;
    
    let currentWidth = parseInt(progressBar.style.width) || 30;
    if (currentWidth < 100) {
        progressBar.style.width = (currentWidth + 1) + '%';
        setTimeout(simulateProgress, 500);
    } else {
        // Reset when finished
        progressBar.style.width = '0%';
        playBtn.textContent = '▶️';
        isPlaying = false;
    }
}

// Utility functions
function getCategoryClass(slug) {
    const classes = {
        'tech': 'tech',
        'ai': 'ai', 
        'marketing': 'marketing',
        'design': 'design'
    };
    return classes[slug] || 'default';
}

function formatDate(dateString) {
    if (!dateString) return '최근';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1일 전';
    if (diffDays <= 7) return `${diffDays}일 전`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}주 전`;
    
    return date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Mobile menu toggle (for future enhancement)
function toggleMobileMenu() {
    // Implementation for mobile menu
    console.log('Mobile menu toggle');
}

// Export functions for global access
window.loadFeaturedArticles = loadFeaturedArticles;
window.toggleMobileMenu = toggleMobileMenu;