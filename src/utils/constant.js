export const Links = {
    "home": "/",
    "categories": "/categories",
    "orders": "/orders",
    'food': "/food",
    "carts": "/carts",
    "orderDetail": "/orderDetail"
}

export const paymentOption = [
    { label: "e-wallet", icon: "iconWallet" },
    { label: "tiền mặt", icon: "iconCash" },
    { label: "thẻ", icon: "iconCredit" },

]

export const optionSize = [
    { label: "lớn", value: "L" },
    { label: "vừa", value: "M" },
    { label: "nhỏ", value: "S" },
]

export const homeVariants = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1,  },
    exit: { opacity: 0, x: -100, transition: {ease: "easeInOut"} },
};

export const foodVariants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0, },
    exit: { opacity: 0, x: -100, },
};


export const typeFood = {
    isGlutenFree: "sản phẩm chứa gluten (tinh bột)",
    isVegan: "thực phẩm chay"
}



export const foodContent = ['bạn sẽ thích', "thức ăn ngon"]