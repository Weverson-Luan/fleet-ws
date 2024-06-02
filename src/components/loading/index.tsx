import React from "react";

import { Container, LoadIndicator } from "./styles";

const Loading = () => {
  return (
    <Container>
      <LoadIndicator color={"#00B37E"} size={24} />
    </Container>
  );
};

export { Loading };
