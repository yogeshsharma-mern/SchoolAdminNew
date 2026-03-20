import React from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';


export default function FAQSection({schoolData,handleChange}) {
    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ❓ Frequently Asked Questions
                </Typography>

                {(schoolData.faqs || []).map((faq, index) => (
                  <Box
                    key={index}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 2,
                      p: 4,
                      mb: 2,
                      background: "#fafafa",
                      position: "relative",

                    }}
                  >
                    {/* ❌ Remove Button */}
                    <Button
                      size="small"
                      color="error"
                      onClick={() =>
                        handleChange(
                          "faqs",
                          schoolData.faqs.filter((_, i) => i !== index)
                        )
                      }
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        minWidth: "30px",
                        height: "30px",
                        borderRadius: "50%",
                        fontSize: "16px",
                        lineHeight: "1",
                        fontWeight: "bold",
                      }}
                    >
                      ✕
                    </Button>

                    <TextField
                      fullWidth
                      label={`Question ${index + 1}`}
                      value={faq.question}
                      onChange={(e) =>
                        handleChange(`faqs.${index}.question`, e.target.value)
                      }
                      sx={{ mb: 1 }}
                    />

                    <TextField
                      fullWidth
                      label={`Answer ${index + 1}`}
                      value={faq.answer}
                      onChange={(e) =>
                        handleChange(`faqs.${index}.answer`, e.target.value)
                      }
                      multiline
                      minRows={2}
                    />
                  </Box>
                ))}

                {/* ➕ Add FAQ button */}
                <Button
                  variant="outlined"
                  onClick={() =>
                    handleChange("faqs", [
                      ...(schoolData.faqs || []),
                      { question: "", answer: "" },
                    ])
                  }
                >
                  ➕ Add FAQ
                </Button>
              </CardContent>
            </Card>
    )
}
