import { RadiusFrame } from "../../Frame/RadiusFrame.tsx";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks.ts";
import { Box, Collapse, useMediaQuery, useTheme } from "@mui/material";
import SidebarContent from "./SidebarContent.tsx";
import { useCallback, useEffect, useState } from "react";
import { FileResponse } from "../../../api/explorer.ts";
import { getFileInfo } from "../../../api/api.ts";

export interface SideBarProps {
  inPhotoViewer?: boolean;
}

const Sidebar = ({ inPhotoViewer }: SideBarProps) => {
  const dispatch = useAppDispatch();
  const theme = useTheme();
  // 添加中等屏幕尺寸检测，与其他组件保持一致
  const isMediumScreen = useMediaQuery("(max-width: 730px) and (min-width: 600px)");
  const sidebarOpen = useAppSelector((state) => state.globalState.sidebarOpen);
  const sidebarTarget = useAppSelector((state) => state.globalState.sidebarTarget);
  // null: not valid, undefined: not loaded, FileResponse: loaded
  const [target, setTarget] = useState<FileResponse | undefined | null>(undefined);
  
  // 在中等屏幕尺寸时使用更小的侧边栏宽度，进一步压缩为主内容留出更多空间
  const sidebarWidth = isMediumScreen ? "200px" : "300px";

  const loadExtendedInfo = useCallback(
    (path: string) => {
      dispatch(
        getFileInfo({
          uri: path,
          extended: true,
        }),
      ).then((res) => {
        setTarget(res);
      });
    },
    [target, dispatch, setTarget],
  );

  useEffect(() => {
    if (sidebarTarget && sidebarOpen) {
      if (typeof sidebarTarget === "string") {
      } else {
        setTarget(sidebarTarget);
        loadExtendedInfo(sidebarTarget.path);
      }
    } else {
      setTarget(null);
    }
  }, [sidebarTarget, setTarget]);

  return (
    <Box
      sx={
        inPhotoViewer
          ? {
              position: "absolute",
              height: "100%",
              right: 0,
              top: 0,
            }
          : {}
      }
    >
      <Collapse
        in={sidebarOpen}
        sx={{ height: "100%" }}
        orientation={"horizontal"}
        unmountOnExit
        timeout={inPhotoViewer ? 0 : "auto"}
      >
        <RadiusFrame
          sx={{
            width: sidebarWidth,
            height: "100%",
            ml: 1,
            borderRadius: (theme) => (inPhotoViewer ? 0 : theme.shape.borderRadius / 8),
            // 添加宽度过渡动画，与项目中其他组件保持一致
            transition: (theme) => theme.transitions.create(["width"], {
              easing: theme.transitions.easing.easeInOut,
              duration: theme.transitions.duration.standard,
            }),
          }}
          withBorder={!inPhotoViewer}
        >
          <SidebarContent inPhotoViewer={inPhotoViewer} target={target} />
        </RadiusFrame>
      </Collapse>
    </Box>
  );
};

export default Sidebar;
