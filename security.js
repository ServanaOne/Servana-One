// Anti-Copy & Security Protection System
// Multiple layers of protection against code copying and inspection

(function() {
    'use strict';
    
    // Disable right-click context menu
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
        e.stopPropagation();
        showWarning('Right-click disabled for security');
        return false;
    });
    
    // Disable text selection
    document.addEventListener('selectstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable drag and drop
    document.addEventListener('dragstart', function(e) {
        e.preventDefault();
        return false;
    });
    
    // Disable keyboard shortcuts for developer tools and copying
    document.addEventListener('keydown', function(e) {
        // Disable F12 (Developer Tools)
        if (e.keyCode === 123) {
            e.preventDefault();
            showWarning('Developer tools access denied');
            return false;
        }
        
        // Disable Ctrl+Shift+I (Developer Tools)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 73) {
            e.preventDefault();
            showWarning('Developer tools access denied');
            return false;
        }
        
        // Disable Ctrl+Shift+C (Element inspector)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 67) {
            e.preventDefault();
            showWarning('Element inspector disabled');
            return false;
        }
        
        // Disable Ctrl+Shift+K (Console)
        if (e.ctrlKey && e.shiftKey && e.keyCode === 75) {
            e.preventDefault();
            showWarning('Console access denied');
            return false;
        }
        
        // Disable Ctrl+U (View Source)
        if (e.ctrlKey && e.keyCode === 85) {
            e.preventDefault();
            showWarning('View source disabled');
            return false;
        }
        
        // Disable Ctrl+A (Select All)
        if (e.ctrlKey && e.keyCode === 65) {
            e.preventDefault();
            showWarning('Select all disabled');
            return false;
        }
        
        // Disable Ctrl+C (Copy)
        if (e.ctrlKey && e.keyCode === 67) {
            e.preventDefault();
            showWarning('Copy function disabled');
            return false;
        }
        
        // Disable Ctrl+V (Paste)
        if (e.ctrlKey && e.keyCode === 86) {
            e.preventDefault();
            return false;
        }
        
        // Disable Ctrl+X (Cut)
        if (e.ctrlKey && e.keyCode === 88) {
            e.preventDefault();
            showWarning('Cut function disabled');
            return false;
        }
        
        // Disable Ctrl+S (Save)
        if (e.ctrlKey && e.keyCode === 83) {
            e.preventDefault();
            showWarning('Save function disabled');
            return false;
        }
        
        // Disable Ctrl+P (Print)
        if (e.ctrlKey && e.keyCode === 80) {
            e.preventDefault();
            showWarning('Print function disabled');
            return false;
        }
        
        // Disable F5 and Ctrl+R (Refresh) when developer tools might be open
        if (e.keyCode === 116 || (e.ctrlKey && e.keyCode === 82)) {
            if (isDevToolsOpen()) {
                e.preventDefault();
                return false;
            }
        }
    });
    
    // Detect developer tools opening (less aggressive)
    let devtools = {open: false, orientation: null};
    const threshold = 200; // Increased threshold to be less sensitive
    
    setInterval(function() {
        const widthThreshold = window.outerWidth - window.innerWidth > threshold;
        const heightThreshold = window.outerHeight - window.innerHeight > threshold;
        const orientation = widthThreshold ? 'vertical' : 'horizontal';
        
        // Only trigger if both width AND height thresholds are exceeded (more strict)
        if (widthThreshold && heightThreshold && 
            ((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized))) {
            if (!devtools.open || devtools.orientation !== orientation) {
                devtools.open = true;
                devtools.orientation = orientation;
                handleDevToolsOpen();
            }
        } else {
            devtools.open = false;
            devtools.orientation = null;
        }
    }, 1000); // Less frequent checks
    
    function isDevToolsOpen() {
        return devtools.open;
    }
    
    function handleDevToolsOpen() {
        // Show warning but don't block normal usage
        showCriticalWarning('Developer tools detected');
        
        // Optional: Only redirect/block if user persists
        // window.location.href = 'access-denied.html';
        // window.close();
        
        // Don't clear page content immediately - give user a chance
        // setTimeout(() => {
        //     document.body.innerHTML = '<div style="color:red;text-align:center;margin-top:50px;font-size:24px;">⚠️ Unauthorized Access Detected ⚠️<br><small>Please refresh the page</small></div>';
        // }, 1000);
    }
    
    // Disable printing
    window.addEventListener('beforeprint', function(e) {
        e.preventDefault();
        showWarning('Printing disabled for security');
        return false;
    });
    
    // Clear console periodically
    setInterval(function() {
        try {
            console.clear();
            console.log('%cStop!', 'color: red; font-size: 50px; font-weight: bold;');
            console.log('%cThis is a browser feature intended for developers. Content is protected.', 'color: red; font-size: 16px;');
        } catch(e) {}
    }, 1000);
    
    // Disable image saving
    document.addEventListener('DOMContentLoaded', function() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            img.addEventListener('dragstart', function(e) {
                e.preventDefault();
                return false;
            });
            
            img.addEventListener('contextmenu', function(e) {
                e.preventDefault();
                return false;
            });
            
            // Add overlay to prevent right-click on images
            img.style.pointerEvents = 'none';
            
            // Wrap images in a container
            const wrapper = document.createElement('div');
            wrapper.style.display = 'inline-block';
            wrapper.style.position = 'relative';
            img.parentNode.insertBefore(wrapper, img);
            wrapper.appendChild(img);
            
            const overlay = document.createElement('div');
            overlay.style.position = 'absolute';
            overlay.style.top = '0';
            overlay.style.left = '0';
            overlay.style.width = '100%';
            overlay.style.height = '100%';
            overlay.style.backgroundColor = 'transparent';
            overlay.style.zIndex = '1';
            wrapper.appendChild(overlay);
        });
    });
    
    // Disable view source through menu
    if (typeof window.external === 'object' && typeof window.external.menuArguments === 'object') {
        window.external.menuArguments.document.oncontextmenu = function() { return false; };
    }
    
    // Anti-debugging techniques (less aggressive)
    let startTime = new Date();
    
    function detectDebugger() {
        try {
            const now = new Date();
            if (now - startTime > 200) { // Increased threshold
                // Only show warning, don't block
                console.warn('Unusual timing detected');
            }
            startTime = now;
            
            // Check if debugger statement takes too long (indicates debugger is open)
            const before = performance.now();
            // debugger; // Commented out to reduce false positives
            const after = performance.now();
            
            if (after - before > 200) { // Increased threshold
                console.warn('Debugger may be active');
            }
        } catch(e) {
            // Silently handle errors
        }
    }
    
    // Run debugger detection less frequently
    setInterval(detectDebugger, 3000);
    
    // Obfuscate page content on blur (less aggressive)
    window.addEventListener('blur', function() {
        // Only blur if we're confident dev tools are open
        if (isDevToolsOpen()) {
            document.body.style.filter = 'blur(2px)'; // Reduced blur
        }
    });
    
    window.addEventListener('focus', function() {
        // Always restore on focus
        document.body.style.filter = 'none';
        document.body.style.display = 'block';
    });
    
    // Warning system
    function showWarning(message) {
        // Create warning notification
        const warning = document.createElement('div');
        warning.innerHTML = `⚠️ ${message}`;
        warning.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff4444;
            color: white;
            padding: 10px 15px;
            border-radius: 5px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            animation: slideIn 0.3s ease;
        `;
        
        // Add slide-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(warning);
        
        setTimeout(() => {
            if (warning.parentNode) {
                warning.parentNode.removeChild(warning);
            }
        }, 3000);
    }
    
    function showCriticalWarning(message) {
        showWarning(message);
        
        // Log attempt for monitoring
        try {
            console.error('Security Alert:', message, new Date().toISOString());
            
            // Optional: Send to analytics or monitoring service
            // fetch('/api/security-alert', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         message: message,
            //         timestamp: new Date().toISOString(),
            //         userAgent: navigator.userAgent,
            //         url: window.location.href
            //     })
            // });
        } catch(e) {}
    }
    
    // Protect the security script itself
    Object.defineProperty(window, 'security', {
        value: 'protected',
        writable: false,
        configurable: false
    });
    
    // Add CSS to prevent text selection globally
    const noSelectStyle = document.createElement('style');
    noSelectStyle.textContent = `
        * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
            -webkit-touch-callout: none !important;
            -webkit-tap-highlight-color: transparent !important;
        }
        
        input, textarea {
            -webkit-user-select: text !important;
            -moz-user-select: text !important;
            -ms-user-select: text !important;
            user-select: text !important;
        }
        
        /* Hide scroll bars to prevent copy via scrolling */
        ::-webkit-scrollbar {
            width: 0px;
            background: transparent;
        }
        
        /* Disable highlighting */
        ::selection {
            background: transparent;
        }
        ::-moz-selection {
            background: transparent;
        }
    `;
    document.head.appendChild(noSelectStyle);
    
    // Monitor for attempts to modify security measures
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                mutation.removedNodes.forEach(function(node) {
                    if (node === noSelectStyle) {
                        document.head.appendChild(noSelectStyle);
                        showCriticalWarning('Security bypass attempt detected!');
                    }
                });
            }
        });
    });
    
    observer.observe(document.head, {
        childList: true,
        subtree: true
    });
    
    // Final initialization message
    console.log('%cSecurity measures active', 'color: green; font-weight: bold;');
    
})();

// Additional protection: Protect security functions
try {
    Object.defineProperty(window, 'disableSecurity', {
        value: function() { 
            console.warn('Security cannot be disabled'); 
            return false; 
        },
        writable: false,
        configurable: false
    });
} catch(e) {
    // Silently handle if already defined
}
