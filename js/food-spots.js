document.addEventListener('DOMContentLoaded', function () {
    // DOM Elements
    const foodSpotsContainer = document.getElementById('food-spots-container');
    const budgetFilter = document.getElementById('budget-filter');
    const typeFilter = document.getElementById('type-filter');
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const brokeStudentCheckbox = document.getElementById('broke-student-checkbox');
    const foodSpotModal = document.getElementById('food-spot-modal');
    const modalContentContainer = document.getElementById('modal-content-container');
    const reviewModal = document.getElementById('review-modal');
    const closeModalButtons = document.querySelectorAll('.close-modal');
    const reviewForm = document.getElementById('review-form');
    const ratingStars = document.querySelectorAll('.rating-select i');
    const userRatingInput = document.getElementById('user-rating');
    const foodSpotIdInput = document.getElementById('food-spot-id');
    const mapMarkerItems = document.querySelectorAll('.map-marker-list li');
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    const openReviewButtons = document.querySelectorAll('.open-review-modal');
    const closeModal = document.querySelector('.close-modal');
    const userNameInput = document.getElementById('user-name');
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    const userNameDisplay = document.getElementById('user-name-display');

    // Proceed with saving review to Firestore
    const spotId = document.getElementById('food-spot-id').value;
    const rating = document.getElementById('user-rating').value;
    const comment = document.getElementById('user-comment').value;

    document.getElementById('review-form').addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (!user) {
            alert('Please log in to write a review.');
            return;
        }

        // Proceed with saving review to Firestore
        const spotId = document.getElementById('food-spot-id').value;
        const rating = document.getElementById('user-rating').value;
        const comment = document.getElementById('user-comment').value;

        try {
            await addDoc(collection(db, 'reviews'), {
                foodSpotId: spotId,
                userName: user.name,
                userEmail: user.email,
                rating: parseInt(rating),
                comment,
                createdAt: new Date()
            });

            alert('Review submitted!');
            document.getElementById('review-form').reset();
            document.getElementById('review-modal').style.display = 'none';
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Error submitting review. Please try again.');
        }
    });

    openReviewButtons.forEach(button => {
        button.addEventListener('click', () => {
            showReviewModal(spotId);
        });
    });

    // Autofill name and make it uneditable
    const nameInput = document.getElementById('user-name');
    if (nameInput && user) {
        nameInput.value = user.name;
        nameInput.readOnly = true;
    }

    // Open the review modal
    // document.getElementById('review-modal').style.display = 'block';
    closeModal.addEventListener('click', () => {
        reviewModal.style.display = 'none';
    });

    window.addEventListener('click', e => {
        if (e.target === reviewModal) {
            reviewModal.style.display = 'none';
        }
    });

    // Current filters state
    let currentFilters = {
        budget: 'all',
        type: 'all',
        search: '',
        brokeStudent: false
    };

    // Firebase data
    let firebaseFoodSpots = [];

    // Load all restaurants from Firebase
    function loadFoodSpotsFromFirebase() {
        db.collection("restaurants").get()
            .then(snapshot => {
                firebaseFoodSpots = [];
                snapshot.forEach(doc => {
                    firebaseFoodSpots.push({ id: doc.id, ...doc.data() });
                });
                displayFoodSpots(); // Refresh UI
            })
            .catch(err => {
                console.error("Error loading restaurants:", err);
                foodSpotsContainer.innerHTML = "<p>Error loading restaurant data.</p>";
            });
    }

    // Get food spot by ID
    function getFoodSpotById(id) {
        return firebaseFoodSpots.find(spot => String(spot.id) == String(id));
    }

    // Generate star rating HTML
    function generateRatingStars(rating) {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (halfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        return starsHTML;
    }

    // Display food spots with filters
    function displayFoodSpots() {
        let filteredSpots = [...firebaseFoodSpots];

        // Apply budget filter
        if (currentFilters.budget !== 'all') {
            filteredSpots = filteredSpots.filter(spot => spot.budget === currentFilters.budget);
        }

        // Apply type filter
        if (currentFilters.type !== 'all') {
            filteredSpots = filteredSpots.filter(spot => spot.type === currentFilters.type);
        }

        // Apply search filter
        if (currentFilters.search) {
            const query = currentFilters.search.toLowerCase();
            filteredSpots = filteredSpots.filter(spot =>
                spot.name.toLowerCase().includes(query) ||
                spot.type.toLowerCase().includes(query)
            );
        }

        // Apply "Broke Student" filter
        if (currentFilters.brokeStudent) {
            filteredSpots = filteredSpots.filter(spot => {
                return spot.menu.some(item => item.price <= 10);
            });
        }

        // Clear container
        foodSpotsContainer.innerHTML = '';

        // Show no results message
        if (filteredSpots.length === 0) {
            foodSpotsContainer.innerHTML = '<div class="no-results">No food spots match your filters.</div>';
            return;
        }

        // Render cards
        filteredSpots.forEach(spot => {
            const ratingStars = generateRatingStars(spot.ratings && typeof spot.ratings.average === 'number' ? spot.ratings.average : 0);

            const foodSpotCard = document.createElement('div');
            foodSpotCard.className = 'food-spot-card';
            foodSpotCard.dataset.id = spot.id;

            foodSpotCard.innerHTML = `
                <div class="food-spot-image">
                    <img src="${spot.image}" alt="${spot.name}">
                </div>
                <div class="food-spot-info">
                    <h3>${spot.name}</h3>
                    <div class="food-spot-detail">
                        <div><i class="fas fa-utensils"></i> ${spot.type}</div>
                        <div><i class="fas fa-tag"></i> ${spot.priceRange}</div>
                    </div>
                    <p>${spot.description}</p>
                    <div class="food-spot-rating">${ratingStars}</div>
                    <div class="food-spot-location"><i class="fas fa-map-marker-alt"></i> ${spot.location}</div>
                </div>
            `;

            foodSpotCard.addEventListener('click', () => openFoodSpotDetail(spot.id));
            foodSpotsContainer.appendChild(foodSpotCard);
        });
    }

    // Helper: Fetch reviews for a food spot from Firestore
    async function fetchReviewsForFoodSpot(spotId) {
        const reviewsSnap = await db.collection('reviews').where('foodSpotId', '==', Number(spotId)).orderBy('createdAt', 'desc').get();
        return reviewsSnap.docs.map(doc => doc.data());
    }

    // Open food spot detail modal (async for reviews)
    async function openFoodSpotDetail(id) {
        console.log('Opening modal for', id);
        const foodSpot = getFoodSpotById(id);
        if (!foodSpot) return;
        const reviews = await fetchReviewsForFoodSpot(id);
        const ratingStars = generateRatingStars(foodSpot.ratings && typeof foodSpot.ratings.average === 'number' ? foodSpot.ratings.average : 0);
        // Build reviews HTML
        let reviewsHTML = '';
        if (reviews.length > 0) {
            reviews.forEach(review => {
                const reviewStars = generateRatingStars(review.rating);
                reviewsHTML += `
                    <div class="review-item">
                        <div class="review-header">
                            <div class="reviewer">${review.userName}</div>
                            <div class="review-date">${review.createdAt && review.createdAt.toDate ? review.createdAt.toDate().toLocaleDateString() : ''}</div>
                        </div>
                        <div class="review-stars">${reviewStars}</div>
                        <div class="review-comment">${review.comment}</div>
                    </div>`;
            });
        } else {
            reviewsHTML = '<div class="no-reviews">No reviews yet. Be the first to review!</div>';
        }
        // Populate modal content
        modalContentContainer.innerHTML = `
            <div class="food-spot-detail-container">
                <div class="detail-image">
                    <img src="${foodSpot.image}" alt="${foodSpot.name}">
                </div>
                <div class="detail-info">
                    <h2>${foodSpot.name}</h2>
                    <div class="detail-meta">
                        <div><i class="fas fa-utensils"></i> ${foodSpot.type}</div>
                        <div><i class="fas fa-tag"></i> ${foodSpot.priceRange}</div>
                    </div>
                    <div class="detail-description">${foodSpot.description}</div>
                    <div class="detail-location">
                        <i class="fas fa-map-marker-alt"></i> ${foodSpot.location}
                    </div>
                    <div class="detail-hours">
                        <i class="fas fa-clock"></i> Open: ${foodSpot.hours || 'Not specified'}
                        <i class="fas fa-clock"></i> Date: ${foodSpot.date || 'Not specified'}
                    </div>
                    <div class="detail-rating">
                        <div class="detail-stars">${ratingStars}</div>
                        <span>${foodSpot.ratings && typeof foodSpot.ratings.average === 'number' ? foodSpot.ratings.average.toFixed(1) : 'N/A'} out of 5 (${foodSpot.ratings && typeof foodSpot.ratings.count === 'number' ? foodSpot.ratings.count : 'N/A'} reviews)</span>
                    </div>
                </div>
            </div>
            <div class="menu-section">
                <h3>Menu Highlights</h3>
                <div class="menu-items">${foodSpot.menu && foodSpot.menu.length > 0 ? foodSpot.menu.map(item => `
                    <div class="menu-item">
                        <div class="menu-item-image">
                            <img src="${item.image}" alt="${item.name}">
                        </div>
                        <div class="menu-item-info">
                            <h4>${item.name} ${item.isPopular ? '<span class="popular-tag">Popular</span>' : ''}</h4>
                            <p>RM${item.price.toFixed(2)}</p>
                            <div class="menu-item-type">${item.type}</div>
                        </div>
                    </div>`).join('') : '<p>No menu items available.</p>'}
                </div>
            </div>
            <div class="reviews-section">
                <div class="reviews-header">
                    <h3>Student Reviews</h3>
                </div>
                <div class="reviews-list">${reviewsHTML}</div>
                <div class="review-form-section">
                    <form id="review-form-modal">
                        <div class="form-group">
                            <label>Your Name:</label>
                            <span id="user-name-display-modal" style="font-weight:600;"></span>
                        </div>
                        <div class="form-group">
                            <label>Rating:</label>
                            <div class="rating-select" id="modal-rating-select">
                                <i class="far fa-star" data-rating="1"></i>
                                <i class="far fa-star" data-rating="2"></i>
                                <i class="far fa-star" data-rating="3"></i>
                                <i class="far fa-star" data-rating="4"></i>
                                <i class="far fa-star" data-rating="5"></i>
                            </div>
                            <input type="hidden" id="user-rating-modal" required>
                        </div>
                        <div class="form-group">
                            <label for="user-comment-modal">Your Review:</label>
                            <textarea id="user-comment-modal" rows="4" required></textarea>
                        </div>
                        <button type="submit" class="btn">Add Review</button>
                    </form>
                </div>
            </div>
        `;
        // Fill user name
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        const userNameDisplay = document.getElementById('user-name-display-modal');
        if (user && userNameDisplay) userNameDisplay.textContent = user.name;
        // Star rating logic
        const modalRatingStars = document.querySelectorAll('#modal-rating-select i');
        const userRatingInput = document.getElementById('user-rating-modal');
        modalRatingStars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = star.dataset.rating;
                modalRatingStars.forEach(s => {
                    if (parseInt(s.dataset.rating) <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
            star.addEventListener('click', () => {
                const rating = star.dataset.rating;
                userRatingInput.value = rating;
                modalRatingStars.forEach(s => {
                    if (parseInt(s.dataset.rating) <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
        document.querySelector('#modal-rating-select').addEventListener('mouseleave', () => {
            const selected = userRatingInput.value;
            modalRatingStars.forEach(star => {
                if (selected && parseInt(star.dataset.rating) <= selected) {
                    star.classList.remove('far');
                    star.classList.add('fas');
                } else {
                    star.classList.remove('fas');
                    star.classList.add('far');
                }
            });
        });
        // Review form submit
        document.getElementById('review-form-modal').addEventListener('submit', async function(e) {
            e.preventDefault();
            if (!user) {
                alert('Please log in to write a review.');
                return;
            }
            const rating = parseInt(userRatingInput.value);
            const comment = document.getElementById('user-comment-modal').value;
            if (!rating || !comment) {
                alert('Please select a rating and enter a comment.');
                return;
            }
            const newReview = {
                foodSpotId: Number(id),
                userName: user.name,
                userEmail: user.email,
                rating,
                comment,
                createdAt: new Date()
            };
            try {
                await db.collection('reviews').add(newReview);
                // Update restaurant's average rating/count
                const reviews = await fetchReviewsForFoodSpot(id);
                const ratings = reviews.map(r => r.rating);
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                await db.collection('restaurants').doc(foodSpot.id).update({
                    'ratings.average': avg,
                    'ratings.count': ratings.length
                });
                // Refresh modal with new reviews
                openFoodSpotDetail(id);
            } catch (err) {
                alert('Error submitting review. Please try again.');
            }
        });
        // Show modal
        foodSpotModal.style.display = 'block';
    }

    // Handle filter changes
    function handleFilterChange() {
        currentFilters.budget = budgetFilter.value;
        currentFilters.type = typeFilter.value;
        currentFilters.search = searchInput.value.trim();
        currentFilters.brokeStudent = brokeStudentCheckbox.checked;
        displayFoodSpots();
    }

    // Initialize star rating functionality
    function initRatingStars() {
        ratingStars.forEach(star => {
            star.addEventListener('mouseover', () => {
                const rating = star.dataset.rating;
                highlightStars(rating);
            });

            star.addEventListener('click', () => {
                const rating = star.dataset.rating;
                userRatingInput.value = rating;
                highlightStars(rating);
            });
        });

        document.querySelector('.rating-select').addEventListener('mouseleave', () => {
            const selected = userRatingInput.value;
            if (selected) highlightStars(selected);
            else resetRatingStars();
        });
    }

    function highlightStars(rating) {
        ratingStars.forEach(star => {
            const value = parseInt(star.dataset.rating);
            if (value <= rating) {
                star.classList.remove('far');
                star.classList.add('fas');
            } else {
                star.classList.remove('fas');
                star.classList.add('far');
            }
        });
    }

    function resetRatingStars() {
        userRatingInput.value = '';
        ratingStars.forEach(star => {
            star.classList.remove('fas');
            star.classList.add('far');
        });
    }

    // Add event listeners
    function addEventListeners() {
        budgetFilter.addEventListener('change', handleFilterChange);
        typeFilter.addEventListener('change', handleFilterChange);
        searchButton.addEventListener('click', handleFilterChange);
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') handleFilterChange();
        });
        brokeStudentCheckbox.addEventListener('change', handleFilterChange);

        // Close modals
        closeModalButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                foodSpotModal.style.display = 'none';
                reviewModal.style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target === foodSpotModal) foodSpotModal.style.display = 'none';
            if (e.target === reviewModal) reviewModal.style.display = 'none';
        });

        // Review form submission (save to 'reviews' and update restaurant rating)
        reviewForm.addEventListener('submit', async function (e) {
            e.preventDefault();
            const foodSpotId = foodSpotIdInput.value;
            const user = JSON.parse(localStorage.getItem('loggedInUser'));
            const userName = user.name;
            const userEmail = user.email;
            const userRating = userRatingInput.value;
            const userComment = document.getElementById('user-comment').value;
            if (!userName || !userRating || !userComment) {
                alert('Please fill in all fields and select a rating.');
                return;
            }
            const newReview = {
                foodSpotId: Number(foodSpotId),
                userName,
                userEmail,
                rating: parseInt(userRating),
                comment: userComment,
                createdAt: new Date()
            };
            try {
                await db.collection('reviews').add(newReview);
                // Update restaurant's average rating/count
                const reviews = await fetchReviewsForFoodSpot(foodSpotId);
                const ratings = reviews.map(r => r.rating);
                const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
                await db.collection('restaurants').doc(foodSpotId).update({
                    'ratings.average': avg,
                    'ratings.count': ratings.length
                });
                reviewModal.style.display = 'none';
                openFoodSpotDetail(foodSpotId);
            } catch (err) {
                alert('Error submitting review. Please try again.');
            }
        });

        mapMarkerItems.forEach(item => {
            item.addEventListener('click', () => {
                const spotId = item.dataset.spotId;
                openFoodSpotDetail(spotId);
            });
        });
    }

    // Initialize page
    function init() {
        loadFoodSpotsFromFirebase();
        initRatingStars();
        addEventListeners();
    }

    // Start app
    init();

    // When opening the review modal, auto-fill and lock user name
    function showReviewModal(spotId) {
        foodSpotIdInput.value = spotId;
        reviewForm.reset();
        resetRatingStars();
        const user = JSON.parse(localStorage.getItem('loggedInUser'));
        if (user) {
            if (userNameDisplay) userNameDisplay.textContent = user.name;
        }
        reviewModal.style.display = 'block';
    }
});