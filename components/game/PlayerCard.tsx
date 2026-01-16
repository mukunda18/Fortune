'use client';

import { Player } from '@/gameInterfaces/player';

interface PlayerCardProps {
    player: Player;
    isAdmin: boolean;
    isSelf: boolean;
}

export const PlayerCard = ({ player, isAdmin, isSelf }: PlayerCardProps) => {
    return (
        <li style={{
            border: '1px solid gray',
            margin: '5px',
            padding: '8px',
            backgroundColor: isSelf ? '#f0f0f0' : 'transparent'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>
                    {isSelf && <span title="You" style={{ marginRight: '5px' }}>👤</span>}
                    <strong>{player.name}</strong>
                    {isAdmin && <span style={{ marginLeft: '5px', color: 'blue', fontSize: '10px' }}>(Admin)</span>}
                </span>
                <span style={{ color: 'green' }}>${player.money}</span>
            </div>
            <div style={{ fontSize: '10px', color: 'gray' }}>
                Pos: {player.position} {player.isDisconnected ? '(Disconnected)' : ''}
            </div>
        </li>
    );
};
