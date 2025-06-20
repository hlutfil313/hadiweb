// UniEats - Reviews Table

if (typeof firebase === 'undefined') {
  document.write('<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-app-compat.js"><\/script>');
  document.write('<script src="https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore-compat.js"><\/script>');
}

window.addEventListener('DOMContentLoaded', async () => {
  function waitForFirebase() {
    return new Promise(resolve => {
      (function check() {
        if (window.firebase && window.firebase.firestore) resolve();
        else setTimeout(check, 50);
      })();
    });
  }
  await waitForFirebase();
  const db = firebase.firestore();

  const container = document.getElementById('reviews-table-container');
  container.innerHTML = '<div class="loading">Loading reviews...</div>';

  try {
    // Fetch all reviews
    const reviewsSnap = await db.collection('reviews').orderBy('createdAt', 'desc').get();
    if (reviewsSnap.empty) {
      container.innerHTML = '<div class="no-results">No reviews yet.</div>';
      return;
    }
    const reviews = [];
    const restaurantIds = new Set();
    reviewsSnap.forEach(doc => {
      const data = doc.data();
      reviews.push({ id: doc.id, ...data });
      if (data.foodSpotId) restaurantIds.add(data.foodSpotId);
    });
    // Fetch all referenced restaurants
    const restaurantMap = {};
    if (restaurantIds.size > 0) {
      const promises = Array.from(restaurantIds).map(id => db.collection('restaurants').doc(String(id)).get());
      const docs = await Promise.all(promises);
      docs.forEach(doc => {
        if (doc.exists) restaurantMap[doc.id] = doc.data().name;
      });
    }
    // Build table
    let html = '<table class="review-list" style="width:100%;border-collapse:collapse;">';
    html += '<thead><tr><th>Restaurant</th><th>Reviewer</th><th>Rating</th><th>Comment</th><th>Date</th></tr></thead><tbody>';
    reviews.forEach(r => {
      const stars = '\u2605'.repeat(r.rating) + '\u2606'.repeat(5 - r.rating);
      html += `<tr>
        <td>${restaurantMap[r.foodSpotId] || '-'}</td>
        <td>${r.userName || '-'}</td>
        <td style="color:#ffb300;">${stars}</td>
        <td>${r.comment || ''}</td>
        <td>${r.createdAt && r.createdAt.toDate ? r.createdAt.toDate().toLocaleDateString() : (r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-')}</td>
      </tr>`;
    });
    html += '</tbody></table>';
    container.innerHTML = html;
  } catch (e) {
    console.error(e);
    container.innerHTML = '<div class="no-results">Error loading reviews.</div>';
  }
}); 