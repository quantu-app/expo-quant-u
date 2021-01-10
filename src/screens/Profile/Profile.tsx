import React from "react";
import { Layout } from "../../Layout";
import { useMapStateToProps } from "../../state";
import { selectUser } from "../../state/auth";
import { ProfileForm } from "./ProfileForm";

export function Profile() {
  const user = useMapStateToProps(selectUser).unwrap();

  return (
    <Layout>
      <ProfileForm user={user} />
    </Layout>
  );
}
