import { Card, CardContent, Grid, TextField } from '@mui/material';
import React from 'react'

export default function BasicInfo({schoolData,handleChange}) {
  return (
     <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
                 <CardContent>
                   <Grid container spacing={2} alignItems="center">
                     <Grid item xs={12} sm={6}>
                       {/* <TextField
                     label="School Name"
                     value={schoolData.schoolName || ""}
                     onChange={(e) => handleChange("schoolName", e.target.value)}
                     fullWidth
                   /> */}
                       <TextField
                         label="School Name"
                         value={schoolData.schoolName || ""}
                         onChange={(e) => {
                           const onlyLetters = e.target.value.replace(/[^a-zA-Z\s]/g, ""); // allow letters and spaces
                           handleChange("schoolName", onlyLetters);
                         }}
                         fullWidth
                       />
   
                     </Grid>
                     {/* <Grid item xs={12} sm={6}>
                     <Typography variant="subtitle1" gutterBottom>
                       Status
                     </Typography>
                     <ToggleButton
                       isActive={schoolData.status}
                       onToggle={() =>
                         handleChange(
                           "status",
                           schoolData.status === "active" ? "inactive" : "active"
                         )
                       }
                     />
                   </Grid> */}
                   </Grid>
                 </CardContent>
               </Card>
  )
}
