'use client';

import { useAtomValue } from 'jotai';
import { adminAtom } from '@/stores/gameStore';
import { playerNameAtom } from '@/stores/roomStore';

export const GameLog = () => {
    const adminName = useAtomValue(adminAtom);
    const myName = useAtomValue(playerNameAtom);
    const isAdmin = myName === adminName && myName !== "";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
            <h3 style={{ margin: '0 0 5px 0' }}>Game Log</h3>
            <div style={{ border: '1px solid lightgray', flex: 1, overflowY: 'scroll', marginBottom: '10px', fontSize: '10px', padding: '5px' }}>
                <p style={{ margin: '2px 0', borderBottom: '1px solid #eee' }}>
                    DEBUG: Me: "{myName}" | Admin: "{adminName}" | IsAdmin: {isAdmin ? "YES" : "NO"}
                </p>
                <p style={{ margin: '2px 0' }}>Log: Awaiting game events...</p>
                {isAdmin && <p style={{ margin: '2px 0', color: 'orange' }}>Status: You are the Admin</p>}
            </div>
        </div>
    );
};
