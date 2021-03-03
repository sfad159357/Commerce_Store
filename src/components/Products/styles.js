import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
    toolbar: theme.mixins.toolbar,
    content: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.default, // 背景帶有淺灰色的效果
        padding: theme.spacing(3), // 總產品content的padding
    },
    root: {
        flexGrow: 1,
    }
}))