"use client";

import { Button, type ButtonProps } from "@mui/material";

const CustomButton = ({ variant, color, children, onClick}: ButtonProps) => {
    return <Button onClick={onClick} variant={variant || 'contained'} color={color || 'primary'}>{children}</Button>
}

export default CustomButton;