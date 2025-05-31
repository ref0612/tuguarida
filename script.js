// ===== Tu Guarida Creativa - Script Integrado =====
// Combinando funcionalidad original con efectos visuales avanzados

// ===== Configuración Global =====
const CONFIG = {
    particles: {
        count: 60, // Reducido para mejor performance
        speed: 0.3,
        maxSize: 3,
        colors: ['#E0B354', '#D9A074', '#F4D03F', '#5A3E36']
    },
    mouse: {
        radius: 120,
        repelForce: 0.015
    },
    animations: {
        duration: 800,
        easing: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)'
    }
};

// ===== Sistema de Partículas Optimizado =====
class ParticleSystem {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.mouse = { x: 0, y: 0, isMoving: false };
        this.animationId = null;
        this.isActive = true;
        this.init();
    }

    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: -1;
            pointer-events: none;
            opacity: 0.6;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.resize();
        
        const backgroundCanvas = document.getElementById('background-canvas');
        if (backgroundCanvas) {
            backgroundCanvas.appendChild(this.canvas);
        }
    }

    createParticles() {
        this.particles = [];
        const count = window.innerWidth < 768 ? CONFIG.particles.count / 2 : CONFIG.particles.count;
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.canvas.width, this.canvas.height));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    bindEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.createParticles();
        });
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
            this.mouse.isMoving = true;
            
            clearTimeout(this.mouseTimeout);
            this.mouseTimeout = setTimeout(() => {
                this.mouse.isMoving = false;
            }, 150);
        });

        // Pausar animaciones cuando la pestaña no está visible
        document.addEventListener('visibilitychange', () => {
            this.isActive = !document.hidden;
        });
    }

    animate() {
        if (!this.isActive) {
            this.animationId = requestAnimationFrame(() => this.animate());
            return;
        }

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach((particle, index) => {
            particle.update(this.mouse);
            particle.draw(this.ctx);
            
            // Conectar partículas cercanas (optimizado)
            if (index % 3 === 0) { // Solo cada tercera partícula para performance
                for (let j = index + 1; j < this.particles.length; j += 3) {
                    const dist = particle.distanceTo(this.particles[j]);
                    if (dist < 80) {
                        this.drawConnection(particle, this.particles[j], dist);
                    }
                }
            }
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnection(p1, p2, distance) {
        const opacity = (80 - distance) / 80 * 0.15;
        this.ctx.strokeStyle = `rgba(224, 179, 84, ${opacity})`;
        this.ctx.lineWidth = 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.stroke();
    }
}

// ===== Clase Partícula =====
class Particle {
    constructor(canvasWidth, canvasHeight) {
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.vx = (Math.random() - 0.5) * CONFIG.particles.speed;
        this.vy = (Math.random() - 0.5) * CONFIG.particles.speed;
        this.size = Math.random() * CONFIG.particles.maxSize + 0.5;
        this.color = CONFIG.particles.colors[Math.floor(Math.random() * CONFIG.particles.colors.length)];
        this.opacity = Math.random() * 0.4 + 0.2;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.originalVx = this.vx;
        this.originalVy = this.vy;
    }

    update(mouse) {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x <= 0 || this.x >= this.canvasWidth) this.vx *= -1;
        if (this.y <= 0 || this.y >= this.canvasHeight) this.vy *= -1;

        if (mouse.isMoving) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < CONFIG.mouse.radius) {
                const force = (CONFIG.mouse.radius - distance) / CONFIG.mouse.radius;
                this.vx += (dx / distance) * force * CONFIG.mouse.repelForce;
                this.vy += (dy / distance) * force * CONFIG.mouse.repelForce;
            }
        }

        this.vx = this.lerp(this.vx, this.originalVx, 0.01);
        this.vy = this.lerp(this.vy, this.originalVy, 0.01);
        this.opacity = 0.2 + Math.sin(Date.now() * 0.001 + this.x * 0.01) * 0.15;
    }

    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    distanceTo(particle) {
        const dx = this.x - particle.x;
        const dy = this.y - particle.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}

// ===== Efectos de Hover Mejorados =====
class HoverEffects {
    constructor() {
        this.init();
    }

    init() {
        this.setupCatalogButtons();
        this.setupWhatsAppButton();
        this.setupLogoEffects();
        this.setupRippleEffect();
    }

    setupCatalogButtons() {
        const buttons = document.querySelectorAll('.catalog-btn');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', (e) => {
                this.createHoverParticles(e.target);
                button.style.transform = 'translateY(-8px) scale(1.02)';
            });

            button.addEventListener('mouseleave', (e) => {
                button.style.transform = 'translateY(0) scale(1)';
            });

            button.addEventListener('mousemove', (e) => {
                this.updateButtonGlow(e);
            });
        });
    }

    setupWhatsAppButton() {
        const whatsappBtn = document.querySelector('.whatsapp-btn');
        if (!whatsappBtn) return;

        whatsappBtn.addEventListener('mouseenter', () => {
            whatsappBtn.style.transform = 'translateY(-3px) scale(1.03)';
        });

        whatsappBtn.addEventListener('mouseleave', () => {
            whatsappBtn.style.transform = 'translateY(0) scale(1)';
        });
    }

    setupLogoEffects() {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        logo.addEventListener('mouseenter', () => {
            logo.style.transform = 'scale(1.08) rotate(2deg)';
            logo.style.filter = 'drop-shadow(0 0 25px rgba(224, 179, 84, 0.5)) brightness(1.1)';
        });

        logo.addEventListener('mouseleave', () => {
            logo.style.transform = 'scale(1) rotate(0deg)';
            logo.style.filter = '';
        });
    }

    setupRippleEffect() {
        const buttons = document.querySelectorAll('.catalog-btn, .whatsapp-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.createRipple(e);
            });
        });
    }

    createHoverParticles(element) {
        if (window.innerWidth < 768) return; // No partículas en móvil

        const rect = element.getBoundingClientRect();
        const particleCount = 8;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: fixed;
                width: 3px;
                height: 3px;
                background: #E0B354;
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + Math.random() * rect.width}px;
                top: ${rect.top + Math.random() * rect.height}px;
                animation: particleFloat 1.5s ease-out forwards;
            `;

            document.body.appendChild(particle);
            setTimeout(() => particle.remove(), 1500);
        }
    }

    updateButtonGlow(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        button.style.background = `
            radial-gradient(circle at ${x}% ${y}%, 
                rgba(244, 208, 63, 0.25) 0%, 
                rgba(255, 249, 245, 0.95) 60%
            )
        `;
    }

    createRipple(e) {
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.4);
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            animation: ripple 0.5s ease-out;
            pointer-events: none;
            z-index: 1;
        `;

        button.style.position = 'relative';
        button.appendChild(ripple);
        setTimeout(() => ripple.remove(), 500);
    }
}

// ===== Funcionalidad Original Mejorada =====
class SiteManager {
    constructor() {
        this.whatsappFloat = document.querySelector('.whatsapp-float');
        this.init();
    }

    init() {
        this.setupSmoothScroll();
        this.setupAnimationOnScroll();
        this.setupWhatsAppFloat();
        this.setupFormHandling();
        this.setupUtilities();
    }

    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    setupAnimationOnScroll() {
        const animatedElements = document.querySelectorAll('.catalog-btn, .main-title, .subtitle');
        
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        });

        const animateOnScroll = () => {
            animatedElements.forEach(element => {
                const elementPosition = element.getBoundingClientRect().top;
                const screenPosition = window.innerHeight / 1.3;
                
                if (elementPosition < screenPosition) {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }
            });
        };

        window.addEventListener('scroll', throttle(animateOnScroll, 100));
        animateOnScroll(); // Ejecutar inmediatamente
    }

    setupWhatsAppFloat() {
        if (!this.whatsappFloat) return;

        this.whatsappFloat.style.cssText += `
            opacity: 0;
            visibility: hidden;
            transform: scale(0.8);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        `;

        const toggleWhatsAppButton = () => {
            const shouldShow = window.scrollY > 300;
            
            this.whatsappFloat.style.opacity = shouldShow ? '1' : '0';
            this.whatsappFloat.style.visibility = shouldShow ? 'visible' : 'hidden';
            this.whatsappFloat.style.transform = shouldShow ? 'scale(1)' : 'scale(0.8)';
        };

        window.addEventListener('scroll', throttle(toggleWhatsAppButton, 100));
        toggleWhatsAppButton();
    }

    setupFormHandling() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => formObject[key] = value);
            
            console.log('Formulario enviado:', formObject);
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '¡Mensaje enviado!';
            submitBtn.style.background = '#4CAF50';
            
            this.reset();
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });
    }

    setupUtilities() {
        // Año actual en footer
        const currentYear = new Date().getFullYear();
        const yearElement = document.querySelector('.footer-bottom p');
        if (yearElement) {
            yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
        }

        // Log de carga
        console.log('Tu Guarida Creativa - Sitio cargado correctamente');
    }
}

// ===== Estilos Dinámicos =====
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes particleFloat {
            0% { opacity: 1; transform: translateY(0) scale(1); }
            100% { opacity: 0; transform: translateY(-30px) scale(0); }
        }

        @keyframes ripple {
            0% { transform: scale(0); opacity: 0.5; }
            100% { transform: scale(1); opacity: 0; }
        }

        .catalog-btn {
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .whatsapp-btn::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
            transform: rotate(45deg) translateX(-100%);
            transition: all 0.6s;
            opacity: 0;
        }

        .whatsapp-btn:hover::before {
            transform: rotate(45deg) translateX(100%);
            opacity: 1;
        }

        @media (prefers-reduced-motion: reduce) {
            *, *::before, *::after {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
            }
        }

        @media (max-width: 768px) {
            .floating-shape {
                opacity: 0.3 !important;
                animation-duration: 8s !important;
            }
        }
    `;
    document.head.appendChild(style);
}

// ===== Utilidades =====
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===== Preloader Simple =====
function createPreloader() {
    const preloader = document.createElement('div');
    preloader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #F4EFEA, #F8F3EE);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 0.5s ease;
    `;
    
    const spinner = document.createElement('div');
    spinner.style.cssText = `
        width: 40px;
        height: 40px;
        border: 3px solid rgba(224, 179, 84, 0.3);
        border-top: 3px solid #E0B354;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    `;
    
    const spinStyle = document.createElement('style');
    spinStyle.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
    document.head.appendChild(spinStyle);
    
    preloader.appendChild(spinner);
    document.body.appendChild(preloader);
    
    // Ocultar preloader
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => preloader.remove(), 500);
        }, 800);
    });
}

// ===== Inicialización Principal =====
document.addEventListener('DOMContentLoaded', function() {
    // Verificar soporte básico
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = window.setTimeout;
    }

    // Agregar estilos dinámicos
    addDynamicStyles();
    
    // Crear preloader
    createPreloader();
    
    // Inicializar sistemas
    new SiteManager();
    new HoverEffects();
    
    // Inicializar partículas solo en dispositivos potentes
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        new ParticleSystem();
    }

    // Efecto de carga suave
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.8s ease';
    
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// ===== Exposición Global (opcional) =====
window.TuGuaridaCreativa = {
    ParticleSystem,
    HoverEffects,
    SiteManager,
    CONFIG
};