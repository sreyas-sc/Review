export const addToCartController = (req, res) => {
    const { itemId, quantity } = req.body;
    console.log("Item ID: ", itemId);
    console.log("Quantity: ", quantity);

    if (itemId === 'PF1') {
        const freeItems = Math.floor(quantity / 2);
        const totalItems = quantity + freeItems;
        res.status(200).json({
            message: 'Buy one get one free applied',
            itemId,
            quantity: totalItems
        });
    } else {
        res.status(200).json({
            message: 'Item added to cart',
            itemId,
            quantity
        });
    }
};