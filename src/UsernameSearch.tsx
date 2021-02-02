import React, { useCallback, useMemo, useRef, useState } from "react";
import { debounce } from "@aicacia/debounce";
import { Autocomplete, AutocompleteItem } from "@ui-kitten/components";
import { RecordOf, Map } from "immutable";
import { findByUsername, IUserExtra, selectUser } from "./state/auth";
import { useMapStateToProps } from "./state";
import { Loading } from "./Loading";

export interface IUsernameSearchProps {
  onSelect(user_id: string, user: RecordOf<IUserExtra>): void;
}

export function UsernameSearch(props: IUsernameSearchProps) {
  const userOption = useMapStateToProps(selectUser),
    autocompleteRef = useRef<Autocomplete | null>(null),
    [loading, setLoading] = useState(false),
    [value, setValue] = useState(""),
    [search, setSearch] = useState(value),
    [users, setUsers] = useState<Map<string, RecordOf<IUserExtra>>>(Map());

  useMemo(() => {
    if (search && userOption.isSome()) {
      findByUsername(userOption.unwrap(), search)
        .then(setUsers)
        .finally(() => {
          setLoading(false);
          if (autocompleteRef.current) {
            autocompleteRef.current.show();
          }
        });
    }
  }, [userOption, search, autocompleteRef, setUsers]);

  const onSetValue = useCallback(debounce(setSearch, 1000), [setSearch]);

  const onChangeText = useCallback(
    (value) => {
      setLoading(true);
      onSetValue(value);
      setValue(value);
    },
    [setSearch]
  );

  const onSelect = useCallback(
    (index) => {
      const id = users.keySeq().toArray()[index],
        user = users.get(id) as RecordOf<IUserExtra>;
      if (user.username) {
        setValue(user.username);
      }
      props.onSelect(id, user);
    },
    [users]
  );

  return (
    <Autocomplete
      ref={autocompleteRef}
      accessoryRight={loading ? () => <Loading size="small" /> : undefined}
      placeholder="Search by Username"
      value={value}
      onSelect={onSelect}
      onChangeText={onChangeText}
    >
      {users
        .map((user, userId) => (
          <AutocompleteItem key={userId} title={user.username || userId} />
        ))
        .valueSeq()
        .toArray()}
    </Autocomplete>
  );
}
