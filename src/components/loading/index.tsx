import React from "react";

import { ActivityIndicator } from "react-native";

import { Container, Title } from "./styles";

export function Loading() {
  return (
    <Container>
      <ActivityIndicator size={24} color={"#fff"} />
      <Title>loading</Title>
    </Container>
  );
}
