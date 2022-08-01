import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Wrapper from "./components/layout/Wrapper";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import setAuthToken from "./utils/setAuthToken";
import Dashboard from "./components/dashboard/Dashboard";
import CreateProfile from "./components/profile-forms/CreateProfile";
import EditProfile from "./components/profile-forms/EditProfile";
import AddExperience from "./components/profile-forms/AddExperience";
import AddEducation from "./components/profile-forms/AddEducation";
import PrivateRoute from "./components/routing/PrivateRoute";
import Posts from "./components/posts/Posts";
import Post from "./components/post/Post";
import NotFound from "./components/layout/NotFound";

//* Redux
import { Provider } from "react-redux";
import store from "./store.js";
import { loadUser } from "./actions/auth";
import Profiles from "./components/profiles/Profiles";
import Profile from "./components/profile/Profile";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <NavBar></NavBar>
        <Routes>
          <Route exact path="/" element={<Landing />} />
          <Route exact path="/login" element={<Wrapper child={<Login />} />} />
          <Route
            exact
            path="/register"
            element={<Wrapper child={<Register />} />}
          />
          <Route
            exact
            path="/profiles"
            element={<Wrapper child={<Profiles />} />}
          />
          <Route
            exact
            path="/profile/:id"
            element={<Wrapper child={<Profile />} />}
          />
          <Route
            exact
            path="/dashboard"
            element={
              <PrivateRoute>
                <Wrapper child={<Dashboard />} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/create-profile"
            element={
              <PrivateRoute>
                <Wrapper child={<CreateProfile />} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/edit-profile"
            element={
              <PrivateRoute>
                <Wrapper child={<EditProfile />} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/add-experience"
            element={
              <PrivateRoute>
                <Wrapper child={<AddExperience />} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/add-education"
            element={
              <PrivateRoute>
                <Wrapper child={<AddEducation />} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/posts"
            element={
              <PrivateRoute>
                <Wrapper child={<Posts />} />
              </PrivateRoute>
            }
          />
          <Route
            exact
            path="/post/:id"
            element={
              <PrivateRoute>
                <Wrapper child={<Post />} />
              </PrivateRoute>
            }
          />
          <Route path="/*" element={<Wrapper child={<NotFound />} />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
