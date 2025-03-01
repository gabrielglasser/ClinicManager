"use client";

import React, { useState } from "react";
import Sidebar from "../../components/sidebar/Sidebar";
import Header from "../../components/header/Header";
import styles from "./DashboardLayout.module.scss";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar isOpen={sidebarOpen} onClose={closeSidebar} />

      <div
        className={`${styles.overlay} ${sidebarOpen ? styles.visible : ""}`}
        onClick={closeSidebar}
      />

      <div className={styles.content}>
        <Header title={title} onMenuClick={toggleSidebar} />

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
