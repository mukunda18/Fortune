'use client';

import { GameSettings } from './GameSettings';
import { GameLog } from './GameLog';

import { useRouter } from 'next/navigation';
import { roomService } from '@/services';

export const GameSidebarRight = () => {
    const router = useRouter();

    const handleLeave = async () => {
        await roomService.leaveRoom();
        router.push('/');
    };

    return (
        <div style={{ border: '1px solid black', padding: '10px', width: '300px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
            <div style={{ flexShrink: 0, overflowY: 'auto', maxHeight: '50%' }}>
                <GameSettings />
            </div>
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <GameLog />
            </div>

            <button
                onClick={handleLeave}
                style={{
                    marginTop: '10px',
                    padding: '8px',
                    backgroundColor: '#fff',
                    border: '1px solid red',
                    color: 'red',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    flexShrink: 0
                }}
            >
                LEAVE ROOM
            </button>
        </div>
    );
};
