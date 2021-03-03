import React from "react";
import { TextField, Grid } from "@material-ui/core";
import { useFormContext, Controller } from "react-hook-form";

const CustomTextField = ({ name, label }) => {
  const { control } = useFormContext();

  return (
    <Grid item xs={12} sm={6}>
      {/* Controller允許任何input types的格式 */}
      <Controller
        as={TextField} // 用什麼格式輸入
        defaultValue="" // 記得要field需要預設空白""字串，不然會被React警告uncontrolled元素變controlled
        control={control}
        fullWidth
        name={name}
        label={label}
        required // required 默認為true
      />
    </Grid>
  );
};

export default CustomTextField;
