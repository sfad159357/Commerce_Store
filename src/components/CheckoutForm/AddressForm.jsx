import React, { useState, useEffect } from "react";
import {
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
} from "@material-ui/core";
import { useForm, FormProvider } from "react-hook-form";
import FormInput from "./CustomTextField";
// 需要調用lib的commerce來取得Commerce.js的api，我們要獲得海外國家資訊
import { commerce } from "../../lib/commerce";
import {Link} from 'react-router-dom'

// 從Checkout元件傳送來的prop，由commerce.checkout.generateToken()產生出token
const AddressForm = ({ checkoutToken, next }) => {
  const [shippingCountries, setShippingCountries] = useState([]);
  const [shippingCountry, setShippingCountry] = useState("");
  const [shippingSubdivisions, setShippingSubdivisions] = useState([]);
  const [shippingSubdivision, setShippingSubdivision] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [shippingOption, setShippingOption] = useState("");

  // 使用react-hook-form來創造methods
  // 在表單提交的時候會使用到
  const methods = useForm();

  // 此checkoutTokenId從Checkout元件產生而來的

  const fetchShippingCountries = async (checkoutTokenId) => {
    // 單一商品必須先設定可運送之國家才回有回傳國家選項
    const { countries } = await commerce.services.localeListShippingCountries(
      checkoutTokenId
    ); //locale!

    console.log("countries", countries);
    setShippingCountries(countries);

    // 我們儲存第一個國家的狀態，也就是一開始select會出現的
    // X countries[0]，由於countries是物件不能這樣用
    // X countries.AT，也不能這樣用，因為不一定都是CA這個國家
    setShippingCountry(Object.keys(countries)[0]); // 如此一來，能夠存取物件中的第一個項目
  };
  console.log("checkoutTokenId", checkoutToken.id);

  // 下面依樣畫葫蘆，參數是所選取的指定國家，也就是shippingCountry
  // 從單一國家中，找出此國家多個子區域
  const fetchShippingSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode);
    console.log("countryCode", shippingCountry);
    console.log("subdivisions", subdivisions);
    setShippingSubdivisions(subdivisions);
    setShippingSubdivision(Object.keys(subdivisions)[0]);
  };

  const fetchShippingOptions = async (checkoutTokenId, country, region=null) => {
    // 不是commerce.services了
    console.log('真的有在做喔')
    const options = await commerce.checkout.getShippingOptions(
      checkoutTokenId,
      { country, region}
    );
    console.log("options", options);
    setShippingOptions(options);
    // 不是Object.keys(options)[0]喔
    setShippingOption(options[0].id);
  };

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id);
  }, []);

  // 無法合併在同一個useEffect呼叫，是因為fetch countries會延遲
  // 而下一個fetch函式馬上就需要用到參數shippingCountry，會來不及造成沒有值傳入
  // 此依賴變數為shippingCountries，一旦shippingCountries改變，就會重新呼叫此useEffect
  useEffect(() => {
    // 有時shippingCountry不存在，所以設個if
    if (shippingCountry) {
      fetchShippingSubdivisions(shippingCountry);
    }
  }, [shippingCountry]);

  useEffect(() => {
    if (shippingSubdivision) {
      console.log('option有去fetch')
      fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision);
    }
  }, [shippingSubdivision]);

  // 由於shippingCountries不是array，存取裡面的項目無法用.map
  // 改用Object.entries(shippingCountries)，是陣列(不同國家)中的陣列(國家簡稱，國家全名)
  // 將array中的array進行解構成code, name
  const countries = Object.entries(shippingCountries).map(([code, name]) => ({
    id: code,
    label: name,
  }));
  // 從{a1:b1, a2:b2, a3:b3 }先換成陣列[[a1,b1],[a2,b2],[a3,b3]] 再轉換成 [{id:a1, name:b1}, {id:a2, name:b2}, {id:a3, name:b3}]
  // 這樣轉換是為了方便進行map將每個項目進行遞迴
  console.log("countries", countries);
  // 一樣進行型態轉換
  const subdivisions = Object.entries(
    shippingSubdivisions
  ).map(([code, name]) => ({ id: code, label: name }));

  // 雖然shippingOptions內只有一個item，但還是用map塑造出新的物件
  const options = shippingOptions.map((option) => ({
    id: option.id, // 哪個果家的代稱
    label: `${option.description} - (${option.price.formatted_with_symbol})`, // 國家 - 此國家的運費
  }));
  console.log("new option", options);

  return (
    <>
      {/* 使用上看起來很難懂，但可以化繁為簡，並且替我們美化其格式，input輸入的狀態管理也幫我們處理好 */}
      <Typography variant="h6" gutterBottom>
        運送地址
      </Typography>
      <FormProvider {...methods}>
        {/* 這裡的method物件是由上面useForm產生的，data是所有FormInput fields中的屬性及值，我們要把這些表單的data傳送到Checkout物件 */}
        {/* 如何處理data要去到Checkout元件新增next函式傳送prop過來，並儲存data物件 */}
        {/* 這裡要另外用...spread operator把data展開，是因為data只有包含FormInput內的data，並不包含Select中的data */}
        <form
          onSubmit={methods.handleSubmit((data) =>
            next({
              ...data,
              shippingCountry,
              shippingSubdivision,
              shippingOption,
            })
          )}
        >
          {/* next()會將新的data物件，傳送回Checkout元件，透過setShippingData儲存狀態 */}
          <Grid container spacing={3}>
            <FormInput name="name" label="姓名" />
            <FormInput name="phone" label="手機電話" />
            <FormInput name="postal_code" label="郵政編碼" />
            <FormInput name="email" label="電子信箱" />
            <FormInput name="city" label="區鎮鄉" />
            <FormInput name="address" label="地址" />
            {/* 新增select */}
            <Grid item xs={12} sm={6}>
              <InputLabel>運送國家</InputLabel>
              {/* select單一國家，此時可以使用已經儲存好state的shippingCountry
              最後傳送改變onChange，透過e.target.value所選取的值，然後setState儲存 */}
              <Select
                value={shippingCountry}
                fullWidth
                onChange={(e) => setShippingCountry(e.target.value)}
              >
                {countries.map((country) => (
                  // 這裡的value必須是country的id比如'CA'，不能用label 'Canada'，不然無法透過shippingCountry來fetchShippingSubdivision
                  <MenuItem key={country.id} value={country.id}>
                    {country.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>州別縣市</InputLabel>
              <Select
                value={shippingSubdivision}
                fullWidth
                onChange={(e) => {
                  setShippingSubdivision(e.target.value);
                }}
              >
                {subdivisions.map((subdivision) => (
                  <MenuItem key={subdivision.id} value={subdivision.id}>
                    {subdivision.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>

            <Grid item xs={12} sm={6}>
              <InputLabel>國際運費</InputLabel>
              <Select
                value={shippingOption}
                fullWidth
                onChange={(e) => setShippingOption(e.target.value)}
              >
                {options.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </Grid>
          </Grid>
          <br />
          {/* jsx style寫法style={{ }} */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* 返回/cart的元件 */}
            <Button component={Link} to="/cart" variant="outlined">
              返回購物車
            </Button>
            {/* 不導向別的元件，直接提交出去 */}
            <Button type="submit" variant="contained" color="primary">
              下一步
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
};

export default AddressForm;
