// UniEats - Main JavaScript File

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            }
        });
    });
    
    // Animation on scroll
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkIfInView() {
        const windowHeight = window.innerHeight;
        const windowTopPosition = window.scrollY;
        const windowBottomPosition = windowTopPosition + windowHeight;

        animatedElements.forEach(element => {
            const elementHeight = element.offsetHeight;
            const elementTopPosition = element.offsetTop;
            const elementBottomPosition = elementTopPosition + elementHeight;

            // Check if element is in viewport
            if (
                (elementBottomPosition >= windowTopPosition) &&
                (elementTopPosition <= windowBottomPosition)
            ) {
                element.classList.add('in-view');
            }
        });
    }
    
    // Run on page load
    checkIfInView();
    
    // Run on scroll
    window.addEventListener('scroll', checkIfInView);
    
    // Reviews carousel
    const reviewsCarousel = document.querySelector('.reviews-carousel');
    const reviewCards = document.querySelectorAll('.review-card');
    const prevReviewBtn = document.querySelector('.prev-review');
    const nextReviewBtn = document.querySelector('.next-review');
    
    if (reviewsCarousel && reviewCards.length > 0) {
        let currentReview = 0;
        
        // Show the first review initially
        reviewCards[0].style.display = 'block';
        for (let i = 1; i < reviewCards.length; i++) {
            reviewCards[i].style.display = 'none';
        }
        
        // Function to show specific review
        function showReview(index) {
            // Hide all reviews
            reviewCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show the selected review
            reviewCards[index].style.display = 'block';
            reviewCards[index].style.animation = 'fadeIn 0.5s forwards';
        }
        
        // Next button
        if (nextReviewBtn) {
            nextReviewBtn.addEventListener('click', function() {
                currentReview = (currentReview + 1) % reviewCards.length;
                showReview(currentReview);
            });
        }
        
        // Previous button
        if (prevReviewBtn) {
            prevReviewBtn.addEventListener('click', function() {
                currentReview = (currentReview - 1 + reviewCards.length) % reviewCards.length;
                showReview(currentReview);
            });
        }
        
        // Auto rotation
        setInterval(function() {
            currentReview = (currentReview + 1) % reviewCards.length;
            showReview(currentReview);
        }, 5000);
    }
    
    // Newsletter form submission
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            if (email) {
                alert('Thank you for subscribing to our newsletter!');
                this.reset();
            }
        });
    }

    // HOMEPAGE DYNAMIC LOGIC
    // Only run if homepage containers exist
    const featuredContainer = document.getElementById('featured-spots-container');
    const lateNightContainer = document.getElementById('late-night-container');
    const brokeStudentDealsContainer = document.getElementById('broke-student-deals-container');
    if (featuredContainer && lateNightContainer && brokeStudentDealsContainer && window.db) {
        db.collection('restaurants').get().then(snapshot => {
            const restaurants = snapshot.docs.map(doc => doc.data());
            // Helper to pick N random
            function pickRandom(arr, n) {
                const shuffled = arr.slice().sort(() => 0.5 - Math.random());
                return shuffled.slice(0, n);
            }
            // Featured: high rating
            const highRated = restaurants.filter(r => r.ratings && r.ratings.average >= 4.0);
            const featured = pickRandom(highRated, 3);
            featuredContainer.innerHTML = featured.length === 0 ? '<div class="no-results">No restaurants at the moment.</div>' : featured.map(r => `
                <div class="spot-card">
                    <div class="spot-image"><img src="${r.image}" alt="${r.name}"></div>
                    <div class="spot-info">
                        <h3>${r.name}</h3>
                        <div class="spot-meta">
                            <span class="price-range">${r.priceRange || ''}</span>
                            <span class="rating">${r.ratings ? r.ratings.average.toFixed(1) : '-'} ★</span>
                        </div>
                        <p>${r.description || ''}</p>
                        <a href="food-spots.html" class="spot-link">View Details <i class="fas fa-arrow-right"></i></a>
                    </div>
                </div>
            `).join('');
            // Late Night: open after 10pm
            function isOpenLate(hours) {
                if (!hours) return false;
                const [open, close] = hours.split('-').map(h => parseInt(h.split('.')[0], 10));
                return close > 22 || close < open;
            }
            const lateNight = pickRandom(restaurants.filter(r => isOpenLate(r.hours)), 3);
            lateNightContainer.innerHTML = lateNight.length === 0 ? '<div class="no-results">No restaurants at the moment.</div>' : lateNight.map(r => `
                <div class="deal-card">
                    <div class="deal-tag">LATE NIGHT</div>
                    <div class="deal-info">
                        <h3>${r.name}</h3>
                        <p class="deal-location">${r.location || ''}</p>
                        <p class="deal-description">${r.description || ''}</p>
                        <div class="deal-price">
                            <span class="price-range">${r.priceRange || ''}</span>
                        </div>
                    </div>
                </div>
            `).join('');
            // Broke Student Deals: 3 random, show random discount
            const discounts = [3, 5, 7];
            const brokeStudentDeals = pickRandom(restaurants, 3);
            brokeStudentDealsContainer.innerHTML = brokeStudentDeals.length === 0 ? '<div class="no-results">No restaurants at the moment.</div>' : brokeStudentDeals.map((r, i) => `
                <div class="deal-card">
                    <div class="deal-tag">BROKE STUDENT DEAL</div>
                    <div class="deal-info">
                        <h3>${r.name}</h3>
                        <p class="deal-location">${r.location || ''}</p>
                        <p class="deal-description">${r.description || ''}</p>
                        <div class="deal-price">
                            <span class="discount-price">Save RM${discounts[i % discounts.length]}</span>
                        </div>
                    </div>
                </div>
            `).join('');
        });
    }

    updateAuthLinks();
});

window.addEventListener('storage', function() {
    updateAuthLinks();
});

function updateAuthLinks() {
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    let staffDashboardLink = document.getElementById('staff-dashboard-link');
    const navLinks = document.querySelector('.nav-links');
    // Remove staff dashboard link if it exists
    if (staffDashboardLink) staffDashboardLink.remove();
    if (user) {
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline-block';
        // Add staff dashboard link for admin/staff
        if ((user.role === 'admin' || user.role === 'staff') && navLinks) {
            staffDashboardLink = document.createElement('li');
            staffDashboardLink.id = 'staff-dashboard-link';
            staffDashboardLink.innerHTML = '<a href="staff-dashboard.html">Staff Dashboard</a>';
            // Insert before logout link if possible
            if (logoutLink && logoutLink.parentElement && logoutLink.parentElement.parentElement === navLinks) {
                navLinks.insertBefore(staffDashboardLink, logoutLink.parentElement);
            } else {
                navLinks.appendChild(staffDashboardLink);
            }
        }
    } else {
        if (loginLink) loginLink.style.display = 'inline-block';
        if (logoutLink) logoutLink.style.display = 'none';
    }
    if (logoutLink) {
        logoutLink.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            updateAuthLinks();
            window.location.href = 'index.html';
        };
    }
}