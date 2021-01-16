import React, { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  Input,
  Layout,
  Datepicker,
  Spinner,
} from "@ui-kitten/components";
import { RecordOf } from "immutable";
import {
  isValidUsername,
  IUser,
  IUserExtra,
  setUserExtra,
} from "../../state/auth";
import { Changeset } from "@aicacia/changeset";

const styles = StyleSheet.create({
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

export interface IProfileFormProps {
  user: RecordOf<IUser>;
}

export function ProfileForm(props: IProfileFormProps) {
  const [loading, setLoading] = useState(false),
    [changeset, setChangeset] = useState<Changeset<IUserExtra>>(() =>
      changesetFn(new Changeset(props.user.extra.toJS() as any))
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
    <>
      <Layout style={styles.container}>
        <Layout style={styles.grid}>
          <Input
            style={styles.input}
            value={changeset.getField("firstName", "")}
            onChangeText={createOnChange("firstName")}
            label="First Name"
          />
        </Layout>
        <Layout style={styles.grid}>
          <Input
            style={styles.input}
            value={changeset.getField("lastName", "")}
            onChangeText={createOnChange("lastName")}
            label="Last Name"
          />
        </Layout>
      </Layout>
      <Input
        style={styles.input}
        value={changeset.getField("username", "")}
        onChangeText={createOnChange("username")}
        label="Userame"
      />
      <Datepicker
        style={styles.input}
        date={changeset.getField("birthday") as Date}
        onSelect={createOnChange("birthday")}
        label="Birthday"
      />
      <Input
        style={styles.input}
        value={changeset.getField("about", "")}
        onChangeText={createOnChange("about")}
        multiline
        label="About"
      />
      <Layout style={styles.buttons}>
        <Button
          appearance="filled"
          accessoryLeft={loading ? () => <Spinner /> : undefined}
          disabled={changeset.isInvalid() || loading}
          onPress={onSubmit}
        >
          Update
        </Button>
      </Layout>
    </>
  );
}
