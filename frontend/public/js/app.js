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

// Admin Panel Functionality
class AdminPanel {
    constructor() {
        this.isVisible = false;
        this.isCollecting = false;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Admin toggle button
        const adminToggle = document.getElementById('adminToggle');
        if (adminToggle) {
            adminToggle.addEventListener('click', () => this.togglePanel());
        }

        // Gmail auth buttons
        const gmailAuthBtn = document.getElementById('gmailAuthBtn');
        if (gmailAuthBtn) {
            gmailAuthBtn.addEventListener('click', () => this.startGmailAuth());
        }

        const authStatusBtn = document.getElementById('authStatusBtn');
        if (authStatusBtn) {
            authStatusBtn.addEventListener('click', () => this.checkAuthStatus());
        }

        const submitAuthCodeBtn = document.getElementById('submitAuthCode');
        if (submitAuthCodeBtn) {
            submitAuthCodeBtn.addEventListener('click', () => this.submitAuthCode());
        }

        // Collect emails button
        const collectBtn = document.getElementById('collectEmailsBtn');
        if (collectBtn) {
            collectBtn.addEventListener('click', () => this.collectEmails());
        }

        // Check status button
        const statusBtn = document.getElementById('checkStatusBtn');
        if (statusBtn) {
            statusBtn.addEventListener('click', () => this.checkStatus());
        }

        // Initialize admin panel on load
        this.initializeAdmin();
    }

    async initializeAdmin() {
        try {
            const response = await fetch(`${API_BASE_URL}/email-collection/initialize`, {
                method: 'POST'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('Admin panel initialized:', data);
                this.checkAuthStatus();
                this.checkStatus();
            }
        } catch (error) {
            console.error('Failed to initialize admin panel:', error);
        }
    }

    async startGmailAuth() {
        try {
            const authStatusDiv = document.getElementById('authStatus');
            if (authStatusDiv) {
                authStatusDiv.innerHTML = '🔄 Gmail 인증 URL을 생성하는 중...';
                authStatusDiv.className = 'status-info processing';
            }

            // Open Gmail auth page in new window
            const authWindow = window.open(`${API_BASE_URL}/auth/gmail`, 'gmailAuth', 
                'width=600,height=700,scrollbars=yes,resizable=yes');

            if (authStatusDiv) {
                authStatusDiv.innerHTML = `
                    ✅ Gmail 인증 창이 열렸습니다.<br>
                    <strong>중요: 9afood@gmail.com 계정으로 로그인하세요</strong><br>
                    1. 새 창에서 <strong>9afood@gmail.com</strong>으로 로그인<br>
                    2. 이메일 읽기 권한 승인<br>
                    3. 인증 코드를 복사하여 아래에 입력
                `;
                authStatusDiv.className = 'status-info success';
            }

            // Show auth code input section
            const authCodeSection = document.getElementById('authCodeSection');
            if (authCodeSection) {
                authCodeSection.style.display = 'block';
            }

        } catch (error) {
            console.error('Gmail auth failed:', error);
            const authStatusDiv = document.getElementById('authStatus');
            if (authStatusDiv) {
                authStatusDiv.innerHTML = `❌ Gmail 인증 시작 실패: ${error.message}`;
                authStatusDiv.className = 'status-info error';
            }
        }
    }

    async submitAuthCode() {
        const authCodeInput = document.getElementById('authCodeInput');
        const authStatusDiv = document.getElementById('authStatus');
        const submitBtn = document.getElementById('submitAuthCode');
        
        if (!authCodeInput || !authCodeInput.value.trim()) {
            alert('인증 코드를 입력해주세요.');
            return;
        }

        const authCode = authCodeInput.value.trim();
        
        try {
            if (submitBtn) {
                submitBtn.innerHTML = '<span class="loading-spinner"></span>처리 중...';
                submitBtn.disabled = true;
            }

            if (authStatusDiv) {
                authStatusDiv.innerHTML = '🔄 Gmail 인증을 처리하는 중...';
                authStatusDiv.className = 'status-info processing';
            }

            const response = await fetch(`${API_BASE_URL}/auth/gmail/callback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code: authCode })
            });

            const data = await response.json();

            if (data.success) {
                if (authStatusDiv) {
                    authStatusDiv.innerHTML = `
                        ✅ 9afood@gmail.com 계정 연동 성공!<br>
                        이제 해당 계정의 TLDR Newsletter 이메일을 수집할 수 있습니다.
                    `;
                    authStatusDiv.className = 'status-info success';
                }

                // Hide auth code section
                const authCodeSection = document.getElementById('authCodeSection');
                if (authCodeSection) {
                    authCodeSection.style.display = 'none';
                }

                // Clear input
                authCodeInput.value = '';

                // Update auth status
                this.checkAuthStatus();

            } else {
                throw new Error(data.message || '인증 실패');
            }

        } catch (error) {
            console.error('Auth code submission failed:', error);
            
            if (authStatusDiv) {
                authStatusDiv.innerHTML = `❌ 인증 실패: ${error.message}`;
                authStatusDiv.className = 'status-info error';
            }
        } finally {
            if (submitBtn) {
                submitBtn.innerHTML = '인증 코드 제출';
                submitBtn.disabled = false;
            }
        }
    }

    async checkAuthStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/gmail/status`);
            const data = await response.json();

            const authStatusDiv = document.getElementById('authStatus');
            const gmailAuthBtn = document.getElementById('gmailAuthBtn');

            if (data.success && data.data.isAuthenticated) {
                if (authStatusDiv) {
                    authStatusDiv.innerHTML = '✅ Gmail 계정이 연동되었습니다. 실제 이메일 수집이 가능합니다.';
                    authStatusDiv.className = 'status-info success';
                }
                if (gmailAuthBtn) {
                    gmailAuthBtn.textContent = '✅ 연동 완료';
                    gmailAuthBtn.disabled = true;
                }
            } else if (data.success && data.data.hasCredentials) {
                if (authStatusDiv) {
                    authStatusDiv.innerHTML = '⚠️ Gmail API가 설정되었지만 사용자 인증이 필요합니다.';
                    authStatusDiv.className = 'status-info processing';
                }
            } else {
                if (authStatusDiv) {
                    authStatusDiv.innerHTML = '❌ Gmail API 설정이 필요합니다. 관리자에게 문의하세요.';
                    authStatusDiv.className = 'status-info error';
                }
                if (gmailAuthBtn) {
                    gmailAuthBtn.disabled = true;
                }
            }

        } catch (error) {
            console.error('Failed to check auth status:', error);
        }
    }

    togglePanel() {
        const panel = document.getElementById('admin-panel');
        if (panel) {
            this.isVisible = !this.isVisible;
            panel.style.display = this.isVisible ? 'block' : 'none';
            
            // Update toggle button
            const toggle = document.getElementById('adminToggle');
            if (toggle) {
                toggle.textContent = this.isVisible ? '✖️' : '⚙️';
                toggle.title = this.isVisible ? '관리자 패널 닫기' : '관리자 패널 열기';
            }
        }
    }

    async collectEmails() {
        if (this.isCollecting) return;

        this.isCollecting = true;
        const btn = document.getElementById('collectEmailsBtn');
        const statusDiv = document.getElementById('collectionStatus');
        
        if (btn) {
            btn.innerHTML = '<span class="loading-spinner"></span>이메일 수집 중...';
            btn.disabled = true;
        }

        if (statusDiv) {
            statusDiv.innerHTML = '📧 TLDR Newsletter 이메일을 수집하고 있습니다...';
            statusDiv.className = 'status-info processing';
        }

        try {
            const response = await fetch(`${API_BASE_URL}/email-collection/collect`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ maxResults: 50 })
            });

            const data = await response.json();

            if (data.success) {
                const { articleCount, emailCount, categories } = data.data;
                
                if (statusDiv) {
                    statusDiv.innerHTML = `
                        ✅ 수집 완료!<br>
                        📧 처리된 이메일: ${emailCount}개<br>
                        📰 추출된 기사: ${articleCount}개
                    `;
                    statusDiv.className = 'status-info success';
                }

                // Update statistics
                this.updateStats(data.data);
                
                // Reload articles to show new content
                await this.loadCollectedArticles();
                
                // Refresh main articles grid
                loadFeaturedArticles();
                
            } else {
                throw new Error(data.message || '수집 실패');
            }

        } catch (error) {
            console.error('Email collection failed:', error);
            
            if (statusDiv) {
                statusDiv.innerHTML = `❌ 수집 실패: ${error.message}`;
                statusDiv.className = 'status-info error';
            }
        } finally {
            this.isCollecting = false;
            
            if (btn) {
                btn.innerHTML = '이메일 수집 시작';
                btn.disabled = false;
            }
        }
    }

    async checkStatus() {
        try {
            const response = await fetch(`${API_BASE_URL}/email-collection/status`);
            const data = await response.json();

            if (data.success) {
                this.updateStats(data.data);
                this.loadCollectedArticles();
            }

        } catch (error) {
            console.error('Failed to check status:', error);
        }
    }

    updateStats(data) {
        // Update total articles count
        const totalArticlesEl = document.getElementById('totalArticles');
        if (totalArticlesEl) {
            totalArticlesEl.textContent = data.articleCount || 0;
        }

        // Update last update time
        const lastUpdateEl = document.getElementById('lastUpdate');
        if (lastUpdateEl && data.lastCollectionDate) {
            const date = new Date(data.lastCollectionDate);
            lastUpdateEl.textContent = date.toLocaleString('ko-KR');
        }

        // Update category stats
        const categoryStatsEl = document.getElementById('categoryStats');
        if (categoryStatsEl && data.categories) {
            categoryStatsEl.innerHTML = '';
            
            Object.entries(data.categories).forEach(([categoryName, stats]) => {
                const statEl = document.createElement('div');
                statEl.className = 'category-stat';
                statEl.innerHTML = `
                    <span class="category-name">${categoryName}</span>
                    <span class="category-count" style="background-color: ${stats.color}">${stats.count}</span>
                `;
                categoryStatsEl.appendChild(statEl);
            });
        }
    }

    async loadCollectedArticles() {
        try {
            const response = await fetch(`${API_BASE_URL}/email-collection/articles?limit=6`);
            const data = await response.json();

            if (data.success) {
                const articlesListEl = document.getElementById('collectedArticlesList');
                if (articlesListEl) {
                    articlesListEl.innerHTML = '';
                    
                    data.data.articles.forEach(article => {
                        const articleEl = this.createCollectedArticleElement(article);
                        articlesListEl.appendChild(articleEl);
                    });
                }
            }

        } catch (error) {
            console.error('Failed to load collected articles:', error);
        }
    }

    createCollectedArticleElement(article) {
        const div = document.createElement('div');
        div.className = 'collected-article-card';
        
        const date = new Date(article.publishedAt).toLocaleDateString('ko-KR');
        
        div.innerHTML = `
            <div class="collected-article-meta">
                <span class="collected-article-category" style="background-color: ${article.category.color}">
                    ${article.category.name}
                </span>
                <span class="collected-article-date">${date}</span>
            </div>
            <h4 class="collected-article-title">${article.title}</h4>
            <p class="collected-article-excerpt">${article.excerpt}</p>
            <div class="collected-article-footer">
                <span class="collected-article-source">${article.source || 'TLDR Newsletter'}</span>
                <span>${article.readTime}분 읽기</span>
            </div>
        `;
        
        return div;
    }
}

// Initialize admin panel when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    new AdminPanel();
});

// Export functions for global access
window.loadFeaturedArticles = loadFeaturedArticles;
window.toggleMobileMenu = toggleMobileMenu;