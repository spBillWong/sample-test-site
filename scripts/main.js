// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }));
    }
});

// Alert function for CTA button
function showAlert() {
    alert('Welcome to our sample GitHub site! This is a demonstration of interactive JavaScript functionality.');
}

// Project Details Modal
const projectDetails = {
    'web-app': {
        title: 'Web Application',
        description: 'A comprehensive web application showcasing modern development practices with HTML5, CSS3, and vanilla JavaScript. Features include responsive design, interactive elements, and clean code architecture.',
        features: [
            'Responsive grid layouts',
            'Interactive user interface',
            'Modern CSS animations',
            'Cross-browser compatibility',
            'Accessibility features'
        ],
        technologies: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design']
    },
    'mobile-first': {
        title: 'Mobile-First Design',
        description: 'A demonstration of mobile-first responsive design principles, ensuring optimal user experience across all device sizes from smartphones to desktop computers.',
        features: [
            'Mobile-first approach',
            'Flexible grid system',
            'Touch-friendly interfaces',
            'Progressive enhancement',
            'Performance optimization'
        ],
        technologies: ['CSS Grid', 'Flexbox', 'Media Queries', 'Progressive Enhancement']
    },
    'interactive': {
        title: 'Interactive Components',
        description: 'A collection of interactive UI components and smooth animations built with vanilla JavaScript and CSS transitions, demonstrating modern web interaction patterns.',
        features: [
            'Smooth CSS transitions',
            'JavaScript animations',
            'User interaction feedback',
            'Component-based architecture',
            'Performance optimized'
        ],
        technologies: ['JavaScript', 'CSS Animations', 'Event Handling', 'DOM Manipulation']
    },
    'github-pages': {
        title: 'GitHub Pages Site',
        description: 'This very website serves as a complete example of how to create, structure, and deploy a multi-page static website using GitHub Pages for free hosting.',
        features: [
            'Multi-page structure',
            'GitHub Pages deployment',
            'Custom domain support',
            'SEO optimization',
            'Fast loading times'
        ],
        technologies: ['GitHub Pages', 'Static Site', 'HTML/CSS/JS', 'Version Control']
    }
};

function showProjectDetails(projectId) {
    const project = projectDetails[projectId];
    if (!project) return;

    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('project-modal');

    modalBody.innerHTML = `
        <h2>${project.title}</h2>
        <p style="margin-bottom: 1.5rem; color: #666;">${project.description}</p>
        
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">Key Features:</h3>
        <ul style="margin-bottom: 1.5rem; margin-left: 2rem;">
            ${project.features.map(feature => `<li style="margin-bottom: 0.5rem;">${feature}</li>`).join('')}
        </ul>
        
        <h3 style="color: #2c3e50; margin-bottom: 1rem;">Technologies:</h3>
        <div style="margin-bottom: 1.5rem;">
            ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
        </div>
        
        <button onclick="closeModal()" style="background: #3498db; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 5px; cursor: pointer;">Close</button>
    `;

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeModal() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }
}

// Close modal when clicking outside of it
window.addEventListener('click', function(event) {
    const modal = document.getElementById('project-modal');
    if (event.target === modal) {
        closeModal();
    }
});

// Contact Form Handler
function handleSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const name = formData.get('name');
    const email = formData.get('email');
    const subject = formData.get('subject');
    const message = formData.get('message');

    // Since this is a static site, we'll just show a success message
    // In a real application, you would send this data to a server
    alert(`Thank you, ${name}! Your message has been received. This is a demo form - in a real application, this would be sent to a server.`);
    
    // Reset the form
    event.target.reset();
}

// Smooth scrolling for anchor links (if any are added)
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Add loading animation for page transitions
window.addEventListener('beforeunload', function() {
    document.body.style.opacity = '0.7';
});

// Intersection Observer for animations (optional enhancement)
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);

    // Observe elements that should animate on scroll
    document.addEventListener('DOMContentLoaded', function() {
        const animateElements = document.querySelectorAll('.feature-card, .project-card, .contact-item');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            observer.observe(el);
        });
    });
}

// Console welcome message
console.log('%c🚀 Welcome to our Sample GitHub Site!', 'color: #3498db; font-size: 16px; font-weight: bold;');
console.log('%cThis site demonstrates modern web development with HTML, CSS, and JavaScript.', 'color: #2c3e50; font-size: 12px;');
console.log('%cBuilt for GitHub Pages deployment.', 'color: #27ae60; font-size: 12px;'); 