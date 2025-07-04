// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
    
    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        document.body.classList.toggle('no-scroll'); 
    });
    
    // Close mobile menu when a link is clicked
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Journey steps animation (Intersection Observer)
    const journeySteps = document.querySelectorAll('.journey-step');
    const progressSteps = document.querySelectorAll('.progress-step');
    
    const observerOptions = {
        threshold: 0.3, // 30% من العنصر يجب أن يكون مرئياً
        rootMargin: '0px 0px -100px 0px' // يبدأ الظهور قبل 100 بكسل من نهاية الشاشة
    };
    
    const observer = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // أضف فئة 'fade-in-animation' فقط إذا لم تكن موجودة بالفعل
                if (!entry.target.classList.contains('fade-in-animation')) {
                    entry.target.classList.add('fade-in-animation');
                    
                    // Update progress indicator
                    const stepNumber = entry.target.getAttribute('data-step');
                    updateProgressIndicator(stepNumber);
                    
                    // أوقف المراقبة لهذا العنصر بمجرد أن يصبح مرئيًا
                    // هذا يضمن أن العنصر يظل مرئيًا ولا يختفي مرة أخرى
                    observer.unobserve(entry.target); 
                }
            } 
        });
    }, observerOptions);
    
    journeySteps.forEach(step => {
        observer.observe(step);
    });

    // Manually trigger observer for elements already in view on load
    // This ensures the first elements get the animation class immediately
    const initialObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.classList.contains('fade-in-animation')) {
                    entry.target.classList.add('fade-in-animation');
                    const stepNumber = entry.target.getAttribute('data-step');
                    updateProgressIndicator(stepNumber);
                }
                obs.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.1 }); // Lower threshold for initial check

    journeySteps.forEach(step => {
        initialObserver.observe(step);
    });


    // Progress step click functionality
    progressSteps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = this.getAttribute('data-step');
            const targetStep = document.querySelector(`.journey-step[data-step="${stepNumber}"]`);
            if (targetStep) {
                targetStep.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        });
    });
    
    function updateProgressIndicator(activeStep) {
        progressSteps.forEach(step => {
            const stepNumber = parseInt(step.getAttribute('data-step'));
            if (stepNumber <= parseInt(activeStep)) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
    }
    
    // Add hover effects to team cards (using .team-member now)
    const teamMembers = document.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        member.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.15)';
        });
        
        member.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)'; // Reset to original shadow
        });
    });
    
    // Add click effects to buttons (ripple effect)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Create ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add loading animation for images (lazy loading)
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
        img.addEventListener('load', function() {
            // This part is more for initial fade-in, not a true "loading" state
            // For true lazy loading, browser handles it. This is for visual effect.
            this.style.opacity = '1'; // Ensure opacity is 1 after load
            this.style.transform = 'scale(1)'; // Ensure scale is 1 after load
        });
        // Set initial styles for fade-in effect if not already in CSS
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Parallax effect for floating elements
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.floating-element');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.05 + (index * 0.02); // Adjusted speed for more subtle effect
            element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.01}deg)`; // Adjusted rotation speed
        });
    });
});

// Add CSS for body no-scroll when mobile menu is active
const noScrollStyle = document.createElement('style');
noScrollStyle.textContent = `
    body.no-scroll {
        overflow: hidden;
    }
`;
document.head.appendChild(noScrollStyle);
