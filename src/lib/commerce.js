import Commerce from '@chec/commerce.js'

// 參數是我們自己的api key，這樣就可以不用再輸入api key得到授權，可以直接使用後端endpoint
export const commerce = new Commerce(process.env.REACT_APP_CHEC_PUBLIC_KEY)