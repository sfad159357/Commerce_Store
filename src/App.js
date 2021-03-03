import React, { useState, useEffect} from 'react'
import {commerce} from './lib/commerce'
// import Products from './components/Products/Products'
// import Navbar from './components/Navbar/Navbar'
// 透過components底下的index.js來幫助整理導入元件
import { Navbar, Products, Cart , Checkout} from './components'
import { BrowserRouter as Router, Route , Switch} from 'react-router-dom'


function App() {

    // 創建新的state，默認下是空的陣列
    // products和cart為最初始的狀態
    const [products, setProducts] =  useState([])
    const [cart, setCart] = useState({})
    const [order, setOrder] = useState({})
    const [errorMessage, setErrorMessage] = useState('')
    console.log('App cart', cart)
    console.log('App order', order)
    console.log('App error1', errorMessage)


    // 從後端api取得外部資源，宣吿async異步的fn
    const fetchProducts = async () => {
        // 取得response。response.data => {data}
        const {data} = await commerce.products.list()
        setProducts(data); // setProducts將異步取得的data重新設置state
    }
    const fetchCart = async () => {
        setCart(await commerce.cart.retrieve())
        console.log('原始cart',cart)
    }

    // 新增物品至購物車的函式
    // 牽涉到後端的api需要使用到異步async
    const handleAddToCart = async (productId, quantity) => {
        // 先發送至後端來作post
        const {cart} = await commerce.cart.add(productId, quantity)
        // 返回的結果再來改變前端的state
        setCart(cart)
    } // 然後傳送prop到Product子元件去觸發

    // 同個商品，不同數量
    const handleUpdateToCart = async (productId, quantity) => {
        // 由於參2更新項目有好幾個，所以是以物件型態呈現
        const { cart }= await commerce.cart.update(productId, { quantity })
        setCart(cart)
    }
    const handleRemoveFromCart = async (productId) => {
        const {cart} = await commerce.cart.remove(productId)
        setCart(cart)
    }
    const handleEmptyCart = async () => {
        const {cart} = await commerce.cart.empty()
        setCart(cart)
    }
    const refresh = () => {
        setOrder({})
        setErrorMessage('') 
        console.log('已重新設定order和errorMessage')
    }

  
    // 處理總訂單資訊的函式
    const handleCaptureCheckout = async (checkoutTokenId, newOrder) => {
        try {
            const incomingOrder = await commerce.checkout.capture(checkoutTokenId, newOrder)
            console.log('incomingOrder',incomingOrder)
            setOrder(incomingOrder)
            // 從PaymentForm傳來的newOrder新訂單串接給commerce後，並儲存的狀態
            // 最後的order還要回傳prop給Checkout元件

            
            // 一旦結帳完，還需要清空購物車
            handleEmptyCart()
        } catch (error) {
            // 還要另外儲存error訊息，會顯示為何有error產生
            console.log('App error2', error)
            setErrorMessage(error.data.error.message)
        }
    }


    // 使用useEffect hook來呼叫異步函式fetchProducts
    // 初始化渲染，取得commerce內所有商品，以及取得空的購物車
    useEffect(() => {
        fetchProducts();
        fetchCart()
        console.log('初始取得')
    },[]) // dependency array，若為[]，代表只會在一開始render時呼叫
    // 如同之前版本的componentDidMount

   

    return (
        <Router>
            <>  
                {/* Navbar永遠固定不用switch */}
                <Navbar totalItems={cart.total_items} onRefresh={refresh}/>
                <Switch>
                    {/* 產品頁面做為首頁 */}
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart} / >
                    </Route>
                    <Route exact path="/cart">
                        <Cart cart={cart}
                            onUpdateToCart={handleUpdateToCart}
                            onRemoveFromCart={handleRemoveFromCart}
                            onEmptyCart={handleEmptyCart}
                        />
                    </Route>
                    <Route>
                        < Checkout
                            cart={cart}
                            onCaptureCheckout={handleCaptureCheckout}
                            order={order}
                            error={errorMessage}
                            onRefresh={refresh}
                            / >
                    </Route>
                </Switch>
            </>
        </Router>
    )
}

export default App
