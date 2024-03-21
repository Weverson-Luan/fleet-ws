import React, { useEffect, useState } from "react";
import { Container, Title, Slogan } from "./styles";

import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

import { Button } from "../../components/button";

import backgroundImg from "../../common/images/background.png";
import { ANDROID_CLIENT_ID, WEB_CLIENT_ID } from "@env";

//com.progrmadorwl_com.fleetws

GoogleSignin.configure({
  scopes: ["https://www.googleapis.com/auth/drive"],
  offlineAccess: true,
  forceCodeForRefreshToken: true,
  webClientId:
    "152472191488-ct963r3co5g44rb3obbmkb7qah1uln4l.apps.googleusercontent.com", // client ID of type WEB for your server. Required to get the idToken on the user object, and for offline access.
});

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(null);

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log(userInfo);
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // O usuário cancelou o processo de login
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Um processo de login está em andamento
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Serviços do Google Play indisponíveis ou desatualizados
      } else {
        console.error(error);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["email"], // qual API você quer acessar em nome do usuário; o padrão é o email e o perfil
      forceCodeForRefreshToken: true,
      webClientId:
        "152472191488-ct963r3co5g44rb3obbmkb7qah1uln4l.apps.googleusercontent.com", //
      offlineAccess: true, // se você deseja acessar a API do Google API em nome do usuário DE SEU SERVIDOR
    });
  }, []);
  return (
    <Container source={backgroundImg}>
      <Title>Ignite Fleet</Title>

      <Slogan>Gestão de uso de veículos {isAuthenticating}</Slogan>

      <Button
        title="Entrar com Google"
        onPress={() => signIn()}
        isLoading={false}
      />
    </Container>
  );
}
