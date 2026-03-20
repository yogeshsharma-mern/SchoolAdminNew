import React from 'react';
import { Card, CardContent, Checkbox, FormControlLabel, Grid, TextField, Typography } from '@mui/material';
import Select from 'react-select';

export default function PeriodsSection({ schoolData, handleChange,runPeriodsValidation,getUsedMinutes,getSchoolTotalMinutes,getTimingStatus,getPossibleLunchTimes }) {
    return (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    📘 Periods
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="number"
                            label="Total Periods"
                            value={schoolData.periods.totalPeriods || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value === "" || (Number(value) >= 1 && Number(value) <= 10)) {
                                    handleChange("periods.totalPeriods", value);
                                }
                            }}
                            onBlur={runPeriodsValidation}
                            fullWidth
                        />


                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="number"
                            label="Period Duration (min)"
                            value={schoolData.periods.periodDuration || ""}
                            onChange={(e) => {
                                let value = e.target.value.replace(/\D/g, "");
                                if (value.length > 3) value = value.slice(0, 3);
                                handleChange("periods.periodDuration", value);
                            }}
                            onBlur={runPeriodsValidation}
                            fullWidth
                        />


                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            type="number"
                            label="Break Duration (min)"
                            value={schoolData.periods.breakDuration || ""}
                            onChange={(e) => {
                                const value = e.target.value;
                                if (Number(value) > 30) {
                                    toast.error("Break duration cannot exceed 30 minutes");
                                    return;
                                }
                                handleChange("periods.breakDuration", value);
                            }}
                            onBlur={runPeriodsValidation}
                            fullWidth
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={schoolData.periods.lunchBreak.isEnabled || false}
                                    onChange={(e) => {
                                        handleChange("periods.lunchBreak.isEnabled", e.target.checked);
                                        setTimeout(runPeriodsValidation, 0);
                                    }}
                                />

                            }
                            label="Enable Lunch Break"
                        />
                    </Grid>
                    {schoolData.periods.lunchBreak.isEnabled && (
                        <>
                            <Grid item xs={12} sm={6}>
                                <Select
                                    options={getPossibleLunchTimes(schoolData)}
                                    value={getPossibleLunchTimes(schoolData).find(
                                        o => o.value === schoolData.periods.lunchBreak.time
                                    )}
                                    onChange={(opt) =>
                                        handleChange("periods.lunchBreak.time", opt.value)
                                    }
                                    placeholder="Select Lunch Time"
                                    menuPortalTarget={document.body}
                                    styles={{
                                        menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                                    }}
                                />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    type="number"
                                    label="Lunch Duration (min)"
                                    value={schoolData.periods.lunchBreak.duration || ""}
                                    onChange={(e) =>
                                        handleChange("periods.lunchBreak.duration", e.target.value)
                                    }
                                    fullWidth
                                />
                            </Grid>
                        </>
                    )}
                </Grid>
                {(() => {
                    const used = getUsedMinutes(schoolData);
                    const school = getSchoolTotalMinutes(schoolData);
                    const status = getTimingStatus(schoolData);

                    if (!used || !school) return null;

                    return (
                        <Typography
                            variant="body2"
                            sx={{ color: status.color, fontWeight: 600, marginTop: 2 }}
                        >
                            Used: {used} min / School: {school} min — {status.msg}
                        </Typography>
                    );
                })()}
            </CardContent>




        </Card>
    )
}
