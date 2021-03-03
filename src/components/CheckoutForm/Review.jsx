// rafce
import React from "react";
import { Typography, List, ListItem, ListItemText } from "@material-ui/core";

const Review = ({ checkoutToken }) => {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        訂單總覽
      </Typography>
      {/* disablePadding取消一點padding top */}
      <List disablePadding>
        {/* 將購物車內的項目進行遞迴 */}
        {checkoutToken.live.line_items.map((product) => (
          <ListItem style={{ padding: "10px 0" }} key={product.name}>
            <ListItemText
              primary={product.name}
              // secondary 淺灰變小
              secondary={`數量:${product.quantity}`}
            />
            {/* 此單一項目價格*數量的總價格 */}
            {/* body2字體縮小一點 */}
            <Typography variant="body2">
              {product.line_total.formatted_with_symbol}
            </Typography>
          </ListItem>
        ))}
        {/* 下面是所有項目加總的總價格 */}
        <ListItem style={{ padding: "10px 0" }}>
          <ListItemText primary="總價格" />
          {/* subtitle字體些微改變而已 */}
          <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
            {checkoutToken.live.subtotal.formatted_with_symbol}
          </Typography>
        </ListItem>
      </List>
    </div>
  );
};

export default Review;
