'use client';

import { useAtomValue } from 'jotai';
import { adminAtom, settingsAtom, turnPhaseAtom } from '@/stores/gameStore';
import { playerNameAtom } from '@/stores/roomStore';
import { Setting } from '@/gameInterfaces/setting';
import { TurnPhase } from '@/gameInterfaces/turnPhases';
import { roomService } from '@/services';

export const GameSettings = () => {
    const adminName = useAtomValue(adminAtom);
    const myName = useAtomValue(playerNameAtom);
    const settings = useAtomValue(settingsAtom);
    const turnPhase = useAtomValue(turnPhaseAtom);
    const isAdmin = myName === adminName && myName !== "";
    const isGameStarted = turnPhase !== TurnPhase.WAITING_FOR_PLAYERS;

    const handleToggle = (key: keyof Setting) => {
        console.log(`[UI] handleToggle called for: ${key}`);
        if (!settings || !isAdmin) {
            return;
        }
        const currentVal = settings[key];
        const newVal = !currentVal;
        console.log(`[UI] Sending updateSettings for ${key}: ${newVal}`);
        roomService.updateSettings({ [key]: newVal });
    };

    if (!settings) return null;

    return (
        <div style={{ border: '2px solid orange', padding: '10px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>GAME SETTINGS</h3>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Starting Cash:
                    <input
                        key={settings.startingCash}
                        type="number"
                        min="500"
                        defaultValue={settings.startingCash ?? 500}
                        inputMode="numeric"
                        onBlur={(e) => {
                            const parsed = parseInt(e.target.value) || 500;
                            const val = Math.max(500, Math.round(parsed / 100) * 100);
                            if (val !== settings.startingCash) roomService.updateSettings({ startingCash: val });
                        }}
                        disabled={!isAdmin || isGameStarted}
                        style={{ width: '60px', border: '1px solid black' }}
                    />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Max Players:
                    <select
                        value={settings.maxPlayers ?? 4}
                        onChange={(e) => isAdmin && roomService.updateSettings({ maxPlayers: parseInt(e.target.value) })}
                        disabled={!isAdmin || isGameStarted}
                        style={{ width: '60px', border: '1px solid black', backgroundColor: !isAdmin ? '#eee' : 'white' }}
                    >
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label><input type="checkbox" checked={settings.doubleRentOnFullSet} onChange={() => handleToggle('doubleRentOnFullSet')} disabled={!isAdmin || isGameStarted} /> Double Rent on Set</label>
                    <label><input type="checkbox" checked={settings.vacationCash} onChange={() => handleToggle('vacationCash')} disabled={!isAdmin || isGameStarted} /> Vacation Cash (Free Parking)</label>
                    <label><input type="checkbox" checked={settings.auction} onChange={() => handleToggle('auction')} disabled={!isAdmin || isGameStarted} /> Enable Auctions</label>
                    <label><input type="checkbox" checked={settings.noRentInPrison} onChange={() => handleToggle('noRentInPrison')} disabled={!isAdmin || isGameStarted} /> No Rent in Prison</label>
                    <label><input type="checkbox" checked={settings.evenBuild} onChange={() => handleToggle('evenBuild')} disabled={!isAdmin || isGameStarted} /> Even Building Rule</label>
                    <label><input type="checkbox" checked={settings.randomizePlayerOrder} onChange={() => handleToggle('randomizePlayerOrder')} disabled={!isAdmin || isGameStarted} /> Randomize Turn Order</label>
                </div>
                <button
                    style={{
                        border: '2px solid black',
                        marginTop: '10px',
                        padding: '10px',
                        fontWeight: 'bold',
                        cursor: isAdmin && !isGameStarted ? 'pointer' : 'default',
                        backgroundColor: isGameStarted ? '#d4edda' : (isAdmin ? '#fff' : '#eee'),
                        color: isGameStarted ? '#155724' : 'black',
                        borderColor: isGameStarted ? '#c3e6cb' : 'black'
                    }}
                    onClick={() => !isGameStarted && roomService.startGame()}
                    disabled={!isAdmin || isGameStarted}
                >
                    {isGameStarted ? 'GAME IN PROGRESS' : 'START GAME'}
                </button>
            </div>
        </div>
    );
};
