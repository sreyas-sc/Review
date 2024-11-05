export const addToCartController = (req, res) => {
    console.log("Add to cart controller...");
    const items = req.body.items.flat(); // Flatten the nested array
    console.log(items);

    let hasPF1 = false;
    let hasPF3 = false;
    let hasPF4 = false;
    let hasPF6 = false;
    const uniquePerfumes = new Set();
    let freeItems = 0;

    items.forEach(item => {
        uniquePerfumes.add(item.code);
        if (item.code === 'PF1') {
            hasPF1 = true;
        }
        if (item.code === 'PF3') {
            hasPF3 = true;
        }
        if (item.code === 'PF4') {
            hasPF4 = true;
        }
        if (item.code === 'PF6') {
            hasPF6 = true;
        }
    });

    const updatedItems = items.map(item => {
        const { quantity, code, price } = item;

        // for rule 1(buy one get one free for PF1)
        if (code === 'PF1' && quantity >= 1) {
            if (quantity === 1) {
                freeItems = Math.floor(quantity);
            } else {
                freeItems = Math.ceil(quantity / 2);
            }
            const totalItems = quantity + freeItems;
            console.log('Buy one get one free applied');
            console.log('Total items: ', totalItems);
            console.log('Free items: ', freeItems);
            console.log('Quantity: ', quantity);
            console.log('Price: ', price);
            return {
                ...item,
                message: 'Buy one get one free applied',
                quantity: totalItems,
                price: Number(price)
            };

            // for rule 2 (Bulk purchase discount for PF2)
        } else if (code === 'PF2' && quantity >= 3) {
            const discountedPrice = 75;
            console.log('Discounted price applied for buying 3 or more PF2');
            console.log('Discounted price: ', discountedPrice);
            console.log('Price: ', price);
            console.log('Quantity: ', quantity);
            console.log('Total price: ', discountedPrice * quantity);
            return {
                ...item,
                message: 'Discounted price applied',
                price: Number(discountedPrice)
            };

            // for rule 3, if PF1 and PF3 are both in the cart then reduce the price of PF3 from 50 to 40 (Combo discount)
        } else if (code === 'PF3' && hasPF1) {
            const discountedPrice = 40;
            console.log('Discount on PF3 applied, bought PF1 and PF3');
            console.log('Discounted price: ', discountedPrice);
            console.log('total price: ', discountedPrice * quantity);
            console.log('Price: ', price);
            return {
                ...item,
                message: 'Discount on PF3 applied',
                price: discountedPrice
            };

            // (Tiered Discount for GUCCI BLOOM)rule 5, if 2 units of PF5 then 10% off and if 4 units of PF5 then 20% off
        } else if (code === 'PF5' && quantity >= 2) {
            let discountedPrice = price;
            if (quantity >= 4) {
                discountedPrice = price * 0.80;
                console.log('20% off on PF5 applied for buying 4 or more');
            } else if (quantity >= 2) {
                discountedPrice = price * 0.90;
                console.log('10% off on PF5 applied for buying 2');
            }
            console.log('Discounted price: ', discountedPrice);
            console.log('total price: ', discountedPrice * quantity);
            console.log('Price: ', price);
            return {
                ...item,
                message: 'Discount on PF5 applied',
                price: discountedPrice
            };
        } else {
            return {
                ...item,
                message: 'Item added to cart'
            };
        }
    });

    // (Buy more save more) Apply cart-wide discounts (10% if 5 unique perfumes, 15% if 6 unique perfumes)
    let totalCartPrice = updatedItems.reduce((total, item) => {
        if (item.code === 'PF3' && hasPF1) {
            return total + ((item.price - 10) * item.quantity);
        }
        return total + (item.price * item.quantity);
    }, 0);
    let discountMessage = '';

    if (uniquePerfumes.size >= 6) {
        totalCartPrice *= 0.85;
        discountMessage = '15% off applied for purchasing all 6 different perfumes';
        console.log('Total cart price: ', totalCartPrice)
        console.log('discounted price:', totalCartPrice * 0.85)
    } else if (uniquePerfumes.size >= 5) {
        totalCartPrice *= 0.90;
        discountMessage = '10% off applied for purchasing 5 different perfumes';
    }

    // (Seasonal discount on Chanel No. 5 PF6 and PF5) Apply 25% off if the cart includes both PF6 and PF4
    if (hasPF6 && hasPF4) {
        totalCartPrice *= 0.75;
        discountMessage = '25% off applied for including both PF6 and PF4';
        console.log('25% off applied for including both PF6 and PF4');
    }

    // (Cart-Wide Discount) Apply additional 5% discount if cart total exceeds 500
    if (totalCartPrice > 500) {
        totalCartPrice *= 0.95;
        discountMessage += ' Additional 5% off applied for cart total exceeding 500';
        console.log('Additional 5% off applied for cart total exceeding 500');
    }

    console.log('Overall total price after all deductions: ', totalCartPrice);

    res.status(200).json({
        items: updatedItems,
        totalCartPrice,
        discountMessage
    });
};
