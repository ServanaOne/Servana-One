// Three.js Background Setup
let scene, camera, renderer, particles;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Animation state
const animationState = {
    isLoaded: false,
    currentSection: 'home'
};

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initThreeJS();
    initAnimations();
    initNavigation();
    initScrollAnimations();
    hideLoadingScreen();
});

// Three.js IoT Tech Background
function initThreeJS() {
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    document.getElementById('three-container').appendChild(renderer.domElement);
    
    // Create IoT-themed elements
    createCircuitBoard();
    createDataConnections();
    createIoTNodes();
    
    camera.position.z = 500;
    
    // Mouse interaction
    document.addEventListener('mousemove', onDocumentMouseMove, false);
    
    animate();
}

function createCircuitBoard() {
    // Create circuit board traces
    const traceCount = 25;
    
    for (let i = 0; i < traceCount; i++) {
        const points = [];
        
        // Create geometric circuit patterns
        const startX = Math.random() * 1200 - 600;
        const startY = Math.random() * 800 - 400;
        const startZ = Math.random() * 400 - 200;
        
        // Generate L-shaped or straight traces
        const isLShaped = Math.random() > 0.5;
        
        if (isLShaped) {
            // L-shaped trace
            const midX = startX + (Math.random() - 0.5) * 200;
            const endY = startY + (Math.random() - 0.5) * 200;
            
            points.push(new THREE.Vector3(startX, startY, startZ));
            points.push(new THREE.Vector3(midX, startY, startZ));
            points.push(new THREE.Vector3(midX, endY, startZ));
        } else {
            // Straight trace
            const endX = startX + (Math.random() - 0.5) * 300;
            const endY = startY + (Math.random() - 0.5) * 300;
            
            points.push(new THREE.Vector3(startX, startY, startZ));
            points.push(new THREE.Vector3(endX, endY, startZ));
        }
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(0.6 + Math.random() * 0.1, 0.8, 0.6), // Pure blue spectrum
            transparent: true,
            opacity: 0.4 + Math.random() * 0.3
        });
        
        const trace = new THREE.Line(geometry, material);
        
        // Add animation data
        trace.userData = {
            pulseSpeed: 1 + Math.random() * 2,
            phase: Math.random() * Math.PI * 2,
            originalOpacity: material.opacity
        };
        
        scene.add(trace);
    }
}

function createDataConnections() {
    const connectionCount = 15;
    
    for (let i = 0; i < connectionCount; i++) {
        const points = [];
        
        // Create data flow lines between random points
        const startPoint = new THREE.Vector3(
            Math.random() * 1000 - 500,
            Math.random() * 600 - 300,
            Math.random() * 300 - 150
        );
        
        const endPoint = new THREE.Vector3(
            Math.random() * 1000 - 500,
            Math.random() * 600 - 300,
            Math.random() * 300 - 150
        );
        
        // Create curved data flow path
        const midPoint = new THREE.Vector3(
            (startPoint.x + endPoint.x) / 2 + (Math.random() - 0.5) * 100,
            (startPoint.y + endPoint.y) / 2 + (Math.random() - 0.5) * 100,
            (startPoint.z + endPoint.z) / 2
        );
        
        // Create smooth curve
        const curve = new THREE.QuadraticBezierCurve3(startPoint, midPoint, endPoint);
        points.push(...curve.getPoints(20));
        
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
            color: new THREE.Color().setHSL(0.55 + Math.random() * 0.1, 0.9, 0.7), // Bright blue/cyan spectrum
            transparent: true,
            opacity: 0.3
        });
        
        const connection = new THREE.Line(geometry, material);
        
        // Add data flow animation data
        connection.userData = {
            dataFlow: Math.random(),
            flowSpeed: 0.01 + Math.random() * 0.02,
            originalColor: material.color.clone()
        };
        
        scene.add(connection);
    }
}

function createIoTNodes() {
    const nodeCount = 12;
    
    for (let i = 0; i < nodeCount; i++) {
        // Create different types of IoT device representations
        const nodeType = Math.random();
        let geometry;
        
        if (nodeType < 0.4) {
            // Hexagonal nodes (sensors)
            geometry = new THREE.CylinderGeometry(8, 8, 3, 6);
        } else if (nodeType < 0.7) {
            // Small cubes (microcontrollers)
            geometry = new THREE.BoxGeometry(6, 6, 6);
        } else {
            // Octahedron (communication hubs)
            geometry = new THREE.OctahedronGeometry(5);
        }
        
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color().setHSL(0.58 + Math.random() * 0.08, 0.8, 0.6), // Deep blue range
            transparent: true,
            opacity: 0.6,
            wireframe: Math.random() > 0.5
        });
        
        const node = new THREE.Mesh(geometry, material);
        node.position.set(
            Math.random() * 800 - 400,
            Math.random() * 500 - 250,
            Math.random() * 200 - 100
        );
        
        // Random rotation
        node.rotation.set(
            Math.random() * Math.PI,
            Math.random() * Math.PI,
            Math.random() * Math.PI
        );
        
        // Add IoT node animation data
        node.userData = {
            pulseSpeed: 0.5 + Math.random() * 1.5,
            rotationSpeed: 0.01 + Math.random() * 0.02,
            originalScale: 1,
            phase: Math.random() * Math.PI * 2,
            activityLevel: Math.random()
        };
        
        scene.add(node);
    }
}

function onDocumentMouseMove(event) {
    mouseX = event.clientX - windowHalfX;
    mouseY = event.clientY - windowHalfY;
}

function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    // Check if camera is initialized before accessing it
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    }
    
    // Check if renderer is initialized before accessing it
    if (renderer) {
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Animate all objects in the scene
    scene.children.forEach((child) => {
        if (child.userData) {
            // Circuit trace pulsing
            if (child.type === 'Line' && child.userData.pulseSpeed) {
                const pulse = Math.sin(time * child.userData.pulseSpeed + child.userData.phase);
                child.material.opacity = child.userData.originalOpacity + pulse * 0.3;
                
                // Change color slightly for electrical activity
                const hue = (0.6 + pulse * 0.05) % 1;
                child.material.color.setHSL(hue, 0.8, 0.6);
            }
            
            // IoT nodes activity
            if (child.type === 'Mesh' && child.userData.pulseSpeed) {
                // Pulsing scale based on activity
                const pulse = Math.sin(time * child.userData.pulseSpeed + child.userData.phase);
                const scale = child.userData.originalScale + pulse * 0.2;
                child.scale.setScalar(scale);
                
                // Rotation for device activity
                child.rotation.y += child.userData.rotationSpeed;
                child.rotation.x += child.userData.rotationSpeed * 0.5;
                
                // Activity-based opacity changes
                child.material.opacity = 0.6 + Math.sin(time * 2 + child.userData.phase) * 0.2;
            }
            
            // Data flow animation
            if (child.userData.dataFlow !== undefined) {
                child.userData.dataFlow += child.userData.flowSpeed;
                
                // Create flowing effect by changing opacity along the line
                const flowPosition = (child.userData.dataFlow % 1);
                child.material.opacity = 0.3 + Math.sin(flowPosition * Math.PI * 4) * 0.4;
                
                // Color shift for data flow
                const hue = (0.55 + flowPosition * 0.08) % 1;
                child.material.color.setHSL(hue, 0.9, 0.7);
            }
        }
    });
    
    // Mouse interaction - smooth camera movement
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

// Loading Screen Animation
function hideLoadingScreen() {
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        loadingScreen.style.opacity = '0';
        loadingScreen.style.visibility = 'hidden';
        
        // Start entrance animations
        setTimeout(() => {
            animateHeroEntrance();
        }, 500);
    }, 2500);
}

// Hero Section Entrance Animation
function animateHeroEntrance() {
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    const titleLines = document.querySelectorAll('.title-line');
    
    // Animate hero content
    anime({
        targets: heroContent,
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 1000,
        easing: 'easeOutQuart'
    });
    
    // Animate title lines with stagger
    anime({
        targets: titleLines,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
    
    // Animate hero visual
    anime({
        targets: heroVisual,
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 1000,
        delay: 300,
        easing: 'easeOutQuart'
    });
    
    animationState.isLoaded = true;
}

// Navigation functionality
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        updateActiveNavLink();
    });
    
    // Smooth scrolling for nav links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80;
                
                anime({
                    targets: document.documentElement,
                    scrollTop: offsetTop,
                    duration: 1000,
                    easing: 'easeInOutQuart'
                });
            }
            
            // Close mobile menu
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.offsetHeight;
        
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
    
    animationState.currentSection = current;
}

// Scroll-triggered animations
function initScrollAnimations() {
    // About section animation
    const aboutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateAboutSection();
                aboutObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    aboutObserver.observe(document.querySelector('.about'));
    
    // Services section animation
    const servicesObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateServicesSection();
                servicesObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    servicesObserver.observe(document.querySelector('.services'));
    
    // Contact section animation
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateContactSection();
                contactObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    contactObserver.observe(document.querySelector('.contact'));
}

// About section animations
function animateAboutSection() {
    const aboutText = document.querySelector('.about-text');
    const aboutVisual = document.querySelector('.about-visual');
    const featureItems = document.querySelectorAll('.feature-item');
    
    // Animate about text
    anime({
        targets: aboutText,
        opacity: [0, 1],
        translateX: [-50, 0],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    // Animate about visual
    anime({
        targets: aboutVisual,
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutQuart'
    });
    
    // Animate feature items with stagger
    anime({
        targets: featureItems,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        delay: anime.stagger(150, {start: 400}),
        easing: 'easeOutQuart'
    });
}

// Services section animations
function animateServicesSection() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    anime({
        targets: serviceCards,
        opacity: [0, 1],
        translateY: [50, 0],
        scale: [0.9, 1],
        duration: 800,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
}

// Contact section animations
function animateContactSection() {
    const contactInfo = document.querySelector('.contact-info');
    const contactVisual = document.querySelector('.contact-visual');
    const contactMethods = document.querySelectorAll('.contact-method');
    
    // Animate contact info
    anime({
        targets: contactInfo,
        opacity: [0, 1],
        translateX: [-50, 0],
        duration: 800,
        easing: 'easeOutQuart'
    });
    
    // Animate contact visual
    anime({
        targets: contactVisual,
        opacity: [0, 1],
        translateX: [50, 0],
        duration: 800,
        delay: 200,
        easing: 'easeOutQuart'
    });
    
    // Animate contact methods with stagger
    anime({
        targets: contactMethods,
        opacity: [0, 1],
        translateY: [30, 0],
        duration: 600,
        delay: anime.stagger(150, {start: 400}),
        easing: 'easeOutQuart'
    });
}

// Initialize general animations
function initAnimations() {
    // Button hover animations
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            anime({
                targets: button,
                scale: 1.05,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        button.addEventListener('mouseleave', () => {
            anime({
                targets: button,
                scale: 1,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Service card hover animations
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            anime({
                targets: card,
                translateY: -10,
                duration: 400,
                easing: 'easeOutQuart'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            anime({
                targets: card,
                translateY: 0,
                duration: 400,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Contact method hover animations
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('mouseenter', () => {
            anime({
                targets: method,
                translateX: 10,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        method.addEventListener('mouseleave', () => {
            anime({
                targets: method,
                translateX: 0,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
    
    // Feature item hover animations
    const featureItems = document.querySelectorAll('.feature-item');
    
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            anime({
                targets: item,
                translateX: 10,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            anime({
                targets: item,
                translateX: 0,
                duration: 300,
                easing: 'easeOutQuart'
            });
        });
    });
}

// Smooth scrolling for anchor links
document.addEventListener('click', (e) => {
    if (e.target.closest('a[href^="#"]')) {
        e.preventDefault();
        const target = e.target.closest('a[href^="#"]');
        const targetId = target.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 80;
            
            anime({
                targets: document.documentElement,
                scrollTop: offsetTop,
                duration: 1000,
                easing: 'easeInOutQuart'
            });
        }
    }
});

// Parallax effect for floating cards
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const floatingCards = document.querySelectorAll('.floating-card');
    
    floatingCards.forEach((card, index) => {
        const speed = 0.5 + (index * 0.1);
        card.style.transform = `translateY(${scrolled * speed * 0.5}px)`;
    });
});

// Code animation in contact section
function animateCodeContent() {
    const codeLines = document.querySelectorAll('.code-line');
    
    anime({
        targets: codeLines,
        opacity: [0, 1],
        translateX: [-20, 0],
        duration: 600,
        delay: anime.stagger(200),
        easing: 'easeOutQuart'
    });
}

// Trigger code animation when contact section is visible
const codeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                animateCodeContent();
            }, 800);
            codeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.addEventListener('DOMContentLoaded', () => {
    const contactCard = document.querySelector('.contact-card');
    if (contactCard) {
        codeObserver.observe(contactCard);
    }
});

// Performance optimization: throttle scroll events
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

// Apply throttling to scroll events
window.addEventListener('scroll', throttle(() => {
    updateActiveNavLink();
}, 100));

// Resize handler for Three.js
window.addEventListener('resize', throttle(() => {
    onWindowResize();
}, 250));