import React from 'react';
import { Box, Button, Card, CardContent, Grid, IconButton, TextField, Typography } from '@mui/material';


export default function SocialLinks({ schoolData, handleSocialChange, getSocialLogoPreview, urlErrors, addSocial }) {
    return (
        <div className="overflow-auto">
            <div className="overflow-auto">
                <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            🌐 Social Media Links
                        </Typography>

                        {(schoolData.socialLinks || []).map((item, index) => {
                            const preview = getSocialLogoPreview(item.logo);

                            return (
                                <Box
                                    key={index}
                                    sx={{
                                        display: "grid",
                                        gridTemplateColumns: {
                                            xs: "1fr", // Mobile: single column
                                            sm: "1fr 1fr", // Tablet: 2 columns
                                            md: "160px 1fr 90px auto", // Desktop: 4 columns (original)
                                        },
                                        gap: { xs: 1.5, sm: 2 }, // Responsive gap
                                        alignItems: "center",
                                        mb: 2,
                                        p: { xs: 1.5, sm: 2 }, // Responsive padding
                                        border: "1px solid #e0e0e0",
                                        borderRadius: 2,
                                        backgroundColor: "#fafafa",
                                    }}
                                >
                                    {/* Platform Name */}
                                    <TextField
                                        label="Platform"
                                        placeholder="Facebook"
                                        value={item.platform}
                                        onChange={(e) =>
                                            handleSocialChange(index, "platform", e.target.value)
                                        }
                                        fullWidth
                                        sx={{
                                            gridColumn: {
                                                xs: "span 1", // Mobile: full width
                                                sm: "span 1", // Tablet: first column
                                                md: "span 1", // Desktop: first column
                                            }
                                        }}
                                    />

                                    {/* URL */}
                                    <TextField
                                        fullWidth
                                        label="Profile URL"
                                        placeholder="https://facebook.com/yourpage"
                                        value={item.url}
                                        onChange={(e) =>
                                            handleSocialChange(index, "url", e.target.value)
                                        }
                                        error={Boolean(urlErrors[index])}
                                        helperText={urlErrors[index]}
                                        sx={{
                                            gridColumn: {
                                                xs: "span 1", // Mobile: full width
                                                sm: "span 1", // Tablet: second column
                                                md: "span 1", // Desktop: second column
                                            }
                                        }}
                                    />

                                    {/* Logo Preview - Hidden on mobile, shown on tablet+ */}
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: "50%",
                                            border: "1px solid #ddd",
                                            display: { xs: "none", sm: "flex" }, // Hidden on mobile
                                            alignItems: "center",
                                            justifyContent: "center",
                                            overflow: "hidden",
                                            background: "#fff",
                                            justifySelf: { sm: "center", md: "auto" }, // Center on tablet
                                            gridColumn: {
                                                sm: "span 1", // Tablet: third column
                                                md: "span 1", // Desktop: third column
                                            }
                                        }}
                                    >
                                        {preview ? (
                                            <img
                                                src={preview}
                                                alt="Logo"
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.secondary">
                                                No Logo
                                            </Typography>
                                        )}
                                    </Box>

                                    {/* Actions - Hidden on mobile, shown on tablet+ */}
                                    <Box
                                        display="flex"
                                        gap={1}
                                        sx={{
                                            display: { xs: "none", sm: "flex" }, // Hidden on mobile
                                            gridColumn: {
                                                sm: "span 1", // Tablet: fourth column
                                                md: "span 1", // Desktop: fourth column
                                            },
                                            justifyContent: {
                                                sm: "flex-start", // Tablet+: align left
                                            }
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                            fullWidth={false}
                                        >
                                            {item.logo ? "Change" : "Upload"}
                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleSocialChange(index, "logo", e.target.files[0])
                                                }
                                            />
                                        </Button>

                                        <IconButton
                                            color="error"
                                            onClick={() => removeSocial(index)}
                                            sx={{
                                                ml: 1
                                            }}
                                        >
                                            ✕
                                        </IconButton>
                                    </Box>

                                    {/* Mobile View - Logo and Actions in a row (Only shown on mobile) */}
                                    <Box
                                        sx={{
                                            display: { xs: "flex", sm: "none" }, // Only show on mobile
                                            gridColumn: "span 1",
                                            gap: 2,
                                            alignItems: "center",
                                            mt: 1,
                                            pt: 1,
                                            borderTop: "1px solid #e0e0e0",
                                        }}
                                    >
                                        {/* Mobile Logo Preview */}
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: "50%",
                                                border: "1px solid #ddd",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                overflow: "hidden",
                                                background: "#fff",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {preview ? (
                                                <img
                                                    src={preview}
                                                    alt="Logo"
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                    }}
                                                />
                                            ) : (
                                                <Typography variant="caption" color="text.secondary" fontSize="0.6rem">
                                                    No Logo
                                                </Typography>
                                            )}
                                        </Box>

                                        {/* Mobile Upload Button */}
                                        <Button
                                            variant="outlined"
                                            component="label"
                                            size="small"
                                            sx={{ flex: 1 }}
                                        >
                                            {item.logo ? "Change Logo" : "Upload Logo"}
                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) =>
                                                    handleSocialChange(index, "logo", e.target.files[0])
                                                }
                                            />
                                        </Button>

                                        <IconButton
                                            color="error"
                                            onClick={() => removeSocial(index)}
                                            size="small"
                                        >
                                            ✕
                                        </IconButton>
                                    </Box>
                                </Box>
                            );
                        })}

                        <Button variant="outlined" onClick={addSocial} sx={{ mt: 2 }}>
                            ➕ Add Social Link
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
