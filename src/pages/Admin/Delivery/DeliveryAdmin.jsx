import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { deleteDeliveryAPI, getDeliveryAPI } from '../../../redux/reducers/DeliveriesReducer';

import style from './DeliveryAdmin.module.css';
import { API_DOMAIN } from '../../../utils/constants/settingSystem';
import { setComponentsAction } from '../../../redux/reducers/FunctionPopupReducer';
import { Tag } from 'antd';

export default function DeliveryAdmin(props) {

  const dispatch = useDispatch();

  const { deliveriesList } = useSelector((state) => state.DeliveriesReducer);

  useEffect(() => {
    let Components = [
      {
        tooltip: 'Add Delivery',
        icon: `<i className="fas fa-plus" />`,
        contentComponentType: 'FormAddDelivery',
      }
    ]
    dispatch(setComponentsAction(Components))
    dispatch(getDeliveryAPI())
  }, [])

  return (
    <div className='grid grid-cols-2'>
      <div className={style.deliveryColumn}>
        <h6>Deliver</h6>
        {deliveriesList.filter((delivery) => delivery.status === false).map((delivery, index) => {
          return (
            <div key={index} className={style.deliveryCard}>
              <div className='flex justify-between items-center border-b-2 mb-2'>
                <p className='mb-2'><span className='font-semibold'>Delivery:</span> {delivery.id}</p>
                <p className='mb-2'><span className='font-semibold'>Status:</span> <Tag color={
                  delivery.status === true ? 'green' : 'red'
                }>{delivery.status === true ? 'Delivered' : 'Not Delivered'}</Tag></p>
                <p className='mb-2'><span className='font-semibold'>Delivery date: </span>{delivery.delivery_date}</p>
              </div>
              <h6>
                Order Information:
              </h6>
              <div className='grid grid-cols-2 gap-4 border-b-2'>
                <div>
                  <p><span className='font-semibold'>Order ID: </span>{delivery.orderResponse.id}</p>
                  <p><span className='font-semibold'>Customer Address: </span>{delivery.orderResponse.customerAddress}</p>
                  <p><span className='font-semibold'>Customer Name: </span>{delivery.orderResponse.customer_name}</p>
                  <p><span className='font-semibold'>Phone Number: </span>{delivery.orderResponse.customerPhone}</p>
                </div>
                <div>
                  <p><span className='font-semibold'>Order Date: </span>{delivery.orderResponse.created_date}</p>
                  <p><span className='font-semibold'>Total Price: </span>{delivery.orderResponse.total_price}</p>
                  <p><span className='font-semibold'>People In Charge: </span>{delivery.orderResponse.customer_name}</p>
                  <p className='uppercase'><span className='font-semibold'>Status: </span>{delivery.orderResponse.status.split("_").join(" ")}</p>
                </div>
              </div>
              <h6>
                Product Information:
              </h6>
              <div className='border-b-2 mb-2'>
                {delivery.orderResponse.orderDetailResponses.map((orderDetail, index) => {
                  return (
                    <div key={index} className=''>
                      <div className='flex'>
                        <img className='w-1/4' src={`${API_DOMAIN}/${orderDetail.product_image}`} alt={orderDetail.product_name} />
                        <div className='ml-3'>
                          <p><span className='font-semibold'>Product Name: </span>{orderDetail.product_name}</p>
                          <p><span className='font-semibold'>Quantity: </span>{orderDetail.quantity}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className='text-end'>
                <button className='btn btn-danger' onClick={() => {
                  dispatch(deleteDeliveryAPI(delivery.id))
                }}>Delete</button>
              </div>
            </div>
          )
        })}
      </div>
      <div className={style.deliveryColumn}>
        <h6>Delivered</h6>
        {deliveriesList.filter((delivery) => delivery.status === true).map((delivery, index) => {
          return (
            <div key={index} className={style.deliveryCard}>
              <div className='flex justify-between items-center border-b-2 mb-2'>
                <p className='mb-2'><span className='font-semibold'>Delivery:</span> {delivery.id}</p>
                <p className='mb-2'>Status: <Tag color={
                  delivery.status === true ? 'green' : 'red'
                }>{delivery.status === true ? 'Delivered' : 'Not Delivered'}</Tag></p>
                <p className='mb-2'><span className='font-semibold'>Delivery date: </span>{delivery.delivery_date}</p>
              </div>
              <h6>
                Order Information:
              </h6>
              <div className='grid grid-cols-2 gap-4 border-b-2'>
                <div>
                  <p><span className='font-semibold'>Order ID: </span>{delivery.orderResponse.id}</p>
                  <p><span className='font-semibold'>Customer Address: </span>{delivery.orderResponse.customerAddress}</p>
                  <p><span className='font-semibold'>Customer Name: </span>{delivery.orderResponse.customer_name}</p>
                  <p><span className='font-semibold'>Phone Number: </span>{delivery.orderResponse.customerPhone}</p>
                </div>
                <div>
                  <p><span className='font-semibold'>Order Date: </span>{delivery.orderResponse.created_date}</p>
                  <p><span className='font-semibold'>Total Price: </span>{delivery.orderResponse.total_price}</p>
                  <p><span className='font-semibold'>People In Charge: </span>{delivery.orderResponse.customer_name}</p>
                  <p><span className='font-semibold'>Status: </span><span className='uppercase'>{delivery.orderResponse.status.split("_").join(" ")}</span></p>
                </div>
              </div>
              <h6>
                Product Information:
              </h6>
              {delivery.orderResponse.orderDetailResponses.map((orderDetail, index) => {
                return (
                  <div key={index} className=''>
                    <div className='flex'>
                      <img className='w-1/4' src={`${API_DOMAIN}/${orderDetail.product_image}`} alt={orderDetail.product_name} />
                      <div className='ml-3'>
                        <p><span className='font-semibold'>Product Name: </span>{orderDetail.product_name}</p>
                        <p><span className='font-semibold'>Quantity: </span>{orderDetail.quantity}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })}
      </div >
    </div >
  )
}
