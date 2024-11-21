import NoImageProduct from "../assets/images/noImageProduct.png"


const productImage = (productImage) => {
    if(productImage !== undefined)
        return productImage === "N/A" ? NoImageProduct : `http://localhost:5132/Images/productImages/${productImage}`
    else
        return NoImageProduct;
}

export default productImage;