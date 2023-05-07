"use client";

import { Button } from "@material-ui/core";

interface CustomButtonProps {
    variant?: "text" | "outlined" | "contained";
    color?: "inherit" | "primary" | "secondary" | "default";
    children: any;
    onClick?: () => void;
}

const CustomButton = ({ variant, color, children, onClick}: CustomButtonProps) => {
    return <Button onClick={onClick} variant={variant || 'contained'} color={color || 'primary'}>{children}</Button>
}

export default CustomButton;