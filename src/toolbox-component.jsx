import React from "react";

const Toolbox = ({ draw, select, group }) => {
  return (
    <div>
      <button type="button" onClick={() => draw()}>
        draw
      </button>
      <button type="button" onClick={() => select()}>
        select
      </button>
      <button type="button" onClick={() => group()}>
        group
      </button>
    </div>
  );
};

export default Toolbox;
