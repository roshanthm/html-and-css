// Emergency Assist App - JavaScript Implementation

class EmergencyApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'dashboard';
        this.emergencyContacts = [];
        this.emergencyActive = false;
        this.emergencyType = '';
        this.location = null;
        this.motionData = null;
        this.isEditing = false;
        
        this.init();
    }

    init() {
        this.showLoadingScreen();
        this.setupEventListeners();
        this.checkAuthState();
        this.initializeLocation();
        this.initializeMotionDetection();
        this.loadContacts();
        this.drawActivityChart();
        this.populateNearbyServices();
    }

    showLoadingScreen() {
        setTimeout(() => {
            document.getElementById('loading-screen').classList.add('hidden');
            if (this.currentUser) {
                this.showDashboard();
            } else {
                this.showAuthPage();
            }
        }, 2000);
    }

    setupEventListeners() {
        // Auth form listeners
        document.getElementById('show-register').addEventListener('click', () => this.toggleAuthMode(false));
        document.getElementById('show-login').addEventListener('click', () => this.toggleAuthMode(true));
        document.getElementById('login-form-element').addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('register-form-element').addEventListener('submit', (e) => this.handleRegister(e));

        // Dashboard navigation
        document.getElementById('menu-toggle').addEventListener('click', () => this.toggleSidebar());
        document.getElementById('sidebar-close').addEventListener('click', () => this.closeSidebar());
        
        // Tab navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // SOS functionality
        document.getElementById('sos-button').addEventListener('click', () => this.handleSOSPress());
        document.getElementById('cancel-emergency').addEventListener('click', () => this.cancelEmergency());
        
        // Emergency types
        document.querySelectorAll('.emergency-type').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectEmergencyType(e.target.dataset.type));
        });

        // Contacts functionality
        document.getElementById('add-contact-btn').addEventListener('click', () => this.showAddContactForm());
        document.getElementById('cancel-contact').addEventListener('click', () => this.hideAddContactForm());
        document.getElementById('save-contact').addEventListener('click', () => this.saveContact());

        // Profile functionality
        document.getElementById('edit-profile-btn').addEventListener('click', () => this.toggleProfileEdit());
        document.getElementById('cancel-edit').addEventListener('click', () => this.cancelProfileEdit());
        document.getElementById('save-profile').addEventListener('click', () => this.saveProfile());
        document.getElementById('logout-btn').addEventListener('click', () => this.logout());

        // Responsive sidebar
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                this.closeSidebar();
            }
        });

        // Click outside sidebar to close
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuBtn = document.getElementById('menu-toggle');
            
            if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
                this.closeSidebar();
            }
        });
    }

    checkAuthState() {
        const savedUser = localStorage.getItem('emergency-user');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.updateUserDisplay();
            } catch (e) {
                localStorage.removeItem('emergency-user');
            }
        }
    }

    toggleAuthMode(isLogin) {
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        if (isLogin) {
            loginForm.classList.remove('hidden');
            registerForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            registerForm.classList.remove('hidden');
        }
        
        // Clear errors
        document.getElementById('auth-error').classList.add('hidden');
        document.getElementById('register-error').classList.add('hidden');
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const btn = document.getElementById('login-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnSpinner = btn.querySelector('.btn-spinner');
        const errorDiv = document.getElementById('auth-error');

        // Validation
        if (!email || !password) {
            this.showError(errorDiv, 'Please enter both email and password');
            return;
        }

        if (!email.includes('@')) {
            this.showError(errorDiv, 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError(errorDiv, 'Password must be at least 6 characters');
            return;
        }

        // Show loading
        btn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        try {
            // Simulate API call
            await this.delay(800);
            
            // Mock successful login
            this.currentUser = {
                uid: 'demo-user-' + Date.now(),
                email: email,
                displayName: email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1),
                phone: '',
                address: '123 Main St, City, State 12345',
                bloodType: 'O+',
                allergies: 'Penicillin',
                medications: 'Aspirin (daily)',
                emergencyNotes: 'Diabetic - carries insulin pen'
            };
            
            localStorage.setItem('emergency-user', JSON.stringify(this.currentUser));
            this.updateUserDisplay();
            this.showDashboard();
            
        } catch (error) {
            this.showError(errorDiv, 'Login failed. Please try again.');
        } finally {
            btn.disabled = false;
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    }

    async handleRegister(e) {
        e.preventDefault();
        
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm').value;
        const btn = document.getElementById('register-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnSpinner = btn.querySelector('.btn-spinner');
        const errorDiv = document.getElementById('register-error');

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            this.showError(errorDiv, 'Please fill in all fields');
            return;
        }

        if (!email.includes('@')) {
            this.showError(errorDiv, 'Please enter a valid email address');
            return;
        }

        if (password.length < 6) {
            this.showError(errorDiv, 'Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            this.showError(errorDiv, 'Passwords do not match');
            return;
        }

        if (name.length < 2) {
            this.showError(errorDiv, 'Name must be at least 2 characters');
            return;
        }

        // Show loading
        btn.disabled = true;
        btnText.classList.add('hidden');
        btnSpinner.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        try {
            // Simulate API call
            await this.delay(800);
            
            // Mock successful registration
            this.currentUser = {
                uid: 'demo-user-' + Date.now(),
                email: email,
                displayName: name,
                phone: '',
                address: '123 Main St, City, State 12345',
                bloodType: 'O+',
                allergies: 'None',
                medications: 'None',
                emergencyNotes: 'None'
            };
            
            localStorage.setItem('emergency-user', JSON.stringify(this.currentUser));
            this.updateUserDisplay();
            this.showDashboard();
            
        } catch (error) {
            this.showError(errorDiv, 'Registration failed. Please try again.');
        } finally {
            btn.disabled = false;
            btnText.classList.remove('hidden');
            btnSpinner.classList.add('hidden');
        }
    }

    showError(errorDiv, message) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }

    showAuthPage() {
        document.getElementById('auth-page').classList.remove('hidden');
        document.getElementById('dashboard').classList.add('hidden');
    }

    showDashboard() {
        document.getElementById('auth-page').classList.add('hidden');
        document.getElementById('dashboard').classList.remove('hidden');
        this.updateContactsDisplay();
        this.updateLocationStatus();
    }

    updateUserDisplay() {
        if (this.currentUser) {
            document.getElementById('user-name').textContent = this.currentUser.displayName;
            document.getElementById('profile-name').textContent = this.currentUser.displayName;
            document.getElementById('profile-email').textContent = this.currentUser.email;
            document.getElementById('display-name').textContent = this.currentUser.displayName;
            document.getElementById('display-email').textContent = this.currentUser.email;
            document.getElementById('display-phone').textContent = this.currentUser.phone || 'Not provided';
            document.getElementById('display-address').textContent = this.currentUser.address;
            document.getElementById('display-blood').textContent = this.currentUser.bloodType;
            document.getElementById('display-allergies').textContent = this.currentUser.allergies;
            document.getElementById('display-medications').textContent = this.currentUser.medications;
            document.getElementById('display-notes').textContent = this.currentUser.emergencyNotes;
        }
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.toggle('open');
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        sidebar.classList.remove('open');
    }

    switchTab(tabName) {
        // Update navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-tab`).classList.add('active');

        this.currentTab = tabName;
        this.closeSidebar();
    }

    selectEmergencyType(type) {
        document.querySelectorAll('.emergency-type').forEach(btn => {
            btn.classList.remove('selected');
        });
        document.querySelector(`[data-type="${type}"]`).classList.add('selected');
        this.emergencyType = type;
    }

    handleSOSPress() {
        if (this.emergencyActive) return;
        
        if (!this.emergencyType) {
            this.selectEmergencyType('SOS');
        }
        
        this.startSOSCountdown();
    }

    startSOSCountdown() {
        const sosButton = document.getElementById('sos-button');
        const countdown = document.getElementById('countdown');
        const sosContent = sosButton.querySelector('.sos-content');
        
        sosButton.classList.add('countdown');
        sosContent.classList.add('hidden');
        countdown.classList.remove('hidden');
        
        let count = 3;
        countdown.textContent = count;
        
        const timer = setInterval(() => {
            count--;
            if (count > 0) {
                countdown.textContent = count;
            } else {
                clearInterval(timer);
                this.activateEmergency();
            }
        }, 1000);
    }

    activateEmergency() {
        this.emergencyActive = true;
        
        const sosButton = document.getElementById('sos-button');
        const countdown = document.getElementById('countdown');
        const sosContent = sosButton.querySelector('.sos-content');
        const emergencyStatus = document.getElementById('emergency-status');
        const emergencyTypes = document.getElementById('emergency-types');
        
        // Update button appearance
        sosButton.classList.remove('countdown');
        sosButton.classList.add('active');
        countdown.classList.add('hidden');
        sosContent.classList.remove('hidden');
        sosContent.innerHTML = '<div class="sos-icon">✅</div><div class="sos-text">ACTIVE</div>';
        
        // Hide emergency types
        emergencyTypes.classList.add('hidden');
        
        // Show status panel
        emergencyStatus.classList.remove('hidden');
        document.getElementById('activation-time').textContent = `Activated: ${new Date().toLocaleTimeString()}`;
        
        // Simulate emergency response
        this.simulateEmergencyResponse();
    }

    simulateEmergencyResponse() {
        // Simulate contacting emergency services and contacts
        console.log('Emergency activated!');
        console.log('Type:', this.emergencyType);
        console.log('Location:', this.location);
        console.log('Contacts notified:', this.emergencyContacts.length);
        
        // In a real app, this would:
        // - Send location to emergency services
        // - Notify emergency contacts via SMS/call
        // - Start continuous location tracking
        // - Log the emergency event
    }

    cancelEmergency() {
        this.emergencyActive = false;
        this.emergencyType = '';
        
        const sosButton = document.getElementById('sos-button');
        const sosContent = sosButton.querySelector('.sos-content');
        const emergencyStatus = document.getElementById('emergency-status');
        const emergencyTypes = document.getElementById('emergency-types');
        
        // Reset button
        sosButton.classList.remove('active', 'countdown');
        sosContent.innerHTML = '<div class="sos-icon">🚨</div><div class="sos-text">SOS</div>';
        
        // Hide status panel
        emergencyStatus.classList.add('hidden');
        
        // Show emergency types
        emergencyTypes.classList.remove('hidden');
        
        // Clear emergency type selection
        document.querySelectorAll('.emergency-type').forEach(btn => {
            btn.classList.remove('selected');
        });
    }

    showAddContactForm() {
        document.getElementById('add-contact-form').classList.remove('hidden');
        document.getElementById('contact-name').focus();
    }

    hideAddContactForm() {
        document.getElementById('add-contact-form').classList.add('hidden');
        this.clearContactForm();
    }

    clearContactForm() {
        document.getElementById('contact-name').value = '';
        document.getElementById('contact-phone').value = '';
        document.getElementById('contact-relationship').value = '';
        document.getElementById('contact-priority').value = '1';
    }

    saveContact() {
        const name = document.getElementById('contact-name').value.trim();
        const phone = document.getElementById('contact-phone').value.trim();
        const relationship = document.getElementById('contact-relationship').value;
        const priority = parseInt(document.getElementById('contact-priority').value);

        if (!name || !phone) {
            alert('Please enter both name and phone number');
            return;
        }

        const contact = {
            id: Date.now().toString(),
            name,
            phone,
            relationship: relationship || 'Other',
            priority,
            isPrimary: this.emergencyContacts.length === 0
        };

        this.emergencyContacts.push(contact);
        this.saveContacts();
        this.updateContactsDisplay();
        this.hideAddContactForm();
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.emergencyContacts = this.emergencyContacts.filter(contact => contact.id !== id);
            this.saveContacts();
            this.updateContactsDisplay();
        }
    }

    setPrimaryContact(id) {
        this.emergencyContacts.forEach(contact => {
            contact.isPrimary = contact.id === id;
        });
        this.saveContacts();
        this.updateContactsDisplay();
    }

    callContact(phone) {
        window.open(`tel:${phone}`, '_self');
    }

    textContact(phone) {
        window.open(`sms:${phone}`, '_self');
    }

    loadContacts() {
        const saved = localStorage.getItem('emergency-contacts');
        if (saved) {
            try {
                this.emergencyContacts = JSON.parse(saved);
            } catch (e) {
                this.emergencyContacts = [];
            }
        } else {
            // Default contacts for demo
            this.emergencyContacts = [
                { id: '1', name: 'John Doe', phone: '+1 (555) 123-4567', relationship: 'Spouse', priority: 1, isPrimary: true },
                { id: '2', name: 'Jane Smith', phone: '+1 (555) 987-6543', relationship: 'Sibling', priority: 2, isPrimary: false },
                { id: '3', name: 'Dr. Wilson', phone: '+1 (555) 456-7890', relationship: 'Doctor', priority: 3, isPrimary: false }
            ];
            this.saveContacts();
        }
    }

    saveContacts() {
        localStorage.setItem('emergency-contacts', JSON.stringify(this.emergencyContacts));
    }

    updateContactsDisplay() {
        const grid = document.getElementById('contacts-grid');
        const noContacts = document.getElementById('no-contacts');
        
        if (this.emergencyContacts.length === 0) {
            grid.classList.add('hidden');
            noContacts.classList.remove('hidden');
            return;
        }
        
        grid.classList.remove('hidden');
        noContacts.classList.add('hidden');
        
        const sortedContacts = [...this.emergencyContacts].sort((a, b) => a.priority - b.priority);
        
        grid.innerHTML = sortedContacts.map(contact => `
            <div class="contact-card">
                <div class="contact-header">
                    <div class="contact-info">
                        <h3>
                            ${contact.name}
                            ${contact.isPrimary ? '<span class="primary-star">⭐</span>' : ''}
                        </h3>
                        <p>${contact.relationship}</p>
                        <p class="contact-phone">${contact.phone}</p>
                    </div>
                    <div class="contact-actions">
                        <button class="icon-btn star" onclick="app.setPrimaryContact('${contact.id}')" title="Set as primary">
                            ${contact.isPrimary ? '⭐' : '☆'}
                        </button>
                        <button class="icon-btn delete" onclick="app.deleteContact('${contact.id}')" title="Delete contact">
                            🗑️
                        </button>
                    </div>
                </div>
                <div class="contact-buttons">
                    <button class="contact-btn call-btn" onclick="app.callContact('${contact.phone}')">
                        📞 Call
                    </button>
                    <button class="contact-btn text-btn" onclick="app.textContact('${contact.phone}')">
                        💬 Text
                    </button>
                </div>
            </div>
        `).join('');
    }

    toggleProfileEdit() {
        this.isEditing = !this.isEditing;
        
        const editBtn = document.getElementById('edit-profile-btn');
        const editActions = document.getElementById('edit-actions');
        
        if (this.isEditing) {
            editBtn.classList.add('hidden');
            editActions.classList.remove('hidden');
            this.showEditInputs();
        } else {
            editBtn.classList.remove('hidden');
            editActions.classList.add('hidden');
            this.hideEditInputs();
        }
    }

    showEditInputs() {
        const fields = ['name', 'email', 'phone', 'address', 'blood', 'allergies', 'medications', 'notes'];
        
        fields.forEach(field => {
            const display = document.getElementById(`display-${field}`);
            const input = document.getElementById(`edit-${field}`);
            
            if (display && input) {
                display.classList.add('hidden');
                input.classList.remove('hidden');
                
                // Set input values
                if (field === 'name') input.value = this.currentUser.displayName;
                else if (field === 'email') input.value = this.currentUser.email;
                else if (field === 'phone') input.value = this.currentUser.phone || '';
                else if (field === 'address') input.value = this.currentUser.address;
                else if (field === 'blood') input.value = this.currentUser.bloodType;
                else if (field === 'allergies') input.value = this.currentUser.allergies;
                else if (field === 'medications') input.value = this.currentUser.medications;
                else if (field === 'notes') input.value = this.currentUser.emergencyNotes;
            }
        });
    }

    hideEditInputs() {
        const fields = ['name', 'email', 'phone', 'address', 'blood', 'allergies', 'medications', 'notes'];
        
        fields.forEach(field => {
            const display = document.getElementById(`display-${field}`);
            const input = document.getElementById(`edit-${field}`);
            
            if (display && input) {
                display.classList.remove('hidden');
                input.classList.add('hidden');
            }
        });
    }

    cancelProfileEdit() {
        this.isEditing = false;
        this.toggleProfileEdit();
    }

    saveProfile() {
        // Get values from inputs
        this.currentUser.displayName = document.getElementById('edit-name').value;
        this.currentUser.email = document.getElementById('edit-email').value;
        this.currentUser.phone = document.getElementById('edit-phone').value;
        this.currentUser.address = document.getElementById('edit-address').value;
        this.currentUser.bloodType = document.getElementById('edit-blood').value;
        this.currentUser.allergies = document.getElementById('edit-allergies').value;
        this.currentUser.medications = document.getElementById('edit-medications').value;
        this.currentUser.emergencyNotes = document.getElementById('edit-notes').value;
        
        // Save to localStorage
        localStorage.setItem('emergency-user', JSON.stringify(this.currentUser));
        
        // Update display
        this.updateUserDisplay();
        
        // Exit edit mode
        this.isEditing = false;
        this.toggleProfileEdit();
        
        // Show success message
        alert('Profile updated successfully!');
    }

    logout() {
        if (confirm('Are you sure you want to sign out?')) {
            this.currentUser = null;
            localStorage.removeItem('emergency-user');
            this.showAuthPage();
        }
    }

    initializeLocation() {
        if (!navigator.geolocation) {
            console.log('Geolocation not supported');
            return;
        }

        const options = {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        };

        navigator.geolocation.watchPosition(
            (position) => {
                this.location = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: Date.now()
                };
                this.updateLocationStatus();
            },
            (error) => {
                console.log('Location error:', error.message);
                this.updateLocationStatus();
            },
            options
        );
    }

    updateLocationStatus() {
        const locationValue = document.getElementById('location-value');
        if (locationValue) {
            locationValue.textContent = this.location ? 'Active' : 'Searching...';
            locationValue.parentElement.parentElement.className = this.location 
                ? 'status-card location-status' 
                : 'status-card location-status searching';
        }
    }

    initializeMotionDetection() {
        if (typeof DeviceMotionEvent === 'undefined') {
            console.log('Motion detection not supported');
            return;
        }

        // Request permission for iOS devices
        if (typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    this.startMotionDetection();
                }
            });
        } else {
            this.startMotionDetection();
        }
    }

    startMotionDetection() {
        window.addEventListener('devicemotion', (event) => {
            const acceleration = event.accelerationIncludingGravity;
            if (acceleration) {
                const x = acceleration.x || 0;
                const y = acceleration.y || 0;
                const z = acceleration.z || 0;
                
                const intensity = Math.sqrt(x * x + y * y + z * z);
                const isMoving = intensity > 12;
                
                this.motionData = {
                    timestamp: Date.now(),
                    acceleration: { x, y, z },
                    isMoving,
                    intensity
                };
                
                this.updateMotionStatus();
            }
        });
    }

    updateMotionStatus() {
        const motionValue = document.getElementById('motion-value');
        if (motionValue && this.motionData) {
            motionValue.textContent = this.motionData.isMoving ? 'Moving' : 'Stationary';
        }
    }

    drawActivityChart() {
        const canvas = document.getElementById('activity-chart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const width = canvas.width;
        const height = canvas.height;
        
        // Sample data
        const data = [
            { time: '10:00', activity: 45 },
            { time: '11:00', activity: 52 },
            { time: '12:00', activity: 48 },
            { time: '13:00', activity: 61 },
            { time: '14:00', activity: 55 },
            { time: '15:00', activity: 67 },
            { time: '16:00', activity: 43 }
        ];
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Set up chart dimensions
        const padding = 60;
        const chartWidth = width - 2 * padding;
        const chartHeight = height - 2 * padding;
        
        // Draw grid
        ctx.strokeStyle = '#e5e7eb';
        ctx.lineWidth = 1;
        
        // Vertical grid lines
        for (let i = 0; i <= data.length - 1; i++) {
            const x = padding + (i * chartWidth) / (data.length - 1);
            ctx.beginPath();
            ctx.moveTo(x, padding);
            ctx.lineTo(x, height - padding);
            ctx.stroke();
        }
        
        // Horizontal grid lines
        for (let i = 0; i <= 4; i++) {
            const y = padding + (i * chartHeight) / 4;
            ctx.beginPath();
            ctx.moveTo(padding, y);
            ctx.lineTo(width - padding, y);
            ctx.stroke();
        }
        
        // Draw line
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 3;
        ctx.beginPath();
        
        const maxActivity = Math.max(...data.map(d => d.activity));
        const minActivity = Math.min(...data.map(d => d.activity));
        const activityRange = maxActivity - minActivity;
        
        data.forEach((point, index) => {
            const x = padding + (index * chartWidth) / (data.length - 1);
            const y = height - padding - ((point.activity - minActivity) / activityRange) * chartHeight;
            
            if (index === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        });
        
        ctx.stroke();
        
        // Draw points
        ctx.fillStyle = '#dc2626';
        data.forEach((point, index) => {
            const x = padding + (index * chartWidth) / (data.length - 1);
            const y = height - padding - ((point.activity - minActivity) / activityRange) * chartHeight;
            
            ctx.beginPath();
            ctx.arc(x, y, 4, 0, 2 * Math.PI);
            ctx.fill();
        });
        
        // Draw labels
        ctx.fillStyle = '#6b7280';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        
        data.forEach((point, index) => {
            const x = padding + (index * chartWidth) / (data.length - 1);
            ctx.fillText(point.time, x, height - padding + 20);
        });
    }

    populateNearbyServices() {
        const services = [
            { name: 'City General Hospital', type: 'Hospital', distance: '0.8 km', status: 'Open', icon: '🏥' },
            { name: 'Police Station 12', type: 'Police', distance: '1.2 km', status: 'Active', icon: '👮' },
            { name: 'Fire Station 7', type: 'Fire Department', distance: '1.5 km', status: 'Available', icon: '🚒' },
            { name: 'AutoCare Workshop', type: 'Mechanic', distance: '0.6 km', status: 'Open', icon: '🔧' }
        ];
        
        const container = document.getElementById('nearby-services');
        if (!container) return;
        
        container.innerHTML = services.map(service => `
            <div class="service-item">
                <div class="service-info">
                    <div class="service-icon">${service.icon}</div>
                    <div class="service-details">
                        <h4>${service.name}</h4>
                        <p>${service.type} • ${service.distance}</p>
                    </div>
                </div>
                <div class="service-status status-open">${service.status}</div>
            </div>
        `).join('');
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new EmergencyApp();
});