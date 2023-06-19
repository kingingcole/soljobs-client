"use client";

import { Button, type ButtonProps } from "@mui/material";

const CustomButton = ({ variant, color, children, onClick, ...otherProps}: ButtonProps) => {
    return <Button onClick={onClick} variant={variant || 'contained'} color={color || 'primary'} {...otherProps}>{children}</Button>
}

export default CustomButton;