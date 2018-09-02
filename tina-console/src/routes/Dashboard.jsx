import Dashboard from "@material-ui/icons/Dashboard";
import DashboardPage from "views/Dashboard/Dashboard";
import Documentation from "views/Documentation/Documentation";
import TrainingPage from "views/Training/TrainingPage";
import PredictionPage from "views/Prediction/PredictionPage";
import TestingPage from "views/Testing/TestingPage";
import SettingsPage from "views/Settings/Settings";
import UploadPage from "views/Upload/Upload";
import Statistics from "views/Statistics/Statistics";
import Debug from "views/Debug/Debug";
import Play from "@material-ui/icons/PlayArrow";
import NetworkCheck from "@material-ui/icons/NetworkCheck";
import BugReport from "@material-ui/icons/BugReport";
import MonitorIcon from "@material-ui/icons/MovieCreationTwoTone";
import Upload from "@material-ui/icons/CloudUpload";
import Settings from "@material-ui/icons/SettingsOutlined";
import Help from "@material-ui/icons/Help";
import Timeline from "@material-ui/icons/Timeline";
import Rowing from "@material-ui/icons/Rowing";

//var pages = [].concat(pagesRoutes)
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
    sidebarName: "Training",
    navbarName: "Training",
    icon: Rowing,
    component: TrainingPage
  },
  {
    path: "/testing",
    sidebarName: "Testing",
    navbarName: "Testing",
    icon: NetworkCheck,
    component: TestingPage
  },

  {
    path: "/predictions",
    sidebarName: "Predictions",
    navbarName: "Predictions",
    icon: Play,
    component: PredictionPage
  },
  {
    path: "/dataupload",
    sidebarName: "Data Upload",
    navbarName: "Data Upload",
    icon: Upload,
    component: UploadPage
  },
  {
    path: "/Statistics",
    sidebarName: "Statistics",
    navbarName: "Statistics",
    icon: Timeline,
    component: Statistics
  },
  {
    path: "/debug",
    sidebarName: "Debug",
    navbarName: "Debug",
    icon: BugReport,
    component: Debug
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
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
