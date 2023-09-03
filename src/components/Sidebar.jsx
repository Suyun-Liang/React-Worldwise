import styles from "./Sidebar.module.css";
import Logo from "./Logo";
import AppNav from "./AppNav";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />
      {/* the element specified in Route component in the App.jsx */}
      <Outlet />
      <Footer />
    </div>
  );
}

export default Sidebar;
