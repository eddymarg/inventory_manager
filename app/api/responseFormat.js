import React from "react";
import { Typography } from "@mui/material";

export function formatRecommendations(response) {
    const lines = response.split("\n").filter(line => line.trim() !== "")

    return lines.map((line, index) => {
        if (/^\d+\./.test(line)) {
            return (
                <Typography 
                    key={index} 
                    variant="body1" 
                    component="span"
                    style={{ 
                        display: "block", 
                        fontWeight: "bold", 
                        fontSize: "1.25rem",
                        fontFamily: "'Roboto',sans-serif",
                        marginTop: "1rem" }}>
                    {line}
                </Typography>
            )
        } else {
            return (
                <Typography 
                    key={index} 
                    variant="body1" 
                    component="span"
                    style={{ 
                        fontSize: "1rem",
                        fontFamily: "'Roboto',sans-serif", 
                    }}>
                    {line}
                </Typography>
            );
        }
    })
}