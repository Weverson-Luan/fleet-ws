import React from "react";
import { Text, View } from "react-native";
import { Container, Title, Slogan } from "./styles";
import backgroundImg from "../../common/images/background.png";

export function SignIn() {
  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos</Slogan>

      {/* <Button
        title="Entrar com Google"
        onPress={handleGoogleSignIn}
        isLoading={isAuthenticating}
      /> */}
    </Container>
  );
}
