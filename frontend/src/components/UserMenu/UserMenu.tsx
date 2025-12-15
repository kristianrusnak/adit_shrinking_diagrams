import { useState } from "react";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useAuth } from "@/context/AuthProvider";
import { useSelector } from "react-redux";
import { selectAccessToken } from "@/store/slices/authSlice";

export default function UserMenu() {
  const { userInfo, logout } = useAuth();
  const accessToken = useSelector(selectAccessToken);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isAuthenticated = Boolean(accessToken && userInfo);

  const email = isAuthenticated && userInfo?.email ? userInfo.email : "Unknown";

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleClose();
    if (isAuthenticated) {
      await logout();
      window.location.reload();
    }
  };

  return (
    <>
      <IconButton onClick={handleOpen} size="small">
        <Avatar sx={{ width: 45, height: 45 }}>
          {email[0].toUpperCase()}
        </Avatar>
      </IconButton>

      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <MenuItem disabled>
          <Typography fontSize={14}>
            {isAuthenticated ? email : "Unknown user"}
          </Typography>
        </MenuItem>

        {isAuthenticated && (
          <MenuItem onClick={handleLogout}>
            Logout
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
