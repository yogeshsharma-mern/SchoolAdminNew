import React from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';


export default function TollFree({schoolData,handleChange}) {
    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    ☎️ Toll-Free Number
                </Typography>
                <TextField
                    fullWidth
                    label="Toll-Free Number"
                    value={schoolData.tollFree || ""}
                    onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ""); // only digits allowed

                        if (value.length > 11) {
                            toast.error("Toll-free number must be 11 digits only");
                            value = value.slice(0, 11); // limit to 11 digits
                        }

                        handleChange("tollFree", value);
                    }}
                    inputProps={{ maxLength: 11 }}
                />
            </CardContent>
        </Card>

    )
}
