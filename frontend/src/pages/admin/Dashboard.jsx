import { useFetchData } from "6pp";
import {
  Group as GroupIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import {
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import React from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import { DoughnutChart, LineChart } from "../../components/specific/Charts";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import ChatSkeleton from "../../components/shared/ChatSkeleton";

const Dashboard = () => {
  const { loading, data, error } = useFetchData({ url: `${server}/api/v1/admin/stats`, key: "dashboard-stats", credentials: "include", dependencyProps: [] });

  const { stats } = data || {};

  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  const Appbar = (
    <header className="admin-section-header"><div><p className="eyebrow">OVERVIEW</p><h1>Workspace overview</h1></div><Typography color="text.secondary" sx={{ fontSize: 12 }}>{moment().format("dddd, D MMMM YYYY")}</Typography></header>
  );

  const Widgets = (
    <Stack
      direction={{
        xs: "column",
        sm: "row",
      }}
      spacing="2rem"
      justifyContent="space-between"
      alignItems={"stretch"}
      margin={"2rem 0"}
    >
      <Widget title={"Users"} value={stats?.usersCount} Icon={<PersonIcon />} />
      <Widget
        title={"Chats"}
        value={stats?.totalChatsCount}
        Icon={<GroupIcon />}
      />
      <Widget
        title={"Messages"}
        value={stats?.messagesCount}
        Icon={<MessageIcon />}
      />
    </Stack>
  );

  return (
    <AdminLayout>
      {loading ? (
        <ChatSkeleton/>
      ) : (
        <Container component={"section"}>
          {Appbar}

          <Stack
            direction={{
              xs: "column",
              lg: "row",
            }}
            flexWrap={"wrap"}
            justifyContent={"center"}
            alignItems={{
              xs: "center",
              lg: "stretch",
            }}
            sx={{ gap: "2rem", width: "100%", minWidth: 0 }}
          >
            <Paper
              elevation={3}
              sx={{
                padding: { xs: "1.25rem", md: "2rem" },
                borderRadius: "8px",
                width: "100%",
                maxWidth: "45rem",
                minWidth: 0,
              }}
            >
              <Typography margin={"0 0 1.5rem"} variant="h6">
                Message activity
              </Typography>

              <LineChart value={stats?.messagesChart || []} />
            </Paper>

            <Paper
              elevation={3}
              sx={{
                padding: "1rem ",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: { xs: "100%", sm: "50%" },
                position: "relative",
                maxWidth: "25rem",
                minWidth: 0,
              }}
            >
              <DoughnutChart
                labels={["Single Chats", "Group Chats"]}
                value={[
                  stats?.totalChatsCount - stats?.groupsCount || 0,
                  stats?.groupsCount || 0,
                ]}
              />

              <Stack
                position={"absolute"}
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={"0.5rem"}
                width={"100%"}
                height={"100%"}
              >
                <GroupIcon /> <Typography>Vs </Typography>
                <PersonIcon />
              </Stack>
            </Paper>
          </Stack>

          {Widgets}
        </Container>
      )}
    </AdminLayout>
  );
};

const Widget = ({ title, value, Icon }) => (
  <Paper
    elevation={3}
    sx={{
      padding: "2rem",
      borderRadius: "8px",
      width: "100%",
      flex: 1,
      minWidth: 0,
    }}
  >
    <Stack alignItems={"center"} spacing={"1rem"}>
      <Typography
        sx={{
          color: "text.primary",
          fontSize: 32,
          fontWeight: 700,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {value ?? 0}
      </Typography>
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        {Icon}
        <Typography>{title}</Typography>
      </Stack>
    </Stack>
  </Paper>
);

export default Dashboard;
