'use client';

import { useAtomValue } from 'jotai';
import { propertiesAtom, playersAtom } from '@/stores/gameStore';
import { PropertyCell } from './PropertyCell';
import { CornerCell } from './CornerCell';
import { PlayerContainer } from './PlayerContainer';
import { BoardCenter } from './BoardCenter';
import { Property, BuyableProperty } from '@/gameInterfaces/property';
import { Player } from '@/gameInterfaces/player';

// Helper to get grid position from board position
const getGridPosition = (pos: number): { rowStart: number; rowEnd: number; colStart: number; colEnd: number } => {
    let rowStart, rowEnd, colStart, colEnd;

    if (pos === 0) {
        // GO corner
        rowStart = 1; rowEnd = 5; colStart = 1; colEnd = 5;
    } else if (pos === 10) {
        // Jail corner
        rowStart = 1; rowEnd = 5; colStart = 23; colEnd = 27;
    } else if (pos === 20) {
        // Vacation corner
        rowStart = 23; rowEnd = 27; colStart = 23; colEnd = 27;
    } else if (pos === 30) {
        // Go To Jail corner
        rowStart = 23; rowEnd = 27; colStart = 1; colEnd = 5;
    } else if (pos > 0 && pos < 10) {
        // Top Row (Left to Right)
        rowStart = 1; rowEnd = 5;
        colStart = 5 + (pos - 1) * 2;
        colEnd = colStart + 2;
    } else if (pos > 10 && pos < 20) {
        // Right Column (Top to Bottom)
        rowStart = 5 + (pos - 11) * 2;
        rowEnd = rowStart + 2;
        colStart = 23; colEnd = 27;
    } else if (pos > 20 && pos < 30) {
        // Bottom Row (Right to Left)
        rowStart = 23; rowEnd = 27;
        colStart = 21 - (pos - 21) * 2;
        colEnd = colStart + 2;
    } else {
        // Left Column (Bottom to Top)
        rowStart = 21 - (pos - 31) * 2;
        rowEnd = rowStart + 2;
        colStart = 1; colEnd = 5;
    }

    return { rowStart, rowEnd, colStart, colEnd };
};

export const GameBoard = () => {
    const propertiesMap = useAtomValue(propertiesAtom);
    const playersMap = useAtomValue(playersAtom);

    const sortedProperties = Object.values(propertiesMap).sort((a, b) => a.position - b.position);

    const playersByPosition: Record<number, Player[]> = {};
    Object.values(playersMap).forEach((player) => {
        if (!player.isBankrupt) {
            if (!playersByPosition[player.position]) {
                playersByPosition[player.position] = [];
            }
            playersByPosition[player.position].push(player);
        }
    });

    // Render player tokens for each position
    const renderPlayerTokens = () => {
        return Object.entries(playersByPosition).map(([posStr, players]) => {
            const pos = parseInt(posStr);
            const { rowStart, rowEnd, colStart, colEnd } = getGridPosition(pos);

            return (
                <PlayerContainer
                    key={`players-${pos}`}
                    players={players}
                    rowStart={rowStart}
                    rowEnd={rowEnd}
                    colStart={colStart}
                    colEnd={colEnd}
                />
            );
        });
    };

    const renderCell = (p: Property) => {
        const pos = p.position;
        // Corners: 0 (GO), 10 (Jail), 20 (Vacation), 30 (Go To Jail)
        if ([0, 10, 20, 30].includes(pos)) return null;

        let rowStart, rowEnd, colStart, colEnd, orientation: 'top' | 'bottom' | 'left' | 'right';

        if (pos > 0 && pos < 10) {
            // Top Row (Left to Right)
            rowStart = 1;
            rowEnd = 5;
            colStart = 5 + (pos - 1) * 2;
            colEnd = colStart + 2;
            orientation = 'top';
        } else if (pos > 10 && pos < 20) {
            // Right Column (Top to Bottom)
            rowStart = 5 + (pos - 11) * 2;
            rowEnd = rowStart + 2;
            colStart = 23;
            colEnd = 27;
            orientation = 'right';
        } else if (pos > 20 && pos < 30) {
            // Bottom Row (Right to Left)
            rowStart = 23;
            rowEnd = 27;
            colStart = 21 - (pos - 21) * 2;
            colEnd = colStart + 2;
            orientation = 'bottom';
        } else {
            // Left Column (Bottom to Top)
            rowStart = 21 - (pos - 31) * 2;
            rowEnd = rowStart + 2;
            colStart = 1;
            colEnd = 5;
            orientation = 'left';
        }

        const price = ('price' in p) ? p.price : undefined;

        // Get owner color for buyable properties
        let ownerColor: string | undefined;
        if ('owner' in p && (p as BuyableProperty).owner) {
            const owner = playersMap[(p as BuyableProperty).owner!];
            if (owner) {
                ownerColor = owner.color;
            }
        }

        return (
            <PropertyCell
                key={p.name}
                rowStart={rowStart} rowEnd={rowEnd}
                colStart={colStart} colEnd={colEnd}
                name={p.name} price={price} orientation={orientation}
                ownerColor={ownerColor}
            />
        );
    };

    return (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', padding: '10px', boxSizing: 'border-box' }}>
            <div style={{
                border: '2px solid black',
                width: 'min(750px, 92vw, 92vh)',
                height: 'min(750px, 92vw, 92vh)',
                display: 'grid',
                gridTemplateColumns: 'repeat(26, 1fr)',
                gridTemplateRows: 'repeat(26, 1fr)',
                backgroundColor: '#f0f0f0',
                aspectRatio: '1/1',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
            }}>
                {/* Corners fixed positions */}
                <CornerCell rowStart={1} colStart={1} name="GO" description="Collect $200" bgColor="#d4edda" />
                <CornerCell rowStart={1} colStart={23} name="Jail" description="Just Visiting" bgColor="#ffcece" />
                <CornerCell rowStart={23} colStart={23} name="Vacation" description="Free Parking" bgColor="#fffbcc" />
                <CornerCell rowStart={23} colStart={1} name="Go To Jail" bgColor="#d1ecf1" />

                {/* Properties from Store */}
                {sortedProperties.map(renderCell)}

                {/* Player Tokens */}
                {renderPlayerTokens()}

                {/* Center / Logo Area */}
                <BoardCenter />
            </div>
        </div>
    );
};
