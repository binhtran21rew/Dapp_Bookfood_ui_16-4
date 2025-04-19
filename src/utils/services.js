import Web3 from "web3";
import contractData from "../constract/Bookfood.json";

const abi = contractData.abi;
const contractAddress = "0x4c4975060664fBdF1765bda2a8936ea20e92bCBC";
const rpcURL = "http://127.0.0.1:8545"; // Ganache RPC
const wsURL = "ws://127.0.0.1:8545"
let web3Instance;
let contractInstance;
let accountInstance;

const initialize = async () => {
    if (!web3Instance) {
        // web3Instance = new Web3(new Web3.providers.HttpProvider(rpcURL));
        web3Instance = new Web3(new Web3.providers.WebsocketProvider(wsURL));
        
        const privateKey = localStorage.getItem("privateKey");
        if (!privateKey) {
            throw new Error("Private Key chưa được nhập!");
        }
        accountInstance = web3Instance.eth.accounts.privateKeyToAccount(privateKey.startsWith("0x") ? privateKey : `0x${privateKey}`);
        web3Instance.eth.accounts.wallet.add(accountInstance);
        web3Instance.eth.defaultAccount = accountInstance.address;
        contractInstance = new web3Instance.eth.Contract(abi, contractAddress);
    }
    return { web3: web3Instance, contract: contractInstance, account: accountInstance };
};

const sendTransaction = async (methodName, ...params) => {
    try {
        const { web3, contract, account } = await initialize();
        const method = contract.methods[methodName](...params);
        const gas = await method.estimateGas({ from: account.address });
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
        const { contract } = await initialize();
        try {
            return await contract.methods.getAllCategory().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách phân loại:", error);
            return [];
        }
    },

    getAllRestaurants: async () => {
        const { contract } = await initialize();
        try {
            return await contract.methods.getAllRestaurants().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách nhà hàng:", error);
            return [];
        }
    },

    getOrder: async (id) => {
        const { contract } = await initialize();
        try {
            return await contract.methods.orders(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error);
            return [];
        }
    },

    getRes: async (id) => {
        const { contract } = await initialize();
        try {
            return await contract.methods.restaurants(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy nhà hàng:", error);
            return [];
        }
    },

    getAllFoods: async () => {
        const { contract } = await initialize();
        try {
            return await contract.methods.getAllFoods().call();
        } catch (error) {
            console.error("Lỗi khi lấy danh sách thức ăn:", error);
            return [];
        }
    },

    getManageOrders: async () => {
        const { web3, contract, account } = await initialize();
        try {
            return await contract.methods.getAllOrders().call({ from: account.address });
        } catch (error) {
            console.error("Lỗi khi lấy danh sách đơn hàng:", error);
            return [];
        }
    },

    getOrderHistory: async () => {
        const { web3, contract, account } = await initialize();
        try {
            return await contract.methods.getOrdersBySender().call({ from: account.address });
        } catch (error) {
            console.error("Lỗi khi lấy lịch sử đơn hàng:", error);
            return [];
        }
    },

    getOrderDetail: async (id) => {
        const { contract } = await initialize();
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
        const { contract } = await initialize();
        try {
            return await contract.methods.searchFood(keyword).call();
        } catch (error) {
            console.error("Lỗi khi tìm kiếm món ăn:", error);
            return [];
        }
    },

    searchRestaurants: async (keyword) => {
        const { contract } = await initialize();
        try {
            return await contract.methods.searchRestaurants(keyword).call();
        } catch (error) {
            console.error("Lỗi khi tìm kiếm nhà hàng:", error);
            return [];
        }
    },

    getRatingByID: async (id) => {
        const { contract } = await initialize();
        try {
            return await contract.methods.getRatingsForFood(id).call();
        } catch (error) {
            console.error("Lỗi khi lấy đánh giá:", error);
            return [];
        }
    },
};

export default services;