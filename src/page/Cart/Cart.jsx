import React, { useEffect, useState } from 'react'
import { Container, Table, Button } from "react-bootstrap";

import './cart.scss';

import services from '../../utils/services';
import validJson from '../../utils/validJson';
import { data, useNavigate } from 'react-router-dom';
import Icon from '../../utils/Icon';
import BtnBack from '../../cpns/BtnBack/BtnBack';

function Cart() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const fetch = async () => {
      const res = await services.getOrderHistory();
      
      const formattedData = res.map((item) => ({        
        id: item.id.toString(),
        discount: parseInt(item.discount),
        total: parseInt(item.totalPrice),
        payment: item.payment,
        status: item.status,
        isReviewed: item.isReviewed,
        isPay: item.isPay,
        note: item.note,
      }));
      setOrders(formattedData);
    }
    fetch()
  }, [])

  useEffect(() => {
    if(orders.length === 0) return;
    const data = orders.filter(data => validJson(data.note) ? JSON.parse(data.note) : '');
    
  }, [orders]);


  const viewOrderDetail = (orderId) => {
    navigate(`/orderDetail/${orderId}`);
  };



  
  return (
    <Container className="pt-4">

    <div className="d-flex justify-content-between">
      <h2>Danh Sách Đơn Hàng</h2>
      <BtnBack /> 
    </div>
    <Table striped bordered hover size="sm">
      <thead className="text-capitalize">
        <tr className='text-center align-content-center'>
          <th>id</th>
          <th>Giảm giá (VNĐ)</th>
          <th>Tổng tiền (VNĐ)</th>
          <th>Phương thức thanh toán</th>
          <th>Trạng thái</th>
          <th>Option</th>
        </tr>
      </thead>
      <tbody>
      {orders.map((order, id) => (
              <tr key={id}>
                <td>{order.id}</td>
                <td>{order.discount === 0 ? order.discount.toLocaleString() : order.discount.toLocaleString()}</td>
                <td>{order.total.toLocaleString()}</td>
                <td>
                  {order.payment == 0
                    ? `Ví điện tử (${order.isPay ? "Đã thanh toán" : "Chưa thanh toán"})`
                    : order.payment == 1
                      ? "Tiền mặt"
                      : "N/A"}
                </td>
                <td>
                  {order.status == 0
                    ? "Đang chờ xác nhận"
                    : order.status == 1
                      ? "Đang chuẩn bị món"
                      : "Đã giao"}
                </td>
                <td className='align-content-center'>
                    <Button  className="text-capitalize" variant="info" onClick={() => viewOrderDetail(order.id)}>
                      chi tiết
                    </Button>
                </td>
              </tr>
            ))}
      </tbody>
    </Table>
  </Container>
  )
}

export default Cart