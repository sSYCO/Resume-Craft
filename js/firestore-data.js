const templates = [
            { id: 1, name: 'Classic', preview: '<i class="fa-regular fa-file" style="color: grey"></i>', file: 'templates/t1-classic.html' },
            { id: 2, name: 'Minimal', preview: '<i class="fa-regular fa-file-lines" style="color: grey"></i>', file: 'templates/t2-minimal.html' },
            { id: 3, name: 'Modern', preview: '<i class="fa-solid fa-chart-column" style="color: grey"></i>', file: 'templates/t3-modern.html' },
            { id: 4, name: 'Creative', preview: '<i class="fa-solid fa-palette" style="color: grey"></i>', file: 'templates/t4-creative.html' },
            { id: 5, name: 'Executive', preview: '<i class="fa-solid fa-briefcase" style="color: grey"></i>', file: 'templates/t5-executive.html' },
            { id: 6, name: 'ATS Pro', preview: '<i class="fa-solid fa-gear" style="color: grey"></i>', file: 'templates/t6-ats-friendly.html' }
        ];

        // Generate Template Cards
        const grid = document.getElementById('guest-templates');
        templates.forEach((t, i) => {
            const card = document.createElement('div');
            card.className = 'template-card fade-up';
            card.style.animationDelay = `${i * 0.1}s`;
            card.innerHTML = `
                <div class="preview-box">${t.preview}</div>
                <h3>${t.name}</h3>
                <span class="badge">Guest View</span>
            `;
            card.addEventListener('click', () => openPopup(t.file));
            grid.appendChild(card);
        });

        // Popup Functions
        function openPopup(templateFile) {
            document.getElementById('popup-iframe').src = templateFile;
            document.getElementById('preview-popup').style.display = 'flex';
        }
        
        function closePopup() {
            document.getElementById('preview-popup').style.display = 'none';
            document.getElementById('popup-iframe').src = '';
        }
        
        document.getElementById('preview-popup').addEventListener('click', function(e) {
            if(e.target === this) closePopup();
        });
        
        document.addEventListener('keydown', function(e) {
            if(e.key === 'Escape') closePopup();
        });

        // Mobile Menu Toggle
        const menuToggle = document.getElementById('menu-toggle');
        const navLinks = document.getElementById('nav-links');
        
        if(menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('mobile-active');
            });
        }
        
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('mobile-active');
            });
        });

        // ✅ CONTACT FORM - FIRESTORE SAVE
        document.addEventListener('DOMContentLoaded', function() {
            // Wait for Firebase to be ready
            setTimeout(function() {
                try {
                    const db = firebase.firestore();
                    console.log('✅ Firestore ready:', db);
                    
                    const contactForm = document.getElementById('contact-form');
                    if(!contactForm) {
                        console.error('❌ Contact form not found');
                        return;
                    }
                    
                    contactForm.addEventListener('submit', async function(e) {
                        e.preventDefault();
                        console.log('📤 Form submitted');
                        
                        const name = document.getElementById('contact-name').value.trim();
                        const email = document.getElementById('contact-email').value.trim();
                        const message = document.getElementById('contact-message').value.trim();
                        
                        if(!name || !email || !message) {
                            alert('⚠️ Please fill all fields');
                            return;
                        }
                        
                        const submitBtn = contactForm.querySelector('button[type="submit"]');
                        const originalText = submitBtn.textContent;
                        submitBtn.textContent = '⏳ Sending...';
                        submitBtn.disabled = true;
                        
                        try {
                            await db.collection('contact_submissions').add({
                                name: name,
                                email: email,
                                message: message,
                                timestamp: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            
                            console.log('✅ Saved to Firestore');
                            alert('✅ Message sent successfully!');
                            contactForm.reset();
                            
                        } catch (error) {
                            console.error('❌ Firebase Error:', error);
                            alert('❌ Error: ' + error.message);
                        } finally {
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                        }
                    });
                    
                } catch(error) {
                    console.error('❌ Firestore init error:', error);
                }
            }, 1000); // Wait 1 second for Firebase to initialize
        });