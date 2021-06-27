import { useCallback, useEffect, useState } from 'react';

import qs from 'qs';

import { SearchPanel } from './search-panel';
import { List } from './list';
import { cleanObject, useDebounce, useMount } from 'utils';

const apiUrl = process.env.REACT_APP_API_URL;

export const ProjectListScreen = () => {
  const [users, setUsers] = useState([]);
  const [param, setParam] = useState({ name: '', personId: '' });
  const [list, setList] = useState([]);
  const debouncedParam = useDebounce(param, 500);

  useEffect(() => {
    fetch(`${apiUrl}/projects?${qs.stringify(cleanObject(debouncedParam))}`).then(async (response) => {
      if (response.ok) {
        setList(await response.json());
      }
    });
  }, [debouncedParam]);

  useMount(
    useCallback(() => {
      fetch(`${apiUrl}/users`).then(async (response) => {
        if (response.ok) {
          setUsers(await response.json());
        }
      });
    }, [])
  );

  return (
    <div>
      <SearchPanel users={users} param={param} setParam={setParam} />
      <List users={users} list={list} />
    </div>
  );
};
