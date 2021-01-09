import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Layout } from "../../Layout";
import { useMapStateToProps } from "../../state";
import { IUser, selectUser } from "../../state/auth";
import { DateInput } from "../../DateInput";

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export function Profile() {
  const user = useMapStateToProps(selectUser).unwrap(),
    [form, setForm] = useState(user);

  function onSubmit() {
    console.log();
  }

  function createOnChange(name: keyof IUser) {
    return function onChange(value: IUser[keyof IUser]) {
      setForm(form.set(name, value));
    };
  }

  return (
    <Layout>
      <View style={styles.container}>
        <TextInput
          value={form.firstName}
          onChangeText={createOnChange("firstName")}
          dense
          label="First Name"
        />
        <TextInput
          value={form.lastName}
          onChangeText={createOnChange("lastName")}
          dense
          label="Last Name"
        />
        <TextInput
          value={form.username}
          onChangeText={createOnChange("username")}
          dense
          label="Userame"
        />
        <TextInput
          value={form.country}
          onChangeText={createOnChange("country")}
          dense
          label="Country"
        />
        <TextInput
          value={form.timezone}
          onChangeText={createOnChange("timezone")}
          dense
          label="Time Zone"
        />
        <DateInput
          value={form.birthday}
          onChangeDate={createOnChange("birthday")}
          label="Birthday"
        />
        <TextInput
          value={form.about}
          onChangeText={createOnChange("about")}
          dense
          multiline
          label="About"
        />
        <Button mode="contained" onPress={onSubmit}>
          Update
        </Button>
      </View>
    </Layout>
  );
}
