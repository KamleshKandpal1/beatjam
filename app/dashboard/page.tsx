import React from "react";
import YouTubeQueue from "./components/YouTubeQueue";
import Appbar from "../components/Appbar";
import Redirect from "../components/Redirect";

const page = () => {
  return (
    <div>
      <Appbar />
      <Redirect />
      <YouTubeQueue />
    </div>
  );
};

export default page;
