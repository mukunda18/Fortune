'use client';

import { useAtomValue } from 'jotai';
import { adminAtom, settingsAtom } from '@/stores/gameStore';
import { playerNameAtom } from '@/stores/roomStore';
import { Setting } from '@/gameInterfaces/setting';
import { roomService } from '@/services';

export const GameSettings = () => {
    const adminName = useAtomValue(adminAtom);
    const myName = useAtomValue(playerNameAtom);
    const settings = useAtomValue(settingsAtom);
    const isAdmin = myName === adminName && myName !== "";

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
                        type="number"
                        step="100"
                        min="500"
                        inputMode="numeric"
                        value={settings.startingCash ?? 500}
                        onBlur={(e) => {
                            const parsed = parseInt(e.target.value) || 500;
                            const val = Math.max(500, Math.round(parsed / 100) * 100);
                            if (isAdmin) roomService.updateSettings({ startingCash: val });
                        }}
                        disabled={!isAdmin}
                        style={{ width: '60px', border: '1px solid black' }}
                    />
                </label>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Max Players:
                    <select
                        value={settings.maxPlayers ?? 8}
                        onChange={(e) => isAdmin && roomService.updateSettings({ maxPlayers: parseInt(e.target.value) })}
                        disabled={!isAdmin}
                        style={{ width: '60px', border: '1px solid black', backgroundColor: !isAdmin ? '#eee' : 'white' }}
                    >
                        {[2, 3, 4, 5, 6, 7, 8].map(num => (
                            <option key={num} value={num}>{num}</option>
                        ))}
                    </select>
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <label><input type="checkbox" checked={settings.doubleRentOnFullSet} onChange={() => handleToggle('doubleRentOnFullSet')} disabled={!isAdmin} /> Double Rent on Set</label>
                    <label><input type="checkbox" checked={settings.vacationCash} onChange={() => handleToggle('vacationCash')} disabled={!isAdmin} /> Vacation Cash (Free Parking)</label>
                    <label><input type="checkbox" checked={settings.auction} onChange={() => handleToggle('auction')} disabled={!isAdmin} /> Enable Auctions</label>
                    <label><input type="checkbox" checked={settings.noRentInPrison} onChange={() => handleToggle('noRentInPrison')} disabled={!isAdmin} /> No Rent in Prison</label>
                    <label><input type="checkbox" checked={settings.evenBuild} onChange={() => handleToggle('evenBuild')} disabled={!isAdmin} /> Even Building Rule</label>
                    <label><input type="checkbox" checked={settings.randomizePlayerOrder} onChange={() => handleToggle('randomizePlayerOrder')} disabled={!isAdmin} /> Randomize Turn Order</label>
                </div>
                <button style={{ border: '2px solid black', marginTop: '10px', padding: '5px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => roomService.startGame()} disabled={!isAdmin}>
                    START GAME
                </button>
            </div>
        </div>
    );
};
