document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add scrolled class to navbar
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        } else {
            navbar.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.05)';
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        }
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply animation initial state to cards
    const animatedElements = document.querySelectorAll('.card, .trust-item, .section-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Dynamic Article Loading
    const blogGrid = document.querySelector('.blog-grid');
    if (blogGrid) {
        // Fetch using explicit relative path
        fetch('./articles.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(articles => {
                blogGrid.innerHTML = ''; // Clear loading/placeholder if any
                articles.forEach(article => {
                    const articleElement = document.createElement('article');
                    articleElement.className = 'card blog-card';
                    articleElement.innerHTML = `
                        <img src="${article.image}" alt="${article.title}" loading="lazy">
                        <div class="card-content">
                            <h3>${article.title}</h3>
                            <p>${article.excerpt}</p>
                            <a href="${article.link}" class="read-more">Read more <i class="ph ph-arrow-right"></i></a>
                        </div>
                    `;
                    
                    // Apply initial animation state
                    articleElement.style.opacity = '0';
                    articleElement.style.transform = 'translateY(20px)';
                    articleElement.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
                    
                    blogGrid.appendChild(articleElement);
                    observer.observe(articleElement);
                });
            })
            .catch(error => {
                // Detailed error console logging for debugging GitHub Pages deployment
                console.error('Failed to load articles.json. Ensure the file exists and the path is correct.', error);
                if (blogGrid) {
                    blogGrid.innerHTML = '<p class="error-text">Oops! We couldn\'t load the latest articles. Please check the console for details.</p>';
                }
            });
    }
});
