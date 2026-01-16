'use client';

interface CornerCellProps {
    rowStart: number;
    colStart: number;
    name: string;
    description?: string;
    bgColor?: string;
}

export const CornerCell = ({ rowStart, colStart, name, description, bgColor = '#fff' }: CornerCellProps) => {
    return (
        <div style={{
            gridRowStart: rowStart,
            gridRowEnd: rowStart + 4,
            gridColumnStart: colStart,
            gridColumnEnd: colStart + 4,
            border: '2px solid black',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: bgColor,
            fontSize: '10px',
            textAlign: 'center',
            fontWeight: 'bold',
            padding: '4px',
            zIndex: 10
        }}>
            <div style={{ textTransform: 'uppercase' }}>{name}</div>
            {description && <div style={{ fontSize: '8px', fontWeight: 'normal', marginTop: '2px' }}>{description}</div>}
        </div>
    );
};
