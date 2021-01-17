import React from "react";
import { Card } from "@ui-kitten/components";
import { useMapStateToProps } from "../../state";
import { selectUser } from "../../state/auth";
import { ProfileForm } from "./ProfileForm";

export function Profile() {
  const user = useMapStateToProps(selectUser).unwrap();

  return (
    <Card>
      <ProfileForm user={user} />
    </Card>
  );
}
