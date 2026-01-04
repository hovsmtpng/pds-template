import { useContext, useEffect, useState, useCallback } from "react"

const isReverseProxy = import.meta.env.VITE_REVERSE_PROXY === "true";

import { AuthContext } from "./auth/AuthContext";
import { checkSession } from "./api/sessionService";
import { useActivePath } from "./ActivePathContext";

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import { NavActions } from "@/components/nav-actions"
import { ThemeProvider } from "@/components/theme-provider"
import { useApp } from "./hooks/use-app";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

// import { ROUTES } from "./routes";
// import { ROUTE_AP } from "./routes/index-ap";

import { Route, Routes, useLocation } from "react-router-dom"
import GenerateBreadcrumb from "@/components/bread-crumb"
import LoadingPage from "@/components/loading-page"

import VisibilitySetting from "./VisibilitySetting";
import AccountInformation from "./AccountInformation";
import { NotFound } from "@puninar-logistics/pds-sdk";
import { PageNotAssigned } from "@puninar-logistics/pds-sdk";
import { getLocalStorage } from "@puninar-logistics/pds-sdk";
import { useIsMobile } from "@/hooks/use-mobile";
import { decodeData } from "@puninar-logistics/pds-sdk";

export default function App() {
  const isMobile = useIsMobile()
  const { auth, login, userRole = [], modules, lobby } = useContext(AuthContext);
  const {
    loading,
    setLoading,
    roles,
    routes,
    routeApps,
    printData,
    activeRole,
    handleClick,
    handleRoutes,
    handleRoleAtFirstTime,
    handleChangeRole,
    stateLoading,
    setStateLoading,
    handleBackToLobby,

    modalState,
    setModalState,
    openModal,
    closeModal,
    handleSave,
    handleOpen,

    filteredAccess,
    setFilteredAccess,
    selectedAccess,
    setSelectedAccess,
    handleChange,
    handleSelectAll,
    handleDeselectAll,
    handleSearch,

    modalAccountInformation,
    handleAccountInformation,
    columnsAccountInformation,
    dataRecAccountInformation,
    sortingAccountInformation,
    paginationAccountInformation,
    searchQueryAccountInformation,
    columnFiltersAccountInformation,
    handleSearchAccountInformation,
    handleSortingAccountInformation,
    handlePaginationAccountInformation,
    handleColumnFiltersAccountInformation,
  } = useApp({
    role: modules?.role,
    auth,
    modules,
    lobby,
    userRole,
  });

  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [crumbs, setCrumbs] = useState([]);
  const [minTimePassed, setMinTimePassed] = useState(false);
  const [pageReady, setPageReady] = useState(false);


  useEffect(() => {
    checkSession(location, login);
  }, []);

  useEffect(() => {
    // untuk set role saat pertama kali
    if (userRole && userRole?.roles?.length > 0) {
      const role = userRole.roles.filter((role) => role.effective_to !== null && new Date(role.effective_to) > new Date())[0]
      handleRoleAtFirstTime(
        getLocalStorage("selected-role", {
          apps_name: "ODONG",
          role: role.role_name,
          role_name: role.role_name,
          effective_from: role.effective_from,
          effective_to: role.effective_to,
        }))

    }
  }, [modules])

  useEffect(() => {
    const segments = location.pathname.split("/").filter(Boolean);

    const formatSegment = (str) =>
      str
        .replace(/[_]+/g, " ")
        .replace(/[-]+/g, " ")
        .split(" ")
        .filter(Boolean)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

    const checkBase64 = (str) => /^[A-Za-z0-9+/=_-]+$/.test(str) && str.length % 4 === 0;

    const isEncodedParam = (str) => {
      if (!checkBase64(str)) return false;
      try {
        const decoded = atob(str);
        // Cek kalau hasil decode bisa di-JSON.parse (hasil encodeData memang JSON.stringify)
        JSON.parse(decoded);
        return true;
      } catch {
        return false;
      }
    };

    const breadcrumbItems = segments
      .map((segment, index) => {
        const decoded = decodeURIComponent(segment);

        const isDynamicParam =
          isEncodedParam(decoded) || // ✅ hasil encodeData
          decoded.startsWith(":") || // route param
          /^[0-9]+$/.test(decoded) || // angka murni
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(decoded); // UUID

        if (isDynamicParam) return null;

        const path = isReverseProxy ? "/26" : "";
        const href = path + "/" + segments.slice(0, index + 1).join("/");
        return {
          key: href,
          disabled: false,
          text: formatSegment(decoded),
          href,
          isLast: index === segments.length - 1,
        };
      })
      .filter(Boolean);

    setCrumbs(breadcrumbItems);
  }, [location.pathname]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimePassed(true);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // cek readyState (DOM + assets selesai)
  useEffect(() => {
    const handleReady = () => {
      if (document.readyState === "complete") {
        setPageReady(true);
      }
    };

    if (document.readyState === "complete") {
      setPageReady(true);
    } else {
      document.addEventListener("readystatechange", handleReady);
    }

    return () => {
      document.removeEventListener("readystatechange", handleReady);
    };
  }, []);

  // gabungan kondisi: minimal 1500ms + page ready
  useEffect(() => {
    if (minTimePassed && pageReady) {
      setLoading(false);
    }
  }, [minTimePassed, pageReady]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])


  if (loading || !auth || !modules) {
    return <LoadingPage state={stateLoading} />;
  }

  // if (!userRole) {
  //   navigate("/not-assigned")
  // }

  return (
    <>
      <div className="no-print print:hidden">
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <SidebarProvider
            defaultOpen={true}
          // open={true}
          >
            <AppSidebar
              auth={auth}
              roles={roles}
              routes={routes}
              modules={modules}
              userRole={userRole}
              routeApps={routeApps}
              activeRole={activeRole}
              handleClick={handleClick}
              handleRoutes={handleRoutes}
              handleChangeRole={handleChangeRole}
              handleAccountInformation={handleAccountInformation}
            />
            <SidebarInset gradientRoutes={["/", "/dashboard"]}>
              <header
                className={`${scrolled
                  ? "sticky top-2 z-50 mx-2 rounded-full bg-background/40 shadow-[0_0_25px_rgba(0,0,0,0.1)] backdrop-blur-sm border border-white/10"
                  : "relative"
                  } flex h-14 shrink-0 items-center gap-2 transition-all duration-500 ease-in-out group-has-data-[collapsible=icon]/sidebar-wrapper:h-14`}
              >
                <div className="flex items-center gap-2 px-4">
                  <SidebarTrigger className="-ml-1" />
                  <Separator
                    orientation="vertical"
                    className="mr-2 data-[orientation=vertical]:h-5"
                  />
                  {
                    !isMobile && (
                      <GenerateBreadcrumb crumbs={crumbs} />
                    )
                  }
                </div>
                <div className="ml-auto px-3">
                  <NavActions
                    scrolled={scrolled}
                    showClock={false}
                    showLanguageChange={false}
                    showThemeChange={true}
                    showBackToLobby={true}
                    showVisibility={true}
                    lobby={handleBackToLobby}
                    handleOpen={handleOpen}
                  />
                </div>
              </header>
              {!scrolled && (
                <Separator
                  orientation="horizontal"
                  className="mr-2 data-[orientation=horizontal]:h-[1px]"
                />
              )}
              <div className="flex flex-1 flex-col">
                <div className="@container/main flex flex-1 flex-col gap-2">
                  <div className="flex flex-col px-2 md:gap-6 md:py-2">

                    {
                      // diakses di mobile breadcrumb pindah kesini
                      isMobile && (
                        <div className="py-4 px-2">
                          <GenerateBreadcrumb crumbs={crumbs} />
                        </div>
                      )
                    }

                    <Routes>
                      {routes.map((route, idx) => {
                        const hasItems = Array.isArray(route.items) && route.items.length > 0;

                        const parentRoute = (
                          <Route
                            key={`parent-${idx}`}
                            path={route.path}
                            element={route.element}
                          />
                        );

                        if (hasItems) {
                          const childRoutes = route.items.map((item, itemIdx) => (
                            <Route
                              key={`child-${idx}-${itemIdx}`}
                              path={item.path}
                              element={item.element}
                            />
                          ));
                          return [parentRoute, ...childRoutes];
                        }

                        return parentRoute;
                      })}

                      <Route path="*" element={<NotFound />} />
                      <Route path="not-assigned" element={<PageNotAssigned />} />
                    </Routes>
                  </div>
                </div>

                <VisibilitySetting
                  modalState={modalState}
                  closeModal={closeModal}
                  filteredAccess={filteredAccess}
                  setFilteredAccess={setFilteredAccess}
                  selectedAccess={selectedAccess}
                  setSelectedAccess={setSelectedAccess}
                  handleChange={handleChange}
                  handleSelectAll={handleSelectAll}
                  handleDeselectAll={handleDeselectAll}
                  handleSearch={handleSearch}
                  handleSave={handleSave}
                />

                <AccountInformation
                  open={modalAccountInformation}
                  onOpenChange={handleAccountInformation}

                  columns={columnsAccountInformation}
                  dataRec={dataRecAccountInformation}
                  sorting={sortingAccountInformation}
                  pagination={paginationAccountInformation}
                  searchQuery={searchQueryAccountInformation}
                  columnFilters={columnFiltersAccountInformation}
                  handleSearch={handleSearchAccountInformation}
                  handleSorting={handleSortingAccountInformation}
                  handlePagination={handlePaginationAccountInformation}
                  handleColumnFilters={handleColumnFiltersAccountInformation}
                />

              </div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </div>
    </>
  )
}