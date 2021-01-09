import React from "react";
import { Changeset } from "@aicacia/changeset";
import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import { Input } from "../../Input";
import { Layout } from "../../Layout";
import { useForm } from "../../state/lib/forms";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

interface IProfileForm {
  firstName: string;
  lastName: string;
  username: string;
  country: string;
  timezone: string;
  birthday: Date;
  about: string;
}

function changeset(
  changeset: Changeset<IProfileForm>
): Changeset<IProfileForm> {
  return changeset
    .filter([
      "firstName",
      "lastName",
      "username",
      "country",
      "timezone",
      "birthday",
      "about",
    ])
    .validateRequired([
      "firstName",
      "lastName",
      "username",
      "country",
      "timezone",
      "birthday",
    ]);
}

export function Profile() {
  const { getFormData, valid, Field } = useForm({
    changeset,
  });

  function onSubmit() {
    const formData = getFormData();
    console.log(formData);
  }

  return (
    <Layout>
      <View style={styles.container}>
        <Field name="firstName" Component={Input} dense />
        <Field name="lastName" Component={Input} dense />
        <Field name="username" Component={Input} dense />
        <Field name="country" Component={Input} dense type="country" />
        <Field name="timezone" Component={Input} dense type="date" />
        <Field name="birthday" Component={Input} dense />
        <Field name="about" Component={Input} dense multiline />
        <Button compact disabled={!valid} mode="contained" onPress={onSubmit}>
          Update
        </Button>
      </View>
    </Layout>
  );
}
