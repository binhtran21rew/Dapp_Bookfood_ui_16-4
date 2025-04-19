import React, { useEffect, useState } from "react";
import { Container, Table, Form, Button } from "react-bootstrap";

import services from "../../utils/services";
import validJson from "../../utils/validJson";
import { data, useNavigate, useParams } from "react-router-dom";
import BtnConfirm from "../../cpns/BtnConfirm/BtnConfirm";
import Icon from "../../utils/Icon";

function OrderDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [foods, setFoods] = useState();
    const [orderDetail, setOrderDetail] = useState([]);
    const [order, setOrder] = useState();
    const [isRating, setIsRating] = useState(null);
    useEffect(() => {
        const getData = async () => {
            try {
                const resFood = await services.getAllFoods();
                const resOrderDetail = await services.getOrderDetail(id);
                const resOrder = await services.getOrder(id);

                const formatFood = resFood.map((food) => ({
                    id: food.id.toString(),
                    name: food.name,
                    price: parseInt(food.price),
                    isVegan: food.isVegan,
                    isGlutenFree: food.isGlutenFree,
                    totalRatings: food.totalRatings,
                    totalStars: food.totalStars,
                    restaurantId: food.restaurantId,
                    categoryId: food.categoryId,
                }));

                const formatDataOrderDetail = resOrderDetail.map((item) => {
                    const matchingOrder = validJson(resOrder.note)
                        ? JSON.parse(resOrder.note).find(
                              (order) => order.id === item.foodId.toString()
                          )
                        : "";
                    return {
                        id: item.foodId.toString(),
                        price: parseInt(item.price),
                        quantity: parseInt(item.quantity),
                        rating: 5,
                        review: "",
                        note: matchingOrder ? matchingOrder : "",
                    };
                });

                const formatOrder = {
                    id: resOrder.id,
                    discount: resOrder.discount,
                    totalPrice: resOrder.totalPrice,
                    isReviewed: resOrder.isReviewed,
                    status: resOrder.status,
                };
                setFoods(formatFood);
                setOrderDetail(formatDataOrderDetail);
                setOrder(formatOrder);
            } catch (error) {
                console.log(error);
            }
        };

        getData();
    }, []);


    const getFoodName = (foodId) => {
        const food = foods.find((item) => item.id === foodId.toString());
        return food ? food.name : "Không xác định";
    };
    const handleReviewChange = (id, field, value) => {
        setOrderDetail((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, [field]: value } : item
            )
        );
    };


    
    const handleRating = async () => {
        const updatedorderDetail = orderDetail.map(item => ({
            ...item,
            review: item.review.trim() === "" ? "Không có đánh giá" : item.review
        }));
        const ratings = updatedorderDetail.map(item => parseInt(item.rating)); // Mảng số sao
        const reviews = updatedorderDetail.map(item => item.review); // Mảng đánh giá


        try {
            const tx = await services.rating(parseInt(id), reviews, ratings)
            alert("Đánh giá đã được thêm vào blockchain!", tx);
            setIsRating(null)
        }catch (e) {
            alert("Đánh giá thất bại!", e);
        }
    }
    return (
        <Container className="pt-4">
            <div className="d-flex justify-content-between">
                <h2>Chi Tiết Đơn Hàng</h2>
                <div className="col-1" onClick={() => navigate(-1)}>
                        <Icon name="iconArrowLeft" size="14" />
                </div>
            </div>
            <Table striped bordered hover size="sm">
                <thead className="text-capitalize">
                    <tr className="text-center align-content-center">
                        <th>tên món</th>
                        <th>giá (VNĐ)</th>
                        <th>số lượng</th>
                        <th>thành tiền (VNĐ)</th>
                        <th>ghi chú</th>
                        <th>đánh giá</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetail.map((item) => (
                        <tr key={item.id}>
                            <td>{getFoodName(item.id)}</td>
                            <td>{item.price.toLocaleString()}</td>
                            <td>{item.quantity}</td>
                            <td>
                                {(item.price * item.quantity).toLocaleString()}
                            </td>
                            <td>
                                <span>{item.note.note}</span>
                                <li className="text-capitalize">
                                    size: {item.note.size}
                                </li>
                            </td>
                            {!order?.isReviewed && 
                            <td className="align-content-center">
                                <Button
                                    className="text-capitalize"
                                    variant="info"
                                    onClick={() => setIsRating(item.id)}
                                >
                                    đánh giá
                                </Button>
                            </td>}
                            {order?.isReviewed && 
                            <td className="align-content-center">
                                Đã đánh giá
                            </td>}
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="mt-3">
                <h5>Giảm giá: {order?.discount}</h5>
                <h4>Thành tiền: {order?.totalPrice.toLocaleString()} vnd</h4>
            </div>

            {isRating && (
                <>
                    <div className="fs-5 fw-bold my-3">{getFoodName(isRating)}</div>
                    {!order?.isReviewed && (
                        <div>
                            <Form.Select
                                // value={item.rating}
                                onChange={(e) =>
                                    handleReviewChange(
                                        isRating,
                                        "rating",
                                        e.target.value
                                    )
                                }
                            >
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <option key={star} value={star}>
                                        {star} ⭐
                                    </option>
                                ))}
                            </Form.Select>
                        </div>
                    )}
                    {!order?.isReviewed && (
                        <div>
                            <Form.Control
                                type="text"
                                // value={item.review}
                                onChange={(e) =>
                                    handleReviewChange(
                                        isRating,
                                        "review",
                                        e.target.value
                                    )
                                }
                                placeholder={`nhập đánh giá...`}
                            />
                        </div>
                    )}

                    <div className="stylePopup-bottom">

                        <BtnConfirm radius={8} onClick={() => handleRating()}> 
                            <span className="text-white fw-bold ms-3 fs-5">Đánh giá</span>
                        </BtnConfirm>
                    </div>
                </>
            )}
        </Container>
    );
}

export default OrderDetail;
