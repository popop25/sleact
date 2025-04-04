import useSocket from '@hooks/useSocket';
import { CollapseButton } from '@components/DMList/styles';
import fetcher from '@utils/fetcher';
import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { NavLink } from 'react-router-dom';
import useSWR from 'swr';

const DMList = () => {
  const { workspace } = useParams();
  const { data: userData, error, revalidate, mutate } = useSWR('/api/users', fetcher, {
    dedupingInterval: 2000, // 2초
  });
  const { data: memberData } = useSWR(userData ? `/api/workspaces/${workspace}/members` : null, fetcher);
  const [socket] = useSocket(workspace);
  const [channelCollapse, setChannelCollapse] = useState(false);
  const [countList, setCountList] = useState({});
  const [onlineList, setOnlineList] = useState([]);

  const toggleChannelCollapse = useCallback(() => {
    setChannelCollapse((prev) => !prev);
  }, []);

  const resetCount = useCallback(
    (id) => () => {
      setCountList((list) => {
        return {
          ...list,
          [id]: 0,
        };
      });
    },
    [],
  );

  const onMessage = (data) => {
    console.log('dm왔다', data);
    setCountList((list) => {
      return {
        ...list,
        [data.SenderId]: list[data.SenderId] ? list[data.SenderId] + 1 : 1,
      };
    });
  };

  useEffect(() => {
    console.log('DMList: workspace 바꼈다', workspace);
    setOnlineList([]);
    setCountList({});
  }, [workspace]);

  useEffect(() => {
    socket?.on('onlineList', (data) => {
      setOnlineList(data);
    });
    socket?.on('dm', onMessage);
    console.log('socket on dm', socket?.hasListeners('dm'), socket);
    return () => {
      socket?.off('dm', onMessage);
      console.log('socket off dm', socket?.hasListeners('dm'));
      socket?.off('onlineList');
    };
  }, [socket]);

  return (
    <>
      <h2>
        <CollapseButton collapse={channelCollapse} onClick={toggleChannelCollapse}>
          <i
            className="c-icon p-channel_sidebar__section_heading_expand p-channel_sidebar__section_heading_expand--show_more_feature c-icon--caret-right c-icon--inherit c-icon--inline"
            data-qa="channel-section-collapse"
            aria-hidden="true"
          />
        </CollapseButton>
        <span>Direct Messages</span>
      </h2>
      <div>
        {!channelCollapse &&
          memberData?.map((member) => {
            const isOnline = onlineList.includes(member.id);
            const count = countList[member.id] || 0;
            return (
              <NavLink
                key={member.id}
                activeClassName="selected"
                to={`/workspace/${workspace}/dm/${member.id}`}
                onClick={resetCount(member.id)}
              >
                <i
                  className={`c-icon p-channel_sidebar__presence_icon p-channel_sidebar__presence_icon--dim_enabled c-presence ${
                    isOnline ? 'c-presence--active c-icon--presence-online' : 'c-icon--presence-offline'
                  }`}
                  aria-hidden="true"
                  data-qa="presence_indicator"
                  data-qa-presence-self="false"
                  data-qa-presence-active="false"
                  data-qa-presence-dnd="false"
                />
                <span className={count > 0 ? 'bold' : undefined}>{member.nickname}</span>
                {member.id === userData?.id && <span> (나)</span>}
                {count > 0 && <span className="count">{count}</span>}
              </NavLink>
            );
          })}
      </div>
    </>
  );
};

export default DMList;
