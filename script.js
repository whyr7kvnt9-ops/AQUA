(function() {
    'use strict';

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const animationController = {
        scrollY: 0,
        ticking: false,
        mouseX: 0,
        mouseY: 0,
        scrollProgress: 0,

        init() {
            this.setupScrollObserver();
            this.setupIntersectionObserver();
            this.setupParallax();
            this.setupSmoothScroll();
            this.setupColorDots();
            this.setupHoverEffects();
            this.setupNavigation();
            this.setupHeroAnimations();
        },

        setupScrollObserver() {
            window.addEventListener('scroll', () => {
                this.scrollY = window.pageYOffset;
                this.scrollProgress = this.scrollY / (document.body.scrollHeight - window.innerHeight);

                if (!this.ticking) {
                    window.requestAnimationFrame(() => {
                        this.onScroll();
                        this.ticking = false;
                    });
                    this.ticking = true;
                }
            });
        },

        onScroll() {
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                if (this.scrollY > 50) {
                    navbar.style.background = 'rgba(255, 255, 255, 0.9)';
                    navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
                } else {
                    navbar.style.background = 'rgba(255, 255, 255, 0.8)';
                    navbar.style.boxShadow = 'none';
                }
            }

            const parallaxElements = document.querySelectorAll('.product-image .image-placeholder');
            parallaxElements.forEach((el, index) => {
                const speed = 0.05 + (index * 0.02);
                const yPos = this.scrollY * speed;
                el.style.transform = `translateY(${yPos}px)`;
            });
        },

        setupIntersectionObserver() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');

                        if (entry.target.classList.contains('hero-title')) {
                            entry.target.style.animation = 'fadeSlideUp 1s ease forwards';
                        }
                        if (entry.target.classList.contains('hero-subtitle')) {
                            entry.target.style.animation = 'fadeSlideUp 0.8s ease forwards 0.2s';
                        }
                        if (entry.target.classList.contains('hero-cta')) {
                            entry.target.style.animation = 'fadeSlideUp 0.8s ease forwards 0.4s';
                        }
                        if (entry.target.classList.contains('hero-image')) {
                            entry.target.style.animation = 'fadeScaleIn 1s ease forwards 0.3s';
                        }
                    }
                });
            }, observerOptions);

            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                observer.observe(el);
            });
        },

        setupParallax() {
            const heroImage = document.querySelector('.hero-image .image-placeholder');
            if (heroImage) {
                document.addEventListener('mousemove', (e) => {
                    const xPos = (e.clientX / window.innerWidth - 0.5) * 20;
                    const yPos = (e.clientY / window.innerHeight - 0.5) * 20;

                    heroImage.style.transform = `translateY(${-20 + this.scrollY * 0.3}px) translateX(${xPos}px)`;
                });
            }

            const productImages = document.querySelectorAll('.product-image .image-placeholder');
            productImages.forEach((img, index) => {
                img.style.transition = 'transform 0.1s ease-out';
            });
        },

        setupSmoothScroll() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', (e) => {
                    e.preventDefault();
                    const targetId = anchor.getAttribute('href');
                    if (targetId === '#') return;

                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                });
            });
        },

        setupColorDots() {
            const colorDots = document.querySelectorAll('.color-dot');
            colorDots.forEach(dot => {
                dot.addEventListener('click', () => {
                    colorDots.forEach(d => d.classList.remove('active'));
                    dot.classList.add('active');

                    const color = dot.style.background;
                    const productImage = dot.closest('.product-highlight').querySelector('.image-placeholder');
                    if (productImage) {
                        productImage.style.transition = 'background 0.5s ease';
                    }

                    dot.style.animation = 'pulse 0.3s ease';
                    setTimeout(() => {
                        dot.style.animation = '';
                    }, 300);
                });
            });
        },

        setupHoverEffects() {
            const buttons = document.querySelectorAll('.btn');
            buttons.forEach(btn => {
                btn.addEventListener('mouseenter', () => {
                    btn.style.transition = 'all 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)';
                });

                btn.addEventListener('mousemove', (e) => {
                    const rect = btn.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    btn.style.setProperty('--mouse-x', `${x}px`);
                    btn.style.setProperty('--mouse-y', `${y}px`);
                });
            });

            const gridItems = document.querySelectorAll('.grid-item');
            gridItems.forEach(item => {
                item.addEventListener('mouseenter', () => {
                    item.style.transition = 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)';
                });

                item.addEventListener('mousemove', (e) => {
                    const rect = item.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;

                    const tiltX = (y - 0.5) * 10;
                    const tiltY = (x - 0.5) * -10;

                    item.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-8px)`;
                });

                item.addEventListener('mouseleave', () => {
                    item.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
                });
            });

            const featureCards = document.querySelectorAll('.feature-card');
            featureCards.forEach(card => {
                card.addEventListener('mouseenter', () => {
                    card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                });
            });
        },

        setupNavigation() {
            const navLinks = document.querySelectorAll('.nav-menu a');
            navLinks.forEach(link => {
                link.addEventListener('mouseenter', () => {
                    link.style.transition = 'all 0.2s ease';
                    link.style.opacity = '1';
                });

                link.addEventListener('mouseleave', () => {
                    link.style.opacity = '0.8';
                });
            });
        },

        setupHeroAnimations() {
            const heroElements = document.querySelectorAll('.hero-title, .hero-subtitle, .hero-cta, .hero-image');
            heroElements.forEach((el, index) => {
                el.classList.add('visible');
            });

            const heroTitle = document.querySelector('.hero-title');
            if (heroTitle) {
                heroTitle.style.opacity = '1';
                heroTitle.style.transform = 'translateY(0)';
                heroTitle.style.animation = 'fadeSlideUp 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
            }

            const heroSubtitle = document.querySelector('.hero-subtitle');
            if (heroSubtitle) {
                setTimeout(() => {
                    heroSubtitle.style.opacity = '1';
                    heroSubtitle.style.transform = 'translateY(0)';
                    heroSubtitle.style.animation = 'fadeSlideUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                }, 200);
            }

            const heroCta = document.querySelector('.hero-cta');
            if (heroCta) {
                setTimeout(() => {
                    heroCta.style.opacity = '1';
                    heroCta.style.transform = 'translateY(0)';
                    heroCta.style.animation = 'fadeSlideUp 0.8s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                }, 400);
            }

            const heroImage = document.querySelector('.hero-image');
            if (heroImage) {
                setTimeout(() => {
                    heroImage.style.opacity = '1';
                    heroImage.style.transform = 'translateY(0) scale(1)';
                    heroImage.style.animation = 'fadeScaleIn 1s cubic-bezier(0.25, 0.1, 0.25, 1) forwards';
                }, 300);
            }
        },

        animateOnScroll() {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('[data-parallax]');

            parallaxElements.forEach(el => {
                const speed = el.dataset.parallax || 0.5;
                const yPos = -(scrolled * speed);
                el.style.transform = `translateY(${yPos}px)`;
            });
        },

        revealElements() {
            const reveals = document.querySelectorAll('.reveal');

            reveals.forEach(el => {
                const windowHeight = window.innerHeight;
                const elementTop = el.getBoundingClientRect().top;
                const elementVisible = 150;

                if (elementTop < windowHeight - elementVisible) {
                    el.classList.add('active');
                }
            });
        }
    };

    const keyframeAnimations = `
        @keyframes fadeSlideUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes fadeScaleIn {
            from {
                opacity: 0;
                transform: scale(0.9) translateY(40px);
            }
            to {
                opacity: 1;
                transform: scale(1) translateY(0);
            }
        }

        @keyframes pulse {
            0% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }

        @keyframes gradientShift {
            0% {
                background-position: 0% 50%;
            }
            50% {
                background-position: 100% 50%;
            }
            100% {
                background-position: 0% 50%;
            }
        }

        @keyframes floatGlow {
            0%, 100% {
                box-shadow: 0 0 30px rgba(0, 113, 227, 0.3);
            }
            50% {
                box-shadow: 0 0 60px rgba(0, 113, 227, 0.6);
            }
        }
    `;

    const styleSheet = document.createElement('style');
    styleSheet.textContent = keyframeAnimations;
    document.head.appendChild(styleSheet);

    document.addEventListener('DOMContentLoaded', () => {
        animationController.init();
    });

    window.addEventListener('load', () => {
        document.body.classList.add('loaded');
    });

    window.addEventListener('resize', () => {
        animationController.onScroll();
    });

    document.querySelectorAll('.animate-on-scroll').forEach((el, index) => {
        el.style.transitionDelay = `${index * 0.05}s`;
    });

    const originalFetch = window.fetch;
    window.fetch = function() {
        return originalFetch.apply(this, arguments).then(response => {
            return response;
        });
    };
})();