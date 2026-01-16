'use client';

import { useAtom, useAtomValue } from 'jotai';
import { adminAtom, settingsAtom } from '@/stores/gameStore';
import { playerNameAtom } from '@/stores/roomStore';
import { Setting } from '@/gameInterfaces/setting';
import { roomService } from '@/services';

export const GameSettings = () => {
    const adminName = useAtomValue(adminAtom);
    const myName = useAtomValue(playerNameAtom);
    const [settings] = useAtom(settingsAtom);
    const isAdmin = myName === adminName && myName !== "";

    const handleToggle = (key: keyof Setting) => {
        console.log(`[UI] handleToggle called for: ${key}`);
        if (!settings || !isAdmin) {
            console.log(`[UI] handleToggle rejected: settings=${!!settings}, isAdmin=${isAdmin}`);
            return;
        }
        const currentVal = settings[key];
        const newSettings = { ...settings, [key]: !currentVal };
        console.log(`[UI] Sending updateSettings for ${key}: ${!currentVal}`);
        roomService.updateSettings(newSettings);
    };

    if (!settings) return null;

    return (
        <div style={{ border: '2px solid orange', padding: '10px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>GAME SETTINGS {isAdmin ? "(Admin)" : "(View Only)"}</h3>
            <div style={{ fontSize: '11px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <label style={{ display: 'flex', justifyContent: 'space-between' }}>
                    Starting Cash:
                    <input
                        type="number"
                        value={settings.startingCash ?? 0}
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (isAdmin && !isNaN(val)) roomService.updateSettings({ startingCash: val });
                        }}
                        disabled={!isAdmin}
                        style={{ width: '60px', border: '1px solid black', backgroundColor: !isAdmin ? '#eee' : 'white' }}
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
                        {Array.from({ length: 9 }, (_, i) => i).filter(n => n >= (settings.minPlayers || 2) && n <= 8).map(num => (
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
                {isAdmin && (
                    <button style={{ border: '2px solid black', marginTop: '10px', padding: '5px', fontWeight: 'bold', cursor: 'pointer' }}>
                        START GAME
                    </button>
                )}
            </div>
        </div>
    );
};
