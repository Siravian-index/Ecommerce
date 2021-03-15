const express = require("express")

const CartsRepository = require("../repository/carts");
const productsRepo = require("../repository/products");
const cartShowTemplate = require("../views/carts/show")

const router = express.Router();

router.post("/cart/products", async (req, res) => {
    //create the cart object
    let cart;
    if (!req.session.cartId) {

        cart = await CartsRepository.create({ items: [] });
        req.session.cartId = cart.id;
    } else {
        cart = await CartsRepository.getOne(req.session.cartId);
    }

    //Check for product
    const existingItem = cart.items.find((item) => {
        return item.id === req.body.productId
    })

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.items.push({ id: req.body.productId, quantity: 1 });
    }
    await CartsRepository.update(cart.id, {
        items: cart.items
    });
    //would be nice to add just a notification "Product added to cart" instead of redirecting
    res.redirect("/cart");
})


// Receive a Get request to show all items in cart

router.get("/cart", async (req, res) => {
    if (!req.session.cartId) {
        return res.redirect("/");
    }

    const cart = await CartsRepository.getOne(req.session.cartId);

    for (let item of cart.items) {
        const product = await productsRepo.getOne(item.id);

        item.product = product;
    }

    console.log(cart)
    res.send(cartShowTemplate({ items: cart.items.filter(x => typeof x.product !== "undefined") }));
})

// Receive a Post request to delete an item from a cart

router.post("/cart/products/delete", async (req, res) => {

    const { itemId } = req.body;
    const cart = await CartsRepository.getOne(req.session.cartId);

    const items = cart.items.filter(item => item.id !== itemId);

    await CartsRepository.update(req.session.cartId, { items });
    
    res.redirect("/cart")

});

module.exports = router;