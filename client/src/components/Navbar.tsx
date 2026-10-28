import { MouseEvent, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useScrollTrigger,
} from "@mui/material";
import MenuRounded from "@mui/icons-material/MenuRounded";
import CloseRounded from "@mui/icons-material/CloseRounded";
import AdminPanelSettingsRounded from "@mui/icons-material/AdminPanelSettingsRounded";
import { NAV_LINKS, NavLink } from "../data";
import type { OpenForm } from "../types";
import { C } from "../brand";
import ThemeToggle from "./ThemeToggle";

// Red button with white text that opens the admin dashboard (/#/admin).
const adminBtnSx = {
  whiteSpace: "nowrap",
  color: "#FFFFFF",
  bgcolor: "#E4202D",
  fontWeight: 700,
  boxShadow: "0 10px 26px -10px rgba(228,32,45,.75)",
  "&:hover": { bgcolor: "#C41823", color: "#FFFFFF", boxShadow: "0 12px 30px -10px rgba(228,32,45,.9)" },
} as const;

export default function Navbar({ openForm, route }: { openForm: OpenForm; route: string }) {
  const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  // Highlight the link of the section currently in view.
  useEffect(() => {
    const ids = NAV_LINKS.map((l) => l.href.slice(1));
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [route]);

  // Links that open a form should not just jump to the anchor.
  const go = (l: NavLink) => (e: MouseEvent) => {
    setOpen(false);
    if (l.form) {
      e.preventDefault();
      openForm(l.form);
    }
  };

  const quote = () => {
    setOpen(false);
    openForm("enquiry", { topic: "Pricing / Quote" });
  };

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <AppBar
        position="fixed"
        elevation={0}
        color="transparent"
        sx={{
          py: scrolled ? 0.5 : 1.5,
          bgcolor: scrolled ? "var(--hb-nav-bg)" : "transparent",
          backdropFilter: scrolled ? "blur(16px)" : "none",
          borderBottom: `1px solid ${scrolled ? C.line : "transparent"}`,
          backgroundImage: "none",
          transition: "all .3s ease",
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: "space-between", gap: 2 }}>
            <Box component="a" href="#home" aria-label="Hirebridge Hub360 home" sx={{ display: "flex", alignItems: "center", gap: 1.4, color: "inherit", textDecoration: "none" }}>
              <Box
                component="img"
                src="/emblem.png"
                alt=""
                sx={{ width: 44, height: 44, objectFit: "contain", filter: "drop-shadow(0 4px 14px rgba(255,200,30,.35))" }}
              />
              <Box>
                <Typography variant="h6" component="span" sx={{ display: "block", whiteSpace: "nowrap", fontSize: { xs: "1.02rem", sm: "1.1rem" }, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
                  Hirebridge{" "}
                  <Box component="b" sx={{ color: "primary.dark" }}>
                    Hub360°
                  </Box>
                </Typography>
                <Typography
                  component="span"
                  sx={{ display: { xs: "none", xl: "block" }, whiteSpace: "nowrap", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "text.secondary", mt: 0.4 }}
                >
                  Bridging Hires, Building Brands
                </Typography>
              </Box>
            </Box>

            <Box component="nav" aria-label="Main" sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5 }}>
              {NAV_LINKS.map((l) => {
                const isActive = l.form ? route === l.form : route === "home" && active === l.href.slice(1);
                return (
                  <Button
                    key={l.label}
                    href={l.href}
                    onClick={go(l)}
                    color="inherit"
                    sx={{
                      position: "relative",
                      px: 0.9,
                      py: 1,
                      whiteSpace: "nowrap",
                      fontSize: "0.88rem",
                      color: isActive ? "primary.dark" : "var(--hb-nav)",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        left: 10,
                        right: 10,
                        bottom: 4,
                        height: 2,
                        borderRadius: "2px",
                        bgcolor: "primary.main",
                        transform: isActive ? "scaleX(1)" : "scaleX(0)",
                        transformOrigin: "left",
                        transition: "transform .3s ease",
                      },
                      "&:hover": { bgcolor: "transparent", color: "#000" },
                      "&:hover::after": { transform: "scaleX(1)" },
                    }}
                  >
                    {l.label}
                  </Button>
                );
              })}
              <Box sx={{ ml: 1 }}><ThemeToggle /></Box>
              <Button variant="contained" size="small" onClick={quote} sx={{ ml: 1, whiteSpace: "nowrap", boxShadow: "0 10px 26px -10px rgba(255,200,30,.7)" }}>
                Get a Free Quote
              </Button>
              <Button
                variant="contained"
                size="small"
                href="#/admin"
                onClick={() => setOpen(false)}
                startIcon={<AdminPanelSettingsRounded />}
                sx={{ ml: 1, ...adminBtnSx }}
              >
                Admin
              </Button>
            </Box>

            <Box sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center", gap: 1 }}>
              <ThemeToggle />
              <Button variant="contained" size="small" href="#/admin" startIcon={<AdminPanelSettingsRounded />} sx={{ ...adminBtnSx, px: 1.4, minWidth: 0 }}>
                Admin
              </Button>
            <IconButton
              aria-label="Open menu"
              onClick={() => setOpen(true)}
              sx={{ display: { xs: "inline-flex", lg: "none" }, border: `1px solid ${C.line}`, bgcolor: "rgba(var(--hb-ink),0.05)", borderRadius: "12px" }}
            >
              <MenuRounded />
            </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ sx: { width: "min(86vw, 340px)", bgcolor: "background.paper", backgroundImage: "none", p: 2.5 } }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box component="img" src="/emblem.png" alt="" sx={{ width: 40 }} />
          <IconButton aria-label="Close menu" onClick={() => setOpen(false)}>
            <CloseRounded />
          </IconButton>
        </Box>
        <Divider />
        <List sx={{ py: 1 }}>
          {NAV_LINKS.map((l) => (
            <ListItemButton key={l.label} component="a" href={l.href} onClick={go(l)} sx={{ borderRadius: "12px", py: 1.6 }}>
              <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          ))}
        </List>
        <Button variant="contained" fullWidth onClick={quote} sx={{ mt: 1 }}>
          Get a Free Quote
        </Button>
        <Button variant="contained" fullWidth href="#/admin" onClick={() => setOpen(false)} startIcon={<AdminPanelSettingsRounded />} sx={{ mt: 1.5, ...adminBtnSx }}>
          Admin
        </Button>
      </Drawer>
    </motion.div>
  );
}






































// import { MouseEvent, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import {
//   AppBar,
//   Box,
//   Button,
//   Container,
//   Divider,
//   Drawer,
//   IconButton,
//   List,
//   ListItemButton,
//   ListItemText,
//   Toolbar,
//   Typography,
//   useScrollTrigger,
// } from "@mui/material";
// import MenuRounded from "@mui/icons-material/MenuRounded";
// import CloseRounded from "@mui/icons-material/CloseRounded";
// import { NAV_LINKS, NavLink } from "../data";
// import type { OpenForm } from "../types";
// import { C } from "../brand";
// import ThemeToggle from "./ThemeToggle";

// export default function Navbar({ openForm, route }: { openForm: OpenForm; route: string }) {
//   const scrolled = useScrollTrigger({ disableHysteresis: true, threshold: 24 });
//   const [open, setOpen] = useState(false);
//   const [active, setActive] = useState("home");

//   // Highlight the link of the section currently in view.
//   useEffect(() => {
//     const ids = NAV_LINKS.map((l) => l.href.slice(1));
//     const obs = new IntersectionObserver(
//       (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
//       { rootMargin: "-45% 0px -50% 0px" }
//     );
//     ids.forEach((id) => {
//       const el = document.getElementById(id);
//       if (el) obs.observe(el);
//     });
//     return () => obs.disconnect();
//   }, [route]);

//   // Links that open a form should not just jump to the anchor.
//   const go = (l: NavLink) => (e: MouseEvent) => {
//     setOpen(false);
//     if (l.form) {
//       e.preventDefault();
//       openForm(l.form);
//     }
//   };

//   const quote = () => {
//     setOpen(false);
//     openForm("enquiry", { topic: "Pricing / Quote" });
//   };

//   return (
//     <motion.div
//       initial={{ y: -80, opacity: 0 }}
//       animate={{ y: 0, opacity: 1 }}
//       transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
//     >
//       <AppBar
//         position="fixed"
//         elevation={0}
//         color="transparent"
//         sx={{
//           py: scrolled ? 0.5 : 1.5,
//           bgcolor: scrolled ? "var(--hb-nav-bg)" : "transparent",
//           backdropFilter: scrolled ? "blur(16px)" : "none",
//           borderBottom: `1px solid ${scrolled ? C.line : "transparent"}`,
//           backgroundImage: "none",
//           transition: "all .3s ease",
//         }}
//       >
//         <Container maxWidth="lg">
//           <Toolbar disableGutters sx={{ justifyContent: "space-between", gap: 2 }}>
//             <Box component="a" href="#home" aria-label="Hirebridge Hub360 home" sx={{ display: "flex", alignItems: "center", gap: 1.4, color: "inherit", textDecoration: "none" }}>
//               <Box
//                 component="img"
//                 src="/emblem.png"
//                 alt=""
//                 sx={{ width: 44, height: 44, objectFit: "contain", filter: "drop-shadow(0 4px 14px rgba(255,200,30,.35))" }}
//               />
//               <Box>
//                 <Typography variant="h6" component="span" sx={{ display: "block", whiteSpace: "nowrap", fontSize: { xs: "1.02rem", sm: "1.1rem" }, lineHeight: 1.05, letterSpacing: "-0.01em" }}>
//                   Hirebridge{" "}
//                   <Box component="b" sx={{ color: "primary.dark" }}>
//                     Hub360°
//                   </Box>
//                 </Typography>
//                 <Typography
//                   component="span"
//                   sx={{ display: { xs: "none", xl: "block" }, whiteSpace: "nowrap", fontSize: "0.62rem", fontWeight: 600, letterSpacing: "0.13em", textTransform: "uppercase", color: "text.secondary", mt: 0.4 }}
//                 >
//                   Bridging Hires, Building Brands
//                 </Typography>
//               </Box>
//             </Box>

//             <Box component="nav" aria-label="Main" sx={{ display: { xs: "none", lg: "flex" }, alignItems: "center", gap: 0.5 }}>
//               {NAV_LINKS.map((l) => {
//                 const isActive = l.form ? route === l.form : route === "home" && active === l.href.slice(1);
//                 return (
//                   <Button
//                     key={l.label}
//                     href={l.href}
//                     onClick={go(l)}
//                     color="inherit"
//                     sx={{
//                       position: "relative",
//                       px: 0.9,
//                       py: 1,
//                       whiteSpace: "nowrap",
//                       fontSize: "0.88rem",
//                       color: isActive ? "primary.dark" : "var(--hb-nav)",
//                       "&::after": {
//                         content: '""',
//                         position: "absolute",
//                         left: 10,
//                         right: 10,
//                         bottom: 4,
//                         height: 2,
//                         borderRadius: "2px",
//                         bgcolor: "primary.main",
//                         transform: isActive ? "scaleX(1)" : "scaleX(0)",
//                         transformOrigin: "left",
//                         transition: "transform .3s ease",
//                       },
//                       "&:hover": { bgcolor: "transparent", color: "#000" },
//                       "&:hover::after": { transform: "scaleX(1)" },
//                     }}
//                   >
//                     {l.label}
//                   </Button>
//                 );
//               })}
//               <Box sx={{ ml: 1 }}><ThemeToggle /></Box>
//               <Button variant="contained" size="small" onClick={quote} sx={{ ml: 1, whiteSpace: "nowrap", boxShadow: "0 10px 26px -10px rgba(255,200,30,.7)" }}>
//                 Get a Free Quote
//               </Button>
//             </Box>

//             <Box sx={{ display: { xs: "flex", lg: "none" }, alignItems: "center", gap: 1 }}>
//               <ThemeToggle />
//             <IconButton
//               aria-label="Open menu"
//               onClick={() => setOpen(true)}
//               sx={{ display: { xs: "inline-flex", lg: "none" }, border: `1px solid ${C.line}`, bgcolor: "rgba(var(--hb-ink),0.05)", borderRadius: "12px" }}
//             >
//               <MenuRounded />
//             </IconButton>
//             </Box>
//           </Toolbar>
//         </Container>
//       </AppBar>

//       <Drawer
//         anchor="right"
//         open={open}
//         onClose={() => setOpen(false)}
//         PaperProps={{ sx: { width: "min(86vw, 340px)", bgcolor: "background.paper", backgroundImage: "none", p: 2.5 } }}
//       >
//         <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//           <Box component="img" src="/emblem.png" alt="" sx={{ width: 40 }} />
//           <IconButton aria-label="Close menu" onClick={() => setOpen(false)}>
//             <CloseRounded />
//           </IconButton>
//         </Box>
//         <Divider />
//         <List sx={{ py: 1 }}>
//           {NAV_LINKS.map((l) => (
//             <ListItemButton key={l.label} component="a" href={l.href} onClick={go(l)} sx={{ borderRadius: "12px", py: 1.6 }}>
//               <ListItemText primary={l.label} primaryTypographyProps={{ fontWeight: 700 }} />
//             </ListItemButton>
//           ))}
//         </List>
//         <Button variant="contained" fullWidth onClick={quote} sx={{ mt: 1 }}>
//           Get a Free Quote
//         </Button>
//       </Drawer>
//     </motion.div>
//   );
// }