import React from "react";
import { StyleSheet } from "react-native";
import { Layout } from "@ui-kitten/components";
import { useMapStateToProps } from "../../state";
import { selectUser } from "../../state/auth";
import { ProfileForm } from "./ProfileForm";

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
  },
});

export function Profile() {
  const user = useMapStateToProps(selectUser).unwrap();

  return (
    <Layout style={styles.form}>
      <ProfileForm user={user} />
    </Layout>
  );
}
