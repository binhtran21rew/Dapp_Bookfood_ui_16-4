import Web3 from "web3";
import contractData from "../constract/Bookfood.json"

const abi = contractData.abi;
const contractAddress = "0xe78A0F7E598Cc8b0Bb87894B0F60dD2a88d6a8Ab";

const initContract = async () => {
    const rpcURL = "http://127.0.0.1:8545"; // Ganache RPC

    const web3 = new Web3(new Web3.providers.HttpProvider(rpcURL));

    const privateKey = localStorage.getItem("privateKey");
    if (!privateKey) {
        throw new Error("Private Key chưa được nhập!");
    }

    const account = web3.eth.accounts.privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
    web3.eth.accounts.wallet.add(account);
    web3.eth.defaultAccount = account.address;

    const contract = new web3.eth.Contract(abi, contractAddress);

    return { web3, contract, account };
};


const sendTransaction = async (methodName, ...params) => {
    try {
        const { web3, contract, account } = await initContract();
        const method = contract.methods[methodName](...params);

        const gas = await method.estimateGas({ from: account.address });

        // Hoàn toàn dùng number
        const gasWithBuffer = Math.floor(Number(gas) * 1.5);

        const txData = await method.send({
            from: account.address,
            gas: gasWithBuffer,
        });

        console.log("Giao dịch thành công:", txData);
        return txData;
    } catch (error) {
        console.error("Lỗi giao dịch:", error);
        throw error;
    }
};


const services = {
    getAllCategories: async () => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getAllCategory().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phân loại:", error);
            return [];
        }
    },

    getAllRestaurants: async () => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getAllRestaurants().call();

        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà hàng:", error);
            return [];
        }
    },


    getOrder: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.orders(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
            return [];
        }
    },

    getRes: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.restaurants(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy nhà hàng:", error);
            return [];
        }
    },

    getAllFoods: async () => {
        const { contract } = await initContract();

        try {
            return await contract.methods.getAllFoods().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thức ăn:", error);
            return [];
        }
    },

    getManageOrders: async () => {
        const { contract, account } = await initContract();
        try {

            return await contract.methods.getAllOrders().call({ from: account.address });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            return [];
        }
    },

    getOrderHistory: async () => {
        const { contract, account } = await initContract();
        try {
            return await contract.methods.getOrdersBySender().call({ from: account.address });
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
            return [];
        }
    },

    getOrderDetail: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getOrderDetails(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy chi tiết đơn hàng:", error);
            return [];
        }
    },

    updateOrderStatus: async (orderId, status) => {
        return sendTransaction("updateOrderStatus", orderId, status);
    },

    rating: async (id, reviews, star) => {
        return sendTransaction("addRating", id, reviews, star);
    },


    createOrder: async (payment, _foodIds, _quantities, UsePoint, note) => {
        return sendTransaction("placeOrder", payment, _foodIds, _quantities, UsePoint, note);
    },

    searchFood: async (keyword) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.searchFood(keyword).call();
        } catch (error) {
            console.error("Lỗi khi tìm kiếm món ăn:", error);
            return [];
        }
    },

    searchRestaurants: async (keyword) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.searchRestaurants(keyword).call();
        } catch (error) {
            console.error("Lỗi khi tìm kiếm nhà hàng:", error);
            return [];
        }
    },

    getRatingByID: async (id) => {
        const { contract } = await initContract();
        try {
            return await contract.methods.getRatingsForFood(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá:", error);
            return [];
        }
    },

};

export default services;