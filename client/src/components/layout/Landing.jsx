import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Landing = ({ auth: { user, loading, isAuthenticated } }) => {
  return (
    <section className="landing">
      <div className="dark-overlay">
        <div className="landing-inner">
          <h1 className="x-large">Social Overflow</h1>
          <p className="lead">
            Create a developer profile/portfolio, share posts and get help from
            other developers
          </p>
          <div className="buttons">
            {!loading && (
              <>
                {isAuthenticated ? (
                  <Link to="dashboard" className="btn btn-primary">
                    Dashboard
                  </Link>
                ) : (
                  <>
                    <Link to="register" className="btn btn-primary">
                      Sign Up
                    </Link>
                    <Link to="login" className="btn btn-light">
                      Login
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

Landing.propTypes = {
  auth: PropTypes.object,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps)(Landing);
