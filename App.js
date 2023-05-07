$(document).ready(function () {

    // Load cart from local storage or initialize to an empty object
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let Products = JSON.parse(localStorage.getItem('Products')) || {};

    // Retrieve products from the API
    $.ajax({
        url: 'https://fakestoreapi.com/products',
        type: 'GET',
        dataType: 'JSON',
        success: function (products) {
            // Iterate through the products and create HTML elements
            $.each(products, function (index, product) {
                for (var i = 0, emp; i < products.length; i++) {
                    emp = products[i];
                    Products[emp.id] = emp;
                }
                let html = '<div class="col-md-4 mb-4">';
                html += '<div class="card">';
                html += '<img src="' + product.image + '" class="card-img-top" alt="' + product.title + '">';
                html += '<div class="card-body">';
                html += '<h5 class="card-title">' + product.title + '</h5>';
                html += '<p class="card-text">' + product.category + '</p>';
                html += '<p class="card-text">'
                    + "Rated: " + product.rating.rate + " by: " + product.rating.count + " buyers" + '</p>';
                html += '<p class="card-text">' + "Price: " + product.price + "$" + '</p>';
                html += '<p class="card-text">' + product.description + '</p>';
                html += '<div class="input-group mb-3">';
                html += '<div class="input-group-prepend">';
                html += '<button class="btn btn-outline-secondary remove-item" type="button" data-product-id="' + product.id + '">Remove</button>';
                html += '</div>';
                html += '<input type="number" class="form-control quantity" value="' + (cart[product.id] || 0) + '" min="0" data-product-id="' + product.id + '">';
                html += '<div class="input-group-append">';
                html += '<button class="btn btn-outline-secondary add-item" type="button" data-product-id="' + product.id + '">Update</button>';
                html += '</div>';
                html += '</div>';
                html += '</div></div></div>';
                $('#product-list').append(html);
            });
        },
        error: function () {
            console.log('Error retrieving products.');
        }
    });


    // Select the HTML elements we need to update
    const shippingCostElement = document.getElementById("shipping-price");
    const productCostElement = document.getElementById("products-price");
    const totalCostElement = document.getElementById("total-price");

    let shippingCost = 0;
    let totalCost = 0;
    let cartCost = 0;
    let itemCount = 0;

    $('#product-list').on('click', '.add-item', function () {
        const productId = $(this).data('product-id');
        const quantity = parseInt($('.quantity[data-product-id="' + productId + '"]').val());

        let previous_quan = cart[productId];

        if (!isNaN(quantity)) {
            // Update the cart with the new quantity for the product
            cart[productId] = quantity;
        }

        cartCost = cartCost + (quantity - previous_quan) * Products[productId].price;
        itemCount = itemCount + quantity - previous_quan;

        // Calculate the shipping cost
        if (itemCount > 4) {
            shippingCost = 10;
        } else {
            shippingCost = 5;
        }
        if (itemCount == 0) {
            shippingCost = 0;
        }

        // Calculate the total cost
        totalCost = shippingCost + cartCost;

        // Update the HTML elements with the new values
        shippingCostElement.textContent = `$${shippingCost.toFixed(2)}`;
        productCostElement.textContent = `$${cartCost.toFixed(2)}`;
        totalCostElement.textContent = `$${totalCost.toFixed(2)}`;

        // Save the cart and Products objects to localStorage when the page unloads
        localStorage.setItem('cart', JSON.stringify(cart));
        localStorage.setItem('Products', JSON.stringify(Products));
    });

});