'use client';

import { useAtomValue } from 'jotai';
import { playersAtom, adminAtom, currentPlayerAtom } from '@/stores/gameStore';
import { playerNameAtom } from '@/stores/roomStore';
import { PlayerCard } from './PlayerCard';

export const PlayerList = () => {
    const players = useAtomValue(playersAtom);
    const adminName = useAtomValue(adminAtom);
    const myName = useAtomValue(playerNameAtom);
    const currentPlayer = useAtomValue(currentPlayerAtom);

    return (
        <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', width: '100%', overflow: 'hidden' }}>
            <h3 style={{
                margin: '10px 10px 5px 10px',
                fontSize: '1rem',
                fontWeight: '800',
                color: '#111827',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>Players</h3>
            <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '10px' }}>
                {Object.entries(players).length === 0 ? (
                    <p style={{ color: 'gray', fontSize: '13px', padding: '10px', textAlign: 'center' }}>No players connected</p>
                ) : (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {Object.entries(players).map(([name, player]) => (
                            <PlayerCard
                                key={name}
                                player={player}
                                isAdmin={name === adminName}
                                isSelf={name === myName}
                                isCurrentTurn={name === currentPlayer}
                            />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};
