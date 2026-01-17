import { Player } from '@/gameInterfaces/player';

interface PlayerContainerProps {
    players: Player[];
    rowStart: number;
    rowEnd: number;
    colStart: number;
    colEnd: number;
}

export const PlayerContainer = ({ players, rowStart, rowEnd, colStart, colEnd }: PlayerContainerProps) => {
    return (
        <div
            style={{
                gridRow: `${rowStart} / ${rowEnd}`,
                gridColumn: `${colStart} / ${colEnd}`,
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'nowrap',
                alignItems: 'center',
                justifyContent: 'center',
                pointerEvents: 'none',
                zIndex: 10,
            }}
        >
            {players.map((player, idx) => (
                <div
                    key={player.name}
                    style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        backgroundColor: player.color,
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)',
                        marginLeft: idx > 0 ? '-10px' : '0',
                        position: 'relative',
                        zIndex: idx,
                    }}
                    title={player.name}
                />
            ))}
        </div>
    );
};
