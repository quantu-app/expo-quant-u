import React, { useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Input, Datepicker, Spinner } from "@ui-kitten/components";
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

const EMPTY_DATE = new Date(
    new Date().setFullYear(new Date().getFullYear() - 18)
  ),
  MIN_DATE = new Date(new Date().setFullYear(1900)),
  MAX_DATE = new Date();

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
      console.log(name, value);
      setChangeset(changesetFn(changeset.addChange(name, value).clearErrors()));
    };
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.grid}>
          <Input
            value={changeset.getField("firstName") || ""}
            onChangeText={createOnChange("firstName")}
            label="First Name"
          />
        </View>
        <View style={styles.grid}>
          <Input
            value={changeset.getField("lastName") || ""}
            onChangeText={createOnChange("lastName")}
            label="Last Name"
          />
        </View>
      </View>
      <Input
        value={changeset.getField("username") || ""}
        onChangeText={createOnChange("username")}
        label="Userame"
      />
      <Datepicker
        min={MIN_DATE}
        max={MAX_DATE}
        date={changeset.getField("birthday") || EMPTY_DATE}
        onSelect={createOnChange("birthday")}
        label="Birthday"
      />
      <Input
        value={changeset.getField("about") || ""}
        onChangeText={createOnChange("about")}
        multiline
        label="About"
      />
      <View style={styles.buttons}>
        <Button
          appearance="filled"
          accessoryLeft={loading ? () => <Spinner /> : undefined}
          disabled={changeset.isInvalid() || loading}
          onPress={onSubmit}
        >
          Update
        </Button>
      </View>
    </>
  );
}
