"use client";

import { Button } from "@mui/material";

interface CustomButtonProps {
    variant?: "text" | "outlined" | "contained";
    color?: "primary" | "inherit" | "secondary" | "success" | "error" | "info" | "warning";
    children: any;
    onClick?: () => void;
}

const CustomButton = ({ variant, color, children, onClick}: CustomButtonProps) => {
    return <Button onClick={onClick} variant={variant || 'contained'} color={color || 'primary'}>{children}</Button>
}

export default CustomButton;