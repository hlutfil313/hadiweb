document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('food-spots-container');

    // Clear loading message
    container.innerHTML = "";

    // Use the existing Firebase app instance if available
    const db = firebase.apps.length ? firebase.app().firestore() : firebase.firestore();

    // Load all restaurants
    db.collection("restaurants").get()
        .then(snapshot => {
            if (snapshot.empty) {
                container.innerHTML = "<p>No restaurants found.</p>";
                return;
            }

            snapshot.forEach(doc => {
                const data = doc.data();

                // Create card
                const card = document.createElement('div');
                card.className = 'food-spot-card';

                card.innerHTML = `
                    <img src="${data.image}" alt="${data.name}">
                    <h3>${data.name}</h3>
                    <p><strong>Type:</strong> ${data.type}</p>
                    <p><strong>Budget:</strong> ${data.budget}</p>
                    <p><strong>Price Range:</strong> ${data.priceRange}</p>
                    <p><strong>Location:</strong> ${data.location}</p>
                    <p>${data.description}</p>
                `;

                container.appendChild(card);
            });
        })
        .catch(err => {
            console.error("Error getting restaurants:", err);
            container.innerHTML = "<p>Error loading restaurants.</p>";
        });
});



















// // UniEats - Food Data
// const foodSpots = [
//     // {
//     //     id: 1,
//     //     name: "Campus Cafe",
//     //     image: "images/cf92cumi32.pdf-3-0.png",
//     //     type: "Cafe",
//     //     priceRange: "RM5-15",
//     //     budget: "medium",
//     //     description: "    ",
//     //     location: "Main Library Building, Ground Floor",
//     //     ratings: {
//     //         average: 4.5,
//     //         count: 120
//     //     },
//     //     reviews: [
//     //         {
//     //             id: 101,
//     //             user: "Sarah L.",
//     //             rating: 5,
//     //             comment: "The best coffee on campus! Love their breakfast sandwiches too.",
//     //             date: "2023-09-15"
//     //         },
//     //         {
//     //             id: 102,
//     //             user: "Ahmed K.",
//     //             rating: 4,
//     //             comment: "Good prices and the staff is always friendly. Menu could have more variety.",
//     //             date: "2023-10-02"
//     //         }
//     //     ],
//     //     menu: [
//     //         {
//     //             name: "Breakfasts Sandwich",
//     //             price: 8.50,
//     //             image: "images/cf92cumi32.pdf-4-0.png",
//     //             type: "Breakfast",
//     //             isPopular: true
//     //         },
//     //         {
//     //             name: "Cafe Latte",
//     //             price: 5.50,
//     //             image: "images/cf92cumi32.pdf-4-3.png",
//     //             type: "Beverage",
//     //             isPopular: true
//     //         }
//     //     ]
//     // },
//     {

//     }
    
//     {
//         id: 2,
//         name: "Budget Bites",
//         image: "images/cf92cumi32.pdf-2-5.png",
//         type: "Fast Food",
//         priceRange: "RM3-8",
//         budget: "low",
//         description: "Affordable meals for students on a tight budget. Quick service.",
//         location: "Student Center, 1st Floor",
//         ratings: {
//             average: 4.2,
//             count: 85
//         },
//         reviews: [
//             {
//                 id: 201,
//                 user: "Min Li",
//                 rating: 5,
//                 comment: "Absolute lifesaver during exam season! So affordable!",
//                 date: "2023-10-10"
//             },
//             {
//                 id: 202,
//                 user: "Jason T.",
//                 rating: 3,
//                 comment: "Good for the price, but quality varies. The chicken wrap is the best option.",
//                 date: "2023-09-28"
//             }
//         ],
//         menu: [
//             {
//                 name: "Student Value Meal",
//                 price: 6.00,
//                 image: "images/cf92cumi32.pdf-4-4.png",
//                 type: "Combo",
//                 isPopular: true
//             },
//             {
//                 name: "Broke Student Noodles",
//                 price: 3.50,
//                 image: "images/cf92cumi32.pdf-8-0.png",
//                 type: "Main",
//                 isPopular: true
//             }
//         ]
//     },
//     {
//         id: 3,
//         name: "Global Flavors",
//         image: "images/cf92cumi32.pdf-4-5.png",
//         type: "International",
//         priceRange: "RM10-25",
//         budget: "high",
//         description: "Diverse international cuisines from around the world, perfect for foodies.",
//         location: "Arts Building, 2nd Floor",
//         ratings: {
//             average: 4.7,
//             count: 95
//         },
//         reviews: [
//             {
//                 id: 301,
//                 user: "Oliver P.",
//                 rating: 5,
//                 comment: "The Thai curry is amazing and authentic! Worth every ringgit.",
//                 date: "2023-10-05"
//             },
//             {
//                 id: 302,
//                 user: "Priya S.",
//                 rating: 4,
//                 comment: "Love the variety of cuisines available. A bit pricey but delicious!",
//                 date: "2023-09-20"
//             }
//         ],
//         menu: [
//             {
//                 name: "Thai Green Curry",
//                 price: 18.50,
//                 image: "images/cf92cumi32.pdf-9-3.png",
//                 type: "Main",
//                 isPopular: true
//             },
//             {
//                 name: "Mediterranean Platter",
//                 price: 15.00,
//                 image: "images/cf92cumi32.pdf-8-8.png",
//                 type: "Appetizer",
//                 isPopular: false
//             }
//         ]
//     },
//     {
//         id: 4,
//         name: "Late Night Bites",
//         image: "images/cf92cumi32.pdf-3-3.png",
//         type: "Fast Food",
//         priceRange: "RM7-18",
//         budget: "medium",
//         description: "Open until 2AM. Perfect for late-night study sessions.",
//         location: "Engineering Complex, Ground Floor",
//         ratings: {
//             average: 4.0,
//             count: 75
//         },
//         reviews: [
//             {
//                 id: 401,
//                 user: "Amir J.",
//                 rating: 4,
//                 comment: "Absolute lifesaver during finals week! The burgers are solid.",
//                 date: "2023-10-08"
//             },
//             {
//                 id: 402,
//                 user: "Zoe L.",
//                 rating: 4,
//                 comment: "Decent food and they're always open when I need them most!",
//                 date: "2023-09-25"
//             }
//         ],
//         menu: [
//             {
//                 name: "Midnight Burger",
//                 price: 9.50,
//                 image: "images/cf92cumi32.pdf-6-1.png",
//                 type: "Main",
//                 isPopular: true
//             },
//             {
//                 name: "Study Break Fries",
//                 price: 5.00,
//                 image: "images/cf92cumi32.pdf-6-2.png",
//                 type: "Side",
//                 isPopular: false
//             }
//         ]
//     },
//     {
//         id: 5,
//         name: "Healthy Harvest",
//         image: "images/cf92cumi32.pdf-3-4.png",
//         type: "Healthy",
//         priceRange: "RM10-20",
//         budget: "medium",
//         description: "Fresh salads, smoothies, and healthy meals for the health-conscious.",
//         location: "Sports Complex, 1st Floor",
//         ratings: {
//             average: 4.4,
//             count: 65
//         },
//         reviews: [
//             {
//                 id: 501,
//                 user: "Emma W.",
//                 rating: 5,
//                 comment: "Best healthy options on campus! Love their protein bowls.",
//                 date: "2023-10-12"
//             },
//             {
//                 id: 502,
//                 user: "David L.",
//                 rating: 4,
//                 comment: "Great for post-workout meals. The smoothies are awesome.",
//                 date: "2023-09-30"
//             }
//         ],
//         menu: [
//             {
//                 name: "Protein Power Bowl",
//                 price: 15.50,
//                 image: "images/cf92cumi32.pdf-2-3.png",
//                 type: "Main",
//                 isPopular: true
//             },
//             {
//                 name: "Green Energy Smoothie",
//                 price: 8.50,
//                 image: "images/cf92cumi32.pdf-7-3.png",
//                 type: "Beverage",
//                 isPopular: true
//             }
//         ]
//     },
//     {
//         id: 6,
//         name: "Prof's Picks",
//         image: "images/cf92cumi32.pdf-7-2.png",
//         type: "Cafe",
//         priceRange: "RM8-18",
//         budget: "medium",
//         description: "Faculty favorite with quiet atmosphere. Great for meetings.",
//         location: "Faculty Building, 3rd Floor",
//         ratings: {
//             average: 4.6,
//             count: 50
//         },
//         reviews: [
//             {
//                 id: 601,
//                 user: "Prof. Johnson",
//                 rating: 5,
//                 comment: "The perfect spot for faculty lunch meetings. Quiet and excellent food.",
//                 date: "2023-10-10"
//             },
//             {
//                 id: 602,
//                 user: "Dr. Martinez",
//                 rating: 4,
//                 comment: "Good quality food and a professional atmosphere. My go-to spot.",
//                 date: "2023-10-05"
//             }
//         ],
//         menu: [
//             {
//                 name: "Academic Lunch Set",
//                 price: 16.00,
//                 image: "images/cf92cumi32.pdf-8-9.png",
//                 type: "Lunch",
//                 isPopular: true
//             },
//             {
//                 name: "Scholar's Coffee",
//                 price: 6.50,
//                 image: "images/cf92cumi32.pdf-6-3.png",
//                 type: "Beverage",
//                 isPopular: false
//             }
//         ]
//     },
//     {
//         id: 7,
//         name: "Exam Season Special",
//         image: "images/cf92cumi32.pdf-4-2.png",
//         type: "Fast Food",
//         priceRange: "RM5-15",
//         budget: "low",
//         description: "Special deals during exam seasons. Comfort food for stressful times.",
//         location: "Central Library, Basement",
//         ratings: {
//             average: 4.1,
//             count: 40
//         },
//         reviews: [
//             {
//                 id: 701,
//                 user: "Lisa T.",
//                 rating: 4,
//                 comment: "Their exam week discounts are amazing! Good comfort food.",
//                 date: "2023-10-20"
//             },
//             {
//                 id: 702,
//                 user: "Kevin R.",
//                 rating: 4,
//                 comment: "Not the healthiest option but definitely helps during stressful periods!",
//                 date: "2023-10-15"
//             }
//         ],
//         menu: [
//             {
//                 name: "Brain Boost Combo",
//                 price: 9.90,
//                 image: "images/cf92cumi32.pdf-9-1.png",
//                 type: "Combo",
//                 isPopular: true
//             },
//             {
//                 name: "All-Nighter Coffee",
//                 price: 4.50,
//                 image: "images/cf92cumi32.pdf-6-4.png",
//                 type: "Beverage",
//                 isPopular: true
//             }
//         ]
//     },
//     {
//         id: 8,
//         name: "Cultural Corner",
//         image: "images/cf92cumi32.pdf-1-2.png",
//         type: "Cultural",
//         priceRange: "RM8-22",
//         budget: "medium",
//         description: "Traditional local dishes and cultural specialties.",
//         location: "Cultural Center, Ground Floor",
//         ratings: {
//             average: 4.8,
//             count: 60
//         },
//         reviews: [
//             {
//                 id: 801,
//                 user: "Mei Ling",
//                 rating: 5,
//                 comment: "Authentic local dishes that remind me of home cooking!",
//                 date: "2023-10-18"
//             },
//             {
//                 id: 802,
//                 user: "Raj P.",
//                 rating: 5,
//                 comment: "Amazing cultural variety. The nasi lemak is particularly excellent.",
//                 date: "2023-10-08"
//             }
//         ],
//         menu: [
//             {
//                 name: "Malaysian Favorites Platter",
//                 price: 18.50,
//                 image: "images/cf92cumi32.pdf-1-6.png",
//                 type: "Main",
//                 isPopular: true
//             },
//             {
//                 name: "Traditional Teh Tarik",
//                 price: 4.50,
//                 image: "images/cf92cumi32.pdf-1-7.png",
//                 type: "Beverage",
//                 isPopular: true
//             }
//         ]
//     }
// ];

// // Save to localStorage on page load
// function initFoodData() {
//     if (!localStorage.getItem('foodSpots')) {
//         localStorage.setItem('foodSpots', JSON.stringify(foodSpots));
//     }
    
//     // Initialize reviews if not exists
//     if (!localStorage.getItem('allReviews')) {
//         // Extract all reviews from food spots
//         const allReviews = [];
//         foodSpots.forEach(spot => {
//             spot.reviews.forEach(review => {
//                 allReviews.push({
//                     ...review,
//                     foodSpotId: spot.id
//                 });
//             });
//         });
//         localStorage.setItem('allReviews', JSON.stringify(allReviews));
//     }
// }

// // Get all food spots
// function getAllFoodSpots() {
//     return JSON.parse(localStorage.getItem('foodSpots')) || foodSpots;
// }

// // Get food spot by ID
// function getFoodSpotById(id) {
//     const spots = getAllFoodSpots();
//     return spots.find(spot => spot.id === parseInt(id));
// }

// // Get reviews for a specific food spot
// function getReviewsForFoodSpot(foodSpotId) {
//     const allReviews = JSON.parse(localStorage.getItem('allReviews')) || [];
//     return allReviews.filter(review => review.foodSpotId === parseInt(foodSpotId));
// }

// // Add a new review
// function addReview(foodSpotId, userReview) {
//     // Get all reviews
//     const allReviews = JSON.parse(localStorage.getItem('allReviews')) || [];
    
//     // Create a new review object
//     const newReview = {
//         id: Date.now(), // Use timestamp as unique ID
//         foodSpotId: parseInt(foodSpotId),
//         user: userReview.user,
//         rating: parseInt(userReview.rating),
//         comment: userReview.comment,
//         date: new Date().toISOString().split('T')[0] // Format: YYYY-MM-DD
//     };
    
//     // Add to all reviews
//     allReviews.push(newReview);
//     localStorage.setItem('allReviews', JSON.stringify(allReviews));
    
//     // Update average rating for the food spot
//     updateFoodSpotRating(foodSpotId);
    
//     return newReview;
// }

// // Update food spot average rating
// function updateFoodSpotRating(foodSpotId) {
//     const foodSpots = getAllFoodSpots();
//     const reviews = getReviewsForFoodSpot(parseInt(foodSpotId));
    
//     if (reviews.length > 0) {
//         const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
//         const averageRating = totalRating / reviews.length;
        
//         // Find and update the food spot
//         const foodSpotIndex = foodSpots.findIndex(spot => spot.id === parseInt(foodSpotId));
//         if (foodSpotIndex !== -1) {
//             foodSpots[foodSpotIndex].ratings.average = Math.round(averageRating * 10) / 10; // Round to 1 decimal
//             foodSpots[foodSpotIndex].ratings.count = reviews.length;
//             localStorage.setItem('foodSpots', JSON.stringify(foodSpots));
//         }
//     }
// }

// // Filter food spots by budget
// function filterFoodSpotsByBudget(budget) {
//     const spots = getAllFoodSpots();
//     if (!budget || budget === 'all') return spots;
    
//     return spots.filter(spot => spot.budget === budget);
// }

// // Filter food spots by type
// function filterFoodSpotsByType(type) {
//     const spots = getAllFoodSpots();
//     if (!type || type === 'all') return spots;
    
//     return spots.filter(spot => spot.type === type);
// }

// // Search food spots by name or description
// function searchFoodSpots(query) {
//     if (!query) return getAllFoodSpots();
    
//     const spots = getAllFoodSpots();
//     const searchQuery = query.toLowerCase();
    
//     return spots.filter(spot => 
//         spot.name.toLowerCase().includes(searchQuery) || 
//         spot.description.toLowerCase().includes(searchQuery)
//     );
// }

// // Initialize data when script loads
// initFoodData();