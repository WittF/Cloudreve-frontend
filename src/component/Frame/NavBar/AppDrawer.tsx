import { Box, Drawer, Popover, PopoverProps, Stack, useMediaQuery, useTheme } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks.ts";
import DrawerHeader from "./DrawerHeader.tsx";
import TreeNavigation from "../../FileManager/TreeView/TreeNavigation.tsx";
import PageNavigation, { AdminPageNavigation } from "./PageNavigation.tsx";
import StorageSummary from "./StorageSummary.tsx";
import { useContext, useRef } from "react";
import SessionManager from "../../../session";
import { PageVariant, PageVariantContext } from "../NavBarFrame.tsx";

const DrawerContent = () => {
  const scrollRef = useRef<any>();
  const user = SessionManager.currentLoginOrNull();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const pageVariant = useContext(PageVariantContext);
  const isDashboard = pageVariant === PageVariant.dashboard;
  return (
    <>
      <DrawerHeader />
      <Stack
        direction={"column"}
        spacing={2}
        ref={scrollRef}
        sx={{
          px: 1,
          pb: 1,
          flexGrow: 1,
          mx: 1,
          overflow: "auto",
        }}
      >
        {!isDashboard && (
          <>
            <TreeNavigation scrollRef={scrollRef} hideWithDrawer={!isMobile} />
            <PageNavigation />
            {user && <StorageSummary />}
          </>
        )}
        {isDashboard && <AdminPageNavigation />}
      </Stack>
    </>
  );
};

export const DrawerPopover = (props: PopoverProps) => {
  const dispatch = useAppDispatch();
  const open = useAppSelector((state) => state.globalState.drawerOpen);
  const drawerWidth = useAppSelector((state) => state.globalState.drawerWidth);
  return (
    <Popover {...props}>
      <Box sx={{ width: "70vw" }}>
        <DrawerContent />
      </Box>
    </Popover>
  );
};

const AppDrawer = () => {
  const open = useAppSelector((state) => state.globalState.drawerOpen);
  const mobileDrawerOpen = useAppSelector((state) => state.globalState.mobileDrawerOpen);
  const drawerWidth = useAppSelector((state) => state.globalState.drawerWidth);
  const dispatch = useAppDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isMediumScreen = useMediaQuery("(max-width: 730px) and (min-width: 600px)");
  const appBarBg = theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900];
  
  const effectiveDrawerWidth = isMediumScreen ? Math.min(drawerWidth, 160) : drawerWidth;

  return (
    <Drawer
      sx={{
        width: effectiveDrawerWidth,
        flexShrink: 0,
        display: "flex",
        // 添加宽度过渡动画，与项目中其他组件保持一致
        transition: (theme) => theme.transitions.create(["width"], {
          easing: theme.transitions.easing.easeInOut,
          duration: theme.transitions.duration.standard,
        }),
        "& .MuiDrawer-paper": {
          width: effectiveDrawerWidth,
          boxSizing: "border-box",
          backgroundColor: appBarBg,
          borderRight: "initial",
          // 为抽屉纸张组件也添加宽度过渡动画
          transition: (theme) => theme.transitions.create(["width"], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        },
      }}
      variant={isMobile ? "temporary" : "persistent"}
      anchor="left"
      open={isMobile ? mobileDrawerOpen : open}
      onClose={() => {
        dispatch({ type: "globalState/setMobileDrawerOpen", payload: false });
      }}
    >
      <DrawerContent />
    </Drawer>
  );
};

export default AppDrawer;
