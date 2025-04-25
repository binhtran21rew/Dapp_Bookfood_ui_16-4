import Web3 from "web3";
import contractData from "../constract/Bookfood.json";

const abi = contractData.abi;
const contractAddress = "0xcB2577Fb51c3E0ff177D46925E32AC2F5df51274";
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
        const gasWithBuffer = Math.floor(Number(gas) * 1.2);
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


    listenForOrderPlaced: async (callback) => {
        try {
            const { contract } = await initialize();

            // Thiết lập trình lắng nghe sự kiện OrderPlaced
            const orderPlacedEvent = contract.events.OrderPlaced({
                fromBlock: 'latest' // Lắng nghe các event mới nhất
            });

            // Xử lý sự kiện khi nó được phát ra
            orderPlacedEvent.on('data', (event) => {
                console.log("Event OrderPlaced được phát ra:", event.returnValues);
                // Gọi callback function với dữ liệu của event
                callback(event.returnValues);
            });

            // Xử lý lỗi trong quá trình lắng nghe
            orderPlacedEvent.on('error', (error) => {
                console.error("Lỗi khi lắng nghe event OrderPlaced:", error);
            });

            console.log("Đang lắng nghe sự kiện OrderPlaced...");

            // Trả về đối tượng event để có thể hủy đăng ký sau này nếu cần
            return orderPlacedEvent;

        } catch (error) {
            console.error("Lỗi khi thiết lập lắng nghe event OrderPlaced:", error);
            throw error;
        }
    },


    listenForAddFood: (callback) => {
        initialize().then(({ contract }) => {
            const foodEvent = contract.events.FoodAdded({
                fromBlock: 'latest'
            });

            foodEvent.on('data', (event) => {
                console.log("Event FoodAdded được phát ra:", event.returnValues);
                callback(event.returnValues);
            });

            
            foodEvent.on('error', (error) => {
                console.error("Lỗi khi lắng nghe event FoodAdded:", error);
            });

            console.log("Đang lắng nghe sự kiện FoodAdded...");

            return foodEvent;
        }).catch(error => {
            console.error("Lỗi khi khởi tạo để lắng nghe event FoodAdded:", error);
        });


        return null;
    },

    listenForPlaceOrder: async (callback) => {
        try {
            const { contract, account } = await initialize();
            if (contract && contract.events && contract.events.OrderPlacedEvent) {
                const listener = contract.events.OrderPlacedEvent({
                    filter: { customer: account.address },
                    fromBlock: 'latest'
                })
                listener.on('data', (event) => {
                    console.log("đang lắng nghe sự kiện OrderPlacedEvent.", event.returnValues);
                    callback(event.returnValues)
                })
                
                if (listener) {
                    return () => {
                        listener.unsubscribe();
                        console.log("Đã hủy đăng ký lắng nghe sự kiện OrderPlacedEvent.");
                    };
                } else {
                    console.warn("Không tạo được listener, không có gì để hủy đăng ký.");
                    return () => {};
                }

            } else {
                console.log("Không thể đăng ký lắng nghe sự kiện OrderPlacedEvent (WebSocket Contract chưa khởi tạo).");
                return () => { };
            }
        } catch (error) {
            console.error("Lỗi khi khởi tạo để lắng nghe event OrderPlacedEvent:", error);
            return () => {};
        }
    },


};

export default services;