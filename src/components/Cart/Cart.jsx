import React from 'react'
import {Link} from 'react-router-dom'
import { Container, Typography, Button, Grid} from '@material-ui/core'
import useStyles from "./styles"
import CardItem from './CartItem/CartItem'


function Cart({cart, onUpdateToCart, onRemoveFromCart, onEmptyCart}) {
    const classes = useStyles()

    // 判斷購物車內是否有項目，如果沒有，isEmpty就是true
    
    // 只是函式作回傳，並非真的子元件
    const EmptyCart = () => (
        <Typography variant="subtitle1">
            購物車內沒有任何商品，
            <Link to="/" className="classes.link">開始買些東西吧</Link>!
        </Typography>
    )
    const FilledCart = () => (
      <>
        {/* container使其RWD排版，spacing為行距 */}
        <Grid container spacing={3}>
          {/* 提取購物車內項目的名稱出來，並作RWD排版 */}
          {cart.line_items.map((item) => (
            // item type
            <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
              <CardItem
                item={item}
                onUpdateToCart={onUpdateToCart}
                onRemoveFromCart={onRemoveFromCart}
              />
            </Grid>
          ))}
        </Grid>
        {/* 計算購物車內所有項目加總價格 */}
        <div className={classes.cardDetails}>
          <Typography variant="h4">
            Subtotal: {cart.subtotal.formatted_with_symbol}
          </Typography>
          <div>
            <Button
              onClick={() => onEmptyCart()}
              className={classes.emptyButton}
              color="secondary"
              size="large"
              type="button"
              variant="contained"
            >
              清空購物車
            </Button>
            <Button
                className={classes.checkoutButton}
                color="primary"
                size="large"
                type="button"
                variant="contained"
                component={Link}
                to="./checkout"        
            >
              結帳
            </Button>
          </div>
        </div>
      </>
    );

    // cart的state雖然有項目在在購物車，但javascript在一開始在編譯時會將cart帶入{}空物件，導致cart.line_items為undefined，造成error
    // 所以先透過條件式篩掉undefined的情況
    if (!cart.line_items) return '載入中...請稍候'
    return (
        // 類似一般div，但有spacing和padding之類的
        <Container>
            {/* 將內容往下移，使內容不會被上面的商品欄遮蓋到 */}
            <div className={classes.toolbar} />
            {/* gutterButton屬性讓標題底下的內容往下移，有點像margin-bottom */}
            <Typography className={classes.title} variant="h3" gutterBottom>Your Shopping cart</Typography>
            { cart.line_items.length ? <FilledCart /> : <EmptyCart /> } 
            {/* <EmptyCard/> 和 <FilledCart/>看起來像是子元件，但其實只是個函式回傳jsx*/}
        </Container>
    )
} 

export default Cart
