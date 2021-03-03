import React from 'react'
import {Typography, Button, Card, CardActions, CardContent, CardMedia} from '@material-ui/core'

import useStyles from './styles'

const CartItem = ({item, onUpdateToCart, onRemoveFromCart}) => {
    const classes = useStyles();

    return (
        <Card>
            <CardMedia image={item.media.source} alt={item.name} className={classes.media}/>
            <CardContent className={classes.cardContent}>
                <Typography variant="h4">{item.name}</Typography>
                {/* 這邊價格用line_total，是因為雖然是單項，但是會乘上數量，也就是單項的總價 */}
                <Typography variant="h5">{item.line_total.formatted_with_symbol}</Typography>
            </CardContent>
            <CardActions className={classes.cardActions}>
                <div className={classes.buttons}>
                    <Button type="button" size="small" onClick={()=>onUpdateToCart(item.id, item.quantity - 1)}>-</Button>
                    <Typography>{item.quantity}</Typography>
                    <Button type="button" size="small" onClick={()=>onUpdateToCart(item.id, item.quantity + 1)}>+</Button>
                </div>
                <Button onClick={() => onRemoveFromCart(item.id)} variant="contained" type="button" color="secondary">移除商品</Button>
            </CardActions>
        </Card>
    )
}

export default CartItem
