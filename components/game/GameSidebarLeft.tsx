'use client';

import { PlayerList } from './PlayerList';
import { Chat } from './Chat';

export const GameSidebarLeft = () => {

    return (
        <div style={{ border: '1px solid black', padding: '10px', width: '250px', display: 'flex', flexDirection: 'column', height: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}>
            <PlayerList />

            <hr style={{ width: '100%', margin: '10px 0', flexShrink: 0 }} />

            <Chat />
        </div>
    );
};
