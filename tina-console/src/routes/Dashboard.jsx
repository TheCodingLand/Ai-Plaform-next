import Dashboard from "@material-ui/icons/Dashboard";
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Documentation from "views/Documentation/Documentation.jsx";
import TrainingPage from "views/Training/TrainingPage.jsx";
import SettingsPage from "views/Settings/Settings.jsx";
import UploadPage from "views/Upload/Upload.jsx";
import Diagnostics from "views/Diagnostics/Diagnostics.jsx";
import Monitoring from "views/Monitoring/Monitoring.jsx";
import Play from "@material-ui/icons/PlayArrow";


import MonitorIcon from "@material-ui/icons/MovieCreationTwoTone";
import Upload from "@material-ui/icons/CloudUpload";
import Settings from "@material-ui/icons/SettingsOutlined";
import Help from "@material-ui/icons/Help";
import Timeline from "@material-ui/icons/Timeline";
import Rowing from "@material-ui/icons/Rowing";



//var pages = [].concat(pagesRoutes);
var dashboardRoutes = [
    {
      path: "/dashboard",
      sidebarName: "Dashboard",
      navbarName: "Dashboard",
      icon: Dashboard,
      component: DashboardPage
    },
    // {
    //   collapse: false,
    //   path: "/pages",
    //   sidebarName: "Pages",
    //   navbarName: 'Pages',
    //   state: "openPages",
    //   icon: Image,
    //   views: pages
    // },
     {
      path: "/training",
      sidebarName: "AI Training",
      navbarName: "Training",
      icon: Rowing,
      component: TrainingPage 
    },
    {
      path: "/dataupload",
      sidebarName: "Data Upload",
      navbarName: "Data Upload",
      icon: Upload,
      component: UploadPage 
    },
    {
      path: "/predictions",
      sidebarName: "Predictions",
      navbarName: "Predictions",
      icon: Play,
      component: SettingsPage
    },
    {
      path: "/diagnostics",
      sidebarName: "Diagnostics",
      navbarName: "Diagnostics",
      icon: Timeline,
      component: Diagnostics    
    },
    {
      path: "/monitoring",
      sidebarName: "Monitoring",
      navbarName: "Monitoring",
      icon: MonitorIcon,
      component: Monitoring    
    },
    {
      path: "/settings",
      sidebarName: "Settings",
      navbarName: "Settings",
      icon: Settings,
      component: SettingsPage
    },
    {
      path: "/documentation",
      sidebarName: "Documentation",
      navbarName: "Documentation",
      icon: Help,
      component: Documentation
    },
      { redirect: true, path: "/", to:'/dashboard', navbarName: "Redirect" }
    ];
    
    export default dashboardRoutes;