import React from 'react';
import { Box, Button, Card, CardContent, Grid, TextField, Typography } from '@mui/material';
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


export default function AcademicSession({schoolData,setSchoolData,academicYearOptions}) {
  console.log("academicYearOptrions",academicYearOptions);
    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    🎓 Academic Session
                </Typography>
                <Grid container spacing={2}>
                    <Select
                        options={academicYearOptions}
                        styles={customSelectStyles}
                        placeholder="Select Academic Year"
                        menuPortalTarget={document.body}     // ✅ CRITICAL FIX
                        menuPosition="fixed"                 // ✅ prevents clipping
                        value={academicYearOptions?.find(opt => {


                            return opt?.value?.academicSession === schoolData?.academicSession?.currentSession
                        })}
                        onChange={(selected) => {
                            const session = selected.value;


                            const formattedStart = formatDateForInput(session.startDate);
                            const formattedEnd = formatDateForInput(session.endDate);

                            setSchoolData(prev => ({
                                ...prev,
                                academicSession: {
                                    startDate: formattedStart,
                                    endDate: formattedEnd,
                                    currentSession: `${session?.academicSession}`, // ✅ FIXED
                                }
                            }));
                        }}
                    />


                </Grid>
            </CardContent>
        </Card>
    )
}
