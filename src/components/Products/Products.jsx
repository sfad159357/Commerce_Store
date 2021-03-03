import React  from 'react';
import { Grid } from '@material-ui/core';
import Product from './Product/Product'

import useStyles from './styles'


// prop.products從App.js獲取
const Products = ({products, onAddToCart}) => {
    const classes = useStyles()
   
    return(
        <main className={classes.content}>
            {/* 增加content上方padding高度是多少px，讓底下的content往下一些 */}
            <div className={classes.toolbar}/>
            <Grid container justify="center" spacing={4}>
                {products.map(item => (
                    // 帶入RWD格線排版功能
                    // Grid需要帶入item屬性，後面的rwd才能起作用
                    <Grid key={item.id} item xs={12} sm={6} md={4} lg={3}>
                        <Product product={item} onAddToCart={onAddToCart}/>
                    </Grid>
                )
                )}
            </Grid>
        </main>
    )
}

export default Products;