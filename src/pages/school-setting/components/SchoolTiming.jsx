import React from 'react';
import { Card, CardContent, Grid, TextField, Typography } from '@mui/material';

export default function SchoolTiming({schoolData,handleChange}) {
  return (
  <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⏰ School Timing
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="time"
                      label="Start Time"
                      value={schoolData.schoolTiming.startTime}
                      onChange={(e) => {
                        const newStart = e.target.value;
                        const end = schoolData.schoolTiming.endTime;
                        if (end && !validateSchoolTiming(newStart, end)) return;
                        handleChange("schoolTiming.startTime", newStart);
                      }}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />

                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      type="time"
                      label="End Time"
                      value={schoolData.schoolTiming.endTime}
                      onChange={(e) => {
                        const newEnd = e.target.value;
                        const start = schoolData.schoolTiming.startTime;
                        if (start && !validateSchoolTiming(start, newEnd)) return;
                        handleChange("schoolTiming.endTime", newEnd);
                      }}
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                    />

                  </Grid>
                </Grid>
              </CardContent>
            </Card>

  )
}
