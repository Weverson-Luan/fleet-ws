import React from "react";

import { Container, LoadIndicator } from "./styles";

const Loading = () => {
  return (
    <Container>
      <LoadIndicator color="red" size={24} />
    </Container>
  );
};

export { Loading };
