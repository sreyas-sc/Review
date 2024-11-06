
export const addToCartController = (req, res) => {
    console.log("Add to cart controller...");
    const items = req.body.items.filter(item => item.code);
    console.log(items);

    let hasPF1 = false;
    let hasPF3 = false;
    let hasPF4 = false;
    let hasPF6 = false;
    const uniquePerfumes = new Set();
    
    items.forEach(item => {
        uniquePerfumes.add(item.code);
        if (item.code === 'PF1') hasPF1 = true;
        if (item.code === 'PF3') hasPF3 = true;
        if (item.code === 'PF4') hasPF4 = true;
        if (item.code === 'PF6') hasPF6 = true;
    });

    const updatedItems = items.map(item => {
        const { quantity, code, price } = item;

        // Rule 1: Buy one get one free for PF1
        if (code === 'PF1' && quantity >= 1) {
            const freeItems = quantity === 1 ? Math.floor(quantity) : Math.ceil(quantity / 2);
            const totalItems = quantity + freeItems;
            const chargableItems = quantity; 
            console.log('Buy one get one free applied');
            console.log('Total items: ', totalItems);
            console.log('Free items: ', freeItems);
            return {
                ...item,
                message: 'Buy one get one free applied',
                quantity: totalItems,
                chargableQuantity: chargableItems, 
                price: Number(price)
            };
        }

        // Rule 2: Bulk purchase discount for PF2
        if (code === 'PF2' && quantity >= 3) {
            const discountedPrice = 75;
            console.log('Discounted price applied for buying 3 or more PF2');
            return {
                ...item,
                message: 'Discounted price applied',
                chargableQuantity: quantity,
                price: Number(discountedPrice)
            };
        }

        // Rule 3: Combo discount for PF3 when bought with PF1
        if (code === 'PF3' && hasPF1) {
            const discountedPrice = 40;
            console.log('Discount on PF3 applied, bought PF1 and PF3');
            return {
                ...item,
                message: 'Discount on PF3 applied',
                chargableQuantity: quantity,
                price: Number(discountedPrice)
            };
        }

        // Rule 4: Tiered Discount for GUCCI BLOOM (PF5)
        if (code === 'PF5' && quantity >= 2) {
            let discountedPrice = Number(price);
            if (quantity >= 4) {
                discountedPrice = price * 0.80; 
                console.log('20% off on PF5 applied for buying 4 or more');
            } else if (quantity >= 2) {
                discountedPrice = price * 0.90; 
                console.log('10% off on PF5 applied for buying 2');
            }
            return {
                ...item,
                message: 'Discount on PF5 applied',
                chargableQuantity: quantity,
                price: Number(discountedPrice)
            };
        }

        return {
            ...item,
            message: 'Item added to cart',
            chargableQuantity: quantity,
            price: Number(price)
        };
    });

    // Calculate initial total cart price using chargableQuantity
    let totalCartPrice = updatedItems.reduce((total, item) => {
        return total + (Number(item.price) * Number(item.chargableQuantity));
    }, 0);

    console.log('Initial total cart price:', totalCartPrice);
    
    let discountMessage = [];

    // Apply cart-wide discounts(15% for 6 unique perfumes, 10% for 5 unique perfumes)
    if (uniquePerfumes.size >= 6) {
        totalCartPrice *= 0.85; 
        console.log('15% off applied for purchasing all 6 different perfumes');
        discountMessage.push('15% off applied for purchasing all 6 different perfumes');
    } else if (uniquePerfumes.size >= 5) {
        totalCartPrice *= 0.90; 
        console.log('10% off applied for purchasing 5 different perfumes');
        discountMessage.push('10% off applied for purchasing 5 different perfumes');
    }

    // Seasonal discount for PF6 and PF4
    if (hasPF6 && hasPF4) {
        totalCartPrice *= 0.75; 
        discountMessage.push('25% off applied for including both PF6 and PF4');
    }

    // Cart-Wide Discount for total exceeding 500
    if (totalCartPrice > 500) {
        console.log('Total cart price exceeds 500, offer applied');
        totalCartPrice *= 0.95; 
        discountMessage.push('Additional 5% off applied for cart total exceeding 500');
    }

    console.log('Overall total price after all deductions:', totalCartPrice.toFixed(2));

    res.status(200).json({
        items: updatedItems,
        totalCartPrice: Number(totalCartPrice.toFixed(2)),
        discountMessage: discountMessage.join('. ')
    });
};