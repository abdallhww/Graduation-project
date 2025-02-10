const foodItems = [
    {
        id: 1,
        name: 'Margherita Pizza',
        price: 12.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=500'
    },
    {
        id: 2,
        name: 'Classic Burger',
        price: 9.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500'
    },
    {
        id: 3,
        name: 'California Roll',
        price: 14.99,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=500'
    },
    {
        id: 4,
        name: 'Chocolate Cake',
        price: 6.99,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500'
    },
    {
        id: 5,
        name: 'Pepperoni Pizza',
        price: 13.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500'
    },
    {
        id: 6,
        name: 'Cheese Burger',
        price: 10.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500'
    },
    {
        id: 7,
        name: 'Dragon Roll',
        price: 16.99,
        category: 'Sushi',
        image: 'https://images.unsplash.com/photo-1617196035154-1e7e6e28b0db?w=500'
    },
    {
        id: 8,
        name: 'Tiramisu',
        price: 7.99,
        category: 'Dessert',
        image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500'
    },
    {
        id: 9,
        name: 'BBQ Chicken Pizza',
        price: 14.99,
        category: 'Pizza',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500'
    },
    {
        id: 10,
        name: 'Bacon Burger',
        price: 11.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    }
    ,{
        id: 10,
        name: 'Bacon Burger',
        price: 11.99,
        category: 'Burger',
        image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433b?w=500'
    },
    
];

// Function to display food items in the grid
function displayFoodItems(items) {
    const foodGrid = document.getElementById('food-grid');
    foodGrid.innerHTML = ''; // Clear the grid before adding new items

    items.forEach(item => {
        const foodItem = document.createElement('div');
        foodItem.classList.add('food-item');
        foodItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="details">
                <h3>${item.name}</h3>
                <p>${item.category}</p>
                <p class="price">$${item.price}</p>
                <div class="like-container">
                    <button class="like-button" onclick="toggleLike(this)">
                        <span class="material-icons-round">favorite_border</span>
                    </button>
                    <span class="like-count" id="like-count-${item.id}">0</span>
                </div>
                <button class="chip">buy</button>
            </div>
        `;
        foodGrid.appendChild(foodItem);
    });
}

// Function to filter food items by category
function filterByCategory(category) {
    const filteredItems = category === 'all' 
        ? foodItems 
        : foodItems.filter(item => item.category === category);

    displayFoodItems(filteredItems);
}
function toggleLike(button) {
    const likeCountElement = button.nextElementSibling; // the span with class like-count
    let likeCount = parseInt(likeCountElement.textContent);

    if (button.classList.contains('liked')) {
        // Remove like
        button.classList.remove('liked');
        likeCount -= 1;
    } else {
        // Add like
        button.classList.add('liked');
        likeCount += 1;
    }

    // Update the like count
    likeCountElement.textContent = likeCount;

    // Change heart color based on like state
    button.querySelector('span').textContent = button.classList.contains('liked') ? 'favorite' : 'favorite_border';
}
// Initial call to display all food items
filterByCategory('all');