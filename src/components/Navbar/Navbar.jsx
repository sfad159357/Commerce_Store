import React from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Badge,
  Typography,
} from "@material-ui/core";
import { ShoppingCart } from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";

import logo from "../../assets/commerce.jpg";
import useStyles from "./styles";

function Navbar({ totalItems, onRefresh }) {
  const classes = useStyles();
  const location = useLocation();

  return (
    <>
      <AppBar position="fixed" className={classes.appBar} color="inherit">
        <Toolbar>
          {/* left side */}
          <Typography
            component={Link}
            to="/"
            variant="h6"
            className={classes.title}
            color="inherit" // 不要有超連結的顏色
          >
            <img
              src={logo}
              alt="Commerce.js"
              height="25px"
              className={classes.image}
            />
            我的商城
          </Typography>

          {/* middle */}
          <div className={classes.grow} />

          {/* 若目前相對路徑在首頁'/'的話，&&條件前者為truthy而顯示購物車圖示 */}
          {/* 反之，若非首頁，則不會顯示購物車圖示 */}
          {location.pathname === "/" && (
            <div className={classes.button}>
              {/* component屬性能夠連擊到Link */}
              <IconButton
                component={Link}
                to="/cart"
                onClick={onRefresh}
                aria-label="Show cart items"
                color="inherit"
              >
                {/* 此badge的功用是告訴消費者現有的購物車有多少項東西，badeContent={有幾的在購物車的項目} */}
                {/* color="secondary變成紅色" */}
                <Badge badgeContent={totalItems} color="secondary">
                  <ShoppingCart />
                </Badge>
              </IconButton>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
