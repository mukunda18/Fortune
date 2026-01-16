'use client';

import { useAtomValue } from 'jotai';
import { playersAtom, adminAtom } from '@/stores/gameStore';
import { playerNameAtom } from '@/stores/roomStore';
import { PlayerCard } from './PlayerCard';

export const PlayerList = () => {
    const players = useAtomValue(playersAtom);
    const adminName = useAtomValue(adminAtom);
    const myName = useAtomValue(playerNameAtom);

    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
            <h3 style={{ margin: '0 0 5px 0', flexShrink: 0 }}>Players</h3>
            <div style={{ flex: 1, overflowY: 'auto', border: '1px solid #eee' }}>
                {Object.entries(players).length === 0 ? (
                    <p style={{ color: 'gray', fontSize: '12px', padding: '5px' }}>No players connected</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {Object.entries(players).map(([name, player]) => (
                            <PlayerCard
                                key={name}
                                player={player}
                                isAdmin={name === adminName}
                                isSelf={name === myName}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
