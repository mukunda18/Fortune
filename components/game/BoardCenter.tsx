import { useAtomValue } from 'jotai';
import { diceAtom, turnPhaseAtom, currentPlayerAtom, playersAtom, usedColorsAtom } from '@/stores/gameStore';
import { socketService } from '@/services/core/socketService';
import { TurnPhase } from '@/gameInterfaces/turnPhases';

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
    }

    return (
        <div style={{
            width: '60px',
            height: '60px',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.15), inset 0 0 10px rgba(0,0,0,0.05)',
            position: 'relative',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid #dee2e6'
        }}>
            {value === 0 ? <span style={{ fontSize: '24px', color: '#ccc' }}>?</span> : dots.map((style, i) => <div key={i} style={style} />)}
        </div>
    );
};

export const BoardCenter = () => {
    const turnPhase = useAtomValue(turnPhaseAtom);
    const dice = useAtomValue(diceAtom);
    const currentPlayerId = useAtomValue(currentPlayerAtom);
    const players = useAtomValue(playersAtom);
    const currentPlayer = players[currentPlayerId];

    const handleRoll = () => {
        socketService.emit('game:rollDice');
    };

    const handleEndTurn = () => {
        socketService.emit('game:end_turn');
    };

    // Determine what to show based on phase
    const showDice = turnPhase !== TurnPhase.WAITING_FOR_PLAYERS && turnPhase !== TurnPhase.STARTING_GAME;
    const showRollBtn = turnPhase === TurnPhase.PRE_ROLL;
    const showEndTurnBtn = turnPhase === TurnPhase.POST_ROLL;

    return (
        <div style={{
            gridRow: '5 / 23',
            gridColumn: '5 / 23',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
        }}>
            {/* Background Logo */}
            <div style={{
                position: 'absolute',
                top: 0, left: 0, right: 0, bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.15,
                pointerEvents: 'none',
                zIndex: 0
            }}>
                <img
                    src="/logo.png"
                    alt="Fortune Logo"
                    style={{
                        maxWidth: '80%',
                        maxHeight: '80%',
                        objectFit: 'contain',
                        filter: 'drop-shadow(2px 4px 6px black)'
                    }}
                />
            </div>

            {/* Active Game Controls */}
            <div style={{
                zIndex: 10,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '24px'
            }}>
                {showDice && (
                    <div style={{ display: 'flex', gap: '20px' }}>
                        <Die value={dice[0]} />
                        <Die value={dice[1]} />
                    </div>
                )}

                {showRollBtn && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '8px' }}>
                            It is {currentPlayer?.name}'s turn!
                        </div>
                        <button
                            onClick={handleRoll}
                            style={{
                                padding: '12px 32px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: 'white',
                                background: 'linear-gradient(135deg, #FF6B6B, #EE5253)',
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(238, 82, 83, 0.4)',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            ROLL DICE
                        </button>
                    </div>
                )}

                {showEndTurnBtn && (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                        <button
                            onClick={handleEndTurn}
                            style={{
                                padding: '12px 32px',
                                fontSize: '1.1rem',
                                fontWeight: '700',
                                color: 'white',
                                background: 'linear-gradient(135deg, #ced6e0, #a4b0be)', // A neutral "End Turn" color, or maybe green/blue
                                border: 'none',
                                borderRadius: '50px',
                                cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                                transition: 'all 0.2s ease',
                                textTransform: 'uppercase'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #a4b0be, #747d8c)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'linear-gradient(135deg, #ced6e0, #a4b0be)'}
                        >
                            End Turn
                        </button>
                    </div>
                )}

                {/* You can add more phase handling here, like AUCTION */}
            </div>
        </div>
    );
};
