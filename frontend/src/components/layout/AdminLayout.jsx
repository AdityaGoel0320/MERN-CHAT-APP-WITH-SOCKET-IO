import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Button,
  Drawer,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";
import ThemeToggle from "../shared/ThemeToggle";
import { MessageCircle } from "lucide-react";

const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 6px;
  padding: 12px 16px;
  color: var(--muted);
  &:hover {
    color: var(--ink);
    background: var(--surface-soft);
  }
`;

const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <Stack width={w} direction={"column"} p={2} spacing={3}>
      <Typography variant="overline" color="text.secondary" sx={{ pl: 2 }}>
        Administration
      </Typography>

      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: "var(--accent-soft)",
                color: "var(--accent)",
                ":hover": { color: "var(--accent)" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}

              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        <Button
          onClick={logoutHandler}
          sx={{
            justifyContent: "flex-start",
            p: "12px 16px",
            color: "error.main",
          }}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />

            <Typography>Logout</Typography>
          </Stack>
        </Button>
      </Stack>
    </Stack>
  );
};

const AdminLayout = ({ children }) => {
  const { isAdmin } = useSelector((state) => state.auth);

  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);

  const handleClose = () => setIsMobile(false);

  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <div className="app-shell">
      <header className="app-header">
        <LinkComponent to="/" className="brand">
          <span className="brand-mark">
            <MessageCircle size={22} />
          </span>
          ChatBuddy
        </LinkComponent>
        <div className="header-actions">
          <ThemeToggle />
          <IconButton
            aria-label="Open admin navigation"
            onClick={handleMobile}
            sx={{ display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </div>
      </header>
      <div className="admin-workspace">
        <aside className="admin-sidebar">
          <Sidebar />
        </aside>
        <main className="admin-main">{children}</main>

        <Drawer
          open={isMobile}
          onClose={handleClose}
          PaperProps={{ sx: { width: "min(300px, 88vw)" } }}
        >
          <IconButton
            aria-label="Close admin navigation"
            onClick={handleClose}
            sx={{ alignSelf: "flex-end", m: 1 }}
          >
            <CloseIcon />
          </IconButton>
          <Sidebar />
        </Drawer>
      </div>
    </div>
  );
};

export default AdminLayout;
