import React from "react";
import Alert from "./Alert";

const Wrapper = ({ child }) => {
  return (
    <section className="container">
      <Alert />
      {child}
    </section>
  );
};

export default Wrapper;
