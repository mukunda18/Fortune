import { useAtomValue } from 'jotai';
import { diceAtom, turnPhaseAtom } from '@/stores/gameStore';
import { TurnPhase } from '@/gameInterfaces/turnPhases';
import { roomService } from '@/services/features/roomService';

export const DiceController = () => {
    const dice = useAtomValue(diceAtom);
    const turnPhase = useAtomValue(turnPhaseAtom);

    if (turnPhase === TurnPhase.WAITING_FOR_PLAYERS || turnPhase === TurnPhase.STARTING_GAME) {
        return null;
    }

    const rollDice = () => {
        roomService.rollDice();
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
            marginTop: '20px',
            zIndex: 10
        }}>
            <div style={{ display: 'flex', gap: '15px' }}>
                <Die value={dice[0]} />
                <Die value={dice[1]} />
            </div>

            {turnPhase === TurnPhase.PRE_ROLL && (
                <button
                    onClick={rollDice}
                    style={{
                        padding: '12px 30px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        color: 'white',
                        background: 'linear-gradient(135deg, #ff416c, #ff4b2b)',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(255, 75, 43, 0.4)',
                        transition: 'transform 0.1s, box-shadow 0.1s',
                        textTransform: 'uppercase',
                        letterSpacing: '2px'
                    }}
                >
                    Roll Dice
                </button>
            )}
        </div>
    );
};

const Die = ({ value }: { value: number }) => {
    const dots: React.CSSProperties[] = [];

    const dotStyle: React.CSSProperties = {
        width: '10px',
        height: '10px',
        backgroundColor: '#333',
        borderRadius: '50%',
        position: 'absolute',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.5)'
    };

    switch (value) {
        case 1:
            dots.push({ ...dotStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            break;
        case 2:
            dots.push({ ...dotStyle, top: '20%', left: '20%' });
            dots.push({ ...dotStyle, bottom: '20%', right: '20%' });
            break;
        case 3:
            dots.push({ ...dotStyle, top: '20%', left: '20%' });
            dots.push({ ...dotStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            dots.push({ ...dotStyle, bottom: '20%', right: '20%' });
            break;
        case 4:
            dots.push({ ...dotStyle, top: '20%', left: '20%' });
            dots.push({ ...dotStyle, top: '20%', right: '20%' });
            dots.push({ ...dotStyle, bottom: '20%', left: '20%' });
            dots.push({ ...dotStyle, bottom: '20%', right: '20%' });
            break;
        case 5:
            dots.push({ ...dotStyle, top: '20%', left: '20%' });
            dots.push({ ...dotStyle, top: '20%', right: '20%' });
            dots.push({ ...dotStyle, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
            dots.push({ ...dotStyle, bottom: '20%', left: '20%' });
            dots.push({ ...dotStyle, bottom: '20%', right: '20%' });
            break;
        case 6:
            dots.push({ ...dotStyle, top: '20%', left: '20%' });
            dots.push({ ...dotStyle, top: '20%', right: '20%' });
            dots.push({ ...dotStyle, top: '50%', left: '20%', transform: 'translateY(-50%)' });
            dots.push({ ...dotStyle, top: '50%', right: '20%', transform: 'translateY(-50%)' });
            dots.push({ ...dotStyle, bottom: '20%', left: '20%' });
            dots.push({ ...dotStyle, bottom: '20%', right: '20%' });
            break;
        default:
            break;
    }

    return (
        <div style={{
            width: '50px',
            height: '50px',
            backgroundColor: '#f8f9fa',
            borderRadius: '10px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1), inset 0 0 10px rgba(0,0,0,0.05)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #e9ecef'
        }}>
            {value === 0 ? (
                <span style={{ fontSize: '24px', color: '#ccc' }}>?</span>
            ) : (
                dots.map((style, i) => <div key={i} style={style} />)
            )}
        </div>
    );
}
