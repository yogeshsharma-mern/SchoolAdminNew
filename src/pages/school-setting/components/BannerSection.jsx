import React from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';


export default function BannerSection({schoolData,handleChange,getImagePreview}) {
  return (
  <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  🖼️ Banner Images
                </Typography>

                <Button
                  variant="contained"
                  component="label"
                  sx={{ background: "var(--gradient-primary)", color: "black", mb: 2 }}
                >
                  Upload Banner
                  <input
                    hidden
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      const files = Array.from(e.target.files);
                      handleChange("banner", [
                        ...(schoolData.banner || []),
                        ...files, // can stay as File objects
                      ]);
                    }}
                  />
                </Button>

                <Box display="flex" flexWrap="wrap" gap={2} mt={2}>
                  {(schoolData.banner || []).map((img, idx) => {
                    const preview = getImagePreview(img);
                    return (
                      <Box
                        key={idx}
                        position="relative"
                        sx={{
                          width: 100,
                          height: 100,
                          borderRadius: 2,
                          overflow: "hidden",
                          boxShadow: 2,
                        }}
                      >
                        <img
                          src={preview}
                          alt={`Banner ${idx}`}
                          width="100%"
                          height="100%"
                          style={{ objectFit: "cover" }}
                        />
                        <Button
                          size="small"
                          color="error"
                          onClick={() => handleDeleteBanner(img, idx)}


                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            minWidth: 28,
                            height: 28,
                            borderRadius: "50%",
                            fontSize: 14,
                            background: "white",
                            "&:hover": { background: "#ffebee" },
                          }}
                        >
                          ✕
                        </Button>
                      </Box>
                    );
                  })}
                </Box>
              </CardContent>
            </Card>
  )
}
