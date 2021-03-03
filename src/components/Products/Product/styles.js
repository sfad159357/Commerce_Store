// 每個元件都有自己獨立的css，
import { makeStyles } from '@material-ui/core/styles';

// 導出函式，參數是一個callback Fn，立即回傳物件
// css寫在js裡頭，和原本的css不太一樣。ex:max-width: 100% => maxWidth: '100%'
export default makeStyles(() => ({
    root: {
        maxWidth: '100%',
    },
    media: {
        height: 0,
        paddingTop: '56.25%', // 16:9
    },
    cardActions: {
        display: 'flex',
        justifyContent: "flex-end",
    },
    cardContent: {
        display: 'flex',
        justifyContent: 'space-between',
    }

}))