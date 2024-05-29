import React from "react";

import { TouchableOpacity } from "react-native";
import { useUser, useApp } from "@realm/react";
import { Power } from "phosphor-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Container, Greeting, Message, Name, Picture } from "./styles";
import theme from "../../theme";

const HeaderHome = () => {
  const { profile } = useUser();
  const insets = useSafeAreaInsets();
  const { currentUser } = useApp();

  const handleLogout = async () => {
    currentUser?.logOut();
  };

  const paddingaTopCustom = insets.top + 32;
  return (
    <Container style={{ paddingTop: paddingaTopCustom }}>
      <Picture
        source={{ uri: profile.pictureUrl }}
        placeholder="L184i9ofbHof00ayjsay~qj[ayj@"
      />
      <Greeting>
        <Message>Olá</Message>

        <Name>{profile.name}</Name>
      </Greeting>

      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  );
};

export { HeaderHome };
