import React from 'react';
import { Card, CardMedia, CardContent, CardActions, Typography, IconButton } from '@material-ui/core';
import { AddShoppingCart } from '@material-ui/icons';

import useStyles from './styles'; // 這裡的useStyles就是makeStyles


function Product({ product, onAddToCart }) {
    const classes = useStyles();


    return(
        // 這裡的css使用已經刻好的classes帶入
        <Card className={classes.root}>
            <CardMedia className={classes.media} image={product.media.source} title={product.name} />

            <CardContent>
                <div className={classes.cardContent}>
                    {/* Typography常用於字型上 */}
                    <Typography variant="h5" gutterBottom>
                        {product.name}
                    </Typography>
                    <Typography variant="h5" >
                        {product.price.formatted_with_symbol}
                    </Typography>
                    {/* textSecondary 給予淺灰色的效果 */}
                </div>
                {/* 由於product.description是一個html標籤來顯示，透過dangerouslySetInnerHTML屬性來將字串轉換成html格式 */}
                <Typography dangerouslySetInnerHTML={{ __html:product.description}} variant="body2" color="textSecondary" />
            </CardContent>

            <CardActions disableSpacing className={classes.cardActions}>
                {/* aria-label是用來給給讀音軟體辨識的html屬性，增加accessibility */}
                <IconButton aria-label="Add to Cart" onClick={() => onAddToCart(product.id, 1)}>
                    {/* 小圖案 */}
                    <AddShoppingCart />
                </IconButton>
            </CardActions>
            
        </Card>
    )
}

export default Product
