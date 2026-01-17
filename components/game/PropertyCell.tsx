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

    let rotation = 0;
    let width = '100%';
    let height = '100%';

    switch (orientation) {
        case 'top':
            rotation = 0;
            break;
        case 'bottom':
            rotation = 0;
            break;
        case 'left':
            width = '50%';
            height = '200%';
            rotation = 90;
            break;
        case 'right':
            width = '50%';
            height = '200%';
            rotation = -90;
            break;
    }

    return (
        <div style={{
            gridRowStart: rowStart,
            gridRowEnd: rowEnd,
            gridColumnStart: colStart,
            gridColumnEnd: colEnd,
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
        }}>
            {/* The Rotatable Card Container */}
            <div style={{
                width: width,
                height: height,
                transform: `rotate(${rotation}deg)`,
                border: '1px solid black',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                fontSize: '9px',
                lineHeight: 1,
                textAlign: 'center',
                boxSizing: 'border-box',
                whiteSpace: 'nowrap',
                position: 'absolute',
            }}>
                {/* Top Section: Color & Name */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    {color && (
                        <div style={{
                            backgroundColor: color,
                            width: '100%',
                            height: '12px',
                            borderBottom: '1px solid black',
                        }} />
                    )}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '2px',
                        fontWeight: 'bold'
                    }}>
                        {name}
                    </div>
                </div>

                {/* Bottom Section: Price / Owner */}
                <div style={{
                    width: '100%',
                    backgroundColor: ownerColor || 'transparent',
                    color: ownerColor ? 'white' : 'black',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '2px 0',
                    fontWeight: 'bold',
                }}>
                    {price ? `$${price}` : ''}
                </div>
            </div>
        </div>
    );
};
