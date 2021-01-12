import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Surface, TextInput } from "react-native-paper";
import { RecordOf } from "immutable";
import {
  isValidUsername,
  IUser,
  IUserExtra,
  setUserExtra,
} from "../../state/auth";
import { DateInput } from "../../DateInput";
import { Changeset } from "@aicacia/changeset";

const styles = StyleSheet.create({
  form: {
    marginTop: 16,
    marginBottom: 16,
    padding: 16,
  },
  container: {
    flexDirection: "row",
  },
  grid: {
    flex: 1,
  },
  input: {
    marginBottom: 16,
  },
  buttons: {
    marginTop: 16,
    justifyContent: "center",
    alignItems: "center",
  },
});

function changesetFn(changeset: Changeset<IUserExtra>): Changeset<IUserExtra> {
  return changeset.validateRequired([
    "firstName",
    "lastName",
    "username",
    "birthday",
  ]);
}

const EMPTY_DATE = new Date();

export interface IProfileFormProps {
  user: RecordOf<IUser>;
}

export function ProfileForm(props: IProfileFormProps) {
  const [loading, setLoading] = useState(false),
    [changeset, setChangeset] = useState<Changeset<IUserExtra>>(() =>
      changesetFn(new Changeset(props.user.extra.toJS()))
    );

  useMemo(() => {
    setChangeset(changeset.addDefaults(props.user.extra.toJS()));
  }, [props.user.extra]);

  async function onSubmit() {
    setLoading(true);
    try {
      const userExtra = changeset.applyChanges().toJS() as IUserExtra;

      if (await isValidUsername(props.user.uid, userExtra.username)) {
        setChangeset(changeset.addError("username", "already taken"));
        setLoading(false);
        return;
      }

      await setUserExtra(
        props.user.uid,
        changeset.applyChanges().toJS() as IUserExtra
      );
    } finally {
      setLoading(false);
    }
  }

  function createOnChange(name: keyof IUserExtra) {
    return function onChange(value?: IUserExtra[keyof IUserExtra]) {
      setChangeset(changesetFn(changeset.addChange(name, value).clearErrors()));
    };
  }

  return (
    <Surface style={styles.form}>
      <View style={styles.container}>
        <View style={styles.grid}>
          <TextInput
            style={styles.input}
            value={changeset.getField("firstName", "")}
            onChangeText={createOnChange("firstName")}
            dense
            label="First Name"
          />
        </View>
        <View style={styles.grid}>
          <TextInput
            style={styles.input}
            value={changeset.getField("lastName", "")}
            onChangeText={createOnChange("lastName")}
            dense
            label="Last Name"
          />
        </View>
      </View>
      <TextInput
        style={styles.input}
        value={changeset.getField("username", "")}
        onChangeText={createOnChange("username")}
        dense
        label="Userame"
      />
      <DateInput
        style={styles.input}
        value={changeset.getField("birthday", EMPTY_DATE) as Date}
        onChangeDate={createOnChange("birthday")}
        label="Birthday"
      />
      <TextInput
        style={styles.input}
        value={changeset.getField("about", "")}
        onChangeText={createOnChange("about")}
        dense
        multiline
        label="About"
      />
      <View style={styles.buttons}>
        <Button
          mode="contained"
          loading={loading}
          disabled={changeset.isInvalid() || loading}
          onPress={onSubmit}
        >
          Update
        </Button>
      </View>
    </Surface>
  );
}
