import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logoutUser } from "../../actions/auth";

const Navbar = ({ auth: { isAuthenticated, loading }, logoutUser }) => {
  const authLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/posts">Posts</Link>
      </li>

      <li>
        <Link to="/dashboard">
          <i className="fas fa-user"></i>
          {"  "}
          <span className="hide-sm">Dashboard</span>
        </Link>
      </li>
      <li>
        <Link onClick={logoutUser} to="/login">
          <i className="fas fa-sign-out-alt"></i>
          {"  "}
          <span className="hide-sm">Logout</span>
        </Link>
      </li>
    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to="/profiles">Developers</Link>
      </li>
      <li>
        <Link to="/register">Register</Link>
      </li>
      <li>
        <Link to="/login">Login</Link>
      </li>
    </ul>
  );
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
          <i className="fas fa-code"></i> Social Overflow
        </Link>
      </h1>
      {!loading && <>{isAuthenticated ? authLinks : guestLinks}</>}
    </nav>
  );
};

Navbar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, { logoutUser })(Navbar);
