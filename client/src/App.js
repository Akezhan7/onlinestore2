import React, { useEffect, useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";

import GlobalStyle from "./global-styles";
import theme from "./theme";
import { fetchUserCart } from "./ducks/cart";
import { setUserData } from "./ducks/auth";
import { fetchCategories } from "./ducks/global";
import { useDispatch, useSelector } from "react-redux";
import routes from "./views";

import {
  Header,
  HomeHeader,
  Footer,
  PrivateRoute,
  ModalProvider,
  Notifications,
} from "./components";
import { useUpdateEffect } from "./hooks";
import { QueryClient, QueryClientProvider } from "react-query";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const Body = styled.div`
  overflow-y: auto;
  height: 100%;
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  .fldasj {
    flex: 1;
  }
`;

const AppLoading = styled.div`
  height: var(--vh);
  display: flex;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-variant: small-caps;
  text-align: center;
  img {
    height: 60px;
    width: 60px;
  }
`;

const queryClient = new QueryClient();

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const categories = useSelector((state) => state.global.categories);
  const [status, setStatus] = useState("loading");

  // Track if it's mobile (for your existing logic)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  function updateBrowserDimensions() {
    let vh = window.innerHeight;
    let vw = window.innerWidth;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
    document.documentElement.style.setProperty("--vw", `${vw}px`);
  }
  function updateNavBar(e) {
    const page = e.currentTarget;
    if (page.scrollTop > 23) page.classList.add("hasScrolled");
    else page.classList.remove("hasScrolled");
  }

  useEffect(() => {
    setStatus("loading");
    dispatch(fetchCategories());
    dispatch(fetchUserCart());
    if (token && !user) {
      dispatch(setUserData());
    }
    // eslint-disable-next-line
  }, [token]);

  useUpdateEffect(() => {
    setStatus("done");
  }, [categories]);

  useEffect(() => {
    updateBrowserDimensions();
    window.addEventListener("resize", updateBrowserDimensions);
    return () => {
      window.removeEventListener("resize", updateBrowserDimensions);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <ModalProvider>
          {status === "loading" ? (
            <AppLoading>
              <div>
                <h4>ERSAINT MCMLIV</h4>
              </div>
            </AppLoading>
          ) : (
            <Body onScroll={updateNavBar}>
              <Notifications />
              
              {isHomePage && !isMobile ? <HomeHeader /> : <Header />}

              <div className="fldasj">
              <Switch>
                {routes.map(({ path, component, exact, authRequired }) =>
                  authRequired ? (
                    <PrivateRoute
                      component={component}
                      path={path}
                      exact={exact}
                      key={path.replace("/", "")}
                    />
                  ) : (
                    <Route
                      path={path}
                      exact={exact}
                      component={component}
                      key={path.replace("/", "")}
                    />
                  )
                )}
              </Switch>
              </div>

              {/* Only show Footer if NOT on the home page */}
              {!isHomePage && <Footer />}
            </Body>
          )}
        </ModalProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
