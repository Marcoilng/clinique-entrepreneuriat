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
            // Activate reveal-delay elements (pillar cards)
            $('.reveal-delay-1, .reveal-delay-2, .reveal-delay-3').addClass('active');
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
    // const cursor = document.getElementById('custom-cursor');
    
    // if (cursor && window.innerWidth >= 768) {
    //     document.addEventListener('mousemove', function (e) {
    //         cursor.style.left = e.clientX - 10 + 'px';
    //         cursor.style.top = e.clientY - 10 + 'px';
    //     });

    //     // Effet sur les liens et boutons
    //     $('a, button, .tilt-card, .hover-float').on('mouseenter', function () {
    //         cursor.style.transform = 'scale(1.5)';
    //         cursor.style.background = '#125C5D';
    //     }).on('mouseleave', function () {
    //         cursor.style.transform = 'scale(1)';
    //         cursor.style.background = '#E8831A';
    //     });
    // }

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
        // Handle main reveal elements
        $('.reveal').each(function () {
            const windowHeight = window.innerHeight;
            const elementTop = $(this).offset().top;
            const elementVisible = 150;
            
            if (elementTop < windowHeight - elementVisible) {
                $(this).addClass('active');
            }
        });
        
        // Handle reveal-delay elements (nested in reveal sections)
        $('.reveal-delay-1, .reveal-delay-2, .reveal-delay-3').each(function () {
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
        // Also trigger after a longer delay to ensure all elements are visible
        setTimeout(reveal, 500);
        setTimeout(reveal, 1000);
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
    // HELPER: SECURITY & UX
    // ========================================
    // Sanitize input to prevent XSS
    function sanitize(input) {
        return $('<div>').text(input).html();
    }

    // Show professional toast notification instead of alert
    function showToast(message, type = 'success') {
        // Create toast container if not exists
        if ($('#toast-notification').length === 0) {
            $('body').append('<div id="toast-notification" class="fixed bottom-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full shadow-2xl z-50 transition-all duration-300 opacity-0 translate-y-10 flex items-center gap-3 border border-gray-700"><i class="fas fa-check-circle text-green-400"></i><span class="toast-message font-medium"></span></div>');
        }
        
        const $toast = $('#toast-notification');
        $toast.find('.toast-message').text(message);
        $toast.removeClass('opacity-0 translate-y-10');
        
        setTimeout(() => {
            $toast.addClass('opacity-0 translate-y-10');
        }, 4000);
    }

    // ========================================
    // 10. FORM VALIDATION
    // ========================================
    $('#contact-form').on('submit', function (e) {
        e.preventDefault();
        let isValid = true;
        
        // Validate Nom
        if (sanitize($('#nom').val()).trim() === '') {
            $('#nom-error').removeClass('hidden');
            isValid = false;
        } else {
            $('#nom-error').addClass('hidden');
        }
        
        // Validate Email
        const email = sanitize($('#email').val());
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            $('#email-error').removeClass('hidden');
            isValid = false;
        } else {
            $('#email-error').addClass('hidden');
        }
        
        // Validate Message
        if (sanitize($('#message').val()).trim() === '') {
            $('#message-error').removeClass('hidden');
            isValid = false;
        } else {
            $('#message-error').addClass('hidden');
        }
        
        // If valid, show success message
        if (isValid) {
            // UX: Show integrated success message
            $('#success-message').removeClass('hidden').hide().fadeIn();
            $('#contact-form')[0].reset();
            
            // Hide message after 5 seconds
            setTimeout(function() {
                $('#success-message').fadeOut();
            }, 5000);
        }
    });

    // ========================================
    // 11. NEWSLETTER FORM
    // ========================================
    $('#newsletter-form, #main-newsletter-form').on('submit', function (e) {
        e.preventDefault();
        const email = sanitize($(this).find('input[type="email"]').val());
        if (email) {
            showToast('Merci de votre inscription à la newsletter !');
            $(this)[0].reset();
            
            // Close popup if it was the source
            if ($(this).attr('id') === 'newsletter-form') {
                setTimeout(() => {
                    $('#newsletter-popup').addClass('hidden');
                    localStorage.setItem('newsletterClosed', 'true');
                }, 1500);
            }
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

    // ========================================
    // 21. DYNAMIC COPYRIGHT YEAR
    // ========================================
    if ($('#copyright-year').length) {
        $('#copyright-year').text(new Date().getFullYear());
    }

})(jQuery);

// ========================================
// 22. Lenis Smooth Scroll
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
});

// ========================================
// 23. MAGNETIC BUTTONS EFFECT
// ========================================
$(document).ready(function() {
    const magneticButtons = document.querySelectorAll('.btn-gradient, .glass, .w-10.h-10');
    
    magneticButtons.forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });
        
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'translate(0, 0)';
        });
    });
});

// ========================================
// 24. COOKIE CONSENT BANNER
// ========================================
$(document).ready(function() {
    if (!localStorage.getItem('cookieConsent')) {
        const cookieHtml = `
        <div id="cookie-banner" class="fixed bottom-0 left-0 right-0 bg-[#0A3D3E] text-white p-4 md:p-6 z-[99999] flex flex-col md:flex-row items-center justify-between gap-4 border-t border-[#D4AF37]/30 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] transform translate-y-full transition-transform duration-500">
            <div class="flex-1 max-w-4xl">
                <h4 class="font-heading font-bold text-[#D4AF37] mb-2 flex items-center gap-2">
                    <i class="fas fa-cookie-bite"></i> Gestion des cookies
                </h4>
                <p class="text-sm text-gray-300">
                    Nous utilisons des cookies pour améliorer votre expérience sur notre site, analyser notre trafic et vous proposer des contenus personnalisés. En cliquant sur "Accepter", vous consentez à l'utilisation de tous les cookies.
                </p>
            </div>
            <div class="flex gap-3 shrink-0">
                <button id="decline-cookies" class="px-5 py-2 rounded-full border border-gray-500 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors text-sm font-semibold">
                    Refuser
                </button>
                <button id="accept-cookies" class="px-5 py-2 rounded-full bg-gradient-to-r from-[#E8831A] to-[#D4AF37] text-white hover:shadow-lg hover:scale-105 transition-all text-sm font-semibold">
                    Accepter
                </button>
            </div>
        </div>
        `;
        $('body').append(cookieHtml);
        
        // Timeout pour laisser le temps de l'animation d'entrée
        setTimeout(() => {
            $('#cookie-banner').removeClass('translate-y-full');
        }, 1000);

        $('#accept-cookies').on('click', function() {
            localStorage.setItem('cookieConsent', 'accepted');
            closeCookieBanner();
        });

        $('#decline-cookies').on('click', function() {
            localStorage.setItem('cookieConsent', 'declined');
            closeCookieBanner();
        });

        function closeCookieBanner() {
            $('#cookie-banner').addClass('translate-y-full');
            setTimeout(() => {
                $('#cookie-banner').remove();
            }, 500);
        }
    }
});
