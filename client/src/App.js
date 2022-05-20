import React, { useState } from "react";

import Header from "components/Header";
import Thoughts from "components/Thoughts";

const App = () => {
  const [loading, setLoading] = useState(false);

  return (
    <div className={loading === false ? "app-container" : "loader-container"}>
      {loading === false && <Header />}
      <Thoughts loading={loading} setLoading={setLoading} />
    </div>
  );
};

export default App;
