(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW({
        boxClass: 'wow',
        animateClass: 'animated',
        offset: 0,
        mobile: true,
        live: true
    }).init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 0) {
            $('.navbar').addClass('position-fixed bg-dark shadow-sm');
        } else {
            $('.navbar').removeClass('position-fixed bg-dark shadow-sm');
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Testimonials carousel
    $('.testimonial-carousel').owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        loop: true,
        nav: false,
        dots: true,
        items: 1,
        dotsData: true,
    });

    
    // ========================================
    // NOUVELLES ANIMATIONS - LA CLINIQUE
    // ========================================

    // Animation au défilement pour les éléments
    function animateOnScroll() {
        $('.fade-in-up, .stagger-item, .list-item').each(function () {
            var elementTop = $(this).offset().top;
            var windowHeight = $(window).height();
            var elementVisible = 100;
            
            if (elementTop < windowHeight - elementVisible) {
                $(this).addClass('visible');
            }
        });
    }
    
    // Exécuter au chargement et au défilement
    $(window).on('scroll load', animateOnScroll);
    
    // Déclencher l'animation initiale
    setTimeout(animateOnScroll, 100);

    // Animation du compteur de statistiques
    function animateCounters() {
        $('.counter-value').each(function () {
            var $this = $(this);
            var target = parseInt($this.data('target'));
            var duration = 2000;
            var increment = target / (duration / 16);
            var current = 0;
            
            var updateCounter = function () {
                current += increment;
                if (current < target) {
                    $this.text(Math.floor(current) + '+');
                    requestAnimationFrame(updateCounter);
                } else {
                    $this.text(target + '+');
                }
            };
            
            // Vérifier si l'élément est visible
            var elementTop = $this.offset().top;
            var windowHeight = $(window).height();
            
            if (elementTop < windowHeight - 100) {
                updateCounter();
                $this.removeAttr('data-target');
            }
        });
    }
    
    $(window).on('scroll load', animateCounters);

    // Animation de parallaxe subtile pour les images
    $(window).on('scroll', function () {
        $('.parallax-img').each(function () {
            var scrolled = $(window).scrollTop();
            $(this).css('transform', 'translateY(' + (scrolled * 0.1) + 'px)');
        });
    });

    // Animation des icônes au survol
    $('.service-icon, .feature-icon').each(function () {
        $(this).hover(
            function () {
                $(this).addClass('animate__animated animate__pulse');
            },
            function () {
                $(this).removeClass('animate__animated animate__pulse');
            }
        );
    });

    // Animation des cartes de programme
    $('.program-card').each(function (index) {
        $(this).css('transition-delay', (index * 0.1) + 's');
    });

    // Animation des éléments de la liste des services
    $('.service-list-item').each(function (index) {
        $(this).addClass('list-item');
        $(this).css('transition-delay', (index * 0.15) + 's');
    });
    
    setTimeout(animateOnScroll, 500);

    // Animation du bouton hover shine
    $('.btn-shine').on('mouseenter', function () {
        $(this).addClass('animate__animated animate__shine');
    });

    // Smooth scroll pour les liens de navigation
    $('a[href^="#"]').on('click', function (event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 80
            }, 1000, 'easeInOutExpo');
        }
    });

    // Animation d'entrée pour les images
    $('.img-container').each(function () {
        $(this).hover(
            function () {
                $(this).find('img').addClass('animate__animated animate__zoomIn');
            },
            function () {
                $(this).find('img').removeClass('animate__animated animate__zoomIn');
            }
        );
    });

    // Animation des statistiques au chargement
    $('.stat-item').each(function (index) {
        $(this).css('opacity', '0');
        $(this).css('transform', 'translateY(20px)');
        $(this).css('transition', 'all 0.6s ease-out');
        $(this).css('transition-delay', (index * 0.2) + 's');
    });

    // Déclencher l'animation des statistiques
    setTimeout(function () {
        $('.stat-item').each(function () {
            $(this).css('opacity', '1');
            $(this).css('transform', 'translateY(0)');
        });
    }, 500);

    // Animation pour la section blog
    $('.blog-card').each(function (index) {
        $(this).addClass('stagger-item');
        $(this).css('transition-delay', (index * 0.15) + 's');
    });
    
    setTimeout(animateOnScroll, 800);

    // Animation des partenaires
    $('.partner-item').each(function (index) {
        $(this).css('opacity', '0');
        $(this).css('transform', 'scale(0.8)');
        $(this).css('transition', 'all 0.5s ease-out');
        $(this).css('transition-delay', (index * 0.1) + 's');
    });
    
    setTimeout(function () {
        $('.partner-item').each(function () {
            $(this).css('opacity', '1');
            $(this).css('transform', 'scale(1)');
        });
    }, 600);

    // Animation des icônes des sections
    $('.section-icon').each(function () {
        $(this).addClass('animate__animated animate__fadeInDown');
    });

    // Loader smooth
    $(window).on('load', function () {
        $('body').addClass('loaded');
        $('.page-loader').fadeOut(500);
    });

    // Animation du hero - entrance
    $('.hero-content').addClass('animate__animated animate__fadeInUp');
    $('.hero-image').addClass('animate__animated animate__fadeInRight');

    // Animation des cartes de la section À propos
    $('.about-card').each(function (index) {
        $(this).addClass('animate__animated');
        if (index % 2 === 0) {
            $(this).addClass('animate__fadeInLeft');
        } else {
            $(this).addClass('animate__fadeInRight');
        }
    });

    // Animation de la vague SVG
    $('.wave-container').addClass('animate__animated animate__fadeInUp');

    // Interactive hover effects
    $('.interactive-card').on('mouseenter', function () {
        $(this).find('.card-icon').addClass('animate__animated animate__bounce');
    }).on('mouseleave', function () {
        $(this).find('.card-icon').removeClass('animate__animated animate__bounce');
    });

    // Form input animations
    $('.form-control').on('focus', function () {
        $(this).addClass('animate__animated animate__pulse');
    }).on('blur', function () {
        $(this).removeClass('animate__animated animate__pulse');
    });

    // Animation du footer
    $('.footer-content').addClass('animate__animated animate__fadeInUp');

})(jQuery);
