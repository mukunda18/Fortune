'use client';

import { useAtomValue } from 'jotai';
import { propertiesAtom } from '@/stores/gameStore';
import { PropertyCell } from './PropertyCell';
import { CornerCell } from './CornerCell';
import { Property } from '@/gameInterfaces/property';

export const GameBoard = () => {
    const propertiesMap = useAtomValue(propertiesAtom);

    const sortedProperties = Object.values(propertiesMap).sort((a, b) => a.position - b.position);

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

        return (
            <PropertyCell
                key={p.name}
                rowStart={rowStart} rowEnd={rowEnd}
                colStart={colStart} colEnd={colEnd}
                name={p.name} price={price} orientation={orientation}
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

                {/* Center / Logo Area */}
                <div style={{
                    gridRow: '5 / 23',
                    gridColumn: '5 / 23',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    fontWeight: '900',
                    color: '#e74c3c',
                    letterSpacing: '5px',
                    transform: 'rotate(-45deg)',
                    textShadow: '2px 2px 0px black',
                    opacity: 0.2,
                    pointerEvents: 'none'
                }}>
                    FORTUNE
                </div>
            </div>
        </div>
    );
};
