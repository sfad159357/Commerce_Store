import React, { useState, useEffect } from "react";
import {
  CssBaseline,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Typography,
  CircularProgress,
  Divider,
  Button,
} from "@material-ui/core";
import useStyles from "./styles";
import AddressForm from "../AddressForm";
import PaymentForm from "../PaymentForm";
import { commerce } from "../../../lib//commerce";
import { Link, useHistory } from "react-router-dom";

const steps = ["運送地址", "訂單總覽"];

const Checkout = ({ cart, onCaptureCheckout, onRefresh, error, order }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [checkoutToken, setCheckoutToken] = useState(null);
  const [shippingData, setShippingData] = useState({});

  const classes = useStyles();
  const history = useHistory();

  // 這裡先定義async函式再呼叫的原因是，我們不能在useEffect(async () => {})這樣異步呼叫函式，需要先定義再呼叫
  const generateToken = async (cartId) => {
    try {
      // token需要的參數有兩個，第一個cartID，第二個是選項，哪個種類
      // 記得異步操作，前面要加await，不然promise呈現pending狀態
      const token = await commerce.checkout.generateToken(cartId, {
        type: "cart",
      });
      setCheckoutToken(token);
    } catch (error) {
      // 現階段不是confirmation的話叫回首頁
      if (activeStep !== steps.length) history.push("/");
    }
  };

  useEffect(() => {
    // 所以必須要先取得購物車的id，以及裡面要有東西，才去請求checkoutToken
    if (cart.id && cart.total_items) {
      generateToken(cart.id);
    }
  }, [cart]); // 一旦購物車物件被更新，就觸發useEffect，產生新的一組token

  // 如果在react要使用前狀態preStep來做setState，要使用callback function (()=>{ })
  // 不能直接setActiveStep(preStep + 1)，以免影響(mutate)到preState
  const nextStep = () => setActiveStep((prevStep) => prevStep + 1);
  const backStep = () => setActiveStep((prevStep) => prevStep - 1);

  // 透過next函式來儲存AddressForm元件表單所傳送過來的data
  const next = (data) => {
    setShippingData(data);
    // 一旦儲存好data後，要進行下一個step，也就是下一個元件Confirmation
    nextStep();
  };
  // 定義完要作為prop傳送到AddressForm元件去處理data
  // 在AddressForm呼叫完next()後，表示已經結束了AddressForm的操作，可以執行到PaymentForm元件了

  let Confirmation = () =>
    order.customer ? (
      <>
        <div>
          <Typography variant="h5">
            {order.customer.firstname}，感謝您的購買
          </Typography>
          <Divider className={classes.divider} />
          <Typography variant="subtitle2">
            訂單編號: {order.customer_reference}
          </Typography>
        </div>
        <br />
        <Button
          component={Link}
          variant="outlined"
          type="button"
          onClick={onRefresh}
          to="/"
        >
          回到首頁
        </Button>
      </>
    ) : (
      <div className={classes.spinner}>
        <CircularProgress />
      </div>
    );

  if (error) {
    Confirmation = () => (
      <>
        <Typography variant="h5">Error: {error}</Typography>
        <br />
        <Button component={Link} variant="outlined" onClick={onRefresh} to="/">
          回到首頁
        </Button>
      </>
    );
  }

  // 判斷步驟是否為0，是0進入AddressForm填寫地址，是1進入PaymentForm填寫信用卡資料
  const Form = () =>
    activeStep === 0 ? (
      <AddressForm checkoutToken={checkoutToken} next={next} />
    ) : (
      // 由於在AddressForm執行了next()，activeStep被+1，並且有shippingData能夠進行存取，作為prop傳送過去使用
      <PaymentForm
        shippingData={shippingData}
        checkoutToken={checkoutToken}
        backStep={backStep}
        nextStep={nextStep}
        onCaptureCheckout={onCaptureCheckout}
      />
    );

  return (
    <>
      {/* 很神奇的css component，能讓超出螢幕範圍的表單縮進去，然後背景呈現灰階色 */}
      <CssBaseline />
      <div className={classes.toolbar} />
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography variant="h4" align="center">
            結帳
          </Typography>
          {/* 屬性為activeStep state動態變化 */}
          <Stepper activeStep={activeStep} className={classes.stepper}>
            {steps.map((step) => (
              <Step key={step}>
                <StepLabel>{step}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {/* steps.length表示steps的長度，也代表最後一個index + 1，我們就將其視為最後一項完成的最後額外一項 */}
          {/* 在最後額外一項就顯示Conformation元件，還不是就跳回上面的Form函式再來一次三元判斷 */}
          {activeStep === steps.length ? (
            <Confirmation />
          ) : (
            // React 首先渲染render JSX => 再來呼叫useEffect，這個時候再會去請求checkoutToken => 狀態改變後 => 第二次渲染
            // 而初次渲染會渲染到<AddressForm>元件，然而剛開始渲染並不會呼叫useEffect，第一次渲染checkoutToken的狀態還是null，會噴undefined的error
            // 用&&條件式來篩選，假如初始渲染checkoutToken是null，就是falsy，Form元件就不會被渲染 
            checkoutToken && <Form />
          )}
        </Paper>
      </main>
    </>
  );
};

export default Checkout;
