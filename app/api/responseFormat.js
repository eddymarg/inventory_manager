import React from "react";
import { Typography } from "@mui/material";

export function formatRecommendations(response) {
    const lines = response.split("\n").filter(line => line.trim() !== "")

    return lines.map((line, index) => {
        if (/^\d+\./.test(line)) {
            return (
                <Typography 
                    key={index} 
                    variant="h6" 
                    component="h2"
                    style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                    {line}
                </Typography>
            )
        } else if (line.startsWith("Why it's a great fit:")) {
            return (
                <Typography 
                    key={index} 
                    variant="body1" 
                    component="span"
                    style={{ fontWeight: "bold", fontSize: "1rem"}}>
                    {line}
                </Typography>
            )
        } else {
            return (
                <Typography 
                    key={index} 
                    variant="body1" 
                    component="span"
                    style={{ fontSize: "1rem" }}>
                    {line}
                </Typography>
            );
        }
    })
}