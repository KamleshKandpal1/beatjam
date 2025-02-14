import React from "react";
import YouTubeQueue from "./components/YouTubeQueue";
import Appbar from "../components/Appbar";

const page = () => {
  return (
    <div>
      <Appbar />
      <YouTubeQueue />
    </div>
  );
};

export default page;
