import React from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';


export default function SchoolLogo({schoolData,handleChange,logoPreview,setLogoPreview}) {
  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🏫 School Logo
                </Typography>
                <Button style={{ background: "var(--gradient-primary)", color: "black" }} component="label">
                  Upload Logo
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        handleChange("schoolLogo", file);
                        setLogoPreview(URL.createObjectURL(file));
                      }
                    }}
                  />
                </Button>
                {logoPreview && (
                  <Box mt={2}>
                    <img
                      src={logoPreview}
                      alt="Preview"
                      style={{ width: 120, height: 120, borderRadius: 12 }}
                    />
                  </Box>
                )}
              </CardContent>
            </Card>
  )
}
