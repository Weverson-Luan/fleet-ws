import React from "react";
import { Container, Title, Slogan } from "./styles";

import { Button } from "../../components/button";

import backgroundImg from "../../common/images/background.png";

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      <Button title="Entrar com Google" onPress={() => {}} isLoading={false} />
    </Container>
  );
}
