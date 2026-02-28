// ========================================
// NOUVELLES FONCTIONNALITÉS - PACK COMPLET
// ========================================

(function ($) {
    "use strict";

    // ========================================
    // 1. LOADER SCREEN
    // ========================================
    $(window).on('load', function () {
        // Masquer le loader après le chargement
        setTimeout(function () {
            $('#loader').addClass('hidden');
            // Activer les animations après le loader
            $('.reveal').each(function () {
                $(this).addClass('active');
            });
        }, 2500);
    });

    // ========================================
    // 2. DARK MODE TOGGLE (Désactivé)
    // ========================================
    // Mode sombre désactivé - le site reste en mode clair

    // ========================================
    // 3. SCROLL PROGRESS BAR
    // ========================================
    $(window).on('scroll', function () {
        const scrollTop = $(window).scrollTop();
        const docHeight = $(document).height() - $(window).height();
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        $('#scroll-progress').width(scrollPercent + '%');
        $('#scroll-progress').attr('aria-valuenow', Math.round(scrollPercent));
    });

    // ========================================
    // 4. NAVIGATION MODERNE - SCROLL EFFECT
    // ========================================
    $(window).on('scroll', function () {
        if ($(this).scrollTop() > 50) {
            $('#main-header').addClass('scrolled');
        } else {
            $('#main-header').removeClass('scrolled');
        }
    });

    // ========================================
    // 5. MOBILE MENU TOGGLE
    // ========================================
    $('#mobile-menu-btn').on('click', function () {
        $('#mobile-menu').toggleClass('hidden');
        const expanded = $(this).attr('aria-expanded') === 'true';
        $(this).attr('aria-expanded', !expanded);
    });

    // ========================================
    // 6. CUSTOM CURSOR
    // ========================================
    const cursor = document.getElementById('custom-cursor');
    
    if (cursor && window.innerWidth >= 768) {
        document.addEventListener('mousemove', function (e) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Effet sur les liens et boutons
        $('a, button, .tilt-card, .hover-float').on('mouseenter', function () {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = '#125C5D';
        }).on('mouseleave', function () {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = '#E8831A';
        });
    }

    // ========================================
    // 7. ANIMATED COUNTERS
    // ========================================
    function animateCounter(el) {
        const target = parseInt(el.attr('data-target'));
        let current = 0;
        const step = target / 100;
        const timer = setInterval(function () {
            current += step;
            if (current >= target) {
                el.text(target + '+');
                clearInterval(timer);
            } else {
                el.text(Math.floor(current) + '+');
            }
        }, 20);
    }

    // Déclencher les compteurs quand visible
    $(window).on('scroll', function () {
        $('.stat-number').each(function () {
            const $this = $(this);
            if ($this.offset().top < $(window).height() - 100 && !$this.hasClass('counted')) {
                $this.addClass('counted');
                animateCounter($this);
            }
        });
    });

    // ========================================
    // 8. REVEAL ANIMATIONS ON SCROLL
    // ========================================
    function reveal() {
        $('.reveal').each(function () {
            const windowHeight = window.innerHeight;
            const elementTop = $(this).offset().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                $(this).addClass('active');
            }
        });
    }
    
    $(window).on('scroll', reveal);
    $(document).ready(function () {
        reveal();
        setTimeout(reveal, 100);
    });

    // ========================================
    // 9. TESTIMONIALS CAROUSEL (Owl Carousel)
    // ========================================
    $('.owl-carousel').owlCarousel({
        items: 1,
        loop: true,
        autoplay: true,
        autoplayTimeout: 5000,
        dots: true,
        margin: 30,
        responsive: {
            0: { items: 1 },
            768: { items: 2 },
            1024: { items: 3 }
        }
    });

    // ========================================
    // 10. FORM VALIDATION
    // ========================================
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate Nom
        if ($('#nom').val().trim() === '') {
            $('#nom-error').removeClass('hidden');
            isValid = false;
        } else {
            $('#nom-error').addClass('hidden');
        }
        
        // Validate Email
        const email = $('#email').val();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#email-error').removeClass('hidden');
            isValid = false;
        } else {
            $('#email-error').addClass('hidden');
        }
        
        // Validate Message
        if ($('#message').val().trim() === '') {
            $('#message-error').removeClass('hidden');
            isValid = false;
        } else {
            $('#message-error').addClass('hidden');
        }
        
        // If valid, show success message
        if (isValid) {
            alert('Merci pour votre message! Nous vous contacterons bientôt.');
            $('#contact-form')[0].reset();
        }
    });

    // ========================================
    // 11. NEWSLETTER FORM
    // ========================================
    $('#newsletter-form').on('submit', function (e) {
        e.preventDefault();
        const email = $(this).find('input[type="email"]').val();
        if (email) {
            alert('Merci de votre inscription à la newsletter!');
            $(this)[0].reset();
        }
    });

    // ========================================
    // 12. NEWSLETTER POPUP
    // ========================================
    setTimeout(function () {
        if (!localStorage.getItem('newsletterClosed')) {
            $('#newsletter-popup').removeClass('hidden');
        }
    }, 5000);

    $('#close-newsletter').on('click', function () {
        $('#newsletter-popup').addClass('hidden');
        localStorage.setItem('newsletterClosed', 'true');
    });

    $(document).on('click', function (e) {
        if (!$('#newsletter-popup').is(e.target) && !$('#close-newsletter').is(e.target) && $('#newsletter-popup').has(e.target).length === 0) {
            // Ne pas fermer automatiquement
        }
    });

    // ========================================
    // 13. SMOOTH SCROLL FOR ANCHOR LINKS
    // ========================================
    $('a[href^="#"]').on('click', function (e) {
        const target = $($(this).attr('href'));
        if (target.length) {
            e.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutExpo');
        }
    });

    // ========================================
    // 14. 3D TILT EFFECT (CSS-based)
    // ========================================
    $('.tilt-card').each(function () {
        $(this).on('mousemove', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            $(this).css('transform', `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`);
        });
        
        $(this).on('mouseleave', function () {
            $(this).css('transform', 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)');
        });
    });

    // ========================================
    // 15. AOS ANIMATIONS INITIALIZE
    // ========================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 1000,
            once: true,
            offset: 100
        });
    }

    // ========================================
    // 16. PARALLAX EFFECT (Subtle)
    // ========================================
    $(window).on('scroll', function () {
        const scrolled = $(window).scrollTop();
        $('.parallax').css('background-position', 'center ' + (scrolled * 0.3) + 'px');
    });

    // ========================================
    // 17. IMAGE lazy loading enhancement
    // ========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    img.classList.remove('lazy-img');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(function (img) {
            imageObserver.observe(img);
        });
    }

    // ========================================
    // 18. ACCESSIBILITY - KEYBOARD NAVIGATION
    // ========================================
    $(document).on('keydown', function (e) {
        // Fermer le menu mobile avec Escape
        if (e.key === 'Escape' && !$('#mobile-menu').hasClass('hidden')) {
            $('#mobile-menu').addClass('hidden');
            $('#mobile-menu-btn').attr('aria-expanded', 'false');
        }
    });

    // ========================================
    // 19. ACTIVE NAV LINK ON SCROLL
    // ========================================
    const sections = $('section[id]');
    $(window).on('scroll', function () {
        const scroll = $(window).scrollTop();
        
        sections.each(function () {
            const top = $(this).offset().top - 100;
            const bottom = top + $(this).outerHeight();
            const id = $(this).attr('id');
            
            if (scroll >= top && scroll <= bottom) {
                $('.nav-link').removeClass('active');
                $(`.nav-link[href="#${id}"]`).addClass('active');
            }
        });
    });

    // ========================================
    // 20. PREVENT ANCHOR JUMP ON LOAD
    // ========================================
    if (window.location.hash) {
        const target = $(window.location.hash);
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 80
            }, 0);
        }
    }

})(jQuery);

// ========================================
// Lenis Smooth Scroll (Optional)
// ========================================
/*
// Décommenter pour utiliser Lenis smooth scroll
// Requires: https://github.com/studio-freight/lenis

document.addEventListener('DOMContentLoaded', function() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
});
*/
