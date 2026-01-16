'use client';

interface PropertyCellProps {
    rowStart: number;
    rowEnd: number;
    colStart: number;
    colEnd: number;
    name: string;
    color?: string;
    price?: number;
    orientation: 'top' | 'bottom' | 'left' | 'right';
    ownerColor?: string;
}

export const PropertyCell = ({ rowStart, rowEnd, colStart, colEnd, name, color, price, orientation, ownerColor }: PropertyCellProps) => {
    const isHorizontal = orientation === 'top' || orientation === 'bottom';

    return (
        <div style={{
            gridRowStart: rowStart,
            gridRowEnd: rowEnd,
            gridColumnStart: colStart,
            gridColumnEnd: colEnd,
            border: '1px solid black',
            display: 'flex',
            flexDirection: orientation === 'top' ? 'column-reverse' :
                orientation === 'bottom' ? 'column' :
                    orientation === 'left' ? 'row-reverse' : 'row',
            backgroundColor: 'white',
            fontSize: '8px',
            textAlign: 'center',
            overflow: 'hidden'
        }}>
            {/* Property Color Strip */}
            {color && (
                <div style={{
                    backgroundColor: color,
                    height: isHorizontal ? '20%' : '100%',
                    width: isHorizontal ? '100%' : '20%',
                    borderBottom: orientation === 'bottom' ? '1px solid black' : 'none',
                    borderTop: orientation === 'top' ? '1px solid black' : 'none',
                    borderRight: orientation === 'right' ? '1px solid black' : 'none',
                    borderLeft: orientation === 'left' ? '1px solid black' : 'none',
                }} />
            )}

            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '2px',
                wordBreak: 'break-word',
                fontWeight: 'bold',
            }}>
                <div style={{
                    transform: orientation === 'left' ? 'rotate(90deg)' :
                        orientation === 'right' ? 'rotate(-90deg)' : 'none',
                    textAlign: 'center',
                    whiteSpace: 'nowrap',
                }}>{name}</div>
            </div>

            {/* Owner Color Strip */}
            {ownerColor && (
                <div style={{
                    backgroundColor: ownerColor,
                    height: isHorizontal ? '15%' : '100%',
                    width: isHorizontal ? '100%' : '15%',
                    borderTop: orientation === 'bottom' ? '1px solid rgba(0,0,0,0.3)' : 'none',
                    borderBottom: orientation === 'top' ? '1px solid rgba(0,0,0,0.3)' : 'none',
                    borderLeft: orientation === 'right' ? '1px solid rgba(0,0,0,0.3)' : 'none',
                    borderRight: orientation === 'left' ? '1px solid rgba(0,0,0,0.3)' : 'none',
                    boxShadow: 'inset 0 0 4px rgba(255,255,255,0.4)',
                }} />
            )}
        </div>
    );
};
