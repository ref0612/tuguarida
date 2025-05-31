// Código JavaScript para interactividad

document.addEventListener('DOMContentLoaded', function() {
    // Variables globales
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    const contactForm = document.getElementById('contactForm');
    const whatsappFloat = document.querySelector('.whatsapp-float');
    
    // Menú móvil
    function toggleMobileMenu() {
        navLinks.classList.toggle('active');
        document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    }
    
    mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    
    // Cerrar menú al hacer clic en un enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMobileMenu();
            }
            // Remover clase active de todos los ítems
            navItems.forEach(i => i.classList.remove('active'));
            // Agregar clase active al ítem clickeado
            item.classList.add('active');
        });
    });
    
    // Efecto de scroll en el navbar
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            navbar.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !navLinks.classList.contains('active')) {
            // Scroll hacia abajo
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scroll hacia arriba
            navbar.style.transform = 'translateY(0)';
            navbar.classList.add('scrolled');
        }
        
        lastScroll = currentScroll;
    });
    
    // Smooth scroll para enlaces internos
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
    
    // Animación de elementos al hacer scroll
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.catalog-card, .contact-info, .contact-form, .section-header');
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.2;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Configuración inicial de estilos para la animación
    const animatedElements = document.querySelectorAll('.catalog-card, .contact-info, .contact-form, .section-header');
    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Mostrar/ocultar botón de WhatsApp flotante
    const toggleWhatsAppButton = () => {
        if (window.scrollY > 500) {
            whatsappFloat.style.opacity = '1';
            whatsappFloat.style.visibility = 'visible';
            whatsappFloat.style.transform = 'scale(1)';
        } else {
            whatsappFloat.style.opacity = '0';
            whatsappFloat.style.visibility = 'hidden';
            whatsappFloat.style.transform = 'scale(0.8)';
        }
    };
    
    // Configuración inicial del botón de WhatsApp
    whatsappFloat.style.opacity = '0';
    whatsappFloat.style.visibility = 'hidden';
    whatsappFloat.style.transform = 'scale(0.8)';
    whatsappFloat.style.transition = 'all 0.3s ease';
    
    // Manejar el envío del formulario
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Aquí iría la lógica para enviar el formulario
            const formData = new FormData(this);
            const formObject = {};
            
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Simular envío (reemplazar con tu lógica de envío real)
            console.log('Formulario enviado:', formObject);
            
            // Mostrar mensaje de éxito
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = '¡Mensaje enviado!';
            submitBtn.style.background = '#4CAF50';
            
            // Resetear formulario
            this.reset();
            
            // Restaurar botón después de 3 segundos
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
            }, 3000);
        });
    }
    
    // Event listeners
    window.addEventListener('scroll', () => {
        animateOnScroll();
        toggleWhatsAppButton();
    });
    
    // Inicializar animaciones
    animateOnScroll();
    toggleWhatsAppButton();
    
    // Efecto hover en tarjetas de catálogo
    const catalogCards = document.querySelectorAll('.catalog-card');
    catalogCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });
    
    // Mostrar año actual en el footer
    const currentYear = new Date().getFullYear();
    const yearElement = document.querySelector('.footer-bottom p');
    if (yearElement) {
        yearElement.textContent = yearElement.textContent.replace('2025', currentYear);
    }
    
    console.log('Sitio web cargado correctamente');
});
