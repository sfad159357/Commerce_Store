import React from 'react'
import { Typography, Button, Divider } from '@material-ui/core';
import { Elements, CardElement,  ElementsConsumer } from '@stripe/react-stripe-js'
// 注意上下來源不一樣
import {loadStripe} from '@stripe/stripe-js'

import Review from './Review'

// 這裡要創建一個stripe public key，要先去到stripe.com辦一個帳號，獲得其public key，然後設置在.env，帶入環境變數
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY)


const PaymentForm = ({
  checkoutToken,
  backStep,
  nextStep,
  shippingData,
  onCaptureCheckout,
}) => {
  const handleSubmit = async (event, elements, stripe) => {
    event.preventDefault(); // 避免衝新啟動網頁
    // 如果沒有stripe或沒有elements就中斷函式
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });
      console.log('paymentMethod',paymentMethod)

    // 在串接stripe API有可能會有error出來，而不是paymentMethod
    // 這段看是否能直接try catch
    if (error) {
      console.log('Payment error',error);
    } else {
      // 顯示訂單資訊
      const orderData = {
        // 商品資訊
        line_items: checkoutToken.live.line_items,
        // 客戶資訊，由於commerce response回來的訂單customer格式名字的格式分為firstname和lastname，這裡直接把name作為firstname
        customer: { firstname: shippingData.name,lastname:shippingData.name, email: shippingData.email },
        // 運送資訊
        shipping: {
          name: "Primary",
          town_city: shippingData.city,
          country: shippingData.shippingCountry,
          county_state: shippingData.shippingSubdivision,
          postal_zip_code: shippingData.postal_code,
          street: shippingData.address,
        },
        //
        fulfillment: { shipping_method: shippingData.shippingOption },
        payment: {
          gateway: "stripe",
          stripe: {
            payment_method_id: paymentMethod.id,
          },
        },
      };
      console.log('orderData',orderData);
      // 最後將所有的訂單資訊傳送回App母元件，進行狀態的儲存，並且串接commerce API
      onCaptureCheckout(checkoutToken.id, orderData);
    }
      nextStep()
  };

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      {/* 很像<hr />的作用 */}
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "10px 0" }}>
        付款方式
      </Typography>
      <Elements stripe={stripePromise}>
        <ElementsConsumer>
          {/* 回呼函式，其參數是一個物件 */}
          {({ elements, stripe }) => (
            <form onSubmit={(e) => handleSubmit(e, elements, stripe)}>
                {/* CardElement呈現出信用卡輸入的格式 */}
              <CardElement />
              <br />
              <br />
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                {/* outlined會變成有線框的按鈕，然後onClick點擊觸發從Checkout傳過來的backStep函式 */}
                <Button variant="outlined" onClick={backStep}>
                  上一步
                </Button>
                {/* primary變藍字，而contained是深藍底加白字 */}
                <Button
                  disabled={!stripe}
                  type="submit"
                  variant="contained"
                  color="primary"
                >
                  {/* 顯示最總共的費用 */}
                  付款 {checkoutToken.live.subtotal.formatted_with_symbol}
                </Button>
              </div>
            </form>
          )}
        </ElementsConsumer>
      </Elements>
    </>
  );
};

export default PaymentForm
