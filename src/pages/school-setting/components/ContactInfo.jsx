import { Card, CardContent, Typography, Grid, TextField } from "@mui/material";
import PhoneInput from "react-phone-input-2";

export default function ContactInfo({ schoolData, handleChange }) {
  return (
    <Card sx={{ mb: 3, borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          📞 Contact Info
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <PhoneInput
              country={"in"}
              value={schoolData.contact.phone || ""}
              onChange={(phone) => handleChange("contact.phone", phone)}
              inputStyle={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Email"
              value={schoolData.contact.email || ""}
              onChange={(e) =>
                handleChange("contact.email", e.target.value)
              }
              fullWidth
            />
          </Grid>

          <Grid item xs={12} sm={4}>
            <TextField
              label="Website"
              value={schoolData.contact.website || ""}
              onChange={(e) =>
                handleChange("contact.website", e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}