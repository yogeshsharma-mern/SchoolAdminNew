import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';
import React from 'react';
import Select from "react-select";
const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    // minHeight: "56px",
    height: "56px",
    borderColor: state.isFocused ? "#1976d2" : "#e5e7eb",
    boxShadow: state.isFocused
      ? "0 0 0 2px rgba(25, 118, 210, 0.2)"
      : "none",
    "&:hover": { borderColor: "#1976d2" },
    borderRadius: "8px",
    fontSize: "0.95rem",
    backgroundColor: state.isDisabled ? "#f9fafb" : "white",
    cursor: state.isDisabled ? "not-allowed" : "pointer",
  }),

  valueContainer: (provided) => ({
    ...provided,
    height: "56px",
    padding: "0 12px",
  }),

  input: (provided) => ({
    ...provided,
    margin: "0",
    padding: "0",
  }),

  indicatorsContainer: (provided) => ({
    ...provided,
    height: "56px",
  }),

  placeholder: (provided) => ({
    ...provided,
    color: "#9ca3af",
  }),

  menuPortal: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),

  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
    borderRadius: "8px",
  }),

  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#1976d2"
      : state.isFocused
        ? "#e8f0fe"
        : "white",
    color: state.isSelected ? "white" : "#1f2937",
    cursor: "pointer",
  }),
};
export default function AddressSection({schoolData,handleChange,countryOptions,stateOptions,cityOptions}) {
    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📍 Address
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Street"
                            value={schoolData.address.street || ""}
                            onChange={(e) => {
                                // allow letters, numbers, and spaces only
                                const cleanValue = e.target.value.replace(/[^a-zA-Z0-9\s]/g, "");
                                handleChange("address.street", cleanValue);
                            }}
                            fullWidth
                        />

                    </Grid>
                 
                    <Grid item xs={12} sm={6}>
                        <Select
                            options={countryOptions}
                            styles={customSelectStyles}
                            value={
                                countryOptions.find(c => c.value === schoolData.address.country) || null
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            onChange={(selected) =>
                                handleChange("address.country", selected?.value || "")
                            }
                            placeholder="Select Country"
                            isClearable
                        />

                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            options={stateOptions}
                            styles={customSelectStyles}
                            menuPortalTarget={document.body}
                            menuPosition="fixed"

                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999, height: "23px" }) }}
                            value={
                                stateOptions.find(s => s.value === schoolData.address.state) || null
                            }
                            onChange={(selected) =>
                                handleChange("address.state", selected?.value || "")
                            }
                            placeholder={
                                schoolData.address.country ? "Select State" : "Select Country First"
                            }
                            isDisabled={!schoolData.address.country}
                            isClearable
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Select
                            options={cityOptions}
                            styles={customSelectStyles}
                            value={
                                cityOptions.find(c => c.value === schoolData.address.city) || null
                            }
                            menuPortalTarget={document.body}
                            menuPosition="fixed"
                            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                            onChange={(selected) =>
                                handleChange("address.city", selected?.value || "")
                            }
                            placeholder={
                                schoolData.address.state ? "Select City" : "Select State First"
                            }
                            isDisabled={!schoolData.address.state}
                            isClearable
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="ZIP"
                            value={schoolData.address.zip || ""}
                            onChange={(e) => {
                                // Allow only numbers and limit to 6 digits
                                const onlyDigits = e.target.value.replace(/\D/g, "").slice(0, 6);
                                handleChange("address.zip", onlyDigits);
                            }}
                            fullWidth
                        />

                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}
