const express = require("express");
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const authRouter = require("./routes/admin/auth")
const productsRouter = require("./routes/admin/products")
const publicProductsRouter = require("./routes/products")
const CartsRouter = require("./routes/carts")

const app = express();

//Where the Magic happens
app.use(express.static("publique"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
    keys: ["pa3tlkgjud2hgytabvn1df"]
}));

app.use(authRouter);
app.use(productsRouter);
app.use(publicProductsRouter);
app.use(CartsRouter);


app.listen(3000, () => {
    console.log("listening")
});

