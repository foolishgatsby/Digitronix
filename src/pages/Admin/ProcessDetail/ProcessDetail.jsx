import React from "react";
import { useParams } from "react-router";

export default function ProcessDetail(props) {
  const { processId } = useParams();

  return <div>ProcessDetail: {processId}</div>;
}
