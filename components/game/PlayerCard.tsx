'use client';

import { Player } from '@/gameInterfaces/player';

interface PlayerCardProps {
    player: Player;
    isAdmin: boolean;
    isSelf: boolean;
    isCurrentTurn: boolean;
}

export const PlayerCard = ({ player, isAdmin, isSelf, isCurrentTurn }: PlayerCardProps) => {
    return (
        <li style={{
            margin: '6px 10px',
            padding: '8px 12px',
            borderRadius: '12px',
            background: isCurrentTurn
                ? `linear-gradient(135deg, ${player.color}ee, ${player.color}aa)`
                : `${player.color}15`,
            border: isCurrentTurn ? `2px solid ${player.color}` : `1px solid ${player.color}44`,
            boxShadow: isCurrentTurn
                ? `0 4px 12px ${player.color}44`
                : 'none',
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            listStyle: 'none',
            height: '60px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            boxSizing: 'border-box',
            overflow: 'hidden',
            color: isCurrentTurn ? 'white' : '#1f2937'
        }}>
            {/* Player Info Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', minWidth: 0 }}>
                    <strong style={{
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: '700'
                    }}>
                        {player.name}
                    </strong>
                    {isAdmin && (
                        <span title="Room Admin" style={{ fontSize: '14px', filter: isCurrentTurn ? 'brightness(1.5)' : 'none' }}>
                            👑
                        </span>
                    )}
                </div>
                <span style={{
                    fontWeight: '800',
                    fontSize: '15px',
                    color: isCurrentTurn ? 'white' : '#059669'
                }}>
                    ${player.money}
                </span>
            </div>

            {/* Stats Row */}
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                opacity: isCurrentTurn ? 0.9 : 0.7,
                fontWeight: '500'
            }}>
                <span>Position: {player.position}</span>
                {player.isDisconnected ? (
                    <span style={{ color: isCurrentTurn ? 'white' : '#ef4444' }}>● Off</span>
                ) : (
                    isCurrentTurn && <span style={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Moving...</span>
                )}
            </div>

        </li>
    );
};
