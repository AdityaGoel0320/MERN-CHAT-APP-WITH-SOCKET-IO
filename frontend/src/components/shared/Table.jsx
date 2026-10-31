import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography } from "@mui/material";

const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container
      sx={{
        height: "100%",
        minHeight: 500,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          padding: { xs: "1rem", md: "1.5rem" },
          borderRadius: 0,
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            margin: "0 0 1.5rem",
            fontWeight: 700,
          }}
        >
          {heading}
        </Typography>
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{
            height: "80%",
          }}
          sx={{
            border: "none",
            ".table-header": {
              bgcolor: "var(--surface-soft)",
              color: "var(--ink)",
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
